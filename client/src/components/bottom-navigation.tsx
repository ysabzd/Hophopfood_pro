import { Home, Package, Gift, Clock, Settings } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "produits", label: "Produits", icon: Package },
    { id: "offrir", label: "Offrir", icon: Gift },
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
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item flex flex-col items-center p-2 min-w-0 flex-1 ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
