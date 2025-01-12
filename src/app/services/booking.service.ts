import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../models/booking.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookings.asObservable();

  constructor(private authService: AuthService) {}

  createBooking(formData: FormData): Booking {
    const user = this.authService.getCurrentUser();
    if (!user)
      throw new Error("User must be authenticated to create a booking");

    // In a real application, you would upload the image to a storage service
    // and get back a URL. Here we're just using the File object as is.
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      tripId: formData.get("tripId") as string,
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

    const currentBookings = this.bookings.value;
    this.bookings.next([...currentBookings, newBooking]);

    return newBooking;
  }

  getBookingsByUser(userId: string): Booking[] {
    return this.bookings.value.filter((booking) => booking.userId === userId);
  }

  getBookingById(bookingId: string): Booking | undefined {
    return this.bookings.value.find((booking) => booking.id === bookingId);
  }

  updateBookingStatus(bookingId: string, status: Booking["status"]): void {
    const currentBookings = this.bookings.value;
    const updatedBookings = currentBookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    this.bookings.next(updatedBookings);
  }
}