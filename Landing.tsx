import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Globe, Smartphone, Search } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [specialty, setSpecialty] = useState("primary-care");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Scroll to providers section (will be handled by navigation)
    window.location.href = "/providers";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareConnect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Button 
                  variant="ghost"
                  className="group-hover:bg-gray-100"
                >
                  Sign In
                </Button>
                {/* Sign In Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">Choose how to sign in:</p>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.location.href = "/api/login"}
                      >
                        <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                        Continue with Replit
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.location.href = "/api/auth/google"}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      New users will be automatically registered
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Healthcare Made Simple</h1>
            <p className="text-xl mb-8 text-blue-100">
              Find providers, book appointments, and manage your health records in one secure place. 
              No insurance? No problem.
            </p>
            
            {/* Quick Search */}
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    What do you need?
                  </Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary-care">Primary Care</SelectItem>
                      <SelectItem value="urgent-care">Urgent Care</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="Enter ZIP code" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Providers
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 mt-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span className="text-sm">Multilingual Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm">Works Everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Healthcare
            </h2>
            <p className="text-gray-600">
              Designed for underserved communities, first-generation immigrants, and anyone navigating healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Providers</h3>
              <p className="text-gray-600">
                Search for healthcare providers by specialty, location, and payment options including 
                sliding scale and cash payments.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Records</h3>
              <p className="text-gray-600">
                Secure, portable health identity that goes with you anywhere. 
                Store and access your medical records safely.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Guidance</h3>
              <p className="text-gray-600">
                Get help navigating insurance, understanding treatment options, 
                and preparing for appointments in your preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Healthcare?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already using CareConnect to navigate 
            healthcare with confidence.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="text-2xl text-blue-600" />
                <span className="text-xl font-bold">CareConnect</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Making healthcare accessible for everyone, everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Find Providers</a></li>
                <li><a href="#" className="hover:text-white">Book Appointments</a></li>
                <li><a href="#" className="hover:text-white">Health Records</a></li>
                <li><a href="#" className="hover:text-white">Insurance Help</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Health Education</a></li>
                <li><a href="#" className="hover:text-white">Community Programs</a></li>
                <li><a href="#" className="hover:text-white">Financial Assistance</a></li>
                <li><a href="#" className="hover:text-white">Support Groups</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2024 CareConnect. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">🔒 HIPAA Compliant</span>
              <span className="text-sm text-gray-400">🌍 Available in 12+ Languages</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
