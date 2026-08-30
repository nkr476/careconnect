import {
  users,
  providers,
  appointments,
  healthRecords,
  chatConversations,
  chatMessages,
  healthPassports,
  communityLocations,
  careReminders,
  culturalMatches,
  offlineCache,
  type User,
  type UpsertUser,
  type Provider,
  type InsertProvider,
  type Appointment,
  type InsertAppointment,
  type HealthRecord,
  type InsertHealthRecord,
  type ChatConversation,
  type InsertChatConversation,
  type ChatMessage,
  type InsertChatMessage,
  type HealthPassport,
  type InsertHealthPassport,
  type CommunityLocation,
  type InsertCommunityLocation,
  type CareReminder,
  type InsertCareReminder,
  type CulturalMatch,
  type InsertCulturalMatch,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { mockProviders, mockCommunityLocations, mockCareReminders, searchMockProviders } from "./mockData";

export interface ProviderSearchFilters {
  specialty?: string;
  location?: string;
  distance?: number;
  acceptsUninsured?: boolean;
  languages?: string[];
  availability?: string;
  sortBy?: string;
  culturalSpecialty?: string;
}

// Comprehensive Interface for all CareConnect operations
export interface IComprehensiveStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Provider operations
  getProvider(id: string): Promise<Provider | undefined>;
  searchProviders(filters: ProviderSearchFilters): Promise<Provider[]>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  
  // Appointment operations
  getAppointment(id: string): Promise<Appointment | undefined>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  // Health record operations
  getHealthRecord(id: string): Promise<HealthRecord | undefined>;
  getUserHealthRecords(userId: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  // Chat operations
  getChatConversation(id: string): Promise<ChatConversation | undefined>;
  getUserChatConversations(userId: string): Promise<ChatConversation[]>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatMessages(conversationId: string): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Health Passport operations
  getHealthPassport(userId: string): Promise<HealthPassport | undefined>;
  createHealthPassport(passport: InsertHealthPassport): Promise<HealthPassport>;
  updateHealthPassport(userId: string, updates: Partial<InsertHealthPassport>): Promise<HealthPassport>;

  // Community Health Map operations
  getCommunityLocations(filters?: { type?: string; languages?: string[]; verified?: boolean }): Promise<CommunityLocation[]>;
  createCommunityLocation(location: InsertCommunityLocation): Promise<CommunityLocation>;
  verifyCommunityLocation(id: string, verifiedBy: string): Promise<CommunityLocation>;

  // Preventive Care operations
  getUserCareReminders(userId: string): Promise<CareReminder[]>;
  createCareReminder(reminder: InsertCareReminder): Promise<CareReminder>;
  markReminderComplete(id: string): Promise<CareReminder>;

  // Cultural Matching operations
  getCulturalMatches(providerId: string): Promise<CulturalMatch[]>;
  createCulturalMatch(match: InsertCulturalMatch): Promise<CulturalMatch>;

  // Offline Data operations
  cacheUserData(userId: string, dataType: string, data: any): Promise<void>;
  getUserCachedData(userId: string, dataType: string): Promise<any>;
}

// Comprehensive Memory Storage Implementation
export class ComprehensiveMemStorage implements IComprehensiveStorage {
  private users = new Map<string, User>();
  private providers = new Map<string, Provider>();
  private appointments = new Map<string, Appointment>();
  private healthRecords = new Map<string, HealthRecord>();
  private conversations = new Map<string, ChatConversation>();
  private messages = new Map<string, ChatMessage[]>();
  private healthPassports = new Map<string, HealthPassport>();
  private communityLocations = new Map<string, CommunityLocation>();
  private careReminders = new Map<string, CareReminder[]>();
  private culturalMatches = new Map<string, CulturalMatch[]>();
  private offlineData = new Map<string, any>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed comprehensive providers with cultural specialties
    const comprehensiveProviders: Provider[] = [
      {
        id: "1",
        name: "Dr. Maria Rodriguez",
        specialty: "Primary Care",
        clinic: "Community Health Center",
        location: "San Francisco, CA",
        address: "123 Mission St, San Francisco, CA 94103",
        phone: "(415) 555-0123",
        email: "maria.rodriguez@chc.org",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        rating: "4.8",
        reviewCount: 156,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["Spanish", "English"],
        minPrice: "50.00",
        maxPrice: "200.00",
        distance: "0.5",
        nextAvailable: new Date("2024-12-15T10:00:00Z"),
        createdAt: new Date()
      },
      {
        id: "2",
        name: "Dr. James Chen",
        specialty: "Cardiology",
        clinic: "Heart Health Specialists",
        location: "Oakland, CA",
        address: "456 Broadway, Oakland, CA 94607",
        phone: "(510) 555-0456",
        email: "james.chen@hhs.org",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        rating: "4.9",
        reviewCount: 203,
        acceptsUninsured: false,
        slidingScale: true,
        cashPayments: false,
        languages: ["Mandarin", "Cantonese", "English"],
        minPrice: "150.00",
        maxPrice: "400.00",
        distance: "2.1",
        nextAvailable: new Date("2024-12-16T14:30:00Z"),
        createdAt: new Date()
      },
      {
        id: "3",
        name: "Dr. Fatima Al-Hassan",
        specialty: "Pediatrics",
        clinic: "Children's Care Network",
        location: "Berkeley, CA",
        address: "789 University Ave, Berkeley, CA 94702",
        phone: "(510) 555-0789",
        email: "fatima.alhassan@ccn.org",
        imageUrl: "https://images.unsplash.com/photo-1594824150847-c86d20c1e1eb?w=400",
        rating: "4.7",
        reviewCount: 98,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["Arabic", "French", "English"],
        minPrice: "75.00",
        maxPrice: "250.00",
        distance: "1.8",
        nextAvailable: new Date("2024-12-17T09:15:00Z"),
        createdAt: new Date()
      },
      {
        id: "4",
        name: "Dr. Raj Patel",
        specialty: "Dermatology", 
        clinic: "Skin Health Institute",
        location: "San Jose, CA",
        address: "321 First St, San Jose, CA 95113",
        phone: "(408) 555-0321",
        email: "raj.patel@shi.org",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
        rating: "4.6",
        reviewCount: 145,
        acceptsUninsured: false,
        slidingScale: false,
        cashPayments: true,
        languages: ["Hindi", "Gujarati", "English"],
        minPrice: "120.00",
        maxPrice: "350.00",
        distance: "3.5",
        nextAvailable: new Date("2024-12-18T11:00:00Z"),
        createdAt: new Date()
      },
      {
        id: "5",
        name: "Dr. Kim Johnson",
        specialty: "Mental Health",
        clinic: "Wellness & Recovery Center",
        location: "Sacramento, CA",
        address: "654 Capitol Ave, Sacramento, CA 95814",
        phone: "(916) 555-0654",
        email: "kim.johnson@wrc.org",
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
        rating: "4.9",
        reviewCount: 187,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["Korean", "English"],
        minPrice: "80.00",
        maxPrice: "180.00",
        distance: "1.2",
        nextAvailable: new Date("2024-12-19T15:45:00Z"),
        createdAt: new Date()
      },
      {
        id: "6",
        name: "Dr. Elena Petrov",
        specialty: "Orthopedics",
        clinic: "Bone & Joint Clinic", 
        location: "Fremont, CA",
        address: "987 Fremont Blvd, Fremont, CA 94538",
        phone: "(510) 555-0987",
        email: "elena.petrov@bjc.org",
        imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
        rating: "4.5",
        reviewCount: 134,
        acceptsUninsured: false,
        slidingScale: true,
        cashPayments: false,
        languages: ["Russian", "Ukrainian", "English"],
        minPrice: "200.00",
        maxPrice: "500.00",
        distance: "4.2",
        nextAvailable: new Date("2024-12-20T08:30:00Z"),
        createdAt: new Date()
      },
      {
        id: "7",
        name: "Dr. Ibrahim Okafor",
        specialty: "Gynecology",
        clinic: "Women's Health Associates",
        location: "Richmond, CA",
        address: "246 MacDonald Ave, Richmond, CA 94801",
        phone: "(510) 555-0246",
        email: "ibrahim.okafor@wha.org",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        rating: "4.8",
        reviewCount: 176,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["Yoruba", "Igbo", "French", "English"],
        minPrice: "100.00",
        maxPrice: "300.00",
        distance: "2.8",
        nextAvailable: new Date("2024-12-21T13:20:00Z"),
        createdAt: new Date()
      },
      {
        id: "8",
        name: "Dr. Ana Gutierrez",
        specialty: "Urgent Care",
        clinic: "24/7 Urgent Care",
        location: "Hayward, CA",
        address: "135 B St, Hayward, CA 94541",
        phone: "(510) 555-0135",
        email: "ana.gutierrez@urgentcare.org",
        imageUrl: "https://images.unsplash.com/photo-1594824150847-c86d20c1e1eb?w=400",
        rating: "4.4",
        reviewCount: 89,
        acceptsUninsured: true,
        slidingScale: false,
        cashPayments: true,
        languages: ["Spanish", "Portuguese", "English"],
        minPrice: "80.00",
        maxPrice: "250.00",
        distance: "3.1",
        nextAvailable: new Date("2024-12-15T16:00:00Z"),
        createdAt: new Date()
      }
    ];

    comprehensiveProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });

    // Seed community health locations
    const communityHealthLocations: CommunityLocation[] = [
      {
        id: "cl1",
        name: "Mission District Free Clinic",
        type: "free_clinic",
        address: "2850 Mission St, San Francisco, CA 94110",
        coordinates: { lat: 37.7515, lng: -122.4185 },
        description: "Free medical services for uninsured residents. No appointment needed for basic care.",
        schedule: {
          monday: "8:00-17:00",
          tuesday: "8:00-17:00", 
          wednesday: "8:00-17:00",
          thursday: "8:00-17:00",
          friday: "8:00-15:00",
          saturday: "9:00-13:00",
          sunday: "closed"
        },
        contactInfo: { phone: "(415) 555-FREE", email: "info@missionfreeclinic.org" },
        languages: ["Spanish", "English", "Mandarin"],
        services: ["Primary Care", "Vaccinations", "Health Screenings", "Mental Health"],
        requirements: "Proof of SF residency",
        cost: "Free",
        verified: true,
        verifiedBy: "SF Health Department",
        submittedBy: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "cl2", 
        name: "Mobile Dental Van - Chinatown",
        type: "dental_van",
        address: "Grant Avenue & Clay St, San Francisco, CA 94108",
        coordinates: { lat: 37.7946, lng: -122.4058 },
        description: "Free dental cleanings and basic care. Rotates through Chinatown weekly.",
        schedule: {
          monday: "closed",
          tuesday: "10:00-16:00",
          wednesday: "closed",
          thursday: "10:00-16:00", 
          friday: "closed",
          saturday: "9:00-15:00",
          sunday: "closed"
        },
        contactInfo: { phone: "(415) 555-TEETH" },
        languages: ["Cantonese", "Mandarin", "English"],
        services: ["Dental Cleaning", "Basic Dental Care", "Oral Health Education"],
        requirements: "Children under 18 priority",
        cost: "Free",
        verified: true,
        verifiedBy: "UCSF Dental School",
        submittedBy: "volunteer1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "cl3",
        name: "Community Health Fair - East Oakland",
        type: "health_fair",
        address: "Eastmont Town Center, Oakland, CA 94605",
        coordinates: { lat: 37.7749, lng: -122.1419 },
        description: "Monthly health fair with free screenings, vaccinations, and health education.",
        schedule: {
          saturday: "9:00-15:00" // First Saturday of each month
        },
        contactInfo: { phone: "(510) 555-FAIR", email: "healthfair@oaklandcares.org" },
        languages: ["Spanish", "English", "Vietnamese"],
        services: ["Blood Pressure Screening", "Diabetes Testing", "Vaccinations", "Health Education"],
        requirements: "None",
        cost: "Free",
        verified: true,
        verifiedBy: "Alameda County Health",
        submittedBy: "community_volunteer",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    communityHealthLocations.forEach(location => {
      this.communityLocations.set(location.id, location);
    });

    // Seed cultural matches for providers
    const culturalMatchesData: CulturalMatch[] = [
      {
        id: "cm1",
        providerId: "1",
        culture: "Latino/Hispanic",
        languages: ["Spanish"],
        culturalNotes: "Understands familismo and importance of family involvement in healthcare decisions",
        religiousAccommodations: true,
        genderPreferences: "flexible",
        communicationStyle: "warm, relationship-focused",
        trustFactors: ["shared_language", "cultural_understanding", "community_reputation"],
        createdAt: new Date()
      },
      {
        id: "cm2", 
        providerId: "2",
        culture: "Chinese/Asian",
        languages: ["Mandarin", "Cantonese"],
        culturalNotes: "Sensitive to traditional medicine integration and family hierarchy in decisions",
        religiousAccommodations: false,
        genderPreferences: "flexible",
        communicationStyle: "respectful, formal",
        trustFactors: ["shared_language", "medical_expertise", "cultural_sensitivity"],
        createdAt: new Date()
      },
      {
        id: "cm3",
        providerId: "3", 
        culture: "Middle Eastern/Arab",
        languages: ["Arabic"],
        culturalNotes: "Respects Islamic principles and dietary restrictions in treatment plans",
        religiousAccommodations: true,
        genderPreferences: "same_gender_preferred",
        communicationStyle: "respectful, considerate",
        trustFactors: ["religious_accommodation", "shared_language", "gender_sensitivity"],
        createdAt: new Date()
      }
    ];

    culturalMatchesData.forEach(match => {
      const matches = this.culturalMatches.get(match.providerId) || [];
      matches.push(match);
      this.culturalMatches.set(match.providerId, matches);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    }

    const user: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      preferredLanguage: userData.preferredLanguage || "en",
      location: userData.location || null,
      emergencyContactName: userData.emergencyContactName || null,
      emergencyContactPhone: userData.emergencyContactPhone || null,
      healthId: userData.healthId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(user.id, user);
    return user;
  }

  // Provider operations
  async getProvider(id: string): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async searchProviders(filters: ProviderSearchFilters): Promise<Provider[]> {
    let results = Array.from(this.providers.values());

    if (filters.specialty) {
      results = results.filter(p => 
        p.specialty.toLowerCase().includes(filters.specialty!.toLowerCase())
      );
    }

    if (filters.acceptsUninsured) {
      results = results.filter(p => p.acceptsUninsured);
    }

    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(p => 
        p.languages && p.languages.length > 0 && filters.languages!.some(lang => 
          p.languages!.some(pLang => pLang.toLowerCase().includes(lang.toLowerCase()))
        )
      );
    }

    if (filters.culturalSpecialty) {
      const culturalProviders = Array.from(this.culturalMatches.entries())
        .filter(([, matches]) => 
          matches.some(m => m.culture.toLowerCase().includes(filters.culturalSpecialty!.toLowerCase()))
        )
        .map(([providerId]) => providerId);
      
      results = results.filter(p => culturalProviders.includes(p.id));
    }

    return results.slice(0, 10); // Limit results
  }

  async createProvider(providerData: InsertProvider): Promise<Provider> {
    const provider: Provider = {
      id: randomUUID(),
      ...providerData,
      createdAt: new Date()
    };
    
    this.providers.set(provider.id, provider);
    return provider;
  }

  // Health Passport operations
  async getHealthPassport(userId: string): Promise<HealthPassport | undefined> {
    return this.healthPassports.get(userId);
  }

  async createHealthPassport(passportData: InsertHealthPassport): Promise<HealthPassport> {
    const passport: HealthPassport = {
      id: randomUUID(),
      ...passportData,
      lastUpdated: new Date(),
      createdAt: new Date()
    };
    
    this.healthPassports.set(passportData.userId, passport);
    return passport;
  }

  async updateHealthPassport(userId: string, updates: Partial<InsertHealthPassport>): Promise<HealthPassport> {
    const existing = this.healthPassports.get(userId);
    if (!existing) {
      throw new Error("Health passport not found");
    }

    const updated: HealthPassport = {
      ...existing,
      ...updates,
      lastUpdated: new Date()
    };

    this.healthPassports.set(userId, updated);
    return updated;
  }

  // Community Health Map operations
  async getCommunityLocations(filters?: { type?: string; languages?: string[]; verified?: boolean }): Promise<CommunityLocation[]> {
    let results = Array.from(this.communityLocations.values());

    if (filters?.type) {
      results = results.filter(l => l.type === filters.type);
    }

    if (filters?.verified !== undefined) {
      results = results.filter(l => l.verified === filters.verified);
    }

    if (filters?.languages && filters.languages.length > 0) {
      results = results.filter(l => 
        l.languages && filters.languages!.some(lang => 
          l.languages!.some(lLang => lLang.toLowerCase().includes(lang.toLowerCase()))
        )
      );
    }

    return results.filter(l => l.isActive);
  }

  async createCommunityLocation(locationData: InsertCommunityLocation): Promise<CommunityLocation> {
    const location: CommunityLocation = {
      id: randomUUID(),
      ...locationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.communityLocations.set(location.id, location);
    return location;
  }

  async verifyCommunityLocation(id: string, verifiedBy: string): Promise<CommunityLocation> {
    const location = this.communityLocations.get(id);
    if (!location) {
      throw new Error("Location not found");
    }

    const verified: CommunityLocation = {
      ...location,
      verified: true,
      verifiedBy,
      updatedAt: new Date()
    };

    this.communityLocations.set(id, verified);
    return verified;
  }

  // Preventive Care operations
  async getUserCareReminders(userId: string): Promise<CareReminder[]> {
    return this.careReminders.get(userId) || [];
  }

  async createCareReminder(reminderData: InsertCareReminder): Promise<CareReminder> {
    const reminder: CareReminder = {
      id: randomUUID(),
      ...reminderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userReminders = this.careReminders.get(reminderData.userId) || [];
    userReminders.push(reminder);
    this.careReminders.set(reminderData.userId, userReminders);
    
    return reminder;
  }

  async markReminderComplete(id: string): Promise<CareReminder> {
    for (const [userId, reminders] of this.careReminders.entries()) {
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        reminder.completed = true;
        reminder.completedAt = new Date();
        reminder.updatedAt = new Date();
        return reminder;
      }
    }
    throw new Error("Reminder not found");
  }

  // Cultural Matching operations
  async getCulturalMatches(providerId: string): Promise<CulturalMatch[]> {
    return this.culturalMatches.get(providerId) || [];
  }

  async createCulturalMatch(matchData: InsertCulturalMatch): Promise<CulturalMatch> {
    const match: CulturalMatch = {
      id: randomUUID(),
      ...matchData,
      createdAt: new Date()
    };
    
    const matches = this.culturalMatches.get(matchData.providerId) || [];
    matches.push(match);
    this.culturalMatches.set(matchData.providerId, matches);
    
    return match;
  }

  // Offline Data operations
  async cacheUserData(userId: string, dataType: string, data: any): Promise<void> {
    const key = `${userId}:${dataType}`;
    this.offlineData.set(key, {
      data,
      lastSync: new Date(),
      userId,
      dataType
    });
  }

  async getUserCachedData(userId: string, dataType: string): Promise<any> {
    const key = `${userId}:${dataType}`;
    const cached = this.offlineData.get(key);
    return cached?.data;
  }

  // Standard operations (simplified implementations)
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(a => a.userId === userId);
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const appointment: Appointment = {
      id: randomUUID(),
      ...appointmentData,
      createdAt: new Date()
    };
    
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async getHealthRecord(id: string): Promise<HealthRecord | undefined> {
    return this.healthRecords.get(id);
  }

  async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values()).filter(r => r.userId === userId);
  }

  async createHealthRecord(recordData: InsertHealthRecord): Promise<HealthRecord> {
    const record: HealthRecord = {
      id: randomUUID(),
      ...recordData,
      createdAt: new Date()
    };
    
    this.healthRecords.set(record.id, record);
    return record;
  }

  async getChatConversation(id: string): Promise<ChatConversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserChatConversations(userId: string): Promise<ChatConversation[]> {
    return Array.from(this.conversations.values()).filter(c => c.userId === userId);
  }

  async createChatConversation(conversationData: InsertChatConversation): Promise<ChatConversation> {
    const conversation: ChatConversation = {
      id: randomUUID(),
      ...conversationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return this.messages.get(conversationId) || [];
  }

  async addChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: randomUUID(),
      ...messageData,
      createdAt: new Date()
    };
    
    const messages = this.messages.get(messageData.conversationId) || [];
    messages.push(message);
    this.messages.set(messageData.conversationId, messages);
    
    return message;
  }
}

export const comprehensiveStorage = new ComprehensiveMemStorage();