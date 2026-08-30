import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Shield,
  Stethoscope,
  Pill,
  Bell,
  Plus,
  Filter
} from "lucide-react";

interface CareReminder {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  completedAt?: string;
  language: string;
  customMessage?: string;
  ageGroup?: string;
  gender?: string;
}

export default function CareReminders() {
  const [filter, setFilter] = useState<'all' | 'due' | 'completed'>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['/api/care-reminders'],
    retry: false,
  });

  const completeReminderMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/care-reminders/${id}/complete`, {
      method: 'PUT',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/care-reminders'] });
      toast({
        title: "Reminder Completed",
        description: "Great job staying on top of your health!",
      });
    },
  });

  const createReminderMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/care-reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/care-reminders'] });
      toast({
        title: "Reminder Created",
        description: "We'll help you stay on track with your health goals.",
      });
    },
  });

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'screening': return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'vaccination': return <Shield className="w-5 h-5 text-green-600" />;
      case 'follow_up': return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'medication': return <Pill className="w-5 h-5 text-red-600" />;
      default: return <Heart className="w-5 h-5 text-pink-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredReminders = reminders.filter((reminder: CareReminder) => {
    if (filter === 'completed') return reminder.completed;
    if (filter === 'due') {
      const daysUntil = getDaysUntilDue(reminder.dueDate);
      return !reminder.completed && daysUntil <= 7;
    }
    return true;
  });

  const upcomingReminders = reminders.filter((r: CareReminder) => !r.completed && getDaysUntilDue(r.dueDate) <= 7);
  const overdueReminders = reminders.filter((r: CareReminder) => !r.completed && getDaysUntilDue(r.dueDate) < 0);

  // Sample preventive care recommendations based on age/gender
  const recommendedCare = [
    {
      type: 'screening',
      title: 'Annual Wellness Check',
      description: 'Comprehensive health screening to catch issues early',
      frequency: 'Yearly',
      ageGroup: 'adult',
      priority: 'medium'
    },
    {
      type: 'screening',
      title: 'Blood Pressure Check',
      description: 'Monitor cardiovascular health',
      frequency: 'Every 2 years',
      ageGroup: 'adult',
      priority: 'high'
    },
    {
      type: 'screening',
      title: 'Cholesterol Screening',
      description: 'Check for heart disease risk factors',
      frequency: 'Every 5 years',
      ageGroup: 'adult',
      priority: 'medium'
    },
    {
      type: 'vaccination',
      title: 'Flu Shot',
      description: 'Annual influenza vaccination',
      frequency: 'Yearly',
      ageGroup: 'all',
      priority: 'medium'
    },
    {
      type: 'screening',
      title: 'Mammogram',
      description: 'Breast cancer screening',
      frequency: 'Every 2 years',
      ageGroup: 'adult',
      gender: 'female',
      priority: 'high'
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Preventive Care Companion</h1>
              <p className="text-gray-600">Stay healthy with personalized care reminders</p>
            </div>
          </div>
          
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </Button>
        </div>

        {/* Health Status Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">
                {reminders.filter((r: CareReminder) => r.completed).length}
              </div>
              <div className="text-sm text-green-700">Completed This Year</div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{upcomingReminders.length}</div>
              <div className="text-sm text-yellow-700">Due This Week</div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{overdueReminders.length}</div>
              <div className="text-sm text-red-700">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>All Reminders</span>
          </Button>
          <Button
            variant={filter === 'due' ? 'default' : 'outline'}
            onClick={() => setFilter('due')}
          >
            Due Soon
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Active Reminders */}
        <div className="space-y-4 mb-8">
          {filteredReminders.map((reminder: CareReminder) => {
            const daysUntil = getDaysUntilDue(reminder.dueDate);
            const isOverdue = daysUntil < 0;
            const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

            return (
              <Card key={reminder.id} className={`${reminder.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-300' : isDueSoon ? 'border-yellow-300' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${reminder.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {reminder.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          getReminderIcon(reminder.type)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-semibold ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {reminder.title}
                          </h3>
                          <Badge className={getPriorityColor(reminder.priority)}>
                            {reminder.priority} priority
                          </Badge>
                          {reminder.type && (
                            <Badge variant="outline">
                              {reminder.type.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{reminder.description}</p>
                        
                        {reminder.customMessage && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>AI Explanation:</strong> {reminder.customMessage}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                          </div>
                          
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              {Math.abs(daysUntil)} days overdue
                            </Badge>
                          )}
                          
                          {isDueSoon && !reminder.completed && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              Due in {daysUntil} days
                            </Badge>
                          )}
                          
                          {reminder.completed && reminder.completedAt && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed {new Date(reminder.completedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!reminder.completed && (
                        <Button
                          size="sm"
                          onClick={() => completeReminderMutation.mutate(reminder.id)}
                          disabled={completeReminderMutation.isPending}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark Complete</span>
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommended Care */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recommended Preventive Care</span>
            </CardTitle>
            <CardDescription>
              Based on your age, gender, and health history, here's what you should consider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedCare.map((care, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    {getReminderIcon(care.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{care.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{care.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{care.frequency}</span>
                        <Button size="sm" variant="outline">
                          Add Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredReminders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
              <p className="text-gray-600 mb-4">
                Start building healthy habits by adding your first care reminder.
              </p>
              <Button>
                Add Your First Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}