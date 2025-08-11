import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusinessSchema, insertProductSchema, insertDonationSchema, insertScheduleSchema, insertClosureSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const businessId = "demo-business-1"; // For MVP, use fixed business ID

  // Business routes
  app.get("/api/business", async (req, res) => {
    try {
      const business = await storage.getBusiness(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  app.patch("/api/business", async (req, res) => {
    try {
      const data = insertBusinessSchema.partial().parse(req.body);
      const business = await storage.updateBusiness(businessId, data);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(400).json({ error: "Invalid business data" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts(businessId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse({ ...req.body, businessId });
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Donation routes
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations(businessId);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const data = insertDonationSchema.parse({ ...req.body, businessId });
      const donation = await storage.createDonation(data);
      res.status(201).json(donation);
    } catch (error) {
      res.status(400).json({ error: "Invalid donation data" });
    }
  });

  app.patch("/api/donations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertDonationSchema.partial().parse(req.body);
      const donation = await storage.updateDonation(id, data);
      if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(400).json({ error: "Invalid donation data" });
    }
  });

  app.delete("/api/donations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDonation(id);
      if (!success) {
        return res.status(404).json({ error: "Donation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete donation" });
    }
  });

  // Schedule routes
  app.get("/api/schedule", async (req, res) => {
    try {
      const schedule = await storage.getSchedule(businessId);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  app.post("/api/schedule", async (req, res) => {
    try {
      const data = insertScheduleSchema.parse({ ...req.body, businessId });
      const schedule = await storage.createOrUpdateSchedule(data);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  // Closure routes
  app.get("/api/closures", async (req, res) => {
    try {
      const closures = await storage.getClosures(businessId);
      res.json(closures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch closures" });
    }
  });

  app.post("/api/closures", async (req, res) => {
    try {
      const data = insertClosureSchema.parse({ ...req.body, businessId });
      const closure = await storage.createClosure(data);
      res.status(201).json(closure);
    } catch (error) {
      res.status(400).json({ error: "Invalid closure data" });
    }
  });

  app.delete("/api/closures/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteClosure(id);
      if (!success) {
        return res.status(404).json({ error: "Closure not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete closure" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
