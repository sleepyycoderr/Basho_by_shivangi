// Workshop Types for Basho Experience Bookings

export type WorkshopType = 'group' | 'private' | 'experience';
export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExperienceType = 'couples_date' | 'birthday_party' | 'corporate' | 'masterclass';

export interface Workshop {
  id: string;
  name: string;
  type: WorkshopType;
  level: WorkshopLevel;
  experienceType?: ExperienceType;
  description: string;
  longDescription: string;
  images: string[];
  duration: string; // e.g., "3 hours", "2-3 hours"
  participants: {
    min: number;
    max: number;
  };
  price: number;
  pricePerPerson: boolean; // true if price is per person
  includes: string[]; // What's included in the workshop
  requirements?: string[]; // What participants need to bring/know
  schedule: WorkshopSchedule[];
  location: string;
  instructor: string;
  takeHome: string; // What participants can take home
  providedMaterials: string[];
  certificate: boolean;
  lunchIncluded: boolean;
  featured?: boolean;
  availableSpots?: number;
}

export interface WorkshopSchedule {
  id: string; // ✅ ADD THIS
  date: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
  isAvailable: boolean;
}


export interface WorkshopBooking {
  workshopId: string;
  selectedDate: string;
  selectedTime: string;
  participants: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  totalAmount: number;
}

export interface WorkshopRegistration {
  name: string;
  email: string;
  phone: string;
  workshopId: string;
  selectedDate: string;
  selectedTime: string;
  numberOfParticipants: number;
  specialRequests?: string;
  gstNumber?: string; // Optional for invoice
}