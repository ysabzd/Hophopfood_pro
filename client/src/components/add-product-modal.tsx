import { useState } from "react";
import { Camera, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";

const addProductSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  unitPrice: z.string().min(1, "Le prix unitaire est requis"),
  currentStock: z.string().min(1, "Le stock actuel est requis"),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
});

type AddProductForm = z.infer<typeof addProductSchema>;

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProduct } = useProducts();
  const { toast } = useToast();

  const form = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      category: "",
      unitPrice: "",
      currentStock: "",
      expiryDate: "",
      description: "",
    },
  });

  const categories = [
    { value: "", label: "Sélectionner une catégorie" },
    { value: "Boulangerie", label: "Boulangerie" },
    { value: "Plats", label: "Plats" },
    { value: "Légumes", label: "Légumes" },
    { value: "Fruits", label: "Fruits" },
    { value: "Boissons", label: "Boissons" },
    { value: "Desserts", label: "Desserts" },
    { value: "Autres", label: "Autres" },
  ];

  const onSubmit = async (data: AddProductForm) => {
    setIsSubmitting(true);
    try {
      await createProduct.mutateAsync({
        businessId: "demo-business-1", // For MVP
        name: data.name,
        category: data.category,
        unitPrice: data.unitPrice,
        currentStock: parseInt(data.currentStock),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        description: data.description || null,
        photoUrl: null,
      });

      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du produit.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto bottom-0 top-auto translate-y-0 rounded-t-2xl rounded-b-none">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Ajouter un produit
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
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
              Nom du produit
            </Label>
            <Input
              id="name"
              placeholder="Ex: Pain de campagne"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
              Catégorie
            </Label>
            <Select onValueChange={(value) => form.setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="unitPrice" className="text-sm font-medium text-gray-700 mb-2 block">
                Prix unitaire
              </Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                placeholder="3.50"
                {...form.register("unitPrice")}
              />
              {form.formState.errors.unitPrice && (
                <p className="text-xs text-red-600 mt-1">{form.formState.errors.unitPrice.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="currentStock" className="text-sm font-medium text-gray-700 mb-2 block">
                Stock actuel
              </Label>
              <Input
                id="currentStock"
                type="number"
                placeholder="12"
                {...form.register("currentStock")}
              />
              {form.formState.errors.currentStock && (
                <p className="text-xs text-red-600 mt-1">{form.formState.errors.currentStock.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 mb-2 block">
              Date d'expiration
            </Label>
            <Input
              id="expiryDate"
              type="date"
              {...form.register("expiryDate")}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Photo du produit
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Cliquer pour ajouter une photo</p>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Description du produit..."
              {...form.register("description")}
            />
          </div>
        </form>

        <DialogFooter className="border-t border-gray-200 pt-4 space-y-3">
          <Button 
            type="submit" 
            className="w-full" 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le produit"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
