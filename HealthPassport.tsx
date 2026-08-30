import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Languages, Download, Upload, Edit, Save, FileText, Globe } from "lucide-react";

interface HealthPassport {
  id: string;
  userId: string;
  medicalHistory: any;
  allergies: string[];
  medications: string[];
  immunizations: any;
  conditions: string[];
  emergencyContacts: any;
  insuranceInfo: any;
  bloodType: string;
  doctorNotes: string;
  lastUpdated: string;
}

export default function HealthPassport() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<HealthPassport>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: passport, isLoading } = useQuery({
    queryKey: ['/api/health-passport'],
    retry: false,
  });

  const createPassportMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/health-passport', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-passport'] });
      toast({
        title: "Health Passport Created",
        description: "Your health passport has been created successfully.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePassportMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/health-passport', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-passport'] });
      toast({
        title: "Health Passport Updated",
        description: "Your health passport has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (passport) {
      setFormData(passport);
    }
  }, [passport]);

  const handleSave = () => {
    if (passport) {
      updatePassportMutation.mutate(formData);
    } else {
      createPassportMutation.mutate(formData);
    }
  };

  const addItem = (field: 'allergies' | 'medications' | 'conditions', item: string) => {
    if (item.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()]
      }));
    }
  };

  const removeItem = (field: 'allergies' | 'medications' | 'conditions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Identity Passport</h1>
              <p className="text-gray-600">Your secure, portable health profile</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Translate</span>
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={createPassportMutation.isPending || updatePassportMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                <span>Save</span>
              </Button>
            )}
          </div>
        </div>

        {/* Passport Status */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Health Passport Active</p>
                  <p className="text-sm text-green-600">
                    Last updated: {passport?.lastUpdated ? new Date(passport.lastUpdated).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Languages className="w-3 h-3 mr-1" />
                Multi-language Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Personal health details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                {isEditing ? (
                  <Input
                    id="bloodType"
                    value={formData.bloodType || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                    placeholder="e.g., A+, O-, AB+"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{formData.bloodType || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="doctorNotes">Doctor's Notes</Label>
                {isEditing ? (
                  <Textarea
                    id="doctorNotes"
                    value={formData.doctorNotes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorNotes: e.target.value }))}
                    placeholder="Important medical notes from your doctor..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{formData.doctorNotes || 'No notes available'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Known allergies and reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.allergies || []).map((allergy, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                    <span className="text-red-800">{allergy}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('allergies', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add allergy..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem('allergies', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
                
                {(!formData.allergies || formData.allergies.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No known allergies</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Medications you're currently taking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.medications || []).map((medication, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                    <span className="text-blue-800">{medication}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('medications', index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add medication..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem('medications', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
                
                {(!formData.medications || formData.medications.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No current medications</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
              <CardDescription>Diagnosed conditions and chronic illnesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.conditions || []).map((condition, index) => (
                  <div key={index} className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg">
                    <span className="text-yellow-800">{condition}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('conditions', index)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add condition..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem('conditions', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
                
                {(!formData.conditions || formData.conditions.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No diagnosed conditions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Translation Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>AI Translation & Summary</span>
            </CardTitle>
            <CardDescription>Automatically translate your health records for providers worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>🇪🇸</span>
                <span>Spanish</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>🇫🇷</span>
                <span>French</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>🇨🇳</span>
                <span>Chinese</span>
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>AI Summary:</strong> This health passport contains essential medical information that can be instantly 
                translated into any language for healthcare providers worldwide. All data is encrypted and under your control.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}