import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, Sparkles, MapPin, Calendar, DollarSign, 
  Users, Share2, Zap, Globe, Heart, Star, ArrowRight,
  Check, Clock, Award, TrendingUp
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Get personalized itineraries in seconds with our advanced AI technology',
      color: 'text-travel-coral',
      bg: 'bg-travel-coral/10'
    },
    {
      icon: Calendar,
      title: 'Day-by-Day Itineraries',
      description: 'Detailed schedules with activities, costs, and local tips for each day',
      color: 'text-travel-teal',
      bg: 'bg-travel-teal/10'
    },
    {
      icon: DollarSign,
      title: 'Budget Friendly',
      description: 'Plans tailored to your budget - from backpacker to luxury travel',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your trips with friends and family with a single link',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: MapPin,
      title: '12+ Destinations',
      description: 'Curated collection of popular destinations around the world',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Create complete travel plans in under 30 seconds',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Destination',
      description: 'Pick from our curated list or enter your dream destination',
      icon: Globe
    },
    {
      number: '02',
      title: 'Set Your Preferences',
      description: 'Tell us your budget, dates, interests, and travel style',
      icon: Users
    },
    {
      number: '03',
      title: 'Get Your Itinerary',
      description: 'AI creates a personalized day-by-day plan in seconds',
      icon: Sparkles
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'TripWeaver planned my entire European adventure in minutes! The AI knew exactly what I wanted.',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      text: 'Best travel planning tool ever! Saved me hours of research and found hidden gems I never knew existed.',
      rating: 5,
      image: '👨‍💻'
    },
    {
      name: 'Emma Davis',
      location: 'London, UK',
      text: 'The budget-friendly options were perfect for my backpacking trip. Highly recommended!',
      rating: 5,
      image: '👩‍🎓'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Trips Planned', icon: Plane },
    { value: '50+', label: 'Countries', icon: Globe },
    { value: '98%', label: 'Satisfaction', icon: Heart },
    { value: '<30s', label: 'Avg. Planning Time', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-travel-coral to-travel-coral/80 flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">TripWeaver</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button 
              className="bg-travel-coral hover:bg-travel-coral/90"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-travel-coral/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-travel-teal/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-travel-coral/10 text-travel-coral border-travel-coral/30 hover:bg-travel-coral/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-travel-coral via-travel-teal to-travel-sky bg-clip-text text-transparent">
              Plan Your Dream Trip in Seconds
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered travel planning that creates personalized itineraries tailored to your style, budget, and interests. ✈️
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-travel-coral hover:bg-travel-coral/90 text-white h-14 px-8 text-lg"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg"
                onClick={() => navigate('/destinations')}
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore Destinations
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-0 bg-muted/50">
                  <CardContent className="pt-6 text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-travel-coral" />
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-travel-teal/10 text-travel-teal border-travel-teal/30">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make travel planning effortless and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-500 border-purple-500/30">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to your perfect itinerary
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-travel-coral to-travel-teal flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <Card className="flex-1 border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-travel-coral/10 flex items-center justify-center flex-shrink-0">
                          <step.icon className="w-6 h-6 text-travel-coral" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground text-lg">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-20 bottom-0 w-0.5 bg-gradient-to-b from-travel-coral to-travel-teal" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
              <Award className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users say about their TripWeaver experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-travel-coral to-travel-teal flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-travel-coral via-travel-teal to-travel-sky opacity-10" />
        
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-travel-coral to-travel-teal text-white">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers who trust TripWeaver to plan their perfect trips
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-white text-travel-coral hover:bg-white/90 h-14 px-8 text-lg"
                  onClick={() => navigate('/auth')}
                >
                  <Plane className="w-5 h-5 mr-2" />
                  Start Planning Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Instant results</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-travel-coral to-travel-coral/80 flex items-center justify-center shadow-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl">TripWeaver</span>
                <p className="text-sm text-muted-foreground">Your AI Travel Companion</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2025 TripWeaver. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Made with ❤️ for travelers worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
