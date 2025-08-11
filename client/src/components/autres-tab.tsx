import { useState } from "react";
import { Camera, ChevronRight, FileText, Headphones, Download, Trash, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusiness } from "@/hooks/use-business";

export default function AutresTab() {
  const { data: business } = useBusiness();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [language, setLanguage] = useState("fr");

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Paramètres et profil</h2>
      
      {/* Business Profile */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Profil de l'établissement</h3>
          
          {/* Photo Upload */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Photo de l'établissement
            </Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
              <Button variant="outline" size="sm">
                Changer la photo
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 mb-2 block">
                Nom de l'établissement
              </Label>
              <Input
                id="businessName"
                defaultValue={business?.name || "Restaurant Le Jardin Bio"}
              />
            </div>

            <div>
              <Label htmlFor="businessType" className="text-sm font-medium text-gray-700 mb-2 block">
                Type d'établissement
              </Label>
              <Select defaultValue="restaurant">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="supermarket">Supermarché</SelectItem>
                  <SelectItem value="bakery">Boulangerie</SelectItem>
                  <SelectItem value="theater">Théâtre</SelectItem>
                  <SelectItem value="concert">Salle de concert</SelectItem>
                  <SelectItem value="yoga">Studio de yoga</SelectItem>
                  <SelectItem value="salon">Salon de coiffure</SelectItem>
                  <SelectItem value="sports">Centre sportif</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Décrivez votre établissement..."
                defaultValue={business?.description || "Restaurant de cuisine biologique locale avec un engagement fort pour l'environnement."}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Adresse complète
              </Label>
              <div className="space-y-2">
                <Input placeholder="Numéro et rue" defaultValue="123 Rue des Jardins" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Code postal" defaultValue="75001" />
                  <Input placeholder="Ville" defaultValue="Paris" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="instructions" className="text-sm font-medium text-gray-700 mb-2 block">
                Instructions de collecte
              </Label>
              <Textarea
                id="instructions"
                rows={2}
                placeholder="Instructions spéciales pour la collecte..."
                defaultValue={business?.collectionInstructions || "Entrée par la porte arrière, sonner deux fois. Apporter des contenants."}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Préférences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Notifications push</span>
                <p className="text-xs text-gray-500">Recevoir des notifications sur l'activité</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Email de rappel</span>
                <p className="text-xs text-gray-500">Rappels pour les produits proches de l'expiration</p>
              </div>
              <Switch
                checked={emailReminders}
                onCheckedChange={setEmailReminders}
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block">
                Langue
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Gestion du compte</h3>
          
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Conditions générales d'utilisation
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center space-x-3">
                <Headphones className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Contacter le support
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Exporter mes données
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-red-900 mb-4">Zone de danger</h3>
          
          <div className="space-y-3">
            <Button variant="destructive" className="w-full">
              <Trash className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </Button>

            <Button variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
