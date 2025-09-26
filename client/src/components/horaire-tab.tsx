import { useState, useEffect } from "react";
import { Clock, Settings, Plus, Minus, ChevronDown, ChevronUp, Sun, Moon, Calendar } from "lucide-react";
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
  const [businessType, setBusinessType] = useState("restaurant");
  const { data: schedules = [], createOrUpdateSchedule } = useSchedule();
  const { toast } = useToast();

  const businessTypes = [
    {
      value: "restaurant",
      label: "Restaurant",
      icon: "🍽️",
      color: "bg-green-50 border-green-200",
      description: "2 services: matin et soir"
    },
    {
      value: "culture",
      label: "Culture",
      icon: "🎭",
      color: "bg-purple-50 border-purple-200",
      description: "Ouvert toute la journée"
    },
    {
      value: "bien-etre",
      label: "Bien-être",
      icon: "🧘",
      color: "bg-blue-50 border-blue-200",
      description: "Créneaux personnalisés"
    }
  ];

  // Generate time options in 24h format
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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

  // Initialize empty schedules and adapt when business type changes
  useEffect(() => {
    const initializeSchedules = async () => {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        await createOrUpdateSchedule.mutateAsync({
          businessId: "demo-business-1",
          dayOfWeek,
          isOpen: false,
          timeSlots: [],
          businessType
        });
      }
    };

    const adaptSchedulesToBusinessType = async () => {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const schedule = getScheduleForDay(dayOfWeek);
        if (!schedule) continue;

        let adaptedTimeSlots = [];

        if (businessType === "restaurant") {
          // Convertir vers restaurant (max 2 créneaux: matin + soir)
          if (schedule.timeSlots.length > 0) {
            adaptedTimeSlots = [
              { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" }
            ];
            if (schedule.timeSlots.length > 1) {
              adaptedTimeSlots.push(
                { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" }
              );
            }
          }
        } else if (businessType === "culture") {
          // Convertir vers culture (1 seul créneau)
          if (schedule.timeSlots.length > 0) {
            adaptedTimeSlots = [
              { startTime: "09:00", endTime: "18:00", label: "Toute la journée", type: "all_day" }
            ];
          }
        } else if (businessType === "bien-etre") {
          // Convertir vers bien-être (créneaux personnalisables)
          if (schedule.timeSlots.length > 0) {
            adaptedTimeSlots = schedule.timeSlots.map((slot, index) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              label: `Créneau ${index + 1}`,
              type: "custom"
            }));
          }
        }

        await createOrUpdateSchedule.mutateAsync({
          businessId: "demo-business-1",
          dayOfWeek,
          isOpen: schedule.isOpen,
          timeSlots: adaptedTimeSlots,
          businessType
        });
      }
    };

    if (schedules.length === 0) {
      // Première initialisation
      initializeSchedules();
    } else {
      // Adapter les horaires existants au nouveau type d'établissement
      adaptSchedulesToBusinessType();
    }
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
    if (!schedule) {
      console.log('No schedule found for day:', dayOfWeek);
      return;
    }

    console.log('Toggling day:', dayOfWeek, 'from', schedule.isOpen, 'to', !schedule.isOpen);

    try {
      await createOrUpdateSchedule.mutateAsync({
        businessId: "demo-business-1",
        dayOfWeek,
        isOpen: !schedule.isOpen,
        timeSlots: schedule.timeSlots,
        businessType
      });
      console.log('Toggle successful for day:', dayOfWeek);
    } catch (error) {
      console.error('Error toggling day:', dayOfWeek, error);
    }
  };

  const addTimeSlot = async (dayOfWeek: number) => {
    const schedule = getScheduleForDay(dayOfWeek);
    if (!schedule) return;

    let newSlot;
    if (businessType === "restaurant") {
      // Restaurant: 2 créneaux max (matin + soir)
      if (schedule.timeSlots.length >= 2) return;
      if (schedule.timeSlots.length === 0) {
        newSlot = { startTime: "11:30", endTime: "14:30", label: "Matin", type: "morning" };
      } else {
        newSlot = { startTime: "18:30", endTime: "22:00", label: "Soir", type: "evening" };
      }
    } else if (businessType === "culture") {
      // Culture: 1 seul créneau modifiable
      if (schedule.timeSlots.length >= 1) return;
      newSlot = { startTime: "09:00", endTime: "18:00", label: "Toute la journée", type: "all_day" };
    } else {
      // Bien-être: plusieurs créneaux personnalisables
      newSlot = {
        startTime: "09:00",
        endTime: "12:00",
        label: `Créneau ${schedule.timeSlots.length + 1}`,
        type: "custom"
      };
    }

    await createOrUpdateSchedule.mutateAsync({
      businessId: "demo-business-1",
      dayOfWeek,
      isOpen: schedule.isOpen,
      timeSlots: [...schedule.timeSlots, newSlot],
      businessType
    });
  };

  const removeTimeSlot = async (dayOfWeek: number, slotIndex: number) => {
    const schedule = getScheduleForDay(dayOfWeek);
    if (!schedule) return;

    // Restaurant et Culture: ne pas supprimer si c'est le dernier
    if ((businessType === "restaurant" || businessType === "culture") && schedule.timeSlots.length <= 1) return;

    // Bien-être: peut supprimer tant qu'il reste au moins 1
    if (businessType === "bien-etre" && schedule.timeSlots.length <= 1) return;

    const updatedSlots = schedule.timeSlots.filter((_, index) => index !== slotIndex);

    await createOrUpdateSchedule.mutateAsync({
      businessId: "demo-business-1",
      dayOfWeek,
      isOpen: schedule.isOpen,
      timeSlots: updatedSlots,
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
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Business Type Selection */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCurrentBusinessType()?.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{getCurrentBusinessType()?.label}</h3>
                <p className="text-sm text-gray-500">Sur place</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400">
              ⌄
            </Button>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Type d'établissement</Label>
            <div className="flex space-x-2">
              {businessTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setBusinessType(type.value)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    businessType === type.value
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Days */}
      <div className="space-y-3">
        {weekDays.map((day) => {
          const schedule = getScheduleForDay(day.id);
          const isOpen = schedule?.isOpen ?? false;
          const timeSlots = schedule?.timeSlots ?? [];
          const dayColors = {
            1: "bg-blue-500", // Lundi
            2: "bg-teal-500", // Mardi
            3: "bg-teal-500", // Mercredi
            4: "bg-teal-500", // Jeudi
            5: "bg-gray-400", // Vendredi
            6: "bg-gray-400", // Samedi
            0: "bg-gray-400", // Dimanche
          };

          return (
            <Card key={day.id} className={`${isOpen ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${dayColors[day.id]} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{day.name}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{day.fullName}</h3>
                      <p className="text-sm text-gray-500">
                        {isOpen ? `${timeSlots.length}/2 créneaux` : "Fermé"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isOpen}
                      onCheckedChange={(checked) => {
                        console.log('Switch toggled for day:', day.id, 'to:', checked);
                        toggleDayOpen(day.id);
                      }}
                      className="data-[state=checked]:bg-green-600"
                    />
                    {isOpen && (
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        ⌄
                      </Button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-3">
                    {timeSlots.length === 0 ? (
                      <Button
                        variant="outline"
                        onClick={() => addTimeSlot(day.id)}
                        className="w-full border-dashed border-2 border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un créneau
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                {slot.type === "morning" ? "Matin" :
                                 slot.type === "evening" ? "Soir" :
                                 slot.type === "all_day" ? "Toute la journée" :
                                 slot.label}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={true}
                                  onCheckedChange={() => {}}
                                  className="data-[state=checked]:bg-green-600 scale-75"
                                  disabled
                                />
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  Actif
                                </Badge>
                                {/* Bouton supprimer selon les règles */}
                                {((businessType === "restaurant" && timeSlots.length > 1) ||
                                  (businessType === "bien-etre" && timeSlots.length > 1)) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTimeSlot(day.id, index)}
                                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={slot.startTime}
                                onValueChange={(value) => updateTimeSlot(day.id, index, "startTime", value)}
                              >
                                <SelectTrigger className="w-20 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-gray-400">à</span>
                              <Select
                                value={slot.endTime}
                                onValueChange={(value) => updateTimeSlot(day.id, index, "endTime", value)}
                              >
                                <SelectTrigger className="w-20 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}

                        {/* Bouton ajouter selon les règles */}
                        {((businessType === "restaurant" && timeSlots.length < 2) ||
                          (businessType === "bien-etre")) && (
                          <Button
                            variant="outline"
                            onClick={() => addTimeSlot(day.id)}
                            className="w-full border-dashed border-2 border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {businessType === "restaurant" && timeSlots.length === 0 && "Ajouter service matin (ex: 11:30-14:30)"}
                            {businessType === "restaurant" && timeSlots.length === 1 && "Ajouter service soir (ex: 18:30-22:00)"}
                            {businessType === "bien-etre" && "Ajouter un créneau (ex: 09:00-12:00)"}
                          </Button>
                        )}

                        {/* Badges des créneaux */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {timeSlots.map((slot, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-900 text-white hover:bg-gray-800">
                              {slot.startTime}-{slot.endTime}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
          <div className="space-y-3">
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

            {/* Example Schedules */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Exemples d'horaires</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => {
                    let exampleSlots = [];
                    if (businessType === "restaurant") {
                      exampleSlots = [
                        { startTime: "11:30", endTime: "14:30", label: "Service midi", type: "morning" },
                        { startTime: "18:30", endTime: "22:00", label: "Service soir", type: "evening" }
                      ];
                    } else if (businessType === "culture") {
                      exampleSlots = [
                        { startTime: "09:00", endTime: "18:00", label: "Toute la journée", type: "all_day" }
                      ];
                    } else if (businessType === "bien-etre") {
                      exampleSlots = [
                        { startTime: "09:00", endTime: "12:00", label: "Matinée", type: "custom" },
                        { startTime: "14:00", endTime: "17:00", label: "Après-midi", type: "custom" }
                      ];
                    }

                    weekDays.slice(1, 6).forEach(day => {
                      createOrUpdateSchedule.mutate({
                        businessId: "demo-business-1",
                        dayOfWeek: day.id,
                        isOpen: true,
                        timeSlots: exampleSlots,
                        businessType
                      });
                    });
                    toast({ title: "Exemple appliqué", description: "Horaires d'exemple appliqués aux jours ouvrables" });
                  }}
                >
                  {businessType === "restaurant" && "🍽️ Restaurant (11h30-14h30, 18h30-22h)"}
                  {businessType === "culture" && "🎭 Culture (9h-18h)"}
                  {businessType === "bien-etre" && "🧘 Bien-être (9h-12h, 14h-17h)"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => {
                    let exampleSlots = [];
                    if (businessType === "restaurant") {
                      exampleSlots = [
                        { startTime: "12:00", endTime: "15:00", label: "Déjeuner", type: "morning" },
                        { startTime: "19:00", endTime: "23:00", label: "Dîner", type: "evening" }
                      ];
                    } else if (businessType === "culture") {
                      exampleSlots = [
                        { startTime: "10:00", endTime: "20:00", label: "Horaires étendus", type: "all_day" }
                      ];
                    } else if (businessType === "bien-etre") {
                      exampleSlots = [
                        { startTime: "08:00", endTime: "19:00", label: "Journée continue", type: "custom" }
                      ];
                    }

                    weekDays.slice(1, 6).forEach(day => {
                      createOrUpdateSchedule.mutate({
                        businessId: "demo-business-1",
                        dayOfWeek: day.id,
                        isOpen: true,
                        timeSlots: exampleSlots,
                        businessType
                      });
                    });
                    toast({ title: "Exemple appliqué", description: "Horaires étendus appliqués aux jours ouvrables" });
                  }}
                >
                  {businessType === "restaurant" && "🍽️ Horaires étendus (12h-15h, 19h-23h)"}
                  {businessType === "culture" && "🎭 Horaires étendus (10h-20h)"}
                  {businessType === "bien-etre" && "🧘 Journée continue (8h-19h)"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}