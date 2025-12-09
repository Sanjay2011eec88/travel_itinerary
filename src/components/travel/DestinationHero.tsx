import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

const DESTINATION_IMAGES: Record<string, string> = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
  newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=80',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
};

interface DestinationHeroProps {
  destination: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  className?: string;
  overlay?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'full';
}

export const DestinationHero = ({
  destination,
  startDate,
  endDate,
  travelers,
  className = '',
  overlay = true,
  height = 'md',
}: DestinationHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = (dest: string) => {
    const key = dest.toLowerCase().replace(/\s+/g, '');
    return DESTINATION_IMAGES[key] || DESTINATION_IMAGES.default;
  };

  const heightClasses = {
    sm: 'h-48',
    md: 'h-64 md:h-80',
    lg: 'h-96 md:h-[500px]',
    full: 'h-screen',
  };

  useEffect(() => {
    const img = new Image();
    img.src = getImageUrl(destination);
    img.onload = () => setImageLoaded(true);
  }, [destination]);

  return (
    <div className={`relative overflow-hidden ${heightClasses[height]} ${className}`}>
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${getImageUrl(destination)})` }}
      />
      
      {/* Shimmer Loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
      )}

      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="flex items-end gap-2 mb-2">
          <MapPin className="w-6 h-6 text-travel-coral" />
          <h1 className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-lg">
            {destination}
          </h1>
        </div>
        
        {(startDate || travelers) && (
          <div className="flex flex-wrap gap-4 mt-3">
            {startDate && endDate && (
              <div className="flex items-center gap-2 text-foreground/90 bg-background/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
            {travelers && (
              <div className="flex items-center gap-2 text-foreground/90 bg-background/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{travelers} Traveler{travelers > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-foreground/20 rounded-full animate-float" />
      <div className="absolute top-12 right-12 w-8 h-8 bg-travel-coral/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
    </div>
  );
};
