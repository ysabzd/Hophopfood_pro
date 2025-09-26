import { type Business, type InsertBusiness, type Product, type InsertProduct, type Donation, type InsertDonation, type Schedule, type InsertSchedule, type Closure, type InsertClosure } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Business methods
  getBusiness(id: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, business: Partial<InsertBusiness>): Promise<Business | undefined>;

  // Product methods
  getProducts(businessId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Donation methods
  getDonations(businessId: string): Promise<Donation[]>;
  getDonation(id: string): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: string, donation: Partial<InsertDonation>): Promise<Donation | undefined>;
  deleteDonation(id: string): Promise<boolean>;

  // Schedule methods
  getSchedule(businessId: string): Promise<Schedule[]>;
  createOrUpdateSchedule(schedule: InsertSchedule): Promise<Schedule>;

  // Closure methods
  getClosures(businessId: string): Promise<Closure[]>;
  createClosure(closure: InsertClosure): Promise<Closure>;
  deleteClosure(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private businesses: Map<string, Business>;
  private products: Map<string, Product>;
  private donations: Map<string, Donation>;
  private schedules: Map<string, Schedule>;
  private closures: Map<string, Closure>;

  constructor() {
    this.businesses = new Map();
    this.products = new Map();
    this.donations = new Map();
    this.schedules = new Map();
    this.closures = new Map();

    // Initialize with demo business
    const demoBusiness: Business = {
      id: "demo-business-1",
      name: "Restaurant Le Jardin Bio",
      type: "Restaurant",
      description: "Restaurant de cuisine biologique locale avec un engagement fort pour l'environnement.",
      address: "123 Rue des Jardins, 75001 Paris",
      photoUrl: null,
      collectionInstructions: "Entrée par la porte arrière, sonner deux fois. Apporter des contenants.",
      isActive: true,
      createdAt: new Date(),
    };
    this.businesses.set(demoBusiness.id, demoBusiness);

    // Initialize with sample products (stock removed - quantities defined in donations only)
    const sampleProducts: Product[] = [
      {
        id: "product-1",
        businessId: "demo-business-1",
        name: "Pain de campagne artisanal",
        description: "Pain bio au levain naturel, cuit au feu de bois",
        category: "Boulangerie",
        unitPrice: "4.50",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-2",
        businessId: "demo-business-1",
        name: "Salade César bio",
        description: "Salade fraîche avec parmesan, croûtons maison et vinaigrette balsamique",
        category: "Plats",
        unitPrice: "12.80",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-3",
        businessId: "demo-business-1",
        name: "Tomates cerises bio",
        description: "Tomates cerises sucrées de producteurs locaux, parfaites en salade",
        category: "Légumes",
        unitPrice: "6.20",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-4",
        businessId: "demo-business-1",
        name: "Tarte aux pommes maison",
        description: "Tarte artisanale aux pommes françaises avec pâte feuilletée maison",
        category: "Desserts",
        unitPrice: "18.00",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-5",
        businessId: "demo-business-1",
        name: "Jus de pomme fermier",
        description: "Jus de pomme 100% naturel du verger voisin, sans conservateur ni sucre ajouté",
        category: "Boissons",
        unitPrice: "3.80",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-6",
        businessId: "demo-business-1",
        name: "Bananes bio équitables",
        description: "Bananes mûres issues du commerce équitable, idéales pour smoothies",
        category: "Fruits",
        unitPrice: "2.90",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-7",
        businessId: "demo-business-1",
        name: "Quiche lorraine traditionnelle",
        description: "Quiche aux lardons et fromage, pâte brisée maison",
        category: "Plats",
        unitPrice: "15.50",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-8",
        businessId: "demo-business-1",
        name: "Soupe de légumes du potager",
        description: "Soupe maison aux légumes de saison, mijotée doucement",
        category: "Plats",
        unitPrice: "8.90",
        currentStock: 0,
        expiryDate: null,
        photoUrl: null,
        createdAt: new Date(),
      }
    ];
    
    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize with sample donations (with new fiscal value system)
    const sampleDonations: Donation[] = [
      {
        id: "donation-1",
        businessId: "demo-business-1",
        productId: "product-1",
        quantity: 5,
        maxPerPerson: 2,
        description: null,
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        collectionSlots: [],
        taxBenefitValue: "22.50", // 4.50 × 5
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "donation-2",
        businessId: "demo-business-1",
        productId: "product-2",
        quantity: 3,
        maxPerPerson: 1,
        description: "À consommer aujourd'hui de préférence",
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        collectionSlots: [],
        taxBenefitValue: "38.40", // 12.80 × 3
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      },
      {
        id: "donation-3",
        businessId: "demo-business-1",
        productId: "product-7",
        quantity: 2,
        maxPerPerson: 1,
        description: "Quiches de midi, encore chaudes !",
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        collectionSlots: [],
        taxBenefitValue: "31.00", // 15.50 × 2
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
      },
      {
        id: "donation-4",
        businessId: "demo-business-1",
        productId: "product-5",
        quantity: 4,
        maxPerPerson: 2,
        description: "Jus frais du matin, excellent pour la santé",
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        collectionSlots: [],
        taxBenefitValue: "15.20", // 3.80 × 4
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: "donation-5",
        businessId: "demo-business-1",
        productId: "product-8",
        quantity: 6,
        maxPerPerson: 2,
        description: "Soupe de légumes maison, parfaite pour l'hiver",
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        collectionSlots: [],
        taxBenefitValue: "53.40", // 8.90 × 6
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      }
    ];
    
    sampleDonations.forEach(donation => {
      this.donations.set(donation.id, donation);
    });

    // Initialize with sample schedules
    const sampleSchedules: Schedule[] = [
      // Lundi - Restaurant avec 2 services
      {
        id: "schedule-1",
        businessId: "demo-business-1",
        dayOfWeek: 1,
        isOpen: true,
        timeSlots: [
          { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" },
          { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" }
        ],
        businessType: "restaurant"
      },
      // Mardi - Restaurant avec 2 services
      {
        id: "schedule-2",
        businessId: "demo-business-1",
        dayOfWeek: 2,
        isOpen: true,
        timeSlots: [
          { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" },
          { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" }
        ],
        businessType: "restaurant"
      },
      // Mercredi - Restaurant avec 2 services
      {
        id: "schedule-3",
        businessId: "demo-business-1",
        dayOfWeek: 3,
        isOpen: true,
        timeSlots: [
          { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" },
          { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" }
        ],
        businessType: "restaurant"
      },
      // Jeudi - Restaurant avec 2 services
      {
        id: "schedule-4",
        businessId: "demo-business-1",
        dayOfWeek: 4,
        isOpen: true,
        timeSlots: [
          { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" },
          { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" }
        ],
        businessType: "restaurant"
      },
      // Vendredi - Restaurant avec 2 services (horaires étendus)
      {
        id: "schedule-5",
        businessId: "demo-business-1",
        dayOfWeek: 5,
        isOpen: true,
        timeSlots: [
          { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" },
          { startTime: "18:00", endTime: "23:00", label: "Soir", type: "evening" }
        ],
        businessType: "restaurant"
      },
      // Samedi - Fermé
      {
        id: "schedule-6",
        businessId: "demo-business-1",
        dayOfWeek: 6,
        isOpen: false,
        timeSlots: [],
        businessType: "restaurant"
      },
      // Dimanche - Fermé
      {
        id: "schedule-0",
        businessId: "demo-business-1",
        dayOfWeek: 0,
        isOpen: false,
        timeSlots: [],
        businessType: "restaurant"
      }
    ];

    sampleSchedules.forEach(schedule => {
      this.schedules.set(schedule.id, schedule);
    });
  }

  // Business methods
  async getBusiness(id: string): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const business: Business = {
      id,
      name: insertBusiness.name,
      type: insertBusiness.type,
      description: insertBusiness.description ?? null,
      address: insertBusiness.address ?? null,
      photoUrl: insertBusiness.photoUrl ?? null,
      collectionInstructions: insertBusiness.collectionInstructions ?? null,
      isActive: insertBusiness.isActive ?? true,
      createdAt: new Date(),
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: string, businessUpdate: Partial<InsertBusiness>): Promise<Business | undefined> {
    const existing = this.businesses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...businessUpdate };
    this.businesses.set(id, updated);
    return updated;
  }

  // Product methods
  async getProducts(businessId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.businessId === businessId);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      businessId: insertProduct.businessId,
      name: insertProduct.name,
      description: insertProduct.description ?? null,
      category: insertProduct.category,
      unitPrice: insertProduct.unitPrice,
      currentStock: insertProduct.currentStock ?? 0,
      expiryDate: insertProduct.expiryDate ?? null,
      photoUrl: insertProduct.photoUrl ?? null,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...productUpdate };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Donation methods
  async getDonations(businessId: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(d => d.businessId === businessId);
  }

  async getDonation(id: string): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      id,
      businessId: insertDonation.businessId,
      productId: insertDonation.productId,
      quantity: insertDonation.quantity,
      maxPerPerson: insertDonation.maxPerPerson ?? 1,
      description: insertDonation.description ?? null,
      status: insertDonation.status ?? "active",
      availableFrom: insertDonation.availableFrom,
      availableTo: insertDonation.availableTo,
      collectionSlots: Array.from(insertDonation.collectionSlots ?? []) as string[],
      taxBenefitValue: insertDonation.taxBenefitValue ?? null,
      createdAt: new Date(),
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonation(id: string, donationUpdate: Partial<InsertDonation>): Promise<Donation | undefined> {
    const existing = this.donations.get(id);
    if (!existing) return undefined;
    
    const updated: Donation = { 
      ...existing, 
      ...donationUpdate,
      collectionSlots: donationUpdate.collectionSlots ? Array.from(donationUpdate.collectionSlots) as string[] : existing.collectionSlots
    };
    this.donations.set(id, updated);
    return updated;
  }

  async deleteDonation(id: string): Promise<boolean> {
    return this.donations.delete(id);
  }

  // Schedule methods
  async getSchedule(businessId: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter(s => s.businessId === businessId);
  }

  async createOrUpdateSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    // Find existing schedule for this business and day
    const existing = Array.from(this.schedules.values()).find(
      s => s.businessId === insertSchedule.businessId && s.dayOfWeek === insertSchedule.dayOfWeek
    );

    if (existing) {
      const updated: Schedule = {
        id: existing.id,
        businessId: insertSchedule.businessId,
        dayOfWeek: insertSchedule.dayOfWeek,
        isOpen: insertSchedule.isOpen ?? existing.isOpen,
        timeSlots: Array.from(insertSchedule.timeSlots ?? existing.timeSlots) as {startTime: string, endTime: string, label: string, type?: string}[],
        businessType: insertSchedule.businessType,
      };
      this.schedules.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const schedule: Schedule = {
        id,
        businessId: insertSchedule.businessId,
        dayOfWeek: insertSchedule.dayOfWeek,
        isOpen: insertSchedule.isOpen ?? false,
        timeSlots: Array.from(insertSchedule.timeSlots ?? []) as {startTime: string, endTime: string, label: string, type?: string}[],
        businessType: insertSchedule.businessType,
      };
      this.schedules.set(id, schedule);
      return schedule;
    }
  }

  // Closure methods
  async getClosures(businessId: string): Promise<Closure[]> {
    return Array.from(this.closures.values()).filter(c => c.businessId === businessId);
  }

  async createClosure(insertClosure: InsertClosure): Promise<Closure> {
    const id = randomUUID();
    const closure: Closure = {
      id,
      businessId: insertClosure.businessId,
      date: insertClosure.date,
      reason: insertClosure.reason ?? null,
      isEmergency: insertClosure.isEmergency ?? false,
      createdAt: new Date(),
    };
    this.closures.set(id, closure);
    return closure;
  }

  async deleteClosure(id: string): Promise<boolean> {
    return this.closures.delete(id);
  }
}

export const storage = new MemStorage();
