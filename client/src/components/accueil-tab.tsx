import { QrCode, Gift, Plus, Calendar, Download, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/hooks/use-business";
import { useProducts } from "@/hooks/use-products";
import { useDonations } from "@/hooks/use-donations";

export default function AccueilTab() {
  const { data: business } = useBusiness();
  const { data: products = [] } = useProducts();
  const { data: donations = [] } = useDonations();

  const activeDonations = donations.filter(d => d.status === "active");
  const totalSavedItems = 156; // This would be calculated from historical data
  const taxValue = 342; // This would be calculated from total donations

  return (
    <div>
      {/* Welcome Section */}
      <div className="gradient-primary text-white p-6">
        <h2 className="text-xl font-semibold mb-2">
          {business?.name || "Restaurant Le Jardin Bio"}
        </h2>
        <p className="text-primary-100">
          {business?.type || "Restaurant"} - Cuisine biologique
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm">Actif - Collectes disponibles</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tableau de bord</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Produits</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">Dons actifs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activeDonations.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-600">Éléments sauvés</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalSavedItems}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm text-gray-600">Valeur fiscale</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{taxValue}€</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="px-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Code QR de votre établissement</h4>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Partagez ce code pour que les bénéficiaires trouvent votre établissement
                </p>
                <Button variant="ghost" size="sm" className="text-primary-600 p-0">
                  Télécharger <Download className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <div className="px-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Activité récente</h4>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Pain artisanal donné</p>
                  <p className="text-xs text-gray-500">3 baguettes • il y a 2 heures</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Nouveau produit ajouté</p>
                  <p className="text-xs text-gray-500">Salade bio • hier</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Horaires mis à jour</p>
                  <p className="text-xs text-gray-500">Collecte 14h-16h • il y a 2 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="px-4 mb-6">
        <Card className="gradient-green border-primary-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Impact ce mois-ci</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">23</p>
                <p className="text-xs text-gray-600">Dons réalisés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">47kg</p>
                <p className="text-xs text-gray-600">Gaspillage évité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
