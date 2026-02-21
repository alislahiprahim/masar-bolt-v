import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Trip } from '../models/trip.model';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { BaseApiService } from './base-api.service';
import { TripsStateService } from '../state/trips.state';

@Injectable({
  providedIn: 'root',
})
export class TripsService extends BaseApiService<Trip> {
  protected apiUrl = `${environment.apiUrl}/trips`;
  protected state = inject(TripsStateService);

  getTrips(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      destination?: string;
      minPrice?: number | null;
      maxPrice?: number | null;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      tag?: string;
    } = {},
    dataKey: string = 'trips'
  ): Observable<{ trips: Trip[]; total: number }> {
    // return of({ items: mockTrips, total: mockTrips.length }).pipe(
    return this.getItems(params, dataKey).pipe(
      map(({ items, total }) => ({ trips: items, total }))
    );
  }

  getTripById(id: string, dataKey: string = ''): Observable<Trip> {
    return this.getItemById(id, dataKey).pipe(
      map(trip => ({
        ...trip,
        itinerary: trip.itinerary.map(item => (typeof item === 'string' ? JSON.parse(item) : item)),
      }))
    );
  }

  getPopularTrips(dataKey: string = ''): Observable<Trip[]> {
    return this.getFeaturedItems(3, 'featured');
  }

  protected getEntityName(): string {
    return 'trip';
  }

  loadTrips() {
    const { filters, pagination } = this.state;
    this.state.setLoading(true);

    this.getTrips({
      ...filters(),
      ...pagination(),
    }).subscribe({
      next: ({ trips, total }) => {
        console.log(pagination());
        this.state.setTrips(
          pagination().page === 1 ? trips : [...this.state.trips(), ...trips],
          total
        );
        this.state.setLoading(false);
      },
      error: error => {
        this.state.setError(error.message);
      },
    });
  }
}

// export const mockTrips: Trip[] = [
//   {
//     id: "1",
//     name: "Desert Adventure",
//     days: 5,
//     price: 500,
//     tripStatus: 1,
//     notes: "Bring sunscreen",
//     description: "<b>A thrilling journey through the desert.</b>",
//     date: "2025-03-01",
//     cityId: "C001",
//     city: "Dubai",
//     maxReservations: 20,
//     isActive: true,
//     tripPhotos: ["photo1.jpg", "photo2.jpg"],
//     destination: "Sahara Desert",
//     included: ["Guide", "Meals", "Transport"],
//   },
//   {
//     id: "2",
//     name: "Mountain Retreat",
//     days: 3,
//     price: 300,
//     tripStatus: 2,
//     notes: "Prepare for cold weather",
//     description: "Relax in the serenity of the mountains.",
//     date: "2025-04-15",
//     cityId: "C002",
//     city: "Aspen",
//     maxReservations: 15,
//     isActive: true,
//     tripPhotos: ["mountain1.jpg"],
//     destination: "Rocky Mountains",
//     included: ["Lodging", "Breakfast", "Hiking Gear"],
//   },
//   {
//     id: "3",
//     name: "Beach Paradise",
//     days: 7,
//     price: 1000,
//     tripStatus: 3,
//     notes: "Bring swimwear",
//     description: "Enjoy a week at a tropical beach resort.",
//     date: "2025-06-10",
//     cityId: "C003",
//     city: "Maldives",
//     maxReservations: 10,
//     isActive: false,
//     tripPhotos: ["beach1.jpg", "beach2.jpg", "beach3.jpg"],
//     destination: "Maldives Islands",
//     included: ["Meals", "Spa Access", "Snorkeling"],
//   },
// ];
