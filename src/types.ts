export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  icon: string;
  startingPrice: string;
  isActive: boolean;
  isFeatured: boolean;
  faqs?: ServiceFAQ[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';

export interface Enquiry {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  businessCategory: string;
  servicesInterestedIn: string[];
  monthlyBudget?: string;
  businessGoals: string[];
  projectDescription: string;
  preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp';
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  heroHeadline: string;
  heroSubheading: string;
  heroIntro: string;
  aboutText: string;
  mission: string;
  vision: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  workingHours: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  featuredServiceIds: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    value?: string;
  }[];
  isEnquiryTrigger?: boolean;
  enquiryDraft?: Partial<Enquiry>;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
}
