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
  status: "success" | "error";
  data: {
    token: string;
    user: UserDetails;
  };
  responseMessage: string | null;
}

export interface UserDetails {
  id: string;
  phoneNumber: string;
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
