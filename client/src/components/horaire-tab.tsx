import { useState, useEffect } from "react";
import { Clock, Settings, Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSchedule } from "@/hooks/use-schedule";
import { useToast } from "@/hooks/use-toast";

export default function HoraireTab() {
  const [businessType, setBusinessType] = useState("alimentaire");
  const [showSettings, setShowSettings] = useState(false);
  const [collectionMethod, setCollectionMethod] = useState("pickup");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { data: schedules = [], createOrUpdateSchedule } = useSchedule();
  const { toast } = useToast();

  const businessTypes = [
    { value: "alimentaire", label: "Restaurant", icon: "🍽️", color: "bg-green-50 border-green-200" },
    { value: "culture", label: "Culture", icon: "🎭", color: "bg-purple-50 border-purple-200" },
    { value: "bien-etre", label: "Bien-être", icon: "🧘", color: "bg-blue-50 border-blue-200" }
  ];

  const collectionMethods = [
    { value: "pickup", label: "Sur place", icon: "🏪" },
    { value: "delivery", label: "Livraison", icon: "🚚" },
    { value: "hybrid", label: "Mixte", icon: "🔄" }
  ];

  const weekDays = [
    { id: 1, name: "Lun", fullName: "Lundi", isWeekend: false },
    { id: 2, name: "Mar", fullName: "Mardi", isWeekend: false },
    { id: 3, name: "Mer", fullName: "Mercredi", isWeekend: false },
    { id: 4, name: "Jeu", fullName: "Jeudi", isWeekend: false },
    { id: 5, name: "Ven", fullName: "Vendredi", isWeekend: false },
    { id: 6, name: "Sam", fullName: "Samedi", isWeekend: true },
    { id: 0, name: "Dim", fullName: "Dimanche", isWeekend: true }
  ];

  const getCurrentBusinessType = () => businessTypes.find(bt => bt.value === businessType);

  // Initialize schedules
  useEffect(() => {
    const initializeSchedules = async () => {
      const currentType = getCurrentBusinessType();
      if (!currentType) return;
      
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const isOpen = businessType === "alimentaire" ? true : !weekDays.find(d => d.id === dayOfWeek)?.isWeekend;
        
        let timeSlots = [];
        if (businessType === "alimentaire") {
          timeSlots = [
            { startTime: "11:30", endTime: "14:30", label: "Déjeuner" },
            { startTime: "18:30", endTime: "22:00", label: "Dîner" }
          ];
        } else if (businessType === "culture") {
          timeSlots = [
            { startTime: "14:00", endTime: "17:00", label: "Matinée" },
            { startTime: "20:00", endTime: "23:00", label: "Soirée" }
          ];
        } else {
          timeSlots = [
            { startTime: "08:00", endTime: "12:00", label: "Matin" },
            { startTime: "14:00", endTime: "18:00", label: "Après-midi" }
          ];
        }
        
        await createOrUpdateSchedule.mutateAsync({
          businessId: "demo-business-1",
          dayOfWeek,
          isOpen,
          timeSlots,
          businessType
        });
      }
    };

    initializeSchedules();
  }, [businessType]);

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  const updateTimeSlot = async (dayOfWeek: number, slotIndex: number, field: string, value: string) => {
    const schedule = getScheduleForDay(dayOfWeek);
    if (!schedule) return;

    const updatedSlots = schedule.timeSlots.map((slot, index) => 
      index === slotIndex ? { ...slot, [field]: value } : slot
    );

    await createOrUpdateSchedule.mutateAsync({
      businessId: "demo-business-1",
      dayOfWeek,
      isOpen: schedule.isOpen,
      timeSlots: updatedSlots,
      businessType
    });
  };

  const toggleDayOpen = async (dayOfWeek: number) => {
    const schedule = getScheduleForDay(dayOfWeek);
    if (!schedule) return;

    await createOrUpdateSchedule.mutateAsync({
      businessId: "demo-business-1",
      dayOfWeek,
      isOpen: !schedule.isOpen,
      timeSlots: schedule.timeSlots,
      businessType
    });
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-900">Horaires</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Business Type & Collection Method */}
      <Card className={`${getCurrentBusinessType()?.color || 'bg-gray-50 border-gray-200'} transition-all`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCurrentBusinessType()?.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{getCurrentBusinessType()?.label}</h3>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{collectionMethods.find(m => m.value === collectionMethod)?.icon}</span>
                  <span>{collectionMethods.find(m => m.value === collectionMethod)?.label}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500"
            >
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Settings Accordion */}
          {showSettings && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Type d'établissement</Label>
                <div className="grid grid-cols-3 gap-2">
                  {businessTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBusinessType(type.value)}
                      className={`p-2 rounded-lg text-xs transition-all ${
                        businessType === type.value 
                          ? "bg-primary-600 text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <div className="text-base">{type.icon}</div>
                      <div className="font-medium mt-1">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Mode de collecte</Label>
                <div className="grid grid-cols-3 gap-2">
                  {collectionMethods.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setCollectionMethod(method.value)}
                      className={`p-2 rounded-lg text-xs transition-all ${
                        collectionMethod === method.value 
                          ? "bg-primary-600 text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <div className="text-base">{method.icon}</div>
                      <div className="font-medium mt-1">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Cards - Mobile First */}
      <div className="space-y-3">
        {weekDays.map((day) => {
          const schedule = getScheduleForDay(day.id);
          const isOpen = schedule?.isOpen ?? false;
          const timeSlots = schedule?.timeSlots ?? [];
          const isExpanded = expandedDay === day.id;

          return (
            <Card key={day.id} className={`transition-all ${
              isOpen 
                ? "border-green-200 bg-green-50" 
                : "border-gray-200 bg-gray-50"
            }`}>
              <CardContent className="p-0">
                {/* Day Header - Always Visible */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isOpen ? "bg-green-600 text-white" : "bg-gray-400 text-white"
                      }`}>
                        <span className="text-xs font-bold">{day.name}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{day.fullName}</h3>
                        <p className="text-xs text-gray-500">
                          {isOpen ? (
                            timeSlots.length > 0 
                              ? `${timeSlots.length} créneaux` 
                              : "Ouvert"
                          ) : "Fermé"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={isOpen} 
                        onCheckedChange={() => toggleDayOpen(day.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      {isOpen && (
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Slots - Expandable */}
                {isOpen && isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-green-200 pt-4">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-700">{slot.label}</Label>
                          <Badge variant="outline" className="text-xs">Actif</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(day.id, index, "startTime", e.target.value)}
                            className="text-center text-sm"
                          />
                          <span className="text-gray-400 text-sm">à</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(day.id, index, "endTime", e.target.value)}
                            className="text-center text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Preview for Closed State */}
                {isOpen && !isExpanded && timeSlots.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="flex space-x-2">
                      {timeSlots.slice(0, 2).map((slot, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {slot.startTime}-{slot.endTime}
                        </Badge>
                      ))}
                      {timeSlots.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{timeSlots.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => {
                // Copy Monday schedule to weekdays
                const mondaySchedule = getScheduleForDay(1);
                if (mondaySchedule) {
                  weekDays.slice(1, 6).forEach(day => {
                    createOrUpdateSchedule.mutate({
                      businessId: "demo-business-1",
                      dayOfWeek: day.id,
                      isOpen: true,
                      timeSlots: mondaySchedule.timeSlots,
                      businessType
                    });
                  });
                  toast({ title: "Horaires synchronisés", description: "Lundi appliqué aux jours ouvrables" });
                }
              }}
            >
              Même horaire
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => {
                weekDays.forEach(day => {
                  createOrUpdateSchedule.mutate({
                    businessId: "demo-business-1",
                    dayOfWeek: day.id,
                    isOpen: false,
                    timeSlots: [],
                    businessType
                  });
                });
                toast({ title: "Fermé", description: "Tous les jours fermés" });
              }}
            >
              Tout fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}