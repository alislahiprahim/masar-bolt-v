import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../models/booking.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookings.asObservable();

  constructor(private authService: AuthService) {}

  createBooking(booking: Omit<Booking, 'id' | 'userId' | 'status' | 'bookingDate'>): Booking {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User must be authenticated to create a booking');

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      status: 'pending',
      bookingDate: new Date().toISOString(),
      ...booking
    };

    const currentBookings = this.bookings.value;
    this.bookings.next([...currentBookings, newBooking]);

    return newBooking;
  }
}