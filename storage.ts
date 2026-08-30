import {
  users,
  providers,
  appointments,
  healthRecords,
  chatConversations,
  chatMessages,
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
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface ProviderSearchFilters {
  specialty?: string;
  location?: string;
  distance?: number;
  acceptsUninsured?: boolean;
  languages?: string[];
  availability?: string;
  sortBy?: string;
}

// Interface for storage operations
export interface IStorage {
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
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private providers: Map<string, Provider>;
  private appointments: Map<string, Appointment>;
  private healthRecords: Map<string, HealthRecord>;
  private chatConversations: Map<string, ChatConversation>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.providers = new Map();
    this.appointments = new Map();
    this.healthRecords = new Map();
    this.chatConversations = new Map();
    this.chatMessages = new Map();
    
    // Initialize with sample providers
    this.initializeProviders();
  }

  private initializeProviders() {
    const sampleProviders: Provider[] = [
      {
        id: "provider-1",
        name: "Dr. Sarah Chen",
        specialty: "Family Medicine",
        clinic: "Community Health Center",
        location: "San Francisco, CA",
        address: "123 Mission St, San Francisco, CA 94103",
        phone: "(555) 123-4567",
        email: "s.chen@communityhealthsf.org",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: "4.9",
        reviewCount: 127,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["English", "Spanish", "Mandarin"],
        minPrice: "40.00",
        maxPrice: "120.00",
        distance: "0.8",
        nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        createdAt: new Date(),
      },
      {
        id: "provider-2",
        name: "Dr. Miguel Rodriguez",
        specialty: "Internal Medicine",
        clinic: "Riverside Medical Clinic",
        location: "San Francisco, CA",
        address: "456 Valencia St, San Francisco, CA 94110",
        phone: "(555) 234-5678",
        email: "m.rodriguez@riversidemedical.org",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
        rating: "4.7",
        reviewCount: 89,
        acceptsUninsured: true,
        slidingScale: false,
        cashPayments: true,
        languages: ["English", "Spanish"],
        minPrice: "85.00",
        maxPrice: "85.00",
        distance: "1.2",
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdAt: new Date(),
      },
      {
        id: "provider-3",
        name: "Dr. Jennifer Kim",
        specialty: "Mental Health",
        clinic: "Wellness Psychology Center",
        location: "San Francisco, CA",
        address: "789 Market St, San Francisco, CA 94102",
        phone: "(555) 345-6789",
        email: "j.kim@wellnesspsych.com",
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=face",
        rating: "4.8",
        reviewCount: 156,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: false,
        languages: ["English", "Korean"],
        minPrice: "60.00",
        maxPrice: "150.00",
        distance: "2.1",
        nextAvailable: new Date(Date.now() + 48 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "provider-4",
        name: "Dr. Ahmed Hassan",
        specialty: "Cardiology",
        clinic: "Heart Care Specialists",
        location: "San Francisco, CA",
        address: "321 Health Blvd, San Francisco, CA 94107",
        phone: "(555) 456-7890",
        email: "a.hassan@heartcare.com",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
        rating: "4.6",
        reviewCount: 92,
        acceptsUninsured: true,
        slidingScale: false,
        cashPayments: true,
        languages: ["English", "Arabic"],
        minPrice: "100.00",
        maxPrice: "300.00",
        distance: "3.5",
        nextAvailable: new Date(Date.now() + 72 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "provider-5",
        name: "Dr. Priya Patel",
        specialty: "Pediatrics",
        clinic: "Children's Health Clinic",
        location: "San Francisco, CA",
        address: "789 Kids Ave, San Francisco, CA 94115",
        phone: "(555) 567-8901",
        email: "p.patel@childrenhealth.org",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: "4.9",
        reviewCount: 201,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: true,
        languages: ["English", "Hindi", "Gujarati"],
        minPrice: "40.00",
        maxPrice: "100.00",
        distance: "1.8",
        nextAvailable: new Date(Date.now() + 6 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "provider-6",
        name: "Dr. Sarah Johnson",
        specialty: "Dermatology",
        clinic: "Skin Health Center",
        location: "San Francisco, CA",
        address: "654 Ocean Dr, San Francisco, CA 94121",
        phone: "(555) 678-9012",
        email: "s.johnson@skinhealth.com",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: "4.8",
        reviewCount: 134,
        acceptsUninsured: false,
        slidingScale: true,
        cashPayments: false,
        languages: ["English"],
        minPrice: "75.00",
        maxPrice: "250.00",
        distance: "2.3",
        nextAvailable: new Date(Date.now() + 96 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "provider-7",
        name: "Dr. Luis Morales",
        specialty: "Orthopedics",
        clinic: "Bone & Joint Institute",
        location: "San Francisco, CA",
        address: "987 Spine St, San Francisco, CA 94109",
        phone: "(555) 789-0123",
        email: "l.morales@bonejoint.org",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
        rating: "4.7",
        reviewCount: 78,
        acceptsUninsured: true,
        slidingScale: false,
        cashPayments: true,
        languages: ["English", "Spanish"],
        minPrice: "90.00",
        maxPrice: "400.00",
        distance: "4.2",
        nextAvailable: new Date(Date.now() + 120 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: "provider-8",
        name: "Dr. Emily Wong",
        specialty: "Gynecology",
        clinic: "Women's Health Partners",
        location: "San Francisco, CA",
        address: "246 Care Lane, San Francisco, CA 94117",
        phone: "(555) 890-1234",
        email: "e.wong@womenshealth.com",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: "4.9",
        reviewCount: 167,
        acceptsUninsured: true,
        slidingScale: true,
        cashPayments: false,
        languages: ["English", "Mandarin", "Cantonese"],
        minPrice: "70.00",
        maxPrice: "180.00",
        distance: "1.5",
        nextAvailable: new Date(Date.now() + 48 * 60 * 60 * 1000),
        createdAt: new Date(),
      }
    ];

    sampleProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser & { id?: string }): Promise<User> {
    const userId = userData.id || randomUUID();
    const existingUser = this.users.get(userId);
    const now = new Date();
    
    const user: User = {
      id: userId,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      preferredLanguage: userData.preferredLanguage || "en",
      location: userData.location || null,
      emergencyContactName: userData.emergencyContactName || null,
      emergencyContactPhone: userData.emergencyContactPhone || null,
      healthId: userData.healthId || `CC-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
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

    // Apply filters
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

    if (filters.distance) {
      results = results.filter(p => 
        parseFloat(p.distance || "0") <= filters.distance!
      );
    }

    // Sort results
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
        break;
      case 'price':
        results.sort((a, b) => parseFloat(a.minPrice || "0") - parseFloat(b.minPrice || "0"));
        break;
      case 'distance':
      default:
        results.sort((a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0"));
        break;
    }

    return results;
  }

  async createProvider(providerData: InsertProvider): Promise<Provider> {
    const id = randomUUID();
    const provider: Provider = {
      id,
      name: providerData.name,
      specialty: providerData.specialty,
      clinic: providerData.clinic,
      location: providerData.location,
      address: providerData.address,
      phone: providerData.phone,
      email: providerData.email || null,
      imageUrl: providerData.imageUrl || null,
      rating: providerData.rating || null,
      reviewCount: providerData.reviewCount || null,
      acceptsUninsured: providerData.acceptsUninsured || null,
      slidingScale: providerData.slidingScale || null,
      cashPayments: providerData.cashPayments || null,
      languages: providerData.languages || null,
      minPrice: providerData.minPrice || null,
      maxPrice: providerData.maxPrice || null,
      distance: providerData.distance || null,
      nextAvailable: providerData.nextAvailable || null,
      createdAt: new Date(),
    };
    this.providers.set(id, provider);
    return provider;
  }

  // Appointment operations
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(a => a.userId === userId);
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      id,
      userId: appointmentData.userId,
      providerId: appointmentData.providerId,
      appointmentDate: appointmentData.appointmentDate,
      duration: appointmentData.duration || null,
      type: appointmentData.type || null,
      status: appointmentData.status || null,
      notes: appointmentData.notes || null,
      cost: appointmentData.cost || null,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  // Health record operations
  async getHealthRecord(id: string): Promise<HealthRecord | undefined> {
    return this.healthRecords.get(id);
  }

  async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }

  async createHealthRecord(recordData: InsertHealthRecord): Promise<HealthRecord> {
    const id = randomUUID();
    const record: HealthRecord = {
      id,
      userId: recordData.userId,
      providerId: recordData.providerId || null,
      title: recordData.title,
      type: recordData.type,
      description: recordData.description || null,
      summary: recordData.summary || null,
      tags: recordData.tags || null,
      fileUrl: recordData.fileUrl || null,
      recordDate: recordData.recordDate,
      createdAt: new Date(),
    };
    this.healthRecords.set(id, record);
    return record;
  }

  // Chat operations
  async getChatConversation(id: string): Promise<ChatConversation | undefined> {
    return this.chatConversations.get(id);
  }

  async getUserChatConversations(userId: string): Promise<ChatConversation[]> {
    return Array.from(this.chatConversations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
  }

  async createChatConversation(conversationData: InsertChatConversation): Promise<ChatConversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: ChatConversation = {
      id,
      userId: conversationData.userId,
      title: conversationData.title || null,
      language: conversationData.language || null,
      createdAt: now,
      updatedAt: now,
    };
    this.chatConversations.set(id, conversation);
    return conversation;
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      conversationId: messageData.conversationId,
      role: messageData.role,
      content: messageData.content,
      metadata: messageData.metadata || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
