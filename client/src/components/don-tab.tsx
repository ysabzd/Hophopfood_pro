import { useState } from "react";
import { Gift, Package2, Clock, MapPin, Users, Heart, Plus, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProducts } from "@/hooks/use-products";
import { useDonations } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";

export default function DonTab() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantityProposed, setQuantityProposed] = useState(1);
  const [maxPerPerson, setMaxPerPerson] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: products = [] } = useProducts();
  const { data: donations = [], createDonation } = useDonations();
  const { toast } = useToast();

  const activeDonations = donations.filter(d => d.status === "active");
  const completedDonations = donations.filter(d => d.status === "completed");

  const getSelectedProductDetails = () => {
    return products.find(p => p.id === selectedProduct);
  };

  const calculateFiscalValue = () => {
    const product = getSelectedProductDetails();
    if (!product) return 0;
    return parseFloat(product.unitPrice) * quantityProposed;
  };

  const handleCreateDonation = async () => {
    if (!selectedProduct || quantityProposed < 1) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit et une quantité valide.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createDonation.mutateAsync({
        businessId: "demo-business-1",
        productId: selectedProduct,
        quantity: quantityProposed,
        maxPerPerson: maxPerPerson,
        fiscalValue: calculateFiscalValue(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        instructions: instructions || null,
        status: "active",
      });

      toast({
        title: "Don publié",
        description: "Votre don a été publié avec succès.",
      });

      // Reset form
      setSelectedProduct("");
      setQuantityProposed(1);
      setMaxPerPerson(1);
      setExpiryDate("");
      setInstructions("");
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication du don.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getDonationProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getTimeAgo = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)} jours`;
  };

  const getExpiryInfo = (donation: any) => {
    if (!donation.expiryDate) return null;

    const expiryDate = new Date(donation.expiryDate);
    const now = new Date();
    const diffInHours = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 0) {
      return { label: "Expiré", color: "destructive" };
    } else if (diffInHours < 6) {
      return { label: `${diffInHours}h restantes`, color: "destructive" };
    } else if (diffInHours < 24) {
      return { label: `${diffInHours}h restantes`, color: "default" };
    } else {
      return { label: `${Math.floor(diffInHours / 24)} jours`, color: "secondary" };
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Mes dons</h2>
        </div>
        <Badge variant="secondary" className="bg-primary-50 text-primary-700">
          {activeDonations.length} actifs
        </Badge>
      </div>

      {/* Publish Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white font-medium text-base flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Publier un don</span>
      </Button>

      {/* Donation Creation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm mx-auto bottom-0 top-auto translate-y-0 rounded-t-2xl rounded-b-none h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
            <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
              Publier un nouveau don
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Product Selection */}
            <div>
              <Label htmlFor="product" className="text-sm font-medium mb-2 block">
                Produit à donner
              </Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un produit..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center space-x-2">
                        <Package2 className="w-4 h-4" />
                        <span>{product.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantityProposed" className="text-sm font-medium mb-2 block">
                  Quantité proposée <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantityProposed"
                  type="number"
                  min={1}
                  value={quantityProposed}
                  onChange={(e) => setQuantityProposed(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </div>
              <div>
                <Label htmlFor="maxPerPerson" className="text-sm font-medium mb-2 block">
                  Max par personne <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxPerPerson"
                  type="number"
                  min={1}
                  value={maxPerPerson}
                  onChange={(e) => setMaxPerPerson(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </div>
            </div>

            {/* Fiscal Value Display */}
            {selectedProduct && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Valeur fiscale calculée
                </Label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valeur totale du don:</span>
                    <span className="font-semibold text-green-700">
                      {calculateFiscalValue().toFixed(2)}€
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Calculée automatiquement: {getSelectedProductDetails()?.unitPrice || 0}€ × {quantityProposed} unité(s)
                  </p>
                </div>
              </div>
            )}

            {/* Expiry Date */}
            <div>
              <Label htmlFor="expiry" className="text-sm font-medium mb-2 block">
                Date limite (optionnel)
              </Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            {/* Instructions */}
            <div>
              <Label htmlFor="instructions" className="text-sm font-medium mb-2 block">
                Instructions spéciales (optionnel)
              </Label>
              <Textarea
                id="instructions"
                placeholder="Ex: À récupérer entre 18h et 20h, apporter un conteneur..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="p-6 pt-0">
            <Button
              onClick={handleCreateDonation}
              disabled={isCreating || !selectedProduct}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              {isCreating ? "Publication..." : "Publier le don"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Donations */}
      {activeDonations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Dons actifs</span>
          </h3>
          <div className="space-y-3">
            {activeDonations.map((donation) => {
              const product = getDonationProduct(donation.productId);
              const expiryInfo = getExpiryInfo(donation);

              return (
                <Card key={donation.id} className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {product?.name || "Produit inconnu"}
                          </h4>
                          <Badge variant="default" className="bg-green-600">
                            Disponible
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Package2 className="w-4 h-4" />
                              <span>{donation.quantity} unités</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getTimeAgo(donation.createdAt || new Date())}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>Max {donation.maxPerPerson || 1}/pers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">💰 {donation.fiscalValue || 0}€ (fiscal)</span>
                            </div>
                          </div>

                          {expiryInfo && (
                            <div className="flex items-center space-x-1">
                              {expiryInfo.color === "destructive" ?
                                <AlertTriangle className="w-4 h-4 text-red-500" /> :
                                <Calendar className="w-4 h-4" />
                              }
                              <Badge variant={expiryInfo.color as any} className="text-xs">
                                {expiryInfo.label}
                              </Badge>
                            </div>
                          )}

                          {donation.instructions && (
                            <div className="bg-white p-2 rounded text-xs border border-green-200">
                              <strong>Instructions:</strong> {donation.instructions}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-red-600">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}


      {/* Empty State */}
      {activeDonations.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun don pour le moment
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par publier votre premier don en sélectionnant un produit ci-dessus.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Aidez votre communauté en partageant vos surplus</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}