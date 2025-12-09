import { Users, UserPlus, Crown, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface TravelCompanionsProps {
  count: number;
  variant?: 'compact' | 'full';
  className?: string;
}

const COMPANION_AVATARS = [
  { name: 'You', initials: 'ME', color: 'bg-travel-coral' },
  { name: 'Travel Buddy', initials: 'TB', color: 'bg-travel-teal' },
  { name: 'Friend', initials: 'FR', color: 'bg-travel-sky' },
  { name: 'Family', initials: 'FM', color: 'bg-travel-sand' },
  { name: 'Partner', initials: 'PT', color: 'bg-purple-500' },
];

export const TravelCompanions = ({ count, variant = 'compact', className = '' }: TravelCompanionsProps) => {
  const companions = COMPANION_AVATARS.slice(0, Math.min(count, 5));
  const extraCount = count > 5 ? count - 5 : 0;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-3">
          {companions.map((companion, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-background">
              <AvatarFallback className={`${companion.color} text-white text-xs font-bold`}>
                {companion.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          {extraCount > 0 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">+{extraCount}</span>
            </div>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{count} traveler{count > 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-travel-coral" />
          <h4 className="font-semibold text-foreground">Travel Companions</h4>
        </div>
        <span className="text-sm text-muted-foreground">{count} people</span>
      </div>

      <div className="space-y-3">
        {companions.map((companion, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={`${companion.color} text-white font-bold`}>
                {companion.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground flex items-center gap-2">
                {companion.name}
                {index === 0 && <Crown className="w-4 h-4 text-travel-coral" />}
              </p>
              <p className="text-xs text-muted-foreground">
                {index === 0 ? 'Trip Organizer' : 'Co-Traveler'}
              </p>
            </div>
            {index !== 0 && (
              <Heart className="w-4 h-4 text-pink-400" />
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 border-dashed border-travel-coral/30 text-travel-coral hover:bg-travel-coral/10">
        <UserPlus className="w-4 h-4 mr-2" />
        Add Travel Companion
      </Button>
    </div>
  );
};
