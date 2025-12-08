export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  budget_level: BudgetLevel;
  start_date: string;
  end_date: string;
  num_travelers: number;
  accommodation_type: AccommodationType;
  travel_mode: TravelMode;
  activities: string[];
  status: TripStatus;
  share_token: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  activities: ItineraryActivity[];
  created_at: string;
}

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: string;
  duration?: string;
  tips?: string;
}

export type BudgetLevel = 'budget' | 'moderate' | 'luxury';
export type AccommodationType = 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'camping';
export type TravelMode = 'flight' | 'train' | 'car' | 'bus';
export type TripStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

export interface TripFormData {
  destination: string;
  budget_level: BudgetLevel;
  start_date: Date | undefined;
  end_date: Date | undefined;
  num_travelers: number;
  accommodation_type: AccommodationType;
  travel_mode: TravelMode;
  activities: string[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  mobile: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  dark_mode: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const BUDGET_LEVELS: { value: BudgetLevel; label: string; description: string }[] = [
  { value: 'budget', label: 'Budget', description: 'Hostels, street food, public transport' },
  { value: 'moderate', label: 'Moderate', description: 'Mid-range hotels, local restaurants' },
  { value: 'luxury', label: 'Luxury', description: 'Premium hotels, fine dining, private tours' },
];

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string; icon: string }[] = [
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'hostel', label: 'Hostel', icon: '🛏️' },
  { value: 'airbnb', label: 'Airbnb', icon: '🏠' },
  { value: 'resort', label: 'Resort', icon: '🏝️' },
  { value: 'camping', label: 'Camping', icon: '⛺' },
];

export const TRAVEL_MODES: { value: TravelMode; label: string; icon: string }[] = [
  { value: 'flight', label: 'Flight', icon: '✈️' },
  { value: 'train', label: 'Train', icon: '🚂' },
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
];

export const ACTIVITY_OPTIONS = [
  'Sightseeing',
  'Beach',
  'Adventure',
  'Culture & Museums',
  'Food & Dining',
  'Shopping',
  'Nightlife',
  'Nature & Hiking',
  'Photography',
  'Relaxation & Spa',
  'Water Sports',
  'Local Experiences',
];