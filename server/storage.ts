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

    // Initialize with sample products
    const sampleProducts: Product[] = [
      {
        id: "product-1",
        businessId: "demo-business-1",
        name: "Pain de campagne artisanal",
        description: "Pain bio au levain naturel, cuit au feu de bois",
        category: "Boulangerie",
        unitPrice: "4.50",
        currentStock: 8,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-2", 
        businessId: "demo-business-1",
        name: "Salade César bio",
        description: "Salade fraîche avec parmesan, croûtons maison",
        category: "Plats",
        unitPrice: "12.80",
        currentStock: 5,
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-3",
        businessId: "demo-business-1", 
        name: "Tomates cerises bio",
        description: "Tomates cerises de producteurs locaux",
        category: "Légumes",
        unitPrice: "6.20",
        currentStock: 15,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-4",
        businessId: "demo-business-1",
        name: "Tarte aux pommes",
        description: "Tarte artisanale aux pommes du verger",
        category: "Desserts",
        unitPrice: "18.00",
        currentStock: 3,
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now  
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-5",
        businessId: "demo-business-1",
        name: "Jus de pomme fermier",
        description: "Jus de pomme 100% naturel, sans conservateur",
        category: "Boissons",
        unitPrice: "3.80",
        currentStock: 12,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        photoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "product-6",
        businessId: "demo-business-1",
        name: "Bananes bio équitables",
        description: "Bananes issues du commerce équitable",
        category: "Fruits", 
        unitPrice: "2.90",
        currentStock: 2, // Low stock
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        photoUrl: null,
        createdAt: new Date(),
      }
    ];
    
    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize with sample donations
    const sampleDonations: Donation[] = [
      {
        id: "donation-1",
        businessId: "demo-business-1",
        productId: "product-1",
        quantity: 3,
        maxPerPerson: 1,
        description: "Pain de la veille, encore excellent pour le petit déjeuner",
        status: "active",
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        collectionSlots: ["lunch", "dinner"],
        taxBenefitValue: "8.10",
        createdAt: new Date(),
      },
      {
        id: "donation-2", 
        businessId: "demo-business-1",
        productId: "product-2",
        quantity: 2,
        maxPerPerson: 1,
        description: "Salades préparées ce matin, à consommer rapidement",
        status: "active", 
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        collectionSlots: ["lunch"],
        taxBenefitValue: "15.36",
        createdAt: new Date(),
      },
      {
        id: "donation-3",
        businessId: "demo-business-1", 
        productId: "product-4",
        quantity: 1,
        maxPerPerson: 1,
        description: "Tarte d'hier, parfaite pour le goûter",
        status: "completed",
        availableFrom: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        availableTo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        collectionSlots: ["afternoon"],
        taxBenefitValue: "10.80",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "donation-4",
        businessId: "demo-business-1",
        productId: "product-6", 
        quantity: 1,
        maxPerPerson: 2,
        description: "Bananes très mûres, parfaites pour smoothies",
        status: "completed",
        availableFrom: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        availableTo: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        collectionSlots: ["morning"],
        taxBenefitValue: "1.74",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ];
    
    sampleDonations.forEach(donation => {
      this.donations.set(donation.id, donation);
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
        timeSlots: Array.from(insertSchedule.timeSlots ?? existing.timeSlots) as {startTime: string, endTime: string, label: string}[],
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
        isOpen: insertSchedule.isOpen ?? true,
        timeSlots: Array.from(insertSchedule.timeSlots ?? []) as {startTime: string, endTime: string, label: string}[],
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
