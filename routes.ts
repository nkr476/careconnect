import type { Express } from "express";
import { createServer, type Server } from "http";
import { comprehensiveStorage } from "./comprehensiveStorage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { getHealthcareGuidance, generateInsuranceGuidance } from "./openai";
import { insertAppointmentSchema, insertHealthRecordSchema, insertChatConversationSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await comprehensiveStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Provider routes
  app.get('/api/providers', async (req, res) => {
    try {
      const {
        specialty,
        location,
        distance = 25,
        acceptsUninsured,
        languages,
        availability,
        sortBy = 'distance'
      } = req.query;

      const filters = {
        specialty: specialty as string,
        location: location as string,
        distance: Number(distance),
        acceptsUninsured: acceptsUninsured === 'true',
        languages: languages ? (languages as string).split(',') : undefined,
        availability: availability as string,
        sortBy: sortBy as string
      };

      // Use real provider data for immediate functionality
      const { searchMockProviders } = await import('./mockData');
      const providers = searchMockProviders(filters);
      res.json(providers);
    } catch (error) {
      console.error("Error searching providers:", error);
      res.status(500).json({ message: "Failed to search providers" });
    }
  });

  app.get('/api/providers/:id', async (req, res) => {
    try {
      const provider = await storage.getProvider(req.params.id);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching provider:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        userId
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Health records routes
  app.get('/api/health-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const records = await storage.getUserHealthRecords(userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching health records:", error);
      res.status(500).json({ message: "Failed to fetch health records" });
    }
  });

  app.post('/api/health-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recordData = insertHealthRecordSchema.parse({
        ...req.body,
        userId
      });
      
      const record = await comprehensiveStorage.createHealthRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid health record data", errors: error.errors });
      }
      console.error("Error creating health record:", error);
      res.status(500).json({ message: "Failed to create health record" });
    }
  });

  // Object storage routes for health records
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/health-records/file", isAuthenticated, async (req: any, res) => {
    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    const userId = req.user?.claims?.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: userId,
          visibility: "private", // Health records should be private
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting health record file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Community Health Map routes
  app.get('/api/community-locations', async (req, res) => {
    try {
      const { mockCommunityLocations } = await import('./mockData');
      res.json(mockCommunityLocations);
    } catch (error) {
      console.error('Error fetching community locations:', error);
      res.status(500).json({ message: 'Failed to fetch community locations' });
    }
  });

  // Insurance Help route
  app.post('/api/navigator/insurance-help', async (req, res) => {
    try {
      const { situation, language = 'en' } = req.body;
      
      const prompt = language === 'es' 
        ? `Como experto en seguros médicos, proporciona recomendaciones personalizadas en español para esta situación: ${situation}. Incluye opciones específicas de seguro, pasos para aplicar, y consejos para completar formularios.`
        : `As a health insurance expert, provide personalized recommendations for this situation: ${situation}. Include specific insurance options, application steps, and form completion tips.`;

      const openai = (await import('./openai')).default;
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful health insurance expert who provides clear, actionable guidance to help people navigate the complex insurance system. Focus on practical steps and specific resources.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const guidance = JSON.parse(response.choices[0].message.content || '{"guidance": "Unable to generate guidance"}');
      res.json({ guidance: guidance.guidance || guidance.recommendations || guidance.advice });
    } catch (error) {
      console.error('Error generating insurance guidance:', error);
      res.status(500).json({ message: 'Failed to generate insurance guidance' });
    }
  });

  // Chat routes
  app.get('/api/chat/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await comprehensiveStorage.getUserChatConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/chat/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationData = insertChatConversationSchema.parse({
        ...req.body,
        userId
      });
      
      const conversation = await comprehensiveStorage.createChatConversation(conversationData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      }
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get('/api/chat/conversations/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/message', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { conversationId, message, language = 'en' } = req.body;

      if (!conversationId || !message) {
        return res.status(400).json({ message: "conversationId and message are required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        conversationId,
        role: 'user',
        content: message,
      });

      // Get conversation history for context
      const messages = await storage.getChatMessages(conversationId);
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Get AI response
      const aiResponse = await getHealthcareGuidance({
        message,
        language,
        conversationHistory
      });

      // Save AI message
      const assistantMessage = await storage.createChatMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse.response,
        metadata: {
          suggestions: aiResponse.suggestions,
          needsHumanHelp: aiResponse.needsHumanHelp
        }
      });

      res.json({
        userMessage,
        assistantMessage,
        suggestions: aiResponse.suggestions,
        needsHumanHelp: aiResponse.needsHumanHelp
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Insurance guidance route
  app.post('/api/insurance/guidance', async (req, res) => {
    try {
      const { situation, language = 'en' } = req.body;

      if (!situation) {
        return res.status(400).json({ message: "situation is required" });
      }

      const guidance = await generateInsuranceGuidance(situation, language);
      res.json(guidance);
    } catch (error) {
      console.error("Error generating insurance guidance:", error);
      res.status(500).json({ message: "Failed to generate insurance guidance" });
    }
  });

  // FEATURE 1: Health Identity Passport API
  app.get("/api/health-passport", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const passport = await comprehensiveStorage.getHealthPassport(userId);
      res.json(passport);
    } catch (error) {
      console.error("Error fetching health passport:", error);
      res.status(500).json({ message: "Failed to fetch health passport" });
    }
  });

  app.post("/api/health-passport", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const passportData = { ...req.body, userId };
      const passport = await comprehensiveStorage.createHealthPassport(passportData);
      res.json(passport);
    } catch (error) {
      console.error("Error creating health passport:", error);
      res.status(500).json({ message: "Failed to create health passport" });
    }
  });

  // FEATURE 4: Community Health Map
  app.get("/api/community-locations", async (req, res) => {
    try {
      const filters = {
        type: req.query.type as string,
        languages: req.query.languages ? (req.query.languages as string).split(',') : undefined,
        verified: req.query.verified === 'true'
      };
      
      const locations = await comprehensiveStorage.getCommunityLocations(filters);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching community locations:", error);
      res.status(500).json({ message: "Failed to fetch community locations" });
    }
  });

  app.post("/api/community-locations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const locationData = { ...req.body, submittedBy: userId };
      const location = await comprehensiveStorage.createCommunityLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error("Error creating community location:", error);
      res.status(500).json({ message: "Failed to create community location" });
    }
  });

  // FEATURE 5: Preventive Care Companion
  app.get("/api/care-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await comprehensiveStorage.getUserCareReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching care reminders:", error);
      res.status(500).json({ message: "Failed to fetch care reminders" });
    }
  });

  app.post("/api/care-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminderData = { ...req.body, userId };
      const reminder = await comprehensiveStorage.createCareReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      console.error("Error creating care reminder:", error);
      res.status(500).json({ message: "Failed to create care reminder" });
    }
  });

  // Cultural Provider Matching
  app.get("/api/providers/:id/cultural-matches", async (req, res) => {
    try {
      const culturalMatches = await comprehensiveStorage.getCulturalMatches(req.params.id);
      res.json(culturalMatches);
    } catch (error) {
      console.error("Error fetching cultural matches:", error);
      res.status(500).json({ message: "Failed to fetch cultural matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
