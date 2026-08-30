import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, Calendar, Clock, MapPin, Phone, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Appointment, Provider } from "@shared/schema";

export default function Appointments() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState("en");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Get selected provider from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('provider');
    if (providerId) {
      // Fetch provider details
      fetch(`/api/providers/${providerId}`)
        .then(res => res.json())
        .then(provider => setSelectedProvider(provider))
        .catch(err => console.error('Error fetching provider:', err));
    }
  }, []);

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['/api/providers'],
    enabled: isAuthenticated,
    retry: false,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest('POST', '/api/appointments', appointmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: language === 'es' ? "Cita Confirmada" : "Appointment Confirmed",
        description: language === 'es' 
          ? "Tu cita ha sido programada exitosamente."
          : "Your appointment has been scheduled successfully.",
      });
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: language === 'es' ? "Error" : "Error",
        description: language === 'es' 
          ? "No se pudo programar la cita."
          : "Failed to schedule appointment.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmAppointment = () => {
    if (!selectedProvider || !selectedDate || !selectedTime) return;

    const appointmentDateTime = new Date(selectedDate);
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let adjustedHours = hours;
    
    if (period === 'PM' && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
    
    appointmentDateTime.setHours(adjustedHours, minutes || 0, 0, 0);

    createAppointmentMutation.mutate({
      providerId: selectedProvider.id,
      appointmentDate: appointmentDateTime.toISOString(),
      duration: 30,
      type: "in-person",
      status: "scheduled",
      cost: selectedProvider.minPrice || "65.00",
    });
  };

  const upcomingAppointments = Array.isArray(appointments) ? appointments.filter((apt: Appointment) => 
    new Date(apt.appointmentDate) > new Date()
  ) : [];

  const pastAppointments = Array.isArray(appointments) ? appointments.filter((apt: Appointment) => 
    new Date(apt.appointmentDate) <= new Date()
  ) : [];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

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
                <Link href="/providers" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Encontrar Proveedores' : 'Find Providers'}
                </Link>
                <Link href="/appointments" className="text-blue-600 font-medium">
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
        {selectedProvider ? (
          /* Appointment Booking Section */
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-2">
                  {language === 'es' 
                    ? `Agendar Cita con ${selectedProvider.name}`
                    : `Book Appointment with ${selectedProvider.name}`
                  }
                </h1>
                <p className="text-blue-100">{selectedProvider.specialty} • {selectedProvider.clinic}</p>
              </div>
              
              <CardContent className="p-6">
                <AppointmentCalendar
                  onDateSelect={setSelectedDate}
                  onTimeSelect={setSelectedTime}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
                
                {selectedDate && selectedTime && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'Detalles de la Cita' : 'Appointment Details'}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>{language === 'es' ? 'Fecha' : 'Date'}:</strong>{' '}
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p>
                        <strong>{language === 'es' ? 'Hora' : 'Time'}:</strong> {selectedTime} - {
                          (() => {
                            const [time, period] = selectedTime.split(' ');
                            const [hours, minutes] = time.split(':').map(Number);
                            let endHours = hours;
                            let endMinutes = (minutes || 0) + 30;
                            
                            if (endMinutes >= 60) {
                              endHours += 1;
                              endMinutes -= 60;
                            }
                            
                            const endTime = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${period}`;
                            return endTime;
                          })()
                        }
                      </p>
                      <p>
                        <strong>{language === 'es' ? 'Tipo' : 'Type'}:</strong>{' '}
                        {language === 'es' ? 'Consulta en persona' : 'In-person consultation'}
                      </p>
                      <p>
                        <strong>{language === 'es' ? 'Costo' : 'Cost'}:</strong>{' '}
                        <span className="text-green-600 font-medium">
                          ${selectedProvider.minPrice} {selectedProvider.slidingScale && (language === 'es' ? '(escala móvil)' : '(sliding scale)')}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
                  onClick={handleConfirmAppointment}
                  disabled={!selectedDate || !selectedTime || createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending 
                    ? (language === 'es' ? 'Confirmando...' : 'Confirming...')
                    : (language === 'es' ? 'Confirmar Cita' : 'Confirm Appointment')
                  }
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Appointments List */
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {language === 'es' ? 'Mis Citas' : 'My Appointments'}
                </h1>
                <p className="text-gray-600">
                  {language === 'es' 
                    ? 'Gestiona tus citas médicas programadas'
                    : 'Manage your scheduled medical appointments'
                  }
                </p>
              </div>
              <Link href="/providers">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Agendar Nueva Cita' : 'Schedule New Appointment'}
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{language === 'es' ? 'Próximas Citas' : 'Upcoming Appointments'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment: Appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">{appointment.type}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === 'scheduled' 
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          {appointment.cost && (
                            <div className="flex items-center text-sm text-gray-600 mt-2">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${appointment.cost}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        {language === 'es' ? 'No tienes citas programadas' : 'No upcoming appointments'}
                      </p>
                      <Link href="/providers">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          {language === 'es' ? 'Agendar Cita' : 'Schedule Appointment'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>{language === 'es' ? 'Citas Anteriores' : 'Past Appointments'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.slice(0, 5).map((appointment: Appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">{appointment.type}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'es' ? 'No hay citas anteriores' : 'No past appointments'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
