import { useState } from "react";
import { Bell, Leaf } from "lucide-react";
import BottomNavigation from "./bottom-navigation";
import AccueilTab from "./accueil-tab";
import ProduitsTab from "./produits-tab";
import DonTab from "./don-tab";
import HoraireTab from "./horaire-tab";
import AutresTab from "./autres-tab";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/hooks/use-business";

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState("accueil");
  const { data: business } = useBusiness();

  const renderTabContent = () => {
    switch (activeTab) {
      case "accueil":
        return <AccueilTab />;
      case "produits":
        return <ProduitsTab />;
      case "don":
        return <DonTab />;
      case "horaire":
        return <HoraireTab />;
      case "autres":
        return <AutresTab />;
      default:
        return <AccueilTab />;
    }
  };

  return (
    <div className="mobile-container bg-white shadow-xl">
      {/* Top Header */}
      <header className="bg-primary-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Leaf className="text-primary-600 w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold">HopHopFood</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-700"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </main>

      {/* Floating Action Button - Only show on products tab */}
      {activeTab === "produits" && (
        <Button
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-40"
          size="icon"
        >
          <span className="text-xl">+</span>
        </Button>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
