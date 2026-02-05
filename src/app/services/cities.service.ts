import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Trip } from '../models/trip.model';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { BaseApiService } from './base-api.service';
import { City } from '../models/city.model';
import { CityStateService } from '../state/city.state';

@Injectable({
  providedIn: 'root',
})
export class CitiesService extends BaseApiService<City> {
  protected apiUrl = `${environment.apiUrl}/cities`;
  protected state = inject(CityStateService);
  getCities(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      destination?: string;
      minPrice?: number | null;
      maxPrice?: number | null;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {},
    dataKey: string = 'cities'
  ): Observable<{ cities: City[]; total: number }> {
    // return of({ items: mockTrips, total: mockTrips.length }).pipe(
    return this.getItems(params, dataKey).pipe(
      map(({ items, total }) => ({ cities: items, total }))
    );
  }

  getCityById(id: string, dataKey: string = ''): Observable<City> {
    return this.getItemById(id, dataKey).pipe(
      map(city => ({
        ...city,
      }))
    );
  }

  getPopularCities(dataKey: string = 'popularCities'): Observable<City[]> {
    return this.getFeaturedItems(6, dataKey);
  }

  protected getEntityName(): string {
    return 'city';
  }

  loadDestinations() {
    this.state.setLoading(true);

    this.getCities().subscribe({
      next: ({ cities }) => {
        console.log(cities);
        this.state.setCities(cities, cities.length);
        this.state.setLoading(false);
      },
      error: error => {
        this.state.setError(error.message);
      },
    });
  }
}
