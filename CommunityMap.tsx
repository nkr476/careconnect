import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Phone, Globe, CheckCircle, AlertTriangle, Star, Navigation, Car } from "lucide-react";

export default function CommunityMap() {
  const [searchLocation, setSearchLocation] = useState('Los Angeles');
  const [selectedType, setSelectedType] = useState('all');
  const [language, setLanguage] = useState('en');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: communityLocations = [], isLoading } = useQuery({
    queryKey: ['/api/community-locations', selectedType, searchLocation],
    select: (data: any[]) => {
      if (selectedType === 'all') return data;
      return data.filter(location => location.type === selectedType);
    }
  });

  const addLocationMutation = useMutation({
    mutationFn: (locationData: any) => apiRequest('/api/community-locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-locations'] });
      toast({
        title: "Location Added",
        description: "Thank you for contributing to our community map!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/community-locations'] });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'free_clinic': return '🏥';
      case 'dental_van': return '🦷';
      case 'health_fair': return '🎪';
      case 'vaccination_drive': return '💉';
      default: return '📍';
    }
  };

  const getTypeName = (type: string) => {
    const types: Record<string, { en: string; es: string }> = {
      free_clinic: { en: 'Free Clinic', es: 'Clínica Gratuita' },
      dental_van: { en: 'Dental Van', es: 'Clínica Dental Móvil' },
      health_fair: { en: 'Health Fair', es: 'Feria de Salud' },
      vaccination_drive: { en: 'Vaccination Drive', es: 'Centro de Vacunación' }
    };
    return types[type]?.[language as keyof typeof types[type]] || type;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'es' ? 'Mapa de Salud Comunitario' : 'Community Health Map'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' 
                  ? 'Encuentra recursos de salud gratuitos y de bajo costo en tu área'
                  : 'Find free and low-cost healthcare resources in your area'
                }
              </p>
            </div>
          </div>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="location">
                  {language === 'es' ? 'Ubicación' : 'Location'}
                </Label>
                <Input
                  id="location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder={language === 'es' ? 'Ingresa ciudad o código postal' : 'Enter city or zip code'}
                  className="text-black placeholder-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="type">
                  {language === 'es' ? 'Tipo de Servicio' : 'Service Type'}
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'es' ? 'Todos los Servicios' : 'All Services'}
                    </SelectItem>
                    <SelectItem value="free_clinic">
                      {language === 'es' ? 'Clínicas Gratuitas' : 'Free Clinics'}
                    </SelectItem>
                    <SelectItem value="dental_van">
                      {language === 'es' ? 'Atención Dental' : 'Dental Care'}
                    </SelectItem>
                    <SelectItem value="health_fair">
                      {language === 'es' ? 'Ferias de Salud' : 'Health Fairs'}
                    </SelectItem>
                    <SelectItem value="vaccination_drive">
                      {language === 'es' ? 'Vacunación' : 'Vaccination'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (language === 'es' ? 'Buscando...' : 'Searching...')
                    : (language === 'es' ? 'Buscar Ubicaciones' : 'Search Locations')
                  }
                </Button>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Agregar Ubicación' : 'Add Location'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Locations */}
        <div className="grid gap-6">
          {communityLocations.map((location: any) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(location.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location.address}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{location.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {location.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {language === 'es' ? 'Verificado' : 'Verified'}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {getTypeName(location.type)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'Horarios' : 'Hours'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><Clock className="w-3 h-3 inline mr-2" />
                        {language === 'es' ? 'Lun-Vie' : 'Mon-Fri'}: {location.schedule?.monday || 'Cerrado'}
                      </p>
                      <p><Clock className="w-3 h-3 inline mr-2" />
                        {language === 'es' ? 'Sáb' : 'Sat'}: {location.schedule?.saturday || 'Cerrado'}
                      </p>
                      <p><Clock className="w-3 h-3 inline mr-2" />
                        {language === 'es' ? 'Dom' : 'Sun'}: {location.schedule?.sunday || 'Cerrado'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'Contacto' : 'Contact'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <Phone className="w-3 h-3 inline mr-2" />
                        {location.contactInfo?.phone || 'N/A'}
                      </p>
                      <p>
                        <Globe className="w-3 h-3 inline mr-2" />
                        {location.languages?.join(', ') || 'English'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'Servicios' : 'Services'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {location.services?.slice(0, 3).map((service: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {location.services?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{location.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{language === 'es' ? 'Costo:' : 'Cost:'}</strong> {location.cost}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {location.requirements}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'es' ? 'Direcciones' : 'Directions'}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      {language === 'es' ? 'Llamar' : 'Call'}
                    </Button>
                  </div>
                </div>
                
                {location.verified && (
                  <div className="mt-4 text-xs text-gray-500 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                    {language === 'es' ? 'Verificado por' : 'Verified by'}: {location.verifiedBy}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {communityLocations.length === 0 && !isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'es' ? 'No se encontraron ubicaciones' : 'No locations found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'es' 
                    ? 'Intenta buscar en una ubicación diferente o agregar nuevas ubicaciones para tu comunidad.'
                    : 'Try searching a different location or add new locations for your community.'
                  }
                </p>
                <Button>
                  {language === 'es' ? 'Agregar Primera Ubicación' : 'Add First Location'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Community Contribution */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'es' ? '¡Ayuda a tu Comunidad!' : 'Help Your Community!'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'es' 
                  ? 'Conoces alguna clínica gratuita, feria de salud o recurso médico? Compártelo con otros.'
                  : 'Know of a free clinic, health fair, or medical resource? Share it with others.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Agregar Ubicación' : 'Add Location'}
                </Button>
                <Button variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Reportar Problema' : 'Report Issue'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}