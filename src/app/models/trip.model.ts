export interface Trip {
  id: string;
  name: string;
  days: number;
  price: number;
  tripStatus: number;
  notes: string;
  description: string;
  date: string;
  cityId: string;
  city: string;
  maxReservations: number;
  isActive: boolean;
  tripPhotos: string[];
  destination: string;
  includes: { includes: { name: string } }[];
}
 