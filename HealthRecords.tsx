import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HealthRecordCard } from "@/components/HealthRecordCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, FileText, Plus, QrCode, Shield, Download, Search } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { HealthRecord } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

export default function HealthRecords() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState("en");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "",
    description: "",
    summary: "",
    tags: "",
    recordDate: new Date().toISOString().split('T')[0],
    fileUrl: ""
  });

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

  const { data: healthRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/health-records'],
    enabled: isAuthenticated,
    retry: false,
  });

  const createRecordMutation = useMutation({
    mutationFn: async (recordData: any) => {
      const response = await apiRequest('POST', '/api/health-records', recordData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-records'] });
      toast({
        title: language === 'es' ? "Expediente Creado" : "Record Created",
        description: language === 'es' 
          ? "Tu expediente médico ha sido guardado."
          : "Your health record has been saved.",
      });
      setIsAddDialogOpen(false);
      setNewRecord({
        title: "",
        type: "",
        description: "",
        summary: "",
        tags: "",
        recordDate: new Date().toISOString().split('T')[0],
        fileUrl: ""
      });
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
          ? "No se pudo crear el expediente."
          : "Failed to create health record.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    try {
      const response = await apiRequest('POST', '/api/objects/upload', {});
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.uploadURL,
      };
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
      throw error;
    }
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const fileURL = uploadedFile.uploadURL;
      
      try {
        // Set ACL policy for the uploaded file
        const response = await apiRequest('PUT', '/api/health-records/file', { fileURL });
        const data = await response.json();
        
        setNewRecord(prev => ({
          ...prev,
          fileUrl: data.objectPath
        }));
        
        toast({
          title: language === 'es' ? "Archivo Subido" : "File Uploaded",
          description: language === 'es' 
            ? "El archivo se ha subido exitosamente."
            : "File has been uploaded successfully.",
        });
      } catch (error: any) {
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
            ? "Error al procesar el archivo."
            : "Error processing file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateRecord = () => {
    if (!newRecord.title || !newRecord.type || !newRecord.recordDate) {
      toast({
        title: language === 'es' ? "Campos Requeridos" : "Required Fields",
        description: language === 'es' 
          ? "Por favor completa todos los campos requeridos."
          : "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const recordData = {
      ...newRecord,
      tags: newRecord.tags ? newRecord.tags.split(',').map(tag => tag.trim()) : [],
      recordDate: new Date(newRecord.recordDate).toISOString(),
    };

    createRecordMutation.mutate(recordData);
  };

  const handleDownload = (record: HealthRecord) => {
    if (record.fileUrl) {
      window.open(record.fileUrl, '_blank');
    } else {
      toast({
        title: language === 'es' ? "Sin Archivo" : "No File",
        description: language === 'es' 
          ? "Este expediente no tiene archivo adjunto."
          : "This record has no attached file.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (record: HealthRecord) => {
    // TODO: Implement sharing functionality
    toast({
      title: language === 'es' ? "Compartir" : "Share",
      description: language === 'es' 
        ? "Función de compartir en desarrollo."
        : "Share functionality coming soon.",
    });
  };

  const filteredRecords = Array.isArray(healthRecords) ? healthRecords.filter((record: HealthRecord) => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || record.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  }) : [];

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
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium">
                  {language === 'es' ? 'Mis Citas' : 'My Appointments'}
                </Link>
                <Link href="/health-records" className="text-blue-600 font-medium">
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'es' ? 'Mis Expedientes Médicos' : 'My Health Records'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' ? 'Seguros, portátiles y siempre accesibles' : 'Secure, portable, and always accessible'}
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Agregar Expediente' : 'Add Record'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'es' ? 'Nuevo Expediente Médico' : 'New Health Record'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      {language === 'es' ? 'Título *' : 'Title *'}
                    </Label>
                    <Input
                      id="title"
                      value={newRecord.title}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={language === 'es' ? 'Ej: Examen físico anual' : 'e.g. Annual Physical Exam'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">
                      {language === 'es' ? 'Tipo *' : 'Type *'}
                    </Label>
                    <Select value={newRecord.type} onValueChange={(value) => setNewRecord(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'es' ? 'Seleccionar tipo' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">{language === 'es' ? 'Examen' : 'Exam'}</SelectItem>
                        <SelectItem value="prescription">{language === 'es' ? 'Prescripción' : 'Prescription'}</SelectItem>
                        <SelectItem value="lab">{language === 'es' ? 'Laboratorio' : 'Lab Results'}</SelectItem>
                        <SelectItem value="imaging">{language === 'es' ? 'Imágenes' : 'Imaging'}</SelectItem>
                        <SelectItem value="vaccination">{language === 'es' ? 'Vacunación' : 'Vaccination'}</SelectItem>
                        <SelectItem value="other">{language === 'es' ? 'Otro' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recordDate">
                      {language === 'es' ? 'Fecha *' : 'Date *'}
                    </Label>
                    <Input
                      id="recordDate"
                      type="date"
                      value={newRecord.recordDate}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, recordDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">
                      {language === 'es' ? 'Resumen' : 'Summary'}
                    </Label>
                    <Textarea
                      id="summary"
                      value={newRecord.summary}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder={language === 'es' ? 'Resumen breve del expediente...' : 'Brief summary of the record...'}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">
                      {language === 'es' ? 'Descripción Detallada' : 'Detailed Description'}
                    </Label>
                    <Textarea
                      id="description"
                      value={newRecord.description}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={language === 'es' ? 'Descripción detallada...' : 'Detailed description...'}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">
                      {language === 'es' ? 'Etiquetas (separadas por comas)' : 'Tags (comma-separated)'}
                    </Label>
                    <Input
                      id="tags"
                      value={newRecord.tags}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder={language === 'es' ? 'laboratorio, preventivo, rutina' : 'lab, preventive, routine'}
                    />
                  </div>

                  <div>
                    <Label>
                      {language === 'es' ? 'Archivo Adjunto' : 'Attach File'}
                    </Label>
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760} // 10MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="w-full mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{language === 'es' ? 'Subir Archivo' : 'Upload File'}</span>
                      </div>
                    </ObjectUploader>
                    {newRecord.fileUrl && (
                      <p className="text-sm text-green-600 mt-2">
                        {language === 'es' ? 'Archivo subido exitosamente' : 'File uploaded successfully'}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      {language === 'es' ? 'Cancelar' : 'Cancel'}
                    </Button>
                    <Button 
                      onClick={handleCreateRecord}
                      disabled={createRecordMutation.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {createRecordMutation.isPending 
                        ? (language === 'es' ? 'Guardando...' : 'Saving...')
                        : (language === 'es' ? 'Guardar' : 'Save')
                      }
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Records List */}
            <div className="lg:col-span-2">
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'es' ? 'Buscar expedientes...' : 'Search records...'}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'es' ? 'Todos los tipos' : 'All types'}</SelectItem>
                    <SelectItem value="exam">{language === 'es' ? 'Exámenes' : 'Exams'}</SelectItem>
                    <SelectItem value="prescription">{language === 'es' ? 'Prescripciones' : 'Prescriptions'}</SelectItem>
                    <SelectItem value="lab">{language === 'es' ? 'Laboratorios' : 'Lab Results'}</SelectItem>
                    <SelectItem value="imaging">{language === 'es' ? 'Imágenes' : 'Imaging'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recordsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6 animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRecords.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecords.map((record: HealthRecord) => (
                    <HealthRecordCard
                      key={record.id}
                      record={record}
                      onDownload={handleDownload}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'es' ? 'No se encontraron expedientes' : 'No records found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || typeFilter !== "all"
                      ? (language === 'es' ? 'Intenta ajustar tus filtros de búsqueda.' : 'Try adjusting your search filters.')
                      : (language === 'es' ? 'Comienza agregando tu primer expediente médico.' : 'Start by adding your first health record.')
                    }
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Agregar Expediente' : 'Add Record'}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Health Summary Sidebar */}
            <div className="space-y-6">
              {/* Health ID Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">
                        {language === 'es' ? 'ID de Salud' : 'Health ID'}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {language === 'es' ? 'Identidad Portátil' : 'Portable Identity'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {user?.healthId || 'CC-2024-XXXXXX'}</p>
                    <p><strong>{language === 'es' ? 'Nombre' : 'Name'}:</strong> {user?.firstName} {user?.lastName}</p>
                    {user?.email && (
                      <p><strong>{language === 'es' ? 'Email' : 'Email'}:</strong> {user.email}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline"
                    className="mt-4 w-full bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Mostrar Código QR' : 'Show QR Code'}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'es' ? 'Resumen de Salud' : 'Health Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {language === 'es' ? 'Total de Expedientes' : 'Total Records'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{Array.isArray(healthRecords) ? healthRecords.length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {language === 'es' ? 'Este Año' : 'This Year'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {Array.isArray(healthRecords) ? healthRecords.filter((record: HealthRecord) => 
                          new Date(record.recordDate).getFullYear() === new Date().getFullYear()
                        ).length : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {language === 'es' ? 'Último Registro' : 'Last Record'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {Array.isArray(healthRecords) && healthRecords.length > 0 
                          ? new Date(healthRecords[0].recordDate).toLocaleDateString()
                          : language === 'es' ? 'Ninguno' : 'None'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Emergency Contact */}
              {user?.emergencyContactName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === 'es' ? 'Contacto de Emergencia' : 'Emergency Contact'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{user.emergencyContactName}</p>
                      {user.emergencyContactPhone && (
                        <p className="text-gray-600">{user.emergencyContactPhone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
