export interface User {
  _id: string;
  name: string;
  email: string;
  email_verified_at?: Date;
  user_photo?: string;
  role_id: Role;
  in_active: number;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  _id: string;
  name: string;
  display_name: string;
  description?: string;
}

export interface Pet {
  _id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  color?: string;
  description: string;
  medicalHistory?: string;
  vaccinated: boolean;
  neutered: boolean;
  photos: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  location?: string;
  addedBy: User | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  _id: string;
  petId: Pet | string;
  userId: User | string;
  applicantName: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  occupation?: string;
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  hasExperience: boolean;
  experienceDetails?: string;
  homeType: 'House' | 'Apartment' | 'Condo' | 'Other';
  hasYard: boolean;
  reasonForAdoption: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  reviewedBy?: User | string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
