import { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchedule } from "@/hooks/use-schedule";

export default function HoraireTab() {
  const [businessType, setBusinessType] = useState("alimentaire");
  const [emergencyClosure, setEmergencyClosure] = useState(false);
  const [newClosureDate, setNewClosureDate] = useState("");

  const { data: schedules = [], createOrUpdateSchedule } = useSchedule();

  // Update all schedules when business type changes
  useEffect(() => {
    const updateSchedulesForBusinessType = async () => {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        let defaultSlots: Array<{startTime: string, endTime: string, label: string}> = [];
        
        if (businessType === "alimentaire") {
          // Midi et soir, ouverture continue 7/7
          defaultSlots = [
            { startTime: "12:00", endTime: "14:00", label: "Service midi" },
            { startTime: "19:00", endTime: "21:00", label: "Service soir" }
          ];
        } else if (businessType === "culture") {
          // Toute la journée avec réservation
          defaultSlots = [
            { startTime: "09:00", endTime: "22:00", label: "Représentations" }
          ];
        } else if (businessType === "bien-etre") {
          // Créneaux horaires pour services
          defaultSlots = [
            { startTime: "13:00", endTime: "14:00", label: "Créneau 1" },
            { startTime: "14:00", endTime: "15:00", label: "Créneau 2" },
            { startTime: "15:00", endTime: "16:00", label: "Créneau 3" }
          ];
        }

        createOrUpdateSchedule.mutate({
          businessId: "demo-business-1",
          dayOfWeek,
          isOpen: dayOfWeek !== 0 || businessType === "alimentaire", // Alimentaire open 7/7
          timeSlots: defaultSlots,
          businessType
        });
      }
    };

    updateSchedulesForBusinessType();
  }, [businessType, createOrUpdateSchedule]);

  const businessTypes = [
    { value: "alimentaire", label: "Alimentaire (Restaurant/Supermarché)" },
    { value: "culture", label: "Culture (Théâtre/Concert)" },
    { value: "bien-etre", label: "Bien-être (Yoga/Sport/Coiffeur)" },
  ];

  const weekDays = [
    { id: 0, name: "Dimanche" },
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 5, name: "Vendredi" },
    { id: 6, name: "Samedi" },
  ];

  const exceptionalClosures = [
    { id: "1", date: "2024-12-25", reason: "Noël - Fermé toute la journée" },
  ];

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Horaires de collecte</h2>
      
      {/* Business Type Selector */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Type d'établissement
          </Label>
          <Select value={businessType} onValueChange={setBusinessType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Planning hebdomadaire</h3>
          
          <div className="space-y-3">
            {weekDays.map((day) => {
              const schedule = getScheduleForDay(day.id);
              const isOpen = schedule?.isOpen ?? (day.id !== 0); // Default closed on Sunday
              
              return (
                <Card key={day.id} className="border border-gray-200">
                  <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                    <span className="font-medium text-gray-900">{day.name}</span>
                    <div className="flex items-center space-x-2">
                      <Switch checked={isOpen} />
                      <span className="text-sm text-gray-600">
                        {isOpen ? "Ouvert" : "Fermé"}
                      </span>
                    </div>
                  </div>
                  
                  {isOpen && (
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Collecte déjeuner</span>
                        <div className="flex space-x-2 text-sm">
                          <Input
                            type="time"
                            defaultValue="12:00"
                            className="w-20 h-8 px-2 text-center"
                          />
                          <span className="self-center">-</span>
                          <Input
                            type="time"
                            defaultValue="14:00"
                            className="w-20 h-8 px-2 text-center"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Collecte dîner</span>
                        <div className="flex space-x-2 text-sm">
                          <Input
                            type="time"
                            defaultValue="19:00"
                            className="w-20 h-8 px-2 text-center"
                          />
                          <span className="self-center">-</span>
                          <Input
                            type="time"
                            defaultValue="21:00"
                            className="w-20 h-8 px-2 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exceptional Closures */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Fermetures exceptionnelles</h3>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                type="date"
                value={newClosureDate}
                onChange={(e) => setNewClosureDate(e.target.value)}
                className="flex-1"
              />
              <Button className="px-4">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Existing Closures */}
            <div className="space-y-2">
              {exceptionalClosures.map((closure) => (
                <Card key={closure.id} className="bg-red-50 border-red-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(closure.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <p className="text-xs text-gray-500">{closure.reason}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Closure Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Fermeture d'urgence</h3>
              <p className="text-sm text-gray-500">Suspendre temporairement toutes les collectes</p>
            </div>
            <Switch
              checked={emergencyClosure}
              onCheckedChange={setEmergencyClosure}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
