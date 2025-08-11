import { useState } from "react";
import { Minus, Plus, Eye, Gift, Edit, Pause, Calendar, Users, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/hooks/use-products";
import { useDonations } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";

export default function OffrirTab() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxPerPerson, setMaxPerPerson] = useState(2);
  const [description, setDescription] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [collectionSlots, setCollectionSlots] = useState<string[]>([]);
  const [collectionInstructions, setCollectionInstructions] = useState("");

  const { data: products = [] } = useProducts();
  const { data: donations = [] } = useDonations();
  const { toast } = useToast();

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const activeDonations = donations.filter(d => d.status === "active");

  const calculateTaxBenefit = () => {
    if (!selectedProduct) return 0;
    const unitPrice = parseFloat(selectedProduct.unitPrice);
    return (quantity * unitPrice * 0.60).toFixed(2); // 60% tax benefit
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = selectedProduct?.currentStock || 0;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleSlotToggle = (slot: string) => {
    setCollectionSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = () => {
    if (!selectedProduct || !availableFrom || !availableTo || collectionSlots.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Don publié",
      description: "Votre don a été publié avec succès.",
    });

    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setMaxPerPerson(2);
    setDescription("");
    setAvailableFrom("");
    setAvailableTo("");
    setCollectionSlots([]);
    setCollectionInstructions("");
  };

  const timeSlots = [
    { id: "lunch", label: "12h00 - 14h00 (Déjeuner)" },
    { id: "dinner", label: "19h00 - 21h00 (Dîner)" },
    { id: "allday", label: "Toute la journée" },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Faire un don</h2>
      
      {/* Product Selection */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Sélectionner un produit
          </Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un produit..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} (Stock: {product.currentStock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Donation Details Form */}
      {selectedProduct && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Détails du don</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantité à donner
                </Label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    max={selectedProduct.currentStock}
                    className="text-center flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedProduct.currentStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum disponible: {selectedProduct.currentStock}
                </p>
              </div>

              <div>
                <Label htmlFor="maxPerPerson" className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantité max par personne
                </Label>
                <Input
                  id="maxPerPerson"
                  type="number"
                  value={maxPerPerson}
                  onChange={(e) => setMaxPerPerson(parseInt(e.target.value) || 1)}
                  min={1}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description et état
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Décrivez le produit, son état, instructions spéciales..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Tax Benefit Calculator */}
              <Card className="bg-primary-50 border-primary-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Avantage fiscal estimé:</span>
                    <span className="text-lg font-bold text-primary-600">{calculateTaxBenefit()}€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Basé sur le prix unitaire et la quantité</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability & Collection */}
      {selectedProduct && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Disponibilité et collecte</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="availableFrom" className="text-sm font-medium text-gray-700 mb-2 block">
                    Date de début
                  </Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="availableTo" className="text-sm font-medium text-gray-700 mb-2 block">
                    Date de fin
                  </Label>
                  <Input
                    id="availableTo"
                    type="date"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Créneaux de collecte
                </Label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={slot.id}
                        checked={collectionSlots.includes(slot.id)}
                        onCheckedChange={() => handleSlotToggle(slot.id)}
                      />
                      <Label htmlFor={slot.id} className="text-sm">
                        {slot.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="collectionInstructions" className="text-sm font-medium text-gray-700 mb-2 block">
                  Instructions de collecte
                </Label>
                <Textarea
                  id="collectionInstructions"
                  rows={2}
                  placeholder="Entrée côté rue, demander au comptoir..."
                  value={collectionInstructions}
                  onChange={(e) => setCollectionInstructions(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {selectedProduct && (
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser le don
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            <Gift className="w-4 h-4 mr-2" />
            Publier le don
          </Button>
        </div>
      )}

      {/* Active Donations */}
      {activeDonations.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-4">Dons actifs</h3>
          <div className="space-y-3">
            {activeDonations.map((donation) => {
              const product = products.find(p => p.id === donation.productId);
              
              return (
                <Card key={donation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{product?.name}</h4>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pause className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Quantité: {donation.quantity} unités
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Jusqu'au {new Date(donation.availableTo).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        2 personnes intéressées
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Actif
                      </span>
                      <Button variant="ghost" size="sm" className="text-primary-600">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
