// Mock data for CareConnect platform - realistic healthcare providers and community locations

export const mockProviders = [
  {
    id: "1",
    name: "Dr. Maria Rodriguez",
    title: "Family Medicine Physician",
    specialty: "Family Medicine",
    languages: ["English", "Spanish"],
    rating: 4.8,
    reviewCount: 127,
    yearsExperience: 12,
    education: "University of California, San Francisco",
    hospital: "Community General Hospital",
    address: "1234 Main Street, Suite 200",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    phone: "(555) 123-4567",
    availability: "accepting_new_patients",
    acceptsInsurance: ["Medicaid", "Medicare", "Blue Cross", "Aetna"],
    coordinates: { lat: 34.0522, lng: -118.2437 },
    culturalCompetency: {
      culture: "Hispanic/Latino",
      genderPreferences: "both",
      religiousAccommodations: true,
      communityInvolvement: "Volunteers at local community health fairs"
    }
  },
  {
    id: "2", 
    name: "Dr. James Kim",
    title: "Internal Medicine Specialist",
    specialty: "Internal Medicine",
    languages: ["English", "Korean", "Mandarin"],
    rating: 4.6,
    reviewCount: 89,
    yearsExperience: 8,
    education: "Johns Hopkins University",
    hospital: "Metro Health Center",
    address: "5678 Oak Avenue, Building A",
    city: "Los Angeles", 
    state: "CA",
    zipCode: "90211",
    phone: "(555) 234-5678",
    availability: "accepting_new_patients",
    acceptsInsurance: ["Medicaid", "Kaiser", "Cigna"],
    coordinates: { lat: 34.0722, lng: -118.2637 },
    culturalCompetency: {
      culture: "Asian American",
      genderPreferences: "both", 
      religiousAccommodations: false,
      communityInvolvement: "Provides free health screenings in Koreatown"
    }
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    title: "Pediatrician",
    specialty: "Pediatrics",
    languages: ["English"],
    rating: 4.9,
    reviewCount: 203,
    yearsExperience: 15,
    education: "Harvard Medical School", 
    hospital: "Children's Medical Center",
    address: "9876 Pine Street, Floor 3",
    city: "Los Angeles",
    state: "CA", 
    zipCode: "90212",
    phone: "(555) 345-6789",
    availability: "accepting_new_patients",
    acceptsInsurance: ["Medicaid", "CHIP", "United Healthcare"],
    coordinates: { lat: 34.0622, lng: -118.2537 },
    culturalCompetency: {
      culture: "General", 
      genderPreferences: "both",
      religiousAccommodations: true,
      communityInvolvement: "Partners with local schools for health education"
    }
  },
  {
    id: "4",
    name: "Dr. Ahmed Hassan",
    title: "Cardiologist", 
    specialty: "Cardiology",
    languages: ["English", "Arabic", "French"],
    rating: 4.7,
    reviewCount: 156,
    yearsExperience: 20,
    education: "Mayo Clinic College of Medicine",
    hospital: "Heart & Vascular Institute",
    address: "3456 Elm Boulevard, Suite 500",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90213", 
    phone: "(555) 456-7890",
    availability: "limited_availability",
    acceptsInsurance: ["Medicare", "Blue Cross", "Aetna", "Humana"],
    coordinates: { lat: 34.0422, lng: -118.2337 },
    culturalCompetency: {
      culture: "Middle Eastern",
      genderPreferences: "both",
      religiousAccommodations: true,
      communityInvolvement: "Offers heart health workshops in Arabic"
    }
  },
  {
    id: "5",
    name: "Dr. Linda Chen",
    title: "Women's Health Specialist",
    specialty: "Obstetrics & Gynecology", 
    languages: ["English", "Mandarin", "Cantonese"],
    rating: 4.8,
    reviewCount: 142,
    yearsExperience: 10,
    education: "Stanford University School of Medicine",
    hospital: "Women's Health Center",
    address: "7890 Birch Lane, Suite 300",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90214",
    phone: "(555) 567-8901",
    availability: "accepting_new_patients",
    acceptsInsurance: ["Medicaid", "Kaiser", "Blue Cross"],
    coordinates: { lat: 34.0822, lng: -118.2737 },
    culturalCompetency: {
      culture: "Asian American",
      genderPreferences: "female", 
      religiousAccommodations: true,
      communityInvolvement: "Provides prenatal care education in Chinese"
    }
  }
];

