import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, of } from "rxjs";
import { Trip } from "../models/trip.model";
import { environment } from "../../environments/environment";
import { ToastService } from "./toast.service";
import { BaseApiService } from "./base-api.service";

@Injectable({
  providedIn: "root",
})
export class TripsService extends BaseApiService<Trip> {
  protected apiUrl = `${environment.apiUrl}/trip`;

  getTrips(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      destination?: string;
      minPrice?: number | null;
      maxPrice?: number | null;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {}
  ): Observable<{ trips: Trip[]; total: number }> {
    // return this.getItems(params).pipe(
    return of({ items: mockTrips, total: mockTrips.length }).pipe(
      map(({ items, total }) => ({ trips: items, total }))
    );
  }

  getTripById(id: string): Observable<Trip> {
    return of(mockTrips.find((trip) => trip.id === id) as Trip);
  }

  getPopularTrips(): Observable<Trip[]> {
    return this.getFeaturedItems(6, "popular");
  }

  protected getEntityName(): string {
    return "trip";
  }
}

export const mockTrips: Trip[] = [
  {
    id: "1",
    name: "Desert Adventure",
    days: 5,
    price: 500,
    tripStatus: 1,
    notes: "Bring sunscreen",
    description: "<b>A thrilling journey through the desert.</b>",
    date: "2025-03-01",
    cityId: "C001",
    city: "Dubai",
    maxReservations: 20,
    isActive: true,
    tripPhotos: ["photo1.jpg", "photo2.jpg"],
    destination: "Sahara Desert",
    included: ["Guide", "Meals", "Transport"],
  },
  {
    id: "2",
    name: "Mountain Retreat",
    days: 3,
    price: 300,
    tripStatus: 2,
    notes: "Prepare for cold weather",
    description: "Relax in the serenity of the mountains.",
    date: "2025-04-15",
    cityId: "C002",
    city: "Aspen",
    maxReservations: 15,
    isActive: true,
    tripPhotos: ["mountain1.jpg"],
    destination: "Rocky Mountains",
    included: ["Lodging", "Breakfast", "Hiking Gear"],
  },
  {
    id: "3",
    name: "Beach Paradise",
    days: 7,
    price: 1000,
    tripStatus: 3,
    notes: "Bring swimwear",
    description: "Enjoy a week at a tropical beach resort.",
    date: "2025-06-10",
    cityId: "C003",
    city: "Maldives",
    maxReservations: 10,
    isActive: false,
    tripPhotos: ["beach1.jpg", "beach2.jpg", "beach3.jpg"],
    destination: "Maldives Islands",
    included: ["Meals", "Spa Access", "Snorkeling"],
  },
];