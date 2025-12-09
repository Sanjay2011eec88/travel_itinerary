import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plane, Plus, MapPin, Loader2, 
  LogOut, Settings, WifiOff, Compass, Globe, Sparkles 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BoardingPassCard } from '@/components/travel/BoardingPassCard';
import { TravelQuote } from '@/components/travel/TravelQuote';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { trips, loading: tripsLoading, isOnline } = useTrips();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-travel-coral to-travel-teal animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
              <Plane className="h-8 w-8 text-travel-coral animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-travel-coral to-travel-coral/80 flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl">TripWeaver</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Your AI Travel Companion ✈️</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="outline" className="gap-1 border-travel-coral/50 text-travel-coral">
                <WifiOff className="h-3 w-3" />
                Offline
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="hover:bg-travel-coral/10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-travel-coral via-travel-coral/90 to-travel-teal p-8 md:p-12 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute bottom-10 right-20 w-20 h-20 border-2 border-white rounded-full" />
              <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-white rotate-45" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-travel-sand" />
                <span className="text-sm font-medium text-white/90">AI-Powered Travel Planning</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Your Next Adventure Awaits ✨
              </h1>
              <p className="text-white/80 mb-6 text-lg">
                Pack your dreams, we'll handle the rest. Create personalized itineraries 
                tailored to your style, budget, and wanderlust.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="bg-white text-travel-coral hover:bg-white/90 shadow-xl"
                  onClick={() => navigate('/plan')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Start Planning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Explore Destinations
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-20 -bottom-20 opacity-20">
              <Plane className="h-64 w-64 rotate-12" />
            </div>
            <div className="absolute top-8 right-8 animate-float">
              <Compass className="h-12 w-12 text-white/40" />
            </div>
          </div>
        </section>

        {/* Stats */}
        {trips.length > 0 && (
          <section className="mb-8 grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-travel-coral/10 to-travel-coral/5 border-travel-coral/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-travel-coral">{trips.length}</p>
                <p className="text-sm text-muted-foreground">Trips Planned</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-travel-teal/10 to-travel-teal/5 border-travel-teal/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-travel-teal">
                  {new Set(trips.map(t => t.destination)).size}
                </p>
                <p className="text-sm text-muted-foreground">Destinations</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-travel-sky/10 to-travel-sky/5 border-travel-sky/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-travel-sky">
                  {trips.reduce((acc, t) => acc + t.num_travelers, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Travelers</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* My Trips Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🎫 My Trips
              </h2>
              <p className="text-muted-foreground text-sm">Your boarding passes to adventure</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/plan')} className="border-travel-coral/30 text-travel-coral hover:bg-travel-coral/10">
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </div>

          {tripsLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-travel-coral mx-auto mb-2" />
                <p className="text-muted-foreground">Loading your adventures...</p>
              </div>
            </div>
          ) : trips.length === 0 ? (
            <Card className="text-center py-16 bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-travel-coral/10 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-travel-coral" />
                </div>
                <h3 className="text-xl font-bold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Every journey begins with a single step. Start planning your first adventure today!
                </p>
                <Button onClick={() => navigate('/plan')} className="bg-travel-coral hover:bg-travel-coral/90">
                  <Plane className="h-4 w-4 mr-2" />
                  Plan Your First Trip
                </Button>
                
                <div className="mt-8">
                  <TravelQuote variant="minimal" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <BoardingPassCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        {/* Motivational Quote */}
        {trips.length > 0 && (
          <section className="mt-12">
            <TravelQuote variant="featured" />
          </section>
        )}
      </main>
    </div>
  );
}
