import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Trip, Itinerary, TripFormData } from '@/types/trip';
import { toast } from '@/hooks/use-toast';

const TRIPS_CACHE_KEY = 'tripweaver_trips_cache';
const ITINERARIES_CACHE_KEY = 'tripweaver_itineraries_cache';

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: 'Back online', description: 'Your data is syncing...' });
      fetchTrips();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: 'Offline mode', description: 'Using cached data' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load trips from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(TRIPS_CACHE_KEY);
    if (cached) {
      try {
        setTrips(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached trips:', e);
      }
    }
  }, []);

  // Fetch trips when user changes
  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTrips = async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedTrips = (data || []) as Trip[];
      setTrips(typedTrips);
      localStorage.setItem(TRIPS_CACHE_KEY, JSON.stringify(typedTrips));
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({ title: 'Error', description: 'Failed to fetch trips', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (formData: TripFormData): Promise<Trip | null> => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in', variant: 'destructive' });
      return null;
    }

    try {
      const tripData = {
        user_id: user.id,
        destination: formData.destination,
        budget_level: formData.budget_level,
        start_date: formData.start_date?.toISOString().split('T')[0],
        end_date: formData.end_date?.toISOString().split('T')[0],
        num_travelers: formData.num_travelers,
        accommodation_type: formData.accommodation_type,
        travel_mode: formData.travel_mode,
        activities: formData.activities,
        status: 'draft',
      };

      const { data, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single();

      if (error) throw error;

      const newTrip = data as Trip;
      setTrips(prev => [newTrip, ...prev]);
      localStorage.setItem(TRIPS_CACHE_KEY, JSON.stringify([newTrip, ...trips]));
      
      return newTrip;
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({ title: 'Error', description: 'Failed to create trip', variant: 'destructive' });
      return null;
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      toast({ title: 'Error', description: 'Failed to update trip', variant: 'destructive' });
      return false;
    }
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrips(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Success', description: 'Trip deleted' });
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({ title: 'Error', description: 'Failed to delete trip', variant: 'destructive' });
      return false;
    }
  };

  const togglePublic = async (id: string, isPublic: boolean): Promise<string | null> => {
    const trip = trips.find(t => t.id === id);
    if (!trip) return null;

    const success = await updateTrip(id, { is_public: isPublic });
    if (success) {
      toast({ 
        title: isPublic ? 'Trip shared!' : 'Trip made private',
        description: isPublic ? 'Anyone with the link can view this trip' : 'Only you can see this trip',
      });
      return trip.share_token;
    }
    return null;
  };

  return {
    trips,
    loading,
    isOnline,
    createTrip,
    updateTrip,
    deleteTrip,
    togglePublic,
    refetch: fetchTrips,
  };
}

export function useItineraries(tripId: string | undefined) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setItineraries([]);
      setLoading(false);
      return;
    }

    // Load from cache first
    const cached = localStorage.getItem(`${ITINERARIES_CACHE_KEY}_${tripId}`);
    if (cached) {
      try {
        setItineraries(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached itineraries:', e);
      }
    }

    fetchItineraries();
  }, [tripId]);

  const fetchItineraries = async () => {
    if (!tripId) return;

    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number', { ascending: true });

      if (error) throw error;

      const typedItineraries = (data || []).map(item => ({
        ...item,
        activities: item.activities as unknown as Itinerary['activities'],
      })) as Itinerary[];
      
      setItineraries(typedItineraries);
      localStorage.setItem(`${ITINERARIES_CACHE_KEY}_${tripId}`, JSON.stringify(typedItineraries));
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveItineraries = async (tripId: string, itineraryData: Omit<Itinerary, 'id' | 'trip_id' | 'created_at'>[]) => {
    try {
      // First delete existing itineraries for this trip
      await supabase
        .from('itineraries')
        .delete()
        .eq('trip_id', tripId);

      // Insert new itineraries - cast activities to Json type
      const insertData = itineraryData.map(item => ({
        trip_id: tripId,
        day_number: item.day_number,
        title: item.title,
        activities: JSON.parse(JSON.stringify(item.activities)),
      }));

      const { data, error } = await supabase
        .from('itineraries')
        .insert(insertData)
        .select();

      if (error) throw error;

      const typedItineraries = (data || []).map(item => ({
        ...item,
        activities: item.activities as unknown as Itinerary['activities'],
      })) as Itinerary[];
      
      setItineraries(typedItineraries);
      localStorage.setItem(`${ITINERARIES_CACHE_KEY}_${tripId}`, JSON.stringify(typedItineraries));
      
      return typedItineraries;
    } catch (error) {
      console.error('Error saving itineraries:', error);
      toast({ title: 'Error', description: 'Failed to save itinerary', variant: 'destructive' });
      return null;
    }
  };

  return {
    itineraries,
    loading,
    saveItineraries,
    refetch: fetchItineraries,
  };
}

export function useSharedTrip(shareToken: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareToken) {
      setLoading(false);
      return;
    }

    fetchSharedTrip();
  }, [shareToken]);

  const fetchSharedTrip = async () => {
    if (!shareToken) return;

    try {
      // Fetch the public trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('share_token', shareToken)
        .eq('is_public', true)
        .maybeSingle();

      if (tripError) throw tripError;

      if (!tripData) {
        setError('Trip not found or is private');
        setLoading(false);
        return;
      }

      setTrip(tripData as Trip);

      // Fetch itineraries
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('trip_id', tripData.id)
        .order('day_number', { ascending: true });

      if (itineraryError) throw itineraryError;

      const typedItineraries = (itineraryData || []).map(item => ({
        ...item,
        activities: item.activities as unknown as Itinerary['activities'],
      })) as Itinerary[];
      
      setItineraries(typedItineraries);
    } catch (err) {
      console.error('Error fetching shared trip:', err);
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  return { trip, itineraries, loading, error };
}