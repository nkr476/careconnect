import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Heart, Calendar, FileText, Users, MessageCircle, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("en");

  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
    select: (data: any[]) => data.filter(apt => new Date(apt.appointmentDate) > new Date()).slice(0, 3)
  });

  const { data: recentRecords = [] } = useQuery({
    queryKey: ['/api/health-records'],
    select: (data: any[]) => data.slice(0, 3)
  });

  const quickActions = [
    {
      title: language === 'es' ? 'Encontrar Proveedores' : 'Find Providers',
      description: language === 'es' ? 'Buscar profesionales de la salud cerca de ti' : 'Search for healthcare professionals near you',
      icon: <Users className="w-6 h-6" />,
      href: '/providers',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: language === 'es' ? 'Agendar Cita' : 'Book Appointment',
      description: language === 'es' ? 'Programar una nueva cita médica' : 'Schedule a new medical appointment',
      icon: <Calendar className="w-6 h-6" />,
      href: '/appointments',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: language === 'es' ? 'Expedientes Médicos' : 'Health Records',
      description: language === 'es' ? 'Ver y gestionar tus expedientes médicos' : 'View and manage your medical records',
      icon: <FileText className="w-6 h-6" />,
      href: '/health-records',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: language === 'es' ? 'Pasaporte de Salud' : 'Health Passport',
      description: language === 'es' ? 'Identidad de salud portátil con traducción automática' : 'Portable health identity with AI translation',
      icon: <Heart className="w-6 h-6" />,
      href: '/health-passport',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: language === 'es' ? 'Mapa Comunitario' : 'Community Map',
      description: language === 'es' ? 'Encuentra atención gratuita cerca de ti' : 'Find free care locations near you',
      icon: <MapPin className="w-6 h-6" />,
      href: '/community-map',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: language === 'es' ? 'Recordatorios de Cuidado' : 'Care Reminders',
      description: language === 'es' ? 'Compañero de cuidado preventivo con IA' : 'AI-powered preventive care companion',
      icon: <Calendar className="w-6 h-6" />,
      href: '/care-reminders',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: language === 'es' ? 'Ayuda con Seguros' : 'Insurance Help',
      description: language === 'es' ? 'Obtén orientación sobre opciones de seguro' : 'Get guidance on insurance options',
      icon: <MessageCircle className="w-6 h-6" />,
      href: '/insurance',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Heart className="text-2xl text-blue-600" />
                <span className="text-xl font-bold text-gray-900">CareConnect</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link href="/providers" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Encontrar Proveedores' : 'Find Providers'}
                </Link>
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Mis Citas' : 'My Appointments'}
                </Link>
                <Link href="/health-records" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Expedientes Médicos' : 'Health Records'}
                </Link>
                <Link href="/insurance" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Ayuda con Seguros' : 'Insurance Help'}
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'es' 
              ? `¡Bienvenido, ${user?.firstName || 'Usuario'}!` 
              : `Welcome back, ${user?.firstName || 'User'}!`
            }
          </h1>
          <p className="text-gray-600">
            {language === 'es' 
              ? 'Gestiona tu salud desde un solo lugar seguro y conveniente.'
              : 'Manage your healthcare from one secure and convenient place.'
            }
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
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
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === 'es' ? 'Ver Detalles' : 'View Details'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'es' ? 'No tienes citas programadas' : 'No upcoming appointments'}
                  </p>
                  <Link href="/providers">
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      {language === 'es' ? 'Agendar Cita' : 'Book Appointment'}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Health Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>{language === 'es' ? 'Expedientes Recientes' : 'Recent Health Records'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{record.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.recordDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === 'es' ? 'Ver' : 'View'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'es' ? 'No hay expedientes médicos' : 'No health records yet'}
                  </p>
                  <Link href="/health-records">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      {language === 'es' ? 'Agregar Expediente' : 'Add Record'}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health ID Card */}
        <Card className="mt-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'es' ? 'Tu Identidad de Salud' : 'Your Health ID'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {language === 'es' ? 'Identidad portátil y segura' : 'Portable, secure identity'}
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>ID:</strong> {user?.healthId || 'CC-2024-XXXXXX'}</p>
                  <p><strong>{language === 'es' ? 'Nombre' : 'Name'}:</strong> {user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <div className="text-right">
                <Button 
                  variant="outline" 
                  className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                >
                  {language === 'es' ? 'Mostrar Código QR' : 'Show QR Code'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
