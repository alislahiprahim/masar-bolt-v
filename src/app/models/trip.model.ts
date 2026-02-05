import { Hotel } from './hotel.model';

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
  city: { id: string; name: string };
  maxReservations: number;
  isActive: boolean;
  tripPhotos: string[];
  destination: string;
  includes: { includes: { name: string } }[];
  itinerary: any[];
  TripHotel: {
    id: string;
    hotel: Hotel;
    costPerPerson: number;
  }[];
}
