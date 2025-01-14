import { Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Booking } from "../models/booking.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private bookingsSignal = signal<Booking[]>([]);
  private bookingStatusSignal = signal<{
    [tripId: string]: "booked" | "pending" | null;
  }>({});

  constructor(private authService: AuthService) {}

  createBooking(formData: FormData): Booking {
    const user = this.authService.getCurrentUser();
    if (!user)
      throw new Error("User must be authenticated to create a booking");

    const tripId = formData.get("tripId") as string;
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      tripId,
      status: "pending",
      bookingDate: new Date().toISOString(),
      whatsappNumber: formData.get("whatsappNumber") as string,
      nationalIdImage: URL.createObjectURL(
        formData.get("nationalIdImage") as File
      ),
      numberOfTravelers: Number(formData.get("numberOfTravelers")),
      totalPrice: Number(formData.get("totalPrice")),
      specialRequests: formData.get("specialRequests") as string,
    };

    // Update bookings
    this.bookingsSignal.update((bookings) => [...bookings, newBooking]);

    // Update booking status for this trip
    this.bookingStatusSignal.update((status) => ({
      ...status,
      [tripId]: "booked",
    }));

    return newBooking;
  }

  getBookingStatus(tripId: string) {
    return this.bookingStatusSignal().hasOwnProperty(tripId)
      ? this.bookingStatusSignal()[tripId]
      : null;
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.bookingsSignal().filter(
      (booking: Booking) => booking.userId === userId
    );
  }

  getBookingById(bookingId: string): Booking | undefined {
    return this.bookingsSignal().find(
      (booking: Booking) => booking.id === bookingId
    );
  }

  updateBookingStatus(bookingId: string, status: Booking["status"]): void {
    this.bookingsSignal.update((bookings: Booking[]) =>
      bookings.map((booking: Booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  }
}
