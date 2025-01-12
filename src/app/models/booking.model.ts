export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  bookingDate: string;
  whatsappNumber: string;
  nationalIdImage: string;
  numberOfTravelers: number;
  totalPrice: number;
  specialRequests?: string;
  amount?: number;
}