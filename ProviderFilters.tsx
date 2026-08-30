import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterProps {
  filters: {
    distance: string;
    acceptsUninsured: boolean;
    slidingScale: boolean;
    cashPayments: boolean;
    languages: string[];
    availability: string[];
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
}

export function ProviderFilters({ filters, onFilterChange }: FilterProps) {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    updateFilter('languages', newLanguages);
  };

  const toggleAvailability = (availability: string) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    updateFilter('availability', newAvailability);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Distance</Label>
          <Select value={filters.distance} onValueChange={(value) => updateFilter('distance', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Within 5 miles</SelectItem>
              <SelectItem value="10">Within 10 miles</SelectItem>
              <SelectItem value="25">Within 25 miles</SelectItem>
              <SelectItem value="50">Within 50 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Accepts Uninsured</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sliding-scale"
                checked={filters.slidingScale}
                onCheckedChange={(checked) => updateFilter('slidingScale', checked)}
              />
              <Label htmlFor="sliding-scale" className="text-sm">Sliding scale fees</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cash-payments"
                checked={filters.cashPayments}
                onCheckedChange={(checked) => updateFilter('cashPayments', checked)}
              />
              <Label htmlFor="cash-payments" className="text-sm">Cash payments</Label>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Languages</Label>
          <div className="space-y-2">
            {['English', 'Spanish', 'Mandarin', 'French'].map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox 
                  id={`lang-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={() => toggleLanguage(language)}
                />
                <Label htmlFor={`lang-${language}`} className="text-sm">{language}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Availability</Label>
          <div className="space-y-2">
            {['Same day', 'This week', 'Next week'].map((availability) => (
              <div key={availability} className="flex items-center space-x-2">
                <Checkbox 
                  id={`avail-${availability}`}
                  checked={filters.availability.includes(availability)}
                  onCheckedChange={() => toggleAvailability(availability)}
                />
                <Label htmlFor={`avail-${availability}`} className="text-sm">{availability}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onFilterChange({
            distance: '25',
            acceptsUninsured: false,
            slidingScale: false,
            cashPayments: false,
            languages: [],
            availability: [],
            sortBy: 'distance'
          })}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
