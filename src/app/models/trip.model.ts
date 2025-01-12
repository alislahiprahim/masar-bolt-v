export interface Trip {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
  included: string[];
  itinerary: { day: number; description: string; }[];
}