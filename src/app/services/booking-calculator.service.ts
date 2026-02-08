import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';
import { TravelerInfo } from '../models/booking.model';

@Injectable({
    providedIn: 'root',
})
export class BookingCalculatorService {
    calculateTripPrice(trip: Trip, travelers: TravelerInfo[], tripHotelId?: string): number {
        const basePrice = tripHotelId
            ? trip.TripHotel?.find(hotel => hotel.id === tripHotelId)?.costPerPerson || trip.price
            : trip.price;

        let totalPrice = 0;
        let childrenUnder12 = 0;
        let childrenUnder6 = 0;

        travelers.forEach(traveler => {
            const type = traveler.type;

            switch (type) {
                case 'adult':
                    totalPrice += basePrice;
                    break;
                case 'childUnder12':
                    if (childrenUnder12 === 0) {
                        // First child under 12 is free
                        childrenUnder12++;
                    } else {
                        totalPrice += basePrice;
                    }
                    break;
                case 'childUnder6':
                    if (childrenUnder6 === 0 && childrenUnder12 === 0) {
                        // First child under 6 is free if no child under 12
                        childrenUnder6++;
                    } else if (childrenUnder6 === 0) {
                        // Second child under 6 is free
                        childrenUnder6++;
                    } else {
                        totalPrice += basePrice;
                    }
                    break;
            }
        });

        return totalPrice;
    }
}
