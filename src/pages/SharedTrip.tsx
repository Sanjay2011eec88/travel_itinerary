import { useParams } from 'react-router-dom';
import { useSharedTrip } from '@/hooks/useTrips';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Loader2, AlertCircle } from 'lucide-react';
import { DestinationHero } from '@/components/travel/DestinationHero';
import { TimelineItinerary } from '@/components/travel/TimelineItinerary';
import { PostcardCard } from '@/components/travel/PostcardCard';

export default function SharedTrip() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { trip, itineraries, loading, error } = useSharedTrip(shareToken);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-travel-coral to-travel-teal animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
              <Plane className="h-8 w-8 text-travel-coral" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading shared adventure...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md text-center border-destructive/50">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Trip Not Found</h2>
            <p className="text-muted-foreground">{error || 'This trip is either private or does not exist.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-16 px-4">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-travel-coral flex items-center justify-center">
            <Plane className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">TripWeaver</span>
          <Badge variant="secondary" className="bg-travel-coral/10 text-travel-coral">Shared</Badge>
        </div>
      </header>

      <DestinationHero destination={trip.destination} startDate={trip.start_date} endDate={trip.end_date} travelers={trip.num_travelers} height="lg" />

      <main className="container px-4 py-6 max-w-3xl mx-auto -mt-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PostcardCard trip={trip} />
          <Card className="p-4 flex flex-col justify-center">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">💰 Budget</span><span className="capitalize font-medium">{trip.budget_level}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">🏨 Stay</span><span className="capitalize font-medium">{trip.accommodation_type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">✈️ Travel</span><span className="capitalize font-medium">{trip.travel_mode}</span></div>
            </div>
            {trip.activities?.length > 0 && (
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-1">
                {trip.activities.map((a) => <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>)}
              </div>
            )}
          </Card>
        </div>

        {itineraries.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">📅 Itinerary</h2>
            {itineraries.map((it) => <TimelineItinerary key={it.id} itinerary={it} />)}
          </div>
        )}

        <Card className="mt-8 bg-gradient-to-r from-travel-coral to-travel-teal text-white border-0">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold mb-2">Love this itinerary? ✨</h3>
            <p className="opacity-90 mb-4">Create your own AI-powered travel plans</p>
            <a href="/" className="inline-flex px-6 py-3 rounded-xl bg-white text-travel-coral font-semibold hover:bg-white/90">Start Planning</a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