export const mockCommunityLocations = [
  {
    id: "1",
    name: "Community Free Clinic",
    type: "free_clinic",
    address: "1500 Hope Street, Los Angeles, CA 90015",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    description: "Provides free medical care to uninsured adults and children. No appointment needed for basic services.",
    schedule: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM", 
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "closed"
    },
    contactInfo: {
      phone: "(213) 555-0123",
      email: "info@communityclinic.org",
      website: "www.communityclinic.org"
    },
    languages: ["English", "Spanish", "Korean"],
    services: ["Primary Care", "Dental", "Mental Health", "Pharmacy"],
    requirements: "No insurance required. Income verification for some services.",
    cost: "Free",
    verified: true,
    verifiedBy: "LA County Health Department",
    isActive: true,
    submittedBy: "admin"
  },
  {
    id: "2", 
    name: "Mobile Dental Van - Eastside",
    type: "dental_van",
    address: "Rotating locations in East LA",
    coordinates: { lat: 34.0331, lng: -118.2098 },
    description: "Mobile dental unit providing free dental care to underserved communities. Cleanings, fillings, and emergency care available.",
    schedule: {
      monday: "9:00 AM - 4:00 PM",
      tuesday: "9:00 AM - 4:00 PM",
      wednesday: "9:00 AM - 4:00 PM", 
      thursday: "9:00 AM - 4:00 PM",
      friday: "9:00 AM - 2:00 PM",
      saturday: "closed",
      sunday: "closed"
    },
    contactInfo: {
      phone: "(323) 555-0456",
      email: "mobile@dentalcare.org"
    },
    languages: ["English", "Spanish"],
    services: ["Dental Cleanings", "Fillings", "Extractions", "Oral Health Education"],
    requirements: "Children and adults welcome. No insurance needed.",
    cost: "Free",
    verified: true,
    verifiedBy: "California Dental Association",
    isActive: true,
    submittedBy: "community_volunteer"
  },
  {
    id: "3",
    name: "Westside Health Fair",
    type: "health_fair", 
    address: "Santa Monica Civic Center, 1855 Main St, Santa Monica, CA",
    coordinates: { lat: 34.0195, lng: -118.4912 },
    description: "Monthly health fair offering free screenings, vaccinations, and health education. First Saturday of every month.",
    schedule: {
      saturday: "9:00 AM - 3:00 PM (First Saturday of month)",
      sunday: "closed",
      monday: "closed",
      tuesday: "closed",
      wednesday: "closed",
      thursday: "closed", 
      friday: "closed"
    },
    contactInfo: {
      phone: "(310) 555-0789",
      email: "healthfair@westside.org"
    },
    languages: ["English", "Spanish", "Tagalog"],
    services: ["Blood Pressure Checks", "Diabetes Screening", "Flu Shots", "Health Education"],
    requirements: "Open to all community members",
    cost: "Free",
    verified: true,
    verifiedBy: "Santa Monica Health Department", 
    isActive: true,
    submittedBy: "health_department"
  },
  {
    id: "4",
    name: "Valley COVID-19 & Flu Vaccination Drive",
    type: "vaccination_drive",
    address: "North Hollywood Park, 11430 Chandler Blvd, North Hollywood, CA",
    coordinates: { lat: 34.1661, lng: -118.3706 },
    description: "Drive-through vaccination site for COVID-19 boosters and seasonal flu shots. No appointment necessary.",
    schedule: {
      monday: "closed",
      tuesday: "10:00 AM - 6:00 PM",
      wednesday: "10:00 AM - 6:00 PM",
      thursday: "10:00 AM - 6:00 PM", 
      friday: "10:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "9:00 AM - 4:00 PM"
    },
    contactInfo: {
      phone: "(818) 555-0321",
      email: "vaccines@valleyhealth.gov"
    },
    languages: ["English", "Spanish", "Armenian"],
    services: ["COVID-19 Vaccines", "Flu Shots", "Travel Vaccines", "Health Consultations"],
    requirements: "All ages welcome. Bring ID if available.",
    cost: "Free",
    verified: true,
    verifiedBy: "LA County Public Health",
    isActive: true,
    submittedBy: "public_health"
  },
  {
    id: "5",
    name: "Skid Row Medical Outreach",
    type: "free_clinic",
    address: "500 S Spring St, Los Angeles, CA 90013", 
    coordinates: { lat: 34.0463, lng: -118.2493 },
    description: "Street medicine program providing healthcare to homeless individuals. Mental health services and substance abuse counseling available.",
    schedule: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 3:00 PM",
      sunday: "closed"
    },
    contactInfo: {
      phone: "(213) 555-0654",
      email: "outreach@skidrowhealth.org"
    },
    languages: ["English", "Spanish"],
    services: ["Primary Care", "Mental Health", "Substance Abuse Counseling", "Case Management"],
    requirements: "Primarily serves homeless population",
    cost: "Free",
    verified: true,
    verifiedBy: "Downtown LA Community Services",
    isActive: true,
    submittedBy: "nonprofit_org"
  }
];

