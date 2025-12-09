import { Plane, Users, Calendar, MapPin, Barcode } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types/trip';
import { useNavigate } from 'react-router-dom';

interface BoardingPassCardProps {
  trip: Trip;
}

export const BoardingPassCard = ({ trip }: BoardingPassCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-travel-teal/20 text-travel-teal border-travel-teal/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-travel-sand/20 text-travel-sand border-travel-sand/30';
    }
  };

  const flightNumber = `TW${trip.id.slice(0, 4).toUpperCase()}`;

  return (
    <div 
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="group relative cursor-pointer"
    >
      {/* Perforated Edge Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-between py-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-background border-2 border-border" />
        ))}
      </div>

      <div className="ml-4 bg-card border border-border rounded-r-2xl rounded-l-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-travel-coral/50 group-hover:-translate-y-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-travel-coral to-travel-coral/80 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-white" />
            <span className="text-white font-bold tracking-wider">TRIPWEAVER</span>
          </div>
          <span className="text-white/80 text-sm font-mono">{flightNumber}</span>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            {/* Departure */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">From</p>
              <p className="text-lg font-bold text-foreground">Your City</p>
              <p className="text-xs text-muted-foreground">HOME</p>
            </div>

            {/* Flight Path */}
            <div className="flex-1 mx-4 flex items-center justify-center">
              <div className="flex-1 h-px bg-border" />
              <Plane className="w-6 h-6 text-travel-coral mx-2 rotate-90" />
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Destination */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">To</p>
              <p className="text-lg font-bold text-foreground">{trip.destination}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <MapPin className="w-3 h-3" /> {trip.destination.slice(0, 3).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-dashed border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Departure</p>
              <p className="font-semibold text-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-travel-teal" />
                {format(new Date(trip.start_date), 'MMM d')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Return</p>
              <p className="font-semibold text-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-travel-teal" />
                {format(new Date(trip.end_date), 'MMM d')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Passengers</p>
              <p className="font-semibold text-foreground flex items-center gap-1">
                <Users className="w-3 h-3 text-travel-coral" />
                {trip.num_travelers}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Class</p>
              <p className="font-semibold text-foreground capitalize">{trip.budget_level}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed border-border">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(trip.status)}`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Barcode className="w-6 h-6" />
              <span className="text-xs font-mono">{trip.id.slice(0, 12)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
