import { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const TRAVEL_QUOTES = [
  { quote: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { quote: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  { quote: "Adventure is worthwhile in itself.", author: "Amelia Earhart" },
  { quote: "Life is short and the world is wide.", author: "Simon Raven" },
  { quote: "Take only memories, leave only footprints.", author: "Chief Seattle" },
  { quote: "Travel far enough, you meet yourself.", author: "David Mitchell" },
  { quote: "Jobs fill your pocket, adventures fill your soul.", author: "Jaime Lyn Beatty" },
  { quote: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { quote: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { quote: "Once a year, go someplace you've never been before.", author: "Dalai Lama" },
];

interface TravelQuoteProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'featured';
}

export const TravelQuote = ({ className = '', variant = 'default' }: TravelQuoteProps) => {
  const [currentQuote, setCurrentQuote] = useState(TRAVEL_QUOTES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TRAVEL_QUOTES.length);
    setCurrentQuote(TRAVEL_QUOTES[randomIndex]);

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * TRAVEL_QUOTES.length);
        setCurrentQuote(TRAVEL_QUOTES[newIndex]);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'minimal') {
    return (
      <p className={`text-muted-foreground italic text-sm ${className}`}>
        "{currentQuote.quote}"
      </p>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`relative p-8 md:p-12 bg-gradient-to-br from-travel-coral/10 via-travel-teal/10 to-travel-sky/10 rounded-2xl border border-border/50 ${className}`}>
        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-travel-coral animate-pulse" />
        <Quote className="w-10 h-10 text-travel-coral/50 mb-4" />
        <p className={`text-xl md:text-2xl font-medium text-foreground leading-relaxed transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          "{currentQuote.quote}"
        </p>
        <p className={`mt-4 text-travel-teal font-semibold transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          — {currentQuote.author}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 p-4 bg-muted/50 rounded-xl ${className}`}>
      <Quote className="w-5 h-5 text-travel-coral flex-shrink-0 mt-1" />
      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-foreground/90 italic">"{currentQuote.quote}"</p>
        <p className="text-sm text-muted-foreground mt-1">— {currentQuote.author}</p>
      </div>
    </div>
  );
};
