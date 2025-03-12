import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Trip } from '../models/trip.model';
import { TripsService } from '../services/trips.service';
import { ReservationService } from '../services/reservation.service';

@Injectable({
  providedIn: 'root'
})
export class TripDetailResolver implements Resolve<Trip | null> {
  constructor(private tripsService: TripsService, private reservationService: ReservationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Trip | null> {
    const tripId = route.paramMap.get('id');
    if (!tripId) {
      return of(null);
    }
    this.reservationService.getUserReservations()
    return this.tripsService.getTripById(tripId).pipe(
      catchError((error) => {
        console.error('Error loading trip:', error);
        return of(null);
      })
    );
  }
}