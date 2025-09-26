import { useState } from "react";
import { QrCode, Gift, Plus, Calendar, Download, Package, TrendingUp, Users, Recycle, Heart, Clock, AlertTriangle, Camera, Scan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBusiness } from "@/hooks/use-business";
import { useProducts } from "@/hooks/use-products";
import { useDonations } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";

export default function AccueilTab() {
  const { data: business } = useBusiness();
  const { data: products = [] } = useProducts();
  const { data: donations = [] } = useDonations();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        setIsScanning(true);
        // Simulate scanning process
        setTimeout(() => {
          setIsScanning(false);
          toast({
            title: "QR Code scanné",
            description: "Don vérifié avec succès ! Le bénéficiaire peut récupérer les produits.",
          });
        }, 2000);
      } else {
        toast({
          title: "Caméra non disponible",
          description: "Votre appareil ne prend pas en charge l'accès à la caméra.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsScanning(false);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra.",
        variant: "destructive",
      });
    }
  };

  const activeDonations = donations.filter(d => d.status === "active");
  const completedDonations = donations.filter(d => d.status === "completed");
  const totalDonations = completedDonations.length;
  const wasteReduced = completedDonations.reduce((total, donation) => total + donation.quantity, 0);
  const peopleBenefited = Math.floor(wasteReduced * 1.5); // Estimate based on portions
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.currentStock <= 5).length;
  const expiringProducts = products.filter(p => {
    if (!p.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 2;
  }).length;
  
  const impactMetrics = [
    { 
      title: "Dons réalisés", 
      value: totalDonations, 
      icon: Gift, 
      color: "text-green-600", 
      bgColor: "bg-green-50",
      description: "ce mois",
      history: [1, 1, 2, 2] // Subtle growth pattern
    },
    { 
      title: "Gaspillage évité", 
      value: `${wasteReduced}kg`, 
      icon: Recycle, 
      color: "text-orange-600", 
      bgColor: "bg-orange-50",
      description: "cette semaine",
      history: [2, 1, 3, 2] // Variable pattern
    },
    { 
      title: "Personnes aidées", 
      value: peopleBenefited, 
      icon: Users, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      description: "familles",
      history: [1, 2, 2, 3] // Growth pattern
    },
    { 
      title: "Dons actifs", 
      value: activeDonations.length, 
      icon: Package, 
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      description: "disponibles",
      history: [2, 2, 2, 2] // Stable pattern
    }
  ];
  
  const getRecentActivity = () => {
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      time: string;
      icon: any;
      color: string;
    }> = [];
    
    // Add recent donations
    donations.slice(0, 3).forEach(donation => {
      const product = products.find(p => p.id === donation.productId);
      if (product) {
        activities.push({
          id: donation.id,
          type: donation.status === 'active' ? 'donation-active' : 'donation-completed',
          title: `${product.name}`,
          description: `${donation.quantity} unités • ${donation.status === 'active' ? 'En cours' : 'Terminé'}`,
          time: new Date(donation.createdAt || new Date()).toLocaleDateString('fr-FR'),
          icon: Gift,
          color: donation.status === 'active' ? 'text-green-600' : 'text-gray-500'
        });
      }
    });
    
    return activities.slice(0, 4);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">
              {business?.name || "Restaurant Le Jardin Bio"}
            </h2>
            <p className="text-primary-100 text-base mb-4">
              {business?.type || "Restaurant"} • Cuisine biologique
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Actif</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {activeDonations.length} collectes disponibles
              </Badge>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Votre impact</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const maxHistory = Math.max(...metric.history);
            return (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    {/* Subtle history sparkline */}
                    <div className="flex items-end space-x-0.5 h-4">
                      {metric.history.map((value, historyIndex) => (
                        <div
                          key={historyIndex}
                          className={`w-1 ${metric.bgColor.replace('bg-', 'bg-').replace('-50', '-300')} opacity-60 rounded-sm`}
                          style={{ 
                            height: `${(value / maxHistory) * 16}px`,
                            minHeight: '2px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      


      {/* Recent Activity Timeline */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-gray-900">Activité récente</h4>
          <Button variant="ghost" size="sm" className="text-primary-600">
            Voir tout
          </Button>
        </div>
        
        <div className="space-y-3">
          {getRecentActivity().map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Card key={activity.id} className="hover:shadow-sm transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                      <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.time}
                        </Badge>
                        {activity.type === 'donation-active' && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Actif
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {getRecentActivity().length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune activité récente</p>
                <p className="text-xs text-gray-400">Vos dons apparaîtront ici</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <Card className="bg-gradient-to-r from-primary-50 to-green-50 border-primary-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="default" 
                className="h-16 flex-col space-y-2 bg-primary-600 hover:bg-primary-700 shadow-sm"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Nouveau don</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2 border-primary-300 hover:bg-primary-50 shadow-sm"
              >
                <Package className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Ajouter produit</span>
              </Button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 flex-col space-y-1 hover:bg-primary-50"
              >
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-primary-700">Horaires</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 flex-col space-y-1 hover:bg-primary-50"
              >
                <QrCode className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-primary-700">Partager QR</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
