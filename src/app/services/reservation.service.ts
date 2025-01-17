import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { Reservation, ReservationUpdate } from "../models/reservation.model";
import { environment } from "../../environments/environment";
import { ToastService } from "./toast.service";
import { BaseApiService } from "./base-api.service";

@Injectable({
  providedIn: "root",
})
export class ReservationService extends BaseApiService<Reservation> {
  protected apiUrl = `${environment.apiUrl}/reservations`;

  getUserReservations(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {}
  ): Observable<{ reservations: Reservation[]; total: number }> {
    return of({ items: mockReservations, total: mockReservations.length }).pipe(
      map(({ items, total }) => ({ reservations: items, total }))
    );
  }

  updateReservation(
    id: string,
    updates: ReservationUpdate
  ): Observable<Reservation> {
    return this.http
      .patch<Reservation>(`${this.apiUrl}/${id}`, updates)
      .pipe(catchError(this.handleError.bind(this)));
  }

  cancelReservation(id: string, reason: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/${id}/cancel`, { reason })
      .pipe(catchError(this.handleError.bind(this)));
  }

  confirmReservation(id: string): Observable<{ paymentUrl: string }> {
    return this.http
      .post<{ paymentUrl: string }>(`${this.apiUrl}/${id}/confirm`, {})
      .pipe(catchError(this.handleError.bind(this)));
  }

  downloadInvoice(id: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${id}/invoice`, { responseType: "blob" })
      .pipe(catchError(this.handleError.bind(this)));
  }

  downloadTicket(id: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${id}/ticket`, { responseType: "blob" })
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected getEntityName(): string {
    return "reservation";
  }
}

export const mockReservations: Reservation[] = [
  {
    id: "res-001",
    userId: "user-001",
    tripId: "trip-001",
    title: "Luxury Hajj Package",
    status: "pending",
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-01-10T12:00:00Z",
    numberOfTravelers: 2,
    totalPrice: 5000,
    whatsappNumber: "+123456789",
    specialRequests: "Need an extra bed in the hotel.",
    isEditable: true,
  },
  {
    id: "res-002",
    userId: "user-002",
    tripId: "trip-002",
    title: "Umrah Economy Package",
    status: "confirmed",
    createdAt: "2025-01-11T14:00:00Z",
    updatedAt: "2025-01-12T10:00:00Z",
    numberOfTravelers: 4,
    totalPrice: 3000,
    whatsappNumber: "+987654321",
    paymentId: "pay-001",
    paymentUrl: "https://payment.gateway/transaction/pay-001",
    isEditable: false,
  },
  {
    id: "res-003",
    userId: "user-003",
    tripId: "trip-003",
    title: "Exclusive Ramadan Umrah",
    status: "paid",
    createdAt: "2025-01-09T08:00:00Z",
    updatedAt: "2025-01-10T15:00:00Z",
    numberOfTravelers: 3,
    totalPrice: 4500,
    whatsappNumber: "+1122334455",
    paymentId: "pay-002",
    isEditable: false,
  },
  {
    id: "res-004",
    userId: "user-004",
    tripId: "trip-004",
    title: "Affordable Group Umrah",
    status: "cancelled",
    createdAt: "2025-01-08T09:00:00Z",
    updatedAt: "2025-01-09T16:00:00Z",
    numberOfTravelers: 1,
    totalPrice: 1000,
    whatsappNumber: "+5566778899",
    cancellationReason: "Personal reasons.",
    isEditable: false,
  },
  {
    id: "res-005",
    userId: "user-005",
    tripId: "trip-005",
    title: "VIP Umrah Experience",
    status: "completed",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2025-01-05T18:00:00Z",
    numberOfTravelers: 2,
    totalPrice: 6000,
    whatsappNumber: "+9988776655",
    isEditable: false,
  },
];

export const mockReservationUpdate: ReservationUpdate = {
  numberOfTravelers: 3,
  whatsappNumber: "+9988776655",
  specialRequests: "Require a wheelchair for one traveler.",
};
