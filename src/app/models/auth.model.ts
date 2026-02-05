import { Reservation } from './reservation.model';

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterCredentials {
  phoneNumber?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface AuthResponse {
  status: 'success' | 'error';
  data: {
    token: string;
    refreshToken: string;
    user: UserDetails;
  };
  message: string | null;
}

export interface CheckPhoneResponse {
  status: 'success' | 'error';
  data: { exists: boolean };
  responseMessage: string | null;
}

export interface UserDetails {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  email?: string;
  isPhoneVerified: boolean;
  phoneVerificationCode?: string | null;
  phoneVerificationExpires?: Date | null;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  reservedTripIds: string[];
  preferences?: {
    preferredDestinations?: string[];
    dietaryRestrictions?: string[];
    travelStyle?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  reservations: Reservation[];
  roles?: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface AuthState {
  user: UserDetails | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}