export const mockCareReminders = [
  {
    id: "1",
    userId: "user123",
    type: "screening",
    title: "Annual Physical Exam",
    description: "Comprehensive health checkup including blood work and vital signs monitoring",
    dueDate: "2024-03-15",
    priority: "medium",
    completed: false,
    language: "en",
    customMessage: "This annual checkup helps detect health issues early when they're easier to treat. During the exam, your doctor will check your blood pressure, heart rate, weight, and may order blood tests to screen for diabetes, high cholesterol, and other conditions.",
    ageGroup: "adult"
  },
  {
    id: "2", 
    userId: "user123",
    type: "vaccination",
    title: "Flu Shot",
    description: "Annual influenza vaccination to protect against seasonal flu strains",
    dueDate: "2024-02-28", 
    priority: "high",
    completed: false,
    language: "en",
    customMessage: "The flu vaccine is especially important for people with chronic conditions like diabetes, heart disease, or asthma. Getting vaccinated also helps protect others in your community who may be more vulnerable to serious flu complications.",
    ageGroup: "adult"
  },
  {
    id: "3",
    userId: "user123", 
    type: "screening",
    title: "Blood Pressure Check",
    description: "Monitor cardiovascular health with regular blood pressure measurements",
    dueDate: "2024-02-20",
    priority: "high", 
    completed: true,
    completedAt: "2024-02-18",
    language: "en",
    customMessage: "High blood pressure often has no symptoms but can lead to serious health problems like heart disease and stroke. Regular monitoring helps catch changes early so treatment can begin if needed.",
    ageGroup: "adult"
  },
  {
    id: "4",
    userId: "user123",
    type: "follow_up",
    title: "Diabetes Management Appointment", 
    description: "Follow-up visit to review blood sugar levels and medication management",
    dueDate: "2024-03-01",
    priority: "high",
    completed: false,
    language: "en", 
    customMessage: "Regular diabetes follow-ups help ensure your treatment plan is working well. Your doctor will review your blood sugar logs, check for complications, and adjust medications if needed. This helps prevent serious complications like nerve damage, kidney problems, and vision issues.",
    ageGroup: "adult"
  },
  {
    id: "5",
    userId: "user123",
    type: "medication",
    title: "Prescription Refill - Blood Pressure Medication",
    description: "Refill monthly blood pressure medication",
    dueDate: "2024-02-25",
    priority: "medium",
    completed: false,
    language: "en",
    customMessage: "Taking blood pressure medication consistently is crucial for preventing heart attacks and strokes. Don't skip doses or stop taking the medication without talking to your doctor, even if you feel fine.",
    ageGroup: "adult"
  }
];

export function searchMockProviders(filters: any) {
  let results = [...mockProviders];
  
  if (filters.location) {
    // Simple location filter - in a real app, this would use geographical distance
    results = results.filter(provider => 
      provider.city.toLowerCase().includes(filters.location.toLowerCase()) ||
      provider.address.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.specialty) {
    results = results.filter(provider => 
      provider.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
    );
  }
  
  if (filters.languages && filters.languages.length > 0) {
    results = results.filter(provider =>
      filters.languages.some((lang: string) => 
        provider.languages.includes(lang)
      )
    );
  }
  
  if (filters.insurance) {
    results = results.filter(provider =>
      provider.acceptsInsurance.some(ins => 
        ins.toLowerCase().includes(filters.insurance.toLowerCase())
      )
    );
  }
  
  if (filters.availability) {
    results = results.filter(provider => 
      provider.availability === filters.availability
    );
  }
  
  // Sort by rating by default
  results.sort((a, b) => b.rating - a.rating);
  
  return results;
}