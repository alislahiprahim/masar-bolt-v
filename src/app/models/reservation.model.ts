export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "cancelled"
  | "completed";

export interface Reservation {
  id: string;
  userId: string;
  tripId: string;
  title: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  numberOfTravelers: number;
  totalPrice: number;
  whatsappNumber: string;
  specialRequests?: string;
  paymentId?: string;
  paymentUrl?: string;
  cancellationReason?: string;
  isEditable: boolean;
}

export interface ReservationUpdate {
  numberOfTravelers?: number;
  whatsappNumber?: string;
  specialRequests?: string;
}
