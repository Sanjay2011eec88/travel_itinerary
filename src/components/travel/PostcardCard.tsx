import { MapPin, Stamp, Heart, Share2 } from 'lucide-react';
import { Trip } from '@/types/trip';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface PostcardCardProps {
  trip: Trip;
  onShare?: () => void;
}

const DESTINATION_IMAGES: Record<string, string> = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
};

export const PostcardCard = ({ trip, onShare }: PostcardCardProps) => {
  const getImageUrl = (dest: string) => {
    const key = dest.toLowerCase().replace(/\s+/g, '');
    return DESTINATION_IMAGES[key] || DESTINATION_IMAGES.default;
  };

  return (
    <div className="group relative bg-amber-50 dark:bg-amber-950/30 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-rotate-1 hover:scale-105">
      {/* Stamp Effect */}
      <div className="absolute top-3 right-3 z-10">
        <div className="w-16 h-16 rounded border-4 border-dashed border-travel-coral/50 flex items-center justify-center bg-white/80 dark:bg-background/80 rotate-12">
          <div className="text-center">
            <Stamp className="w-6 h-6 text-travel-coral mx-auto" />
            <span className="text-[8px] font-bold text-travel-coral">TRIP</span>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={getImageUrl(trip.destination)}
          alt={trip.destination}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Postcard Content */}
      <div className="p-5 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        {/* Postcard Lines */}
        <div className="space-y-3 border-b border-travel-sand/30 pb-4 mb-4">
          <div className="h-px bg-travel-sand/20" />
          <div className="h-px bg-travel-sand/20" />
          <div className="h-px bg-travel-sand/20" />
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-travel-coral" />
          <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'cursive' }}>
            Greetings from {trip.destination}!
          </h3>
        </div>

        {/* Date */}
        <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: 'cursive' }}>
          {format(new Date(trip.start_date), 'MMMM d')} - {format(new Date(trip.end_date), 'MMMM d, yyyy')}
        </p>

        {/* Message */}
        <p className="text-sm text-foreground/80 italic mb-4" style={{ fontFamily: 'cursive' }}>
          "Having an amazing time exploring {trip.destination}! The {trip.activities[0]?.toLowerCase() || 'adventure'} is incredible. 
          Wish you were here! ❤️"
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-travel-sand/30">
          <div className="flex items-center gap-2 text-travel-coral">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Memories</span>
          </div>
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="text-travel-teal hover:text-travel-teal hover:bg-travel-teal/10"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
