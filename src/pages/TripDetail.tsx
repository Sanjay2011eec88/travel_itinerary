import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips, useItineraries } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  ArrowLeft, Share2, Check, Trash2, Loader2, Plane
} from 'lucide-react';
import { DestinationHero } from '@/components/travel/DestinationHero';
import { TimelineItinerary } from '@/components/travel/TimelineItinerary';
import { BudgetReceipt } from '@/components/travel/BudgetReceipt';
import { TravelCompanions } from '@/components/travel/TravelCompanions';
import { TravelQuote } from '@/components/travel/TravelQuote';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, deleteTrip, togglePublic } = useTrips();
  const { itineraries, loading: itinerariesLoading } = useItineraries(id);
  
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  
  const trip = trips.find(t => t.id === id);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-travel-coral to-travel-teal animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
              <Plane className="h-8 w-8 text-travel-coral" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareToken = await togglePublic(trip.id, true);
    if (shareToken) {
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: '🔗 Link copied!', description: 'Share your adventure with friends and family' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const success = await deleteTrip(trip.id);
    if (success) {
      navigate('/dashboard');
    }
    setDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'completed': return 'bg-travel-teal/20 text-travel-teal border-travel-teal/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-travel-sand/20 text-travel-sand border-travel-sand/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={handleShare}
              className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
            >
              {copied ? <Check className="h-4 w-4 text-travel-teal" /> : <Share2 className="h-4 w-4" />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your trip to {trip.destination} and all itinerary data will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleting}
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Trip'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <DestinationHero 
        destination={trip.destination}
        startDate={trip.start_date}
        endDate={trip.end_date}
        travelers={trip.num_travelers}
        height="lg"
      />

      {/* Content */}
      <main className="container px-4 py-6 -mt-6 relative z-10">
        {/* Trip Status Card */}
        <Card className="mb-6 shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(trip.status)} border`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  💰 <span className="capitalize">{trip.budget_level}</span>
                </span>
                <span className="flex items-center gap-1">
                  🏨 <span className="capitalize">{trip.accommodation_type}</span>
                </span>
                <span className="flex items-center gap-1">
                  {trip.travel_mode === 'flight' ? '✈️' : trip.travel_mode === 'train' ? '🚂' : trip.travel_mode === 'car' ? '🚗' : '🚌'}
                  <span className="capitalize">{trip.travel_mode}</span>
                </span>
              </div>
            </div>

            {trip.activities && trip.activities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {trip.activities.map((activity) => (
                    <Badge key={activity} variant="secondary" className="bg-travel-coral/10 text-travel-coral border-travel-coral/20">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="itinerary" className="py-3">
              📅 Itinerary
            </TabsTrigger>
            <TabsTrigger value="budget" className="py-3">
              💰 Budget
            </TabsTrigger>
            <TabsTrigger value="companions" className="py-3">
              👥 Travelers
            </TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {itinerariesLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-travel-coral mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading your itinerary...</p>
                </div>
              </div>
            ) : itineraries.length === 0 ? (
              <Card className="text-center py-12 border-dashed border-2">
                <CardContent>
                  <p className="text-muted-foreground">No itinerary generated yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {itineraries.map((itinerary, index) => (
                  <TimelineItinerary 
                    key={itinerary.id} 
                    itinerary={itinerary}
                    isActive={index === 0}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget">
            <BudgetReceipt trip={trip} itineraries={itineraries} />
          </TabsContent>

          {/* Companions Tab */}
          <TabsContent value="companions" className="space-y-6">
            <TravelCompanions count={trip.num_travelers} variant="full" />
            <TravelQuote variant="default" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
