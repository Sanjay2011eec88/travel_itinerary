import { Ticket, Clock, MapPin, Star } from 'lucide-react';
import { ItineraryActivity } from '@/types/trip';

interface TicketStubProps {
  activity: ItineraryActivity;
  dayNumber: number;
}

export const TicketStub = ({ activity, dayNumber }: TicketStubProps) => {
  return (
    <div className="relative group">
      {/* Ticket Container */}
      <div className="flex overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Left Section - Main Content */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-travel-coral" />
            <span className="text-xs text-muted-foreground font-medium">DAY {dayNumber}</span>
          </div>
          
          <h4 className="font-bold text-foreground mb-2">{activity.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{activity.description}</p>
          
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1 text-travel-teal">
              <Clock className="w-3 h-3" /> {activity.time}
            </span>
            {activity.location && (
              <span className="flex items-center gap-1 text-travel-coral">
                <MapPin className="w-3 h-3" /> {activity.location}
              </span>
            )}
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="w-px bg-border relative">
          <div className="absolute inset-0 flex flex-col justify-around">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-background -ml-1.5 border border-border" />
            ))}
          </div>
        </div>

        {/* Right Section - Stub */}
        <div className="w-24 p-4 bg-gradient-to-br from-travel-coral/10 to-travel-coral/5 flex flex-col items-center justify-center text-center">
          {activity.cost ? (
            <>
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="text-lg font-bold text-travel-coral">{activity.cost}</span>
            </>
          ) : (
            <>
              <Star className="w-6 h-6 text-travel-coral mb-1" />
              <span className="text-xs text-muted-foreground">Included</span>
            </>
          )}
          {activity.duration && (
            <span className="text-xs text-muted-foreground mt-2">⏱️ {activity.duration}</span>
          )}
        </div>
      </div>
    </div>
  );
};
