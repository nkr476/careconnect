import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProviderCard } from "@/components/ProviderCard";
import { ProviderFilters } from "@/components/ProviderFilters";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Search } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Provider } from "@shared/schema";

export default function Providers() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("en");
  const [searchParams, setSearchParams] = useState({
    specialty: "",
    location: "",
  });
  const [filters, setFilters] = useState({
    distance: "25",
    acceptsUninsured: false,
    slidingScale: false,
    cashPayments: false,
    languages: [] as string[],
    availability: [] as string[],
    sortBy: "distance",
  });

  const queryParams = new URLSearchParams();
  if (searchParams.specialty) queryParams.append('specialty', searchParams.specialty);
  if (searchParams.location) queryParams.append('location', searchParams.location);
  if (filters.distance) queryParams.append('distance', filters.distance);
  if (filters.acceptsUninsured) queryParams.append('acceptsUninsured', 'true');
  if (filters.languages.length > 0) queryParams.append('languages', filters.languages.join(','));
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['/api/providers', queryParams.toString()],
  });

  const handleSearch = () => {
    // Trigger search by updating query params
    setSearchParams({ ...searchParams });
  };

  const handleViewProfile = (provider: Provider) => {
    // TODO: Navigate to provider profile page
    console.log('View profile for:', provider.name);
  };

  const handleBookNow = (provider: Provider) => {
    // TODO: Navigate to booking page with provider
    window.location.href = `/appointments?provider=${provider.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="text-2xl text-blue-600" />
                <span className="text-xl font-bold text-gray-900">CareConnect</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/providers" className="text-blue-600 font-medium">
                  {language === 'es' ? 'Encontrar Proveedores' : 'Find Providers'}
                </Link>
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Mis Citas' : 'My Appointments'}
                </Link>
                <Link href="/health-records" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Expedientes Médicos' : 'Health Records'}
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector value={language} onChange={setLanguage} />
              
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"} 
                  alt="User profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || user?.email || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'es' ? 'Encontrar Proveedores de Salud' : 'Find Healthcare Providers'}
          </h1>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Select 
                value={searchParams.specialty} 
                onValueChange={(value) => setSearchParams({ ...searchParams, specialty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Especialidad' : 'Specialty'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Family Medicine">{language === 'es' ? 'Medicina Familiar' : 'Family Medicine'}</SelectItem>
                  <SelectItem value="Internal Medicine">{language === 'es' ? 'Medicina Interna' : 'Internal Medicine'}</SelectItem>
                  <SelectItem value="Mental Health">{language === 'es' ? 'Salud Mental' : 'Mental Health'}</SelectItem>
                  <SelectItem value="Dental">{language === 'es' ? 'Dental' : 'Dental'}</SelectItem>
                  <SelectItem value="Urgent Care">{language === 'es' ? 'Atención Urgente' : 'Urgent Care'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input 
                type="text" 
                placeholder={language === 'es' ? 'Ingresa código postal' : 'Enter ZIP code'} 
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Buscar Proveedores' : 'Search Providers'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProviderFilters filters={filters} onFilterChange={setFilters} />
          </div>
          
          {/* Provider Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'es' ? 'Proveedores de Atención Primaria' : 'Primary Care Providers'}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {Array.isArray(providers) ? providers.length : 0} {language === 'es' ? 'proveedores encontrados' : 'providers found'}
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(providers) && providers.length > 0 ? (
              <div className="space-y-4">
                {providers.map((provider: Provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onViewProfile={handleViewProfile}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'es' ? 'No se encontraron proveedores' : 'No providers found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'es' 
                    ? 'Intenta ajustar tus filtros de búsqueda.'
                    : 'Try adjusting your search filters.'
                  }
                </p>
                <Button 
                  onClick={() => setFilters({
                    distance: "25",
                    acceptsUninsured: false,
                    slidingScale: false,
                    cashPayments: false,
                    languages: [],
                    availability: [],
                    sortBy: "distance",
                  })}
                  variant="outline"
                >
                  {language === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
