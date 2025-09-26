import { useState } from "react";
import { Camera, X, ArrowLeft, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";

const addProductSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  description: z.string().optional(),
  proposedQuantity: z.number().min(1, "La quantité proposée est requise"),
  maxPerPerson: z.number().min(1, "La quantité max par personne est requise"),
  productValue: z.string().min(1, "La valeur du produit est requise"),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  allergens: z.array(z.string()),
  additionalOptions: z.array(z.string()),
});

type AddProductForm = z.infer<typeof addProductSchema>;

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProduct } = useProducts();
  const { toast } = useToast();

  const form = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      proposedQuantity: 1,
      maxPerPerson: 1,
      productValue: "",
      isVegetarian: false,
      isVegan: false,
      allergens: [],
      additionalOptions: [],
    },
  });

  const productTypes = [
    { 
      value: "alimentaire", 
      label: "Alimentaire",
      description: "Nourriture, boissons, produits frais",
      icon: "🍽️",
      fields: ["allergens", "dietary", "expiry", "temperature"]
    },
    { 
      value: "culture", 
      label: "Culture",
      description: "Théâtre, concert, livre, art",
      icon: "🎭",
      fields: ["category", "condition", "age", "language"]
    },
    { 
      value: "bien-etre", 
      label: "Bien être",
      description: "Cosmétiques, soins, wellness",
      icon: "🧘",
      fields: ["type", "ingredients", "skinType", "usage"]
    },
  ];

  const allergens = [
    { id: "gluten", label: "Gluten" },
    { id: "eggs", label: "Œufs" },
    { id: "peanuts", label: "Arachides" },
    { id: "milk", label: "Lait" },
    { id: "celery", label: "Céleri" },
    { id: "sesame", label: "Graines de sésame" },
    { id: "lupin", label: "Lupin" },
    { id: "crustaceans", label: "Crustacés" },
    { id: "fish", label: "Poissons" },
    { id: "soy", label: "Soja" },
    { id: "nuts", label: "Fruits à coque" },
    { id: "mustard", label: "Moutarde" },
    { id: "sulfites", label: "Anhydride sulfureux" },
    { id: "molluscs", label: "Mollusques" },
  ];

  const additionalOptions = [
    { id: "container", label: "Apporter contenant" },
    { id: "bag", label: "Apporter sac" },
    { id: "dlc", label: "DLC du jour" },
  ];

  const onSubmit = async (data: AddProductForm) => {
    setIsSubmitting(true);
    try {
      // Convert product type to category
      const categoryMap: { [key: string]: string } = {
        "alimentaire": "Plats",
        "culture": "Autres",
        "bien-etre": "Autres"
      };

      await createProduct.mutateAsync({
        businessId: "demo-business-1",
        name: data.name,
        category: categoryMap[productType] || "Autres",
        unitPrice: data.productValue,
        currentStock: data.proposedQuantity,
        expiryDate: null,
        description: data.description || null,
        photoUrl: null,
      });

      toast({
        title: "Produit publié",
        description: "Votre produit a été publié avec succès.",
      });

      form.reset();
      setStep(1);
      setProductType("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementQuantity = (field: "proposedQuantity" | "maxPerPerson") => {
    const currentValue = form.getValues(field);
    form.setValue(field, currentValue + 1);
  };

  const decrementQuantity = (field: "proposedQuantity" | "maxPerPerson") => {
    const currentValue = form.getValues(field);
    if (currentValue > 1) {
      form.setValue(field, currentValue - 1);
    }
  };

  const handleAllergenChange = (allergenId: string, checked: boolean) => {
    const currentAllergens = form.getValues("allergens");
    if (checked) {
      form.setValue("allergens", [...currentAllergens, allergenId]);
    } else {
      form.setValue("allergens", currentAllergens.filter(id => id !== allergenId));
    }
  };

  const handleOptionChange = (optionId: string, checked: boolean) => {
    const currentOptions = form.getValues("additionalOptions");
    if (checked) {
      form.setValue("additionalOptions", [...currentOptions, optionId]);
    } else {
      form.setValue("additionalOptions", currentOptions.filter(id => id !== optionId));
    }
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setProductType("");
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-sm mx-auto bottom-0 top-auto translate-y-0 rounded-t-2xl rounded-b-none h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {step > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setStep(step - 1)}
                className="h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="text-lg font-semibold text-gray-900 flex-1 text-center">
              {step === 1 ? "Choisir type de produit" : "Créer un nouveau produit"}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step 1: Product Type Selection */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between p-6">
            <div className="space-y-3">
              {productTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setProductType(type.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${ 
                    productType === type.value 
                      ? "border-primary-600 bg-primary-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{type.label}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          productType === type.value ? "bg-primary-600" : "bg-gray-300"
                        }`}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <Button 
              onClick={() => setStep(2)}
              disabled={!productType}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              Continuer
            </Button>
          </div>
        )}

        {/* Step 2: Product Details */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Photo du produit
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Ajouter une photo</p>
                  <Button variant="outline" size="sm" type="button">
                    Choisir une photo
                  </Button>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nom du produit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Pizza Margherita, Salade César..."
                  {...form.register("name")}
                  className="w-full"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Décrivez brièvement le produit..."
                  {...form.register("description")}
                />
              </div>

              {/* Quantity Controls */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Quantité proposée <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => decrementQuantity("proposedQuantity")}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={form.watch("proposedQuantity")}
                      onChange={(e) => form.setValue("proposedQuantity", parseInt(e.target.value) || 1)}
                      className="text-center w-20"
                      min="1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => incrementQuantity("proposedQuantity")}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Quantité max par personne
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => decrementQuantity("maxPerPerson")}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={form.watch("maxPerPerson")}
                      onChange={(e) => form.setValue("maxPerPerson", parseInt(e.target.value) || 1)}
                      className="text-center w-20"
                      min="1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => incrementQuantity("maxPerPerson")}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Value */}
              <div>
                <Label htmlFor="productValue" className="text-sm font-medium text-gray-700 mb-2 block">
                  Valeur du produit (€)
                </Label>
                <Input
                  id="productValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("productValue")}
                />
              </div>

              {/* Business Type Specific Fields */}
              {productType === "alimentaire" && (
                <>
                  {/* Dietary Information */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Informations diététiques
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegetarian"
                          checked={form.watch("isVegetarian")}
                          onCheckedChange={(checked) => form.setValue("isVegetarian", checked === true)}
                        />
                        <Label htmlFor="vegetarian" className="text-sm">Végétarien</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegan"
                          checked={form.watch("isVegan")}
                          onCheckedChange={(checked) => form.setValue("isVegan", checked === true)}
                        />
                        <Label htmlFor="vegan" className="text-sm">Vegan</Label>
                      </div>
                    </div>
                  </div>

                  {/* Allergens */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Allergènes présents
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {allergens.map((allergen) => (
                        <div key={allergen.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={allergen.id}
                            checked={form.watch("allergens").includes(allergen.id)}
                            onCheckedChange={(checked) => handleAllergenChange(allergen.id, checked === true)}
                          />
                          <Label htmlFor={allergen.id} className="text-xs">{allergen.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Temperature Storage */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Conservation
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="refrigerated" />
                        <Label htmlFor="refrigerated" className="text-sm">Réfrigéré</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="frozen" />
                        <Label htmlFor="frozen" className="text-sm">Congelé</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {productType === "culture" && (
                <>
                  {/* Category */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Catégorie culturelle
                    </Label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Livre</option>
                      <option>Billet spectacle</option>
                      <option>Œuvre d'art</option>
                      <option>Instrument</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      État
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="new" />
                        <Label htmlFor="new" className="text-sm">Neuf</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="used" />
                        <Label htmlFor="used" className="text-sm">Occasion</Label>
                      </div>
                    </div>
                  </div>

                  {/* Age Recommendation */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Âge recommandé
                    </Label>
                    <Input placeholder="Ex: Tout public, 12+, Adulte..." />
                  </div>
                </>
              )}

              {productType === "bien-etre" && (
                <>
                  {/* Product Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Type de produit
                    </Label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Cosmétique</option>
                      <option>Soin visage</option>
                      <option>Soin corps</option>
                      <option>Parfum</option>
                      <option>Accessoire wellness</option>
                    </select>
                  </div>

                  {/* Skin Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Type de peau
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sensitive" />
                        <Label htmlFor="sensitive" className="text-sm">Sensible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dry" />
                        <Label htmlFor="dry" className="text-sm">Sèche</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="oily" />
                        <Label htmlFor="oily" className="text-sm">Grasse</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="combination" />
                        <Label htmlFor="combination" className="text-sm">Mixte</Label>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Caractéristiques
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="organic" />
                        <Label htmlFor="organic" className="text-sm">Bio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="natural" />
                        <Label htmlFor="natural" className="text-sm">Naturel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cruelty-free" />
                        <Label htmlFor="cruelty-free" className="text-sm">Non testé sur animaux</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Additional Options */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Options supplémentaires
                </Label>
                <div className="space-y-2">
                  {additionalOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={form.watch("additionalOptions").includes(option.id)}
                        onCheckedChange={(checked) => handleOptionChange(option.id, checked === true)}
                      />
                      <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-base font-medium"
              >
                {isSubmitting ? "Publication en cours..." : "Publier le produit"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}