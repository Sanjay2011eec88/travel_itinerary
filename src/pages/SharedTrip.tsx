import { useParams } from 'react-router-dom';
import { useSharedTrip } from '@/hooks/useTrips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { 
  Calendar, Users, MapPin, Plane, Hotel, 
  DollarSign, Loader2, Clock, Lightbulb, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SharedTrip() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { trip, itineraries, loading, error } = useSharedTrip(shareToken);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shared trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Trip Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'This trip is either private or does not exist.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tripDays = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex items-center justify-center h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Plane className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">TripWeaver</span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-3xl mx-auto">
        {/* Trip Overview */}
        <Card className="mb-6 shadow-card">
          <CardHeader className="pb-4">
            <Badge variant="outline" className="w-fit mb-2">Shared Trip</Badge>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {trip.destination}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
              <span className="text-muted-foreground">({tripDays} days)</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{trip.num_travelers} {trip.num_travelers === 1 ? 'Traveler' : 'Travelers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{trip.budget_level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{trip.accommodation_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{trip.travel_mode}</span>
              </div>
            </div>

            {trip.activities && trip.activities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Activities</p>
                <div className="flex flex-wrap gap-2">
                  {trip.activities.map((activity) => (
                    <Badge key={activity} variant="secondary">{activity}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Itinerary */}
        {itineraries.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Itinerary</h2>
            
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="w-full overflow-x-auto flex justify-start mb-4 h-auto p-1">
                {itineraries.map((day) => (
                  <TabsTrigger 
                    key={day.day_number} 
                    value={String(day.day_number)}
                    className="min-w-[100px]"
                  >
                    Day {day.day_number}
                  </TabsTrigger>
                ))}
              </TabsList>

              {itineraries.map((day) => (
                <TabsContent key={day.day_number} value={String(day.day_number)}>
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{day.title || `Day ${day.day_number}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {day.activities.map((activity, index) => (
                        <div 
                          key={index}
                          className={cn(
                            'relative pl-6 pb-4',
                            index < day.activities.length - 1 && 'border-l-2 border-border ml-2'
                          )}
                        >
                          <div className="absolute -left-[5px] top-0 w-3 h-3 rounded-full bg-primary" />
                          
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Clock className="h-4 w-4" />
                              <span>{activity.time}</span>
                              {activity.duration && (
                                <span className="text-muted-foreground/60">• {activity.duration}</span>
                              )}
                            </div>
                            
                            <h4 className="font-semibold mb-1">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              {activity.location && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                              )}
                              {activity.cost && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <DollarSign className="h-3 w-3" />
                                  {activity.cost}
                                </span>
                              )}
                            </div>

                            {activity.tips && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-start gap-2 text-sm">
                                  <Lightbulb className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{activity.tips}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}

        {/* Footer CTA */}
        <Card className="mt-8 gradient-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold mb-2">Love this itinerary?</h3>
            <p className="opacity-80 mb-4">Create your own AI-powered travel plans with TripWeaver</p>
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-card text-foreground font-semibold hover:bg-card/90 transition-colors"
            >
              Start Planning
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}