import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TripFormData, BUDGET_LEVELS, ACCOMMODATION_TYPES, 
  TRAVEL_MODES, ACTIVITY_OPTIONS, Itinerary 
} from '@/types/trip';
import { format } from 'date-fns';
import { 
  ArrowLeft, ArrowRight, CalendarIcon, Loader2, 
  Sparkles, Check, MapPin, Minus, Plus, Plane, Globe, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TravelCompanions } from '@/components/travel/TravelCompanions';

const STEPS = [
  { id: 1, title: 'Destination', description: 'Where does your heart want to go? 🌍', icon: '🗺️' },
  { id: 2, title: 'Dates', description: 'When is your adventure? 📅', icon: '✈️' },
  { id: 3, title: 'Budget', description: 'Travel your way 💰', icon: '💎' },
  { id: 4, title: 'Travelers', description: 'Who\'s coming along? 👥', icon: '🧳' },
  { id: 5, title: 'Accommodation', description: 'Where will you rest? 🏨', icon: '🛏️' },
  { id: 6, title: 'Travel Mode', description: 'How will you get there? 🚀', icon: '🌐' },
  { id: 7, title: 'Activities', description: 'What excites you? ✨', icon: '🎯' },
];

const POPULAR_DESTINATIONS = [
  { name: 'Paris, France', emoji: '🗼' },
  { name: 'Tokyo, Japan', emoji: '🗾' },
  { name: 'Bali, Indonesia', emoji: '🏝️' },
  { name: 'New York, USA', emoji: '🗽' },
  { name: 'Rome, Italy', emoji: '🏛️' },
  { name: 'Maldives', emoji: '🌴' },
];

