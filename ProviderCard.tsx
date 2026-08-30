import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import type { Provider } from "@shared/schema";

interface ProviderCardProps {
  provider: Provider;
  onViewProfile: (provider: Provider) => void;
  onBookNow: (provider: Provider) => void;
}

export function ProviderCard({ provider, onViewProfile, onBookNow }: ProviderCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < fullStars
                  ? "fill-current"
                  : i === fullStars && hasHalfStar
                  ? "fill-current opacity-50"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">{rating} ({provider.reviewCount})</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4">
        <img 
          src={provider.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face"} 
          alt={provider.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.specialty}</p>
              <p className="text-sm text-gray-500">{provider.clinic}</p>
            </div>
            <div className="text-right">
              {renderStars(provider.rating || "0")}
              <div className="flex items-center text-sm font-semibold text-green-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {provider.distance} miles
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.acceptsUninsured && (
              <Badge className="bg-green-600 text-white">Accepts Uninsured</Badge>
            )}
            {provider.languages?.includes("Spanish") && (
              <Badge variant="outline" className="border-blue-600 text-blue-600">🇪🇸 Spanish</Badge>
            )}
            {provider.languages?.includes("Mandarin") && (
              <Badge variant="outline" className="border-blue-600 text-blue-600">🇨🇳 Mandarin</Badge>
            )}
            {provider.nextAvailable && new Date(provider.nextAvailable).getTime() < Date.now() + 24 * 60 * 60 * 1000 && (
              <Badge className="bg-purple-600 text-white">Same Day Available</Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Next available: <span className="font-medium text-gray-900">
                {provider.nextAvailable ? new Date(provider.nextAvailable).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                }) : 'Contact for availability'}
              </span></p>
              {provider.slidingScale ? (
                <p>Sliding scale: <span className="font-medium text-green-600">${provider.minPrice}-${provider.maxPrice}</span></p>
              ) : (
                <p>Cash rate: <span className="font-medium text-green-600">${provider.minPrice}</span></p>
              )}
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onViewProfile(provider)}
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                View Profile
              </Button>
              <Button 
                onClick={() => onBookNow(provider)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
