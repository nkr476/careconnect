import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Heart,
  Users,
  Calculator,
  HelpCircle,
  Book,
  Phone
} from "lucide-react";

export default function InsuranceHelp() {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    familySize: '',
    employmentStatus: '',
    currentInsurance: '',
    medicalConditions: '',
    preferredLanguage: 'en'
  });
  const [aiResponse, setAiResponse] = useState('');
  const { toast } = useToast();

  const insuranceGuidanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/navigator/insurance-help', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (response) => {
      setAiResponse(response.guidance);
      toast({
        title: "Insurance Guidance Generated",
        description: "Here's personalized advice for your situation.",
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

  const handleGetAdvice = () => {
    const situation = `Age: ${formData.age}, Income: ${formData.income}, Family Size: ${formData.familySize}, Employment: ${formData.employmentStatus}, Current Insurance: ${formData.currentInsurance}, Medical Conditions: ${formData.medicalConditions}`;
    
    insuranceGuidanceMutation.mutate({
      situation,
      language: formData.preferredLanguage
    });
  };

  const insuranceTypes = [
    {
      name: language === 'es' ? 'Medicaid' : 'Medicaid',
      description: language === 'es' ? 'Programa gubernamental para personas de bajos ingresos' : 'Government program for low-income individuals',
      eligibility: language === 'es' ? 'Ingresos bajos, embarazadas, discapacitados' : 'Low income, pregnant women, disabled',
      cost: language === 'es' ? 'Gratis o muy bajo costo' : 'Free or very low cost',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: language === 'es' ? 'Medicare' : 'Medicare',
      description: language === 'es' ? 'Programa federal para adultos mayores de 65 años' : 'Federal program for adults 65 and older',
      eligibility: language === 'es' ? '65+ años, ciertas discapacidades' : '65+ years old, certain disabilities',
      cost: language === 'es' ? 'Primas mensuales varían' : 'Monthly premiums vary',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: language === 'es' ? 'Seguros del Mercado (ACA)' : 'Marketplace Insurance (ACA)',
      description: language === 'es' ? 'Planes privados con subsidios gubernamentales' : 'Private plans with government subsidies',
      eligibility: language === 'es' ? 'Todos los ciudadanos y residentes legales' : 'All citizens and legal residents',
      cost: language === 'es' ? 'Varía según ingresos' : 'Varies by income',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: language === 'es' ? 'CHIP' : 'CHIP',
      description: language === 'es' ? 'Programa de seguro de salud para niños' : "Children's Health Insurance Program",
      eligibility: language === 'es' ? 'Familias que ganan demasiado para Medicaid' : 'Families who earn too much for Medicaid',
      cost: language === 'es' ? 'Bajo costo o gratis' : 'Low cost or free',
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const formSteps = [
    {
      title: language === 'es' ? 'Información Personal' : 'Personal Information',
      fields: [
        { key: 'fullName', label: language === 'es' ? 'Nombre Completo' : 'Full Name', required: true },
        { key: 'dateOfBirth', label: language === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth', required: true },
        { key: 'ssn', label: language === 'es' ? 'Número de Seguro Social' : 'Social Security Number', required: true },
        { key: 'address', label: language === 'es' ? 'Dirección' : 'Address', required: true }
      ]
    },
    {
      title: language === 'es' ? 'Información de Ingresos' : 'Income Information',
      fields: [
        { key: 'monthlyIncome', label: language === 'es' ? 'Ingresos Mensuales' : 'Monthly Income', required: true },
        { key: 'employmentStatus', label: language === 'es' ? 'Estado de Empleo' : 'Employment Status', required: true },
        { key: 'employer', label: language === 'es' ? 'Empleador' : 'Employer', required: false },
        { key: 'otherIncome', label: language === 'es' ? 'Otros Ingresos' : 'Other Income', required: false }
      ]
    },
    {
      title: language === 'es' ? 'Información de Salud' : 'Health Information',
      fields: [
        { key: 'currentDoctor', label: language === 'es' ? 'Médico Actual' : 'Current Doctor', required: false },
        { key: 'medications', label: language === 'es' ? 'Medicamentos' : 'Medications', required: false },
        { key: 'conditions', label: language === 'es' ? 'Condiciones Médicas' : 'Medical Conditions', required: false },
        { key: 'preferredHospital', label: language === 'es' ? 'Hospital Preferido' : 'Preferred Hospital', required: false }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'es' ? 'Ayuda con Seguros' : 'Insurance Help'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' 
                  ? 'Orientación personalizada para encontrar el seguro médico adecuado'
                  : 'Personalized guidance to find the right health insurance'
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Assessment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>{language === 'es' ? 'Evaluación Personal' : 'Personal Assessment'}</span>
                </CardTitle>
                <CardDescription>
                  {language === 'es' 
                    ? 'Completa esta información para recibir recomendaciones personalizadas'
                    : 'Complete this information to receive personalized recommendations'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">{language === 'es' ? 'Edad' : 'Age'}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder={language === 'es' ? 'Tu edad' : 'Your age'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="income">{language === 'es' ? 'Ingresos Anuales ($)' : 'Annual Income ($)'}</Label>
                    <Input
                      id="income"
                      type="number"
                      value={formData.income}
                      onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                      placeholder={language === 'es' ? 'Ej: 35000' : 'e.g., 35000'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="familySize">{language === 'es' ? 'Tamaño de Familia' : 'Family Size'}</Label>
                    <Input
                      id="familySize"
                      type="number"
                      value={formData.familySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, familySize: e.target.value }))}
                      placeholder={language === 'es' ? 'Número de personas' : 'Number of people'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employmentStatus">{language === 'es' ? 'Estado de Empleo' : 'Employment Status'}</Label>
                    <Select 
                      value={formData.employmentStatus} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, employmentStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'es' ? 'Selecciona estado' : 'Select status'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">{language === 'es' ? 'Empleado' : 'Employed'}</SelectItem>
                        <SelectItem value="unemployed">{language === 'es' ? 'Desempleado' : 'Unemployed'}</SelectItem>
                        <SelectItem value="self-employed">{language === 'es' ? 'Trabajador Independiente' : 'Self-employed'}</SelectItem>
                        <SelectItem value="student">{language === 'es' ? 'Estudiante' : 'Student'}</SelectItem>
                        <SelectItem value="retired">{language === 'es' ? 'Jubilado' : 'Retired'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currentInsurance">{language === 'es' ? 'Seguro Actual' : 'Current Insurance'}</Label>
                  <Input
                    id="currentInsurance"
                    value={formData.currentInsurance}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentInsurance: e.target.value }))}
                    placeholder={language === 'es' ? 'Ninguno, Medicaid, Empleador, etc.' : 'None, Medicaid, Employer, etc.'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="medicalConditions">{language === 'es' ? 'Condiciones Médicas' : 'Medical Conditions'}</Label>
                  <Textarea
                    id="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                    placeholder={language === 'es' 
                      ? 'Describe cualquier condición médica existente...'
                      : 'Describe any existing medical conditions...'
                    }
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleGetAdvice}
                  disabled={insuranceGuidanceMutation.isPending}
                  className="w-full"
                >
                  {insuranceGuidanceMutation.isPending 
                    ? (language === 'es' ? 'Generando Consejos...' : 'Generating Advice...')
                    : (language === 'es' ? 'Obtener Recomendaciones de IA' : 'Get AI Recommendations')
                  }
                </Button>
                
                {aiResponse && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {language === 'es' ? 'Recomendaciones Personalizadas:' : 'Personalized Recommendations:'}
                    </h4>
                    <div className="text-blue-800 whitespace-pre-wrap">{aiResponse}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insurance Types */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>{language === 'es' ? 'Tipos de Seguro' : 'Insurance Types'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insuranceTypes.map((type, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <Badge className={type.color}>
                        {type.cost}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-gray-500">
                      <strong>{language === 'es' ? 'Elegibilidad:' : 'Eligibility:'}</strong> {type.eligibility}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>{language === 'es' ? 'Consejos Rápidos' : 'Quick Tips'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'es' 
                      ? 'Compara los deducibles y copagos, no solo las primas'
                      : 'Compare deductibles and copays, not just premiums'
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'es' 
                      ? 'Verifica si tus médicos están en la red'
                      : 'Check if your doctors are in-network'
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'es' 
                      ? 'Ten en cuenta los subsidios disponibles'
                      : 'Consider available subsidies'
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'es' 
                      ? 'Lee los beneficios de medicamentos recetados'
                      : 'Review prescription drug benefits'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Filling Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{language === 'es' ? 'Guía para Llenar Formularios' : 'Form Filling Guide'}</span>
            </CardTitle>
            <CardDescription>
              {language === 'es' 
                ? 'Pasos para completar una solicitud de seguro médico'
                : 'Steps to complete a health insurance application'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {formSteps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                  </div>
                  <div className="space-y-2">
                    {step.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex items-center space-x-2">
                        {field.required ? (
                          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 border border-gray-300 rounded-sm flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700">{field.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">
                    {language === 'es' ? 'Documentos Necesarios:' : 'Required Documents:'}
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• {language === 'es' ? 'Declaración de impuestos del año anterior' : 'Previous year tax return'}</li>
                    <li>• {language === 'es' ? 'Talones de pago recientes' : 'Recent pay stubs'}</li>
                    <li>• {language === 'es' ? 'Tarjeta de Seguro Social' : 'Social Security card'}</li>
                    <li>• {language === 'es' ? 'Información del seguro actual (si aplica)' : 'Current insurance information (if applicable)'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>{language === 'es' ? 'Recursos de Emergencia' : 'Emergency Resources'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  {language === 'es' ? 'Líneas de Ayuda Gratuitas' : 'Free Help Lines'}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Healthcare.gov</span>
                    <span className="text-sm font-medium">1-800-318-2596</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Medicaid</span>
                    <span className="text-sm font-medium">1-877-267-2323</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">CHIP</span>
                    <span className="text-sm font-medium">1-877-543-7669</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  {language === 'es' ? 'Centros de Inscripción Local' : 'Local Enrollment Centers'}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'es' 
                    ? 'Encuentra ayuda en persona cerca de ti:'
                    : 'Find in-person help near you:'
                  }
                </p>
                <Button variant="outline" className="w-full">
                  {language === 'es' ? 'Buscar Centros Cercanos' : 'Find Nearby Centers'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}