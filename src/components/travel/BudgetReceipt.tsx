import { Receipt, Plane, Hotel, Utensils, Ticket, ShoppingBag, Coins, TrendingUp } from 'lucide-react';
import { Trip, Itinerary } from '@/types/trip';
import { Progress } from '@/components/ui/progress';

interface BudgetReceiptProps {
  trip: Trip;
  itineraries: Itinerary[];
}

const BUDGET_ESTIMATES = {
  budget: { daily: 50, accommodation: 30, food: 15, activities: 20, transport: 10 },
  moderate: { daily: 150, accommodation: 80, food: 40, activities: 50, transport: 30 },
  luxury: { daily: 400, accommodation: 200, food: 100, activities: 150, transport: 80 },
};

export const BudgetReceipt = ({ trip, itineraries }: BudgetReceiptProps) => {
  const totalDays = Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const budget = BUDGET_ESTIMATES[trip.budget_level as keyof typeof BUDGET_ESTIMATES] || BUDGET_ESTIMATES.moderate;
  
  const categories = [
    { icon: Hotel, label: 'Accommodation', amount: budget.accommodation * totalDays, emoji: '🏨' },
    { icon: Plane, label: 'Transportation', amount: budget.transport * totalDays, emoji: '✈️' },
    { icon: Utensils, label: 'Food & Dining', amount: budget.food * totalDays, emoji: '🍽️' },
    { icon: Ticket, label: 'Activities & Tours', amount: budget.activities * totalDays, emoji: '🎫' },
    { icon: ShoppingBag, label: 'Shopping & Misc', amount: Math.round(budget.daily * totalDays * 0.15), emoji: '🛍️' },
  ];

  const totalEstimate = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const perPerson = Math.round(totalEstimate / trip.num_travelers);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Receipt Header */}
      <div className="bg-gradient-to-r from-travel-sand/20 to-travel-coral/10 px-6 py-4 border-b border-dashed border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-travel-coral/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-travel-coral" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Trip Budget Estimate</h3>
              <p className="text-xs text-muted-foreground">✨ {trip.budget_level.charAt(0).toUpperCase() + trip.budget_level.slice(1)} Travel Style</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{totalDays} Days</p>
            <p className="text-xs text-muted-foreground">{trip.num_travelers} Traveler{trip.num_travelers > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Receipt Items */}
      <div className="px-6 py-4 space-y-3 font-mono text-sm">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="flex items-center justify-between py-2 border-b border-dotted border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.emoji}</span>
                <span className="text-foreground">{category.label}</span>
              </div>
              <span className="text-foreground font-semibold">${category.amount.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-6 border-t-2 border-dashed border-border" />

      {/* Total */}
      <div className="px-6 py-4 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-foreground flex items-center gap-2">
            <Coins className="w-5 h-5 text-travel-coral" />
            ESTIMATED TOTAL
          </span>
          <span className="text-2xl font-bold text-travel-coral">${totalEstimate.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Per person (÷{trip.num_travelers})</span>
          <span className="font-semibold text-foreground">${perPerson.toLocaleString()}</span>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Daily Budget: ${budget.daily}/day
          </span>
          <span className="text-travel-teal font-medium">
            {trip.budget_level.charAt(0).toUpperCase() + trip.budget_level.slice(1)} Tier
          </span>
        </div>
        <Progress value={trip.budget_level === 'budget' ? 33 : trip.budget_level === 'moderate' ? 66 : 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>💰 Budget</span>
          <span>💎 Moderate</span>
          <span>👑 Luxury</span>
        </div>
      </div>

      {/* Receipt Footer */}
      <div className="px-6 py-3 bg-travel-coral/5 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          💡 Tip: This is an estimate based on your travel style. Actual costs may vary.
        </p>
      </div>
    </div>
  );
};
