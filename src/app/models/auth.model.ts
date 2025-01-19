export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  content: {
    token: string;
    userDetails: UserDetails;
  };
  responseMessage: string | null;
}

export interface UserDetails {
  id: string;
  phone: string;
  email?: string;
  userName?: string;
  name?: string;
  profilePicture?: string;
  reservedTripIds: string[];
  preferences?: {
    preferredDestinations: string[];
    dietaryRestrictions?: string[];
    travelStyle?: string;
  };
}

export interface AuthState {
  user: UserDetails | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
