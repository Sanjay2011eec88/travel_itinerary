import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { useItineraries } from '@/hooks/useTrips';
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
  Sparkles, Check, MapPin, Minus, Plus 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Destination', description: 'Where do you want to go?' },
  { id: 2, title: 'Dates', description: 'When are you traveling?' },
  { id: 3, title: 'Budget', description: 'What\'s your budget level?' },
  { id: 4, title: 'Travelers', description: 'How many people?' },
  { id: 5, title: 'Accommodation', description: 'Where will you stay?' },
  { id: 6, title: 'Travel Mode', description: 'How will you get there?' },
  { id: 7, title: 'Activities', description: 'What do you want to do?' },
];

export default function PlanTrip() {
  const navigate = useNavigate();
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
      navigate('/');
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

    try {
      // First create the trip
      const trip = await createTrip(formData);
      if (!trip) {
        throw new Error('Failed to create trip');
      }

      toast({ title: 'Generating itinerary...', description: 'Our AI is crafting your perfect trip' });

      // Generate itinerary using AI
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

      // Save the generated itinerary
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

        // Save itineraries to database
        for (const item of itineraryData) {
          await supabase.from('itineraries').insert({
            trip_id: trip.id,
            day_number: item.day_number,
            title: item.title,
            activities: JSON.parse(JSON.stringify(item.activities)),
          });
        }

        toast({ title: 'Success!', description: 'Your trip has been created' });
        navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      console.error('Error generating trip:', error);
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
              <h1 className="font-semibold">Plan Your Trip</h1>
              <p className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-lg mx-auto">
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>{STEPS[step - 1].title}</CardTitle>
            <CardDescription>{STEPS[step - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Destination */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                      'w-full p-4 rounded-xl border-2 text-left transition-all',
                      formData.budget_level === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{level.label}</p>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {formData.budget_level === level.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Travelers */}
            {step === 4 && (
              <div className="flex items-center justify-center gap-8 py-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setFormData({ ...formData, num_travelers: Math.max(1, formData.num_travelers - 1) })}
                  disabled={formData.num_travelers <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="text-center">
                  <span className="text-5xl font-bold">{formData.num_travelers}</span>
                  <p className="text-muted-foreground mt-2">
                    {formData.num_travelers === 1 ? 'Traveler' : 'Travelers'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setFormData({ ...formData, num_travelers: formData.num_travelers + 1 })}
                >
                  <Plus className="h-5 w-5" />
                </Button>
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
                      'p-4 rounded-xl border-2 text-center transition-all',
                      formData.accommodation_type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <p className="mt-2 font-medium">{type.label}</p>
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
                      'p-4 rounded-xl border-2 text-center transition-all',
                      formData.travel_mode === mode.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-2xl">{mode.icon}</span>
                    <p className="mt-2 font-medium">{mode.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 7: Activities */}
            {step === 7 && (
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={cn(
                      'px-4 py-2 rounded-full border-2 text-sm font-medium transition-all',
                      formData.activities.includes(activity)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step < STEPS.length ? (
            <Button 
              className="flex-1 gradient-primary" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              className="flex-1 gradient-primary" 
              onClick={handleGenerate}
              disabled={!canProceed() || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}