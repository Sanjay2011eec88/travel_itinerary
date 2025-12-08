import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips, useItineraries } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Trip } from '@/types/trip';
import { format } from 'date-fns';
import { 
  ArrowLeft, Calendar, Users, MapPin, Plane, Hotel, 
  DollarSign, Share2, Copy, Check, Trash2, Loader2,
  Clock, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, deleteTrip, togglePublic } = useTrips();
  const { itineraries, loading: itinerariesLoading } = useItineraries(id);
  
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
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
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading trip...</p>
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
      toast({ title: 'Link copied!', description: 'Share it with friends and family' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const success = await deleteTrip(trip.id);
    if (success) {
      navigate('/');
    }
    setDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-travel-teal text-primary-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const tripDays = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex items-center h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="ml-4 flex-1">
            <h1 className="font-semibold truncate">{trip.destination}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4 text-travel-teal" /> : <Share2 className="h-4 w-4" />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your trip and itinerary will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground"
                    disabled={deleting}
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Trip Overview */}
        <Card className="mb-6 shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {trip.destination}
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                  <span className="text-muted-foreground">({tripDays} days)</span>
                </CardDescription>
              </div>
              <Badge className={getStatusColor(trip.status)}>
                {trip.status}
              </Badge>
            </div>
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
        <h2 className="text-xl font-bold mb-4">Itinerary</h2>
        
        {itinerariesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : itineraries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No itinerary generated yet</p>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </main>
    </div>
  );
}