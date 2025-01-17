import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
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
    return this.getItems(params).pipe(
      map(({ items, total }) => ({ trips: items, total }))
    );
  }

  getTripById(id: string): Observable<Trip> {
    return this.getItemById(id, "getTripById");
  }

  getPopularTrips(): Observable<Trip[]> {
    return this.getFeaturedItems(6, "popular");
  }

  protected getEntityName(): string {
    return "trip";
  }
}
