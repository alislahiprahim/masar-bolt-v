// import { Injectable, inject } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import {
//   catchError,
//   firstValueFrom,
//   map,
//   Observable,
//   tap,
//   throwError,
// } from "rxjs";
// import { environment } from "../../environments/environment";
// import { Booking, ReservationResponse } from "../models/booking.model";
// import { AuthService } from "./auth.service";
// import { ToastService } from "./toast.service";

// @Injectable({
//   providedIn: "root",
// })
// export class BookingService {
//   private apiUrl = `${environment.apiUrl}/reservations`;
//   private http = inject(HttpClient);
//   private toastService = inject(ToastService);
//   private bookingStatus: { [tripId: string]: "booked" | "pending" | null } = {};

//   getBookingStatus(tripId: string): "booked" | "pending" | null {
//     return this.bookingStatus[tripId] || null;
//   }

//   createBooking(formData: FormData): Observable<boolean> {
//     return this.http.post<ReservationResponse>(this.apiUrl, formData).pipe(
//       tap((response) => {
//         if (response.status === "success") {
//           this.bookingStatus[response.data.tripId] = "booked"; // Assuming response.data.reservation contains tripId
//           this.toastService.success("booking.bookingSuccess");
//         } else {
//           this.toastService.error(
//             response.responseMessage || "booking.bookingError"
//           );
//         }
//       }),
//       map((response) => response.status === "success"), // Assuming ReservationResponse can be cast to Booking
//       catchError((error) => {
//         console.error("Error creating booking:", error);
//         this.toastService.error("booking.bookingError");
//         return throwError(() => new Error("Booking creation failed"));
//       })
//     );
//   }

//   async requestBooking(tripId: string, whatsappNumber: string): Promise<void> {
//     await firstValueFrom(
//       this.http.post(`${this.apiUrl}/request`, { tripId, whatsappNumber })
//     );

//     this.bookingStatus[tripId] = "pending";
//   }
// }
