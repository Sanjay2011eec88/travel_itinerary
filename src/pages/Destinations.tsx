import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Plane, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Destination {
  name: string;
  country: string;
  description: string;
  image: string;
  emoji: string;
  highlights: string[];
  bestTime: string;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  daysRecommended: string;
  popular: boolean;
}

const DESTINATIONS: Destination[] = [
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light beckons with iconic landmarks, world-class museums, and romantic ambiance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    emoji: '🗼',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre'],
    bestTime: 'Apr-Jun, Sep-Oct',
    budgetLevel: 'moderate',
    daysRecommended: '4-7 days',
    popular: true,
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A mesmerizing blend of ancient tradition and cutting-edge technology in the heart of Japan.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    emoji: '🗾',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mt. Fuji', 'Tsukiji Market'],
    bestTime: 'Mar-May, Sep-Nov',
    budgetLevel: 'moderate',
    daysRecommended: '5-10 days',
    popular: true,
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    emoji: '🏝️',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    bestTime: 'Apr-Oct',
    budgetLevel: 'budget',
    daysRecommended: '5-7 days',
    popular: true,
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps offers world-famous landmarks, Broadway shows, and diverse culture.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    emoji: '🗽',
    highlights: ['Statue of Liberty', 'Times Square', 'Central Park', 'Brooklyn Bridge'],
    bestTime: 'Apr-Jun, Sep-Nov',
    budgetLevel: 'luxury',
    daysRecommended: '4-6 days',
    popular: true,
  },
  {
    name: 'Rome',
    country: 'Italy',
    description: 'The Eternal City where ancient history meets la dolce vita and incredible cuisine.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    emoji: '🏛️',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    bestTime: 'Apr-Jun, Sep-Oct',
    budgetLevel: 'moderate',
    daysRecommended: '3-5 days',
    popular: false,
  },
  {
    name: 'Dubai',
    country: 'UAE',
    description: 'Ultra-modern city with luxury shopping, futuristic architecture, and desert adventures.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    emoji: '🏙️',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'],
    bestTime: 'Nov-Mar',
    budgetLevel: 'luxury',
    daysRecommended: '3-5 days',
    popular: true,
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    description: 'Vibrant coastal city famous for Gaudí architecture, beaches, and Mediterranean cuisine.',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    emoji: '🏖️',
    highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
    bestTime: 'May-Jun, Sep-Oct',
    budgetLevel: 'moderate',
    daysRecommended: '3-5 days',
    popular: false,
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Stunning island paradise with white-washed buildings, blue domes, and breathtaking sunsets.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    emoji: '🇬🇷',
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Akrotiri', 'Wine Tasting'],
    bestTime: 'Apr-Nov',
    budgetLevel: 'luxury',
    daysRecommended: '3-5 days',
    popular: true,
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    description: 'Bustling capital with ornate temples, vibrant street life, and amazing street food.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    emoji: '🛕',
    highlights: ['Grand Palace', 'Wat Pho', 'Floating Markets', 'Khao San Road'],
    bestTime: 'Nov-Feb',
    budgetLevel: 'budget',
    daysRecommended: '3-5 days',
    popular: false,
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    description: 'Tropical paradise of overwater bungalows, crystal-clear waters, and pristine beaches.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    emoji: '🌴',
    highlights: ['Overwater Villas', 'Diving', 'Private Islands', 'Spa Resorts'],
    bestTime: 'Nov-Apr',
    budgetLevel: 'luxury',
    daysRecommended: '5-7 days',
    popular: true,
  },
  {
    name: 'London',
    country: 'United Kingdom',
    description: 'Historic capital blending royal heritage, world-class museums, and modern culture.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    emoji: '🏰',
    highlights: ['Big Ben', 'Buckingham Palace', 'British Museum', 'Tower Bridge'],
    bestTime: 'May-Sep',
    budgetLevel: 'moderate',
    daysRecommended: '4-6 days',
    popular: false,
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    description: 'Land of fire and ice with stunning waterfalls, geysers, and the Northern Lights.',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    emoji: '🌋',
    highlights: ['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Jökulsárlón'],
    bestTime: 'Jun-Aug (summer), Sep-Mar (Northern Lights)',
    budgetLevel: 'luxury',
    daysRecommended: '5-7 days',
    popular: true,
  },
];

export default function Destinations() {
  const navigate = useNavigate();

  const getBudgetColor = (level: string) => {
    switch (level) {
      case 'budget': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'moderate': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'luxury': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const handleSelectDestination = (destination: Destination) => {
    navigate('/plan', { state: { preSelectedDestination: `${destination.name}, ${destination.country}` } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="hover:bg-travel-coral/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-travel-coral to-travel-coral/80 flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">TripWeaver</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-travel-coral via-travel-coral/90 to-travel-teal py-12 md:py-16 text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Amazing Destinations ✨
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Discover your next adventure from our handpicked collection of the world's most incredible places
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{DESTINATIONS.length} Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>AI-Powered Planning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <main className="container px-4 py-8">
        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">🔥 Popular Destinations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.filter(d => d.popular).map((destination) => (
              <Card key={`${destination.name}-${destination.country}`} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleSelectDestination(destination)}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 text-4xl">{destination.emoji}</div>
                  <Badge className="absolute top-3 left-3 bg-travel-coral text-white border-0">
                    Popular
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{destination.name}</span>
                    <MapPin className="h-5 w-5 text-travel-coral" />
                  </CardTitle>
                  <CardDescription>{destination.country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Best time:</span>
                      <span className="font-medium">{destination.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className={getBudgetColor(destination.budgetLevel)}>
                        {destination.budgetLevel}
                      </Badge>
                      <span className="text-muted-foreground ml-auto">{destination.daysRecommended}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-travel-coral hover:bg-travel-coral/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDestination(destination);
                    }}
                  >
                    Plan Trip to {destination.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Destinations */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">🌍 All Destinations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.filter(d => !d.popular).map((destination) => (
              <Card key={`${destination.name}-${destination.country}`} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleSelectDestination(destination)}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 text-4xl">{destination.emoji}</div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{destination.name}</span>
                    <MapPin className="h-5 w-5 text-travel-coral" />
                  </CardTitle>
                  <CardDescription>{destination.country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Best time:</span>
                      <span className="font-medium">{destination.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className={getBudgetColor(destination.budgetLevel)}>
                        {destination.budgetLevel}
                      </Badge>
                      <span className="text-muted-foreground ml-auto">{destination.daysRecommended}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-travel-coral hover:bg-travel-coral/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDestination(destination);
                    }}
                  >
                    Plan Trip to {destination.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
