import { useState } from "react";
import { Grid, List, Search, Edit, Clock, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";
import AddProductModal from "./add-product-modal";

export default function ProduitsTab() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: products = [], isLoading } = useProducts();

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Boulangerie", label: "Boulangerie" },
    { value: "Plats", label: "Plats" },
    { value: "Légumes", label: "Légumes" },
    { value: "Fruits", label: "Fruits" },
    { value: "Boissons", label: "Boissons" },
    { value: "Desserts", label: "Desserts" },
    { value: "Autres", label: "Autres" },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Boulangerie: "🍞",
      Plats: "🍽️",
      Légumes: "🥕",
      Fruits: "🍎",
      Boissons: "🥤",
      Desserts: "🧁",
      Autres: "📦",
    };
    return icons[category] || "📦";
  };

  const getExpiryStatus = (expiryDate: Date | null) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Expiré", color: "text-red-600" };
    if (diffDays === 0) return { text: "Expire aujourd'hui", color: "text-orange-600" };
    if (diffDays === 1) return { text: "Expire demain", color: "text-orange-500" };
    return { text: `Expire dans ${diffDays}j`, color: "text-gray-500" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mes produits</h2>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"}>
            {filteredProducts.map((product) => {
              const expiryStatus = getExpiryStatus(product.expiryDate);
              const isLowStock = product.currentStock <= 5;
              
              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      <>
                        <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 relative flex items-center justify-center">
                          <span className="text-3xl">{getCategoryIcon(product.category)}</span>
                          <div className="absolute top-2 right-2">
                            <span className={`text-white text-xs px-2 py-1 rounded-full ${
                              isLowStock ? "bg-red-500" : "bg-primary-600"
                            }`}>
                              Stock: {product.currentStock}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              {parseFloat(product.unitPrice).toFixed(2)}€
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                          {expiryStatus && (
                            <div className={`mt-2 text-xs ${expiryStatus.color} flex items-center`}>
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{expiryStatus.text}</span>
                            </div>
                          )}
                          {isLowStock && (
                            <div className="mt-2 text-xs text-red-500 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              <span>Stock faible</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-4 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {parseFloat(product.unitPrice).toFixed(2)}€
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              isLowStock ? "bg-red-100 text-red-800" : "bg-primary-100 text-primary-800"
                            }`}>
                              Stock: {product.currentStock}
                            </span>
                          </div>
                          {expiryStatus && (
                            <div className={`mt-1 text-xs ${expiryStatus.color} flex items-center`}>
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{expiryStatus.text}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product Button */}
      <div className="p-4">
        <Button 
          className="w-full"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Add Product Modal */}
      <AddProductModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
}
