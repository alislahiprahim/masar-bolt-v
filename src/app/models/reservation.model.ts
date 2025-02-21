import { Trip } from "./trip.model";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "CANCELLED"
  | "COMPLETED";

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
  trip: Trip;
}

export interface ReservationUpdate {
  numberOfTravelers?: number;
  whatsappNumber?: string;
  specialRequests?: string;
}

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

export interface ReservationResponse {
  status: "success" | "error";
  data: any;
  responseMessage: string | null;
}
