import { Clock, MapPin, Lightbulb, ExternalLink, Ticket, Hotel, Utensils, Camera, ShoppingBag, PartyPopper } from 'lucide-react';
import { Itinerary, ItineraryActivity } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimelineItineraryProps {
  itinerary: Itinerary;
  isActive?: boolean;
}

const getActivityIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('hotel') || lowerTitle.includes('check-in') || lowerTitle.includes('accommodation')) return Hotel;
  if (lowerTitle.includes('breakfast') || lowerTitle.includes('lunch') || lowerTitle.includes('dinner') || lowerTitle.includes('food') || lowerTitle.includes('restaurant')) return Utensils;
  if (lowerTitle.includes('tour') || lowerTitle.includes('visit') || lowerTitle.includes('explore') || lowerTitle.includes('museum')) return Camera;
  if (lowerTitle.includes('shopping') || lowerTitle.includes('market')) return ShoppingBag;
  if (lowerTitle.includes('show') || lowerTitle.includes('entertainment') || lowerTitle.includes('nightlife')) return PartyPopper;
  return Ticket;
};

const getBookingUrl = (activity: ItineraryActivity, destination: string) => {
  const lowerTitle = activity.title.toLowerCase();
  const location = encodeURIComponent(activity.location || destination);
  
  if (lowerTitle.includes('hotel') || lowerTitle.includes('accommodation')) {
    return `https://www.booking.com/searchresults.html?ss=${location}`;
  }
  if (lowerTitle.includes('flight')) {
    return `https://www.skyscanner.com/transport/flights/anywhere/${location}`;
  }
  if (lowerTitle.includes('restaurant') || lowerTitle.includes('dinner') || lowerTitle.includes('lunch')) {
    return `https://www.google.com/maps/search/restaurants+${location}`;
  }
  if (lowerTitle.includes('tour') || lowerTitle.includes('activity') || lowerTitle.includes('visit')) {
    return `https://www.getyourguide.com/s/?q=${location}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(activity.title)}+${location}+booking`;
};

export const TimelineItinerary = ({ itinerary, isActive = false }: TimelineItineraryProps) => {
  return (
    <div className={`relative ${isActive ? '' : 'opacity-75'}`}>
      {/* Day Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-travel-coral to-travel-coral/60 flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">D{itinerary.day_number}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{itinerary.title || `Day ${itinerary.day_number}`}</h3>
          <p className="text-muted-foreground text-sm">{itinerary.activities.length} activities planned</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="ml-7 border-l-2 border-travel-teal/30 pl-8 space-y-6">
        {itinerary.activities.map((activity, index) => {
          const ActivityIcon = getActivityIcon(activity.title);
          const bookingUrl = getBookingUrl(activity, itinerary.title || '');
          
          return (
            <div key={index} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-travel-teal border-4 border-background shadow-sm group-hover:scale-125 transition-transform" />
              
              {/* Activity Card */}
              <div className="bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-travel-coral/30 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Time & Duration */}
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-travel-coral/10 text-travel-coral border-travel-coral/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </Badge>
                      {activity.duration && (
                        <span className="text-xs text-muted-foreground">⏱️ {activity.duration}</span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-2 mb-2">
                      <ActivityIcon className="w-5 h-5 text-travel-teal" />
                      <h4 className="font-semibold text-foreground">{activity.title}</h4>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>

                    {/* Location & Cost */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {activity.location && (
                        <span className="flex items-center gap-1 text-travel-sky">
                          <MapPin className="w-4 h-4" />
                          {activity.location}
                        </span>
                      )}
                      {activity.cost && (
                        <span className="flex items-center gap-1 text-green-500 font-medium">
                          💰 {activity.cost}
                        </span>
                      )}
                    </div>

                    {/* Tips */}
                    {activity.tips && (
                      <div className="mt-3 p-3 bg-travel-sand/10 rounded-lg border border-travel-sand/20">
                        <p className="text-xs text-muted-foreground flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-travel-sand flex-shrink-0 mt-0.5" />
                          <span>{activity.tips}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Booking Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-travel-coral/10 border-travel-coral/30 text-travel-coral hover:bg-travel-coral hover:text-white transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(bookingUrl, '_blank');
                      }}
                    >
                      <span className="hidden sm:inline mr-1">Book Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End of Day Marker */}
      <div className="ml-7 pl-8 mt-6 flex items-center gap-2 text-muted-foreground">
        <div className="absolute left-[23px] w-4 h-4 rounded-full bg-travel-teal/30 border-2 border-background" />
        <span className="text-sm italic">✨ End of Day {itinerary.day_number}</span>
      </div>
    </div>
  );
};
