import { Home, Package, Gift, Clock, Settings, Scan } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startQRScan = async () => {
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

  const navItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "produits", label: "Produits", icon: Package },
    { id: "scan", label: "Scanner", icon: Scan, isAction: true },
    { id: "horaire", label: "Horaire", icon: Clock },
    { id: "autres", label: "Autres", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-mobile mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isQRScanner = item.id === "scan";
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isQRScanner) {
                    startQRScan();
                  } else {
                    onTabChange(item.id);
                  }
                }}
                className={`nav-item flex flex-col items-center p-2 min-w-0 flex-1 relative ${
                  isActive ? "active" : ""
                } ${isQRScanner && isScanning ? "animate-pulse" : ""}`}
                disabled={isQRScanner && isScanning}
              >
                <div className={`${isQRScanner ? "bg-primary-600 rounded-full p-1.5 -mt-2" : ""}`}>
                  <Icon className={`w-5 h-5 mb-1 ${
                    isQRScanner ? "text-white" : ""
                  } ${isQRScanner && isScanning ? "animate-pulse" : ""}`} />
                </div>
                <span className={`text-xs font-medium ${
                  isQRScanner ? "text-primary-600" : ""
                }`}>
                  {isQRScanner && isScanning ? "Scan..." : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
