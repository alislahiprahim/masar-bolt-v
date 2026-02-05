export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  preferences?: {
    preferredDestinations: string[];
    dietaryRestrictions?: string[];
    travelStyle?: string;
  };
  profilePicture?: string;
}