export default function PlanTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createTrip } = useTrips();
  
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    budget_level: 'moderate',
    start_date: undefined,
    end_date: undefined,
    num_travelers: 1,
    accommodation_type: 'hotel',
    travel_mode: 'flight',
    activities: [],
  });

  // Pre-fill destination if coming from Destinations page
  useEffect(() => {
    const state = location.state as { preSelectedDestination?: string };
    if (state?.preSelectedDestination) {
      setFormData(prev => ({ ...prev, destination: state.preSelectedDestination }));
    }
  }, [location.state]);

  const progress = (step / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1: return formData.destination.trim().length > 0;
      case 2: return formData.start_date && formData.end_date;
      case 3: return true;
      case 4: return formData.num_travelers > 0;
      case 5: return true;
      case 6: return true;
      case 7: return formData.activities.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in first', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    let createdTripId: string | null = null;

    try {
      const trip = await createTrip(formData);
      if (!trip) {
        throw new Error('Failed to create trip');
      }
      
      createdTripId = trip.id;

      toast({ title: '✨ Generating itinerary...', description: 'Our AI is crafting your perfect adventure' });

      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          tripDetails: {
            destination: formData.destination,
            budget_level: formData.budget_level,
            start_date: formData.start_date?.toISOString().split('T')[0],
            end_date: formData.end_date?.toISOString().split('T')[0],
            num_travelers: formData.num_travelers,
            accommodation_type: formData.accommodation_type,
            travel_mode: formData.travel_mode,
            activities: formData.activities,
          },
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate itinerary');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.itinerary) {
        const itineraryData: Omit<Itinerary, 'id' | 'trip_id' | 'created_at'>[] = data.itinerary.map((day: {
          day_number: number;
          title: string;
          activities: Itinerary['activities'];
        }) => ({
          day_number: day.day_number,
          title: day.title,
          activities: day.activities,
        }));

        for (const item of itineraryData) {
          await supabase.from('itineraries').insert({
            trip_id: trip.id,
            day_number: item.day_number,
            title: item.title,
            activities: JSON.parse(JSON.stringify(item.activities)),
          });
        }

        toast({ title: '🎉 Success!', description: 'Your adventure awaits!' });
        navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      console.error('Error generating trip:', error);
      
      // Clean up the trip if itinerary generation failed
      if (createdTripId) {
        console.log('Cleaning up failed trip:', createdTripId);
        await supabase.from('trips').delete().eq('id', createdTripId);
      }
      
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to generate itinerary',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container px-4">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="ml-4 flex-1">
              <h1 className="font-semibold flex items-center gap-2">
                <span>{STEPS[step - 1].icon}</span> {STEPS[step - 1].title}
              </h1>
              <p className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Plane className="h-4 w-4 text-travel-coral" />
              <span className="hidden sm:inline">Planning Mode</span>
            </div>
          </div>
          <Progress value={progress} className="h-1 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-travel-coral [&>div]:to-travel-teal" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-lg mx-auto">
        <Card className="shadow-xl border-0 animate-fade-in bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">{STEPS[step - 1].icon}</div>
            <CardTitle className="text-2xl">{STEPS[step - 1].title}</CardTitle>
            <CardDescription className="text-base">{STEPS[step - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Step 1: Destination */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-travel-coral" />
                  <Input
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="pl-12 h-14 text-lg border-2 focus:border-travel-coral"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Popular destinations</p>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => setFormData({ ...formData, destination: dest.name })}
                        className={cn(
                          'p-3 rounded-xl border-2 text-left transition-all text-sm',
                          formData.destination === dest.name
                            ? 'border-travel-coral bg-travel-coral/10'
                            : 'border-border hover:border-travel-coral/50 hover:bg-muted/50'
                        )}
                      >
                        <span className="mr-2">{dest.emoji}</span>
                        {dest.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span>🛫</span> Departure
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left h-12 border-2">
                          <CalendarIcon className="mr-2 h-4 w-4 text-travel-coral" />
                          {formData.start_date ? format(formData.start_date, 'MMM d, yyyy') : 'Pick date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.start_date}
                          onSelect={(date) => setFormData({ ...formData, start_date: date })}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span>🛬</span> Return
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left h-12 border-2">
                          <CalendarIcon className="mr-2 h-4 w-4 text-travel-teal" />
                          {formData.end_date ? format(formData.end_date, 'MMM d, yyyy') : 'Pick date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.end_date}
                          onSelect={(date) => setFormData({ ...formData, end_date: date })}
                          disabled={(date) => date < (formData.start_date || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {formData.start_date && formData.end_date && (
                  <div className="p-4 rounded-xl bg-travel-coral/10 border border-travel-coral/20 text-center">
                    <p className="text-lg font-semibold text-travel-coral">
                      {Math.ceil((formData.end_date.getTime() - formData.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1} days of adventure! 🎉
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-3">
                {BUDGET_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData({ ...formData, budget_level: level.value })}
                    className={cn(
                      'w-full p-5 rounded-xl border-2 text-left transition-all',
                      formData.budget_level === level.value
                        ? 'border-travel-coral bg-travel-coral/10 shadow-lg'
                        : 'border-border hover:border-travel-coral/50 hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {level.value === 'budget' ? '💰' : level.value === 'moderate' ? '💎' : '👑'}
                        </span>
                        <div>
                          <p className="font-bold text-lg">{level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                      {formData.budget_level === level.value && (
                        <Check className="h-6 w-6 text-travel-coral" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Travelers */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-8 py-8">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-2 border-travel-coral text-travel-coral hover:bg-travel-coral hover:text-white"
                    onClick={() => setFormData({ ...formData, num_travelers: Math.max(1, formData.num_travelers - 1) })}
                    disabled={formData.num_travelers <= 1}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <div className="text-center">
                    <span className="text-6xl font-bold bg-gradient-to-r from-travel-coral to-travel-teal bg-clip-text text-transparent">
                      {formData.num_travelers}
                    </span>
                    <p className="text-muted-foreground mt-2 text-lg">
                      {formData.num_travelers === 1 ? 'Solo Traveler 🎒' : 'Travelers 👥'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-2 border-travel-teal text-travel-teal hover:bg-travel-teal hover:text-white"
                    onClick={() => setFormData({ ...formData, num_travelers: formData.num_travelers + 1 })}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                <TravelCompanions count={formData.num_travelers} variant="compact" className="justify-center" />
              </div>
            )}

            {/* Step 5: Accommodation */}
            {step === 5 && (
              <div className="grid grid-cols-2 gap-3">
                {ACCOMMODATION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, accommodation_type: type.value })}
                    className={cn(
                      'p-5 rounded-xl border-2 text-center transition-all',
                      formData.accommodation_type === type.value
                        ? 'border-travel-coral bg-travel-coral/10 shadow-lg'
                        : 'border-border hover:border-travel-coral/50 hover:bg-muted/50'
                    )}
                  >
                    <span className="text-4xl block mb-2">{type.icon}</span>
                    <p className="font-semibold">{type.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 6: Travel Mode */}
            {step === 6 && (
              <div className="grid grid-cols-2 gap-3">
                {TRAVEL_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setFormData({ ...formData, travel_mode: mode.value })}
                    className={cn(
                      'p-5 rounded-xl border-2 text-center transition-all',
                      formData.travel_mode === mode.value
                        ? 'border-travel-teal bg-travel-teal/10 shadow-lg'
                        : 'border-border hover:border-travel-teal/50 hover:bg-muted/50'
                    )}
                  >
                    <span className="text-4xl block mb-2">{mode.icon}</span>
                    <p className="font-semibold">{mode.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 7: Activities */}
            {step === 7 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={cn(
                        'px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all flex items-center gap-1',
                        formData.activities.includes(activity)
                          ? 'border-travel-coral bg-travel-coral text-white shadow-lg'
                          : 'border-border hover:border-travel-coral/50 hover:bg-muted/50'
                      )}
                    >
                      {formData.activities.includes(activity) && <Heart className="h-3 w-3 fill-current" />}
                      {activity}
                    </button>
                  ))}
                </div>
                {formData.activities.length > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {formData.activities.length} activities selected ✨
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step < STEPS.length ? (
            <Button 
              className="flex-1 h-14 bg-gradient-to-r from-travel-coral to-travel-coral/90 hover:from-travel-coral/90 hover:to-travel-coral text-white shadow-xl" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="flex-1 h-14 bg-gradient-to-r from-travel-coral via-travel-coral to-travel-teal hover:opacity-90 text-white shadow-xl" 
              onClick={handleGenerate}
              disabled={!canProceed() || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate My Adventure
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
