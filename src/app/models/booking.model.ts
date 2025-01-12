export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  specialRequests?: string;
}