import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { Booking } from "../models/booking.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private bookingStatus: { [tripId: string]: "booked" | "pending" | null } = {};

  getBookingStatus(tripId: string): "booked" | "pending" | null {
    return this.bookingStatus[tripId] || null;
  }

  async createBooking(formData: FormData): Promise<Booking> {
    const response = await firstValueFrom(
      this.http.post<Booking>(this.apiUrl, formData)
    );

    this.bookingStatus[response.tripId] = "booked";
    return response;
  }

  async requestBooking(tripId: string, whatsappNumber: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.apiUrl}/request`, { tripId, whatsappNumber })
    );

    this.bookingStatus[tripId] = "pending";
  }
}
