import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div class="flex gap-4">
          <select [(ngModel)]="statusFilter" 
                  (change)="applyFilters()"
                  class="input-field">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select [(ngModel)]="sortBy"
                  (change)="applyFilters()"
                  class="input-field">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div class="space-y-6">
        @for (booking of filteredBookings; track booking.id) {
          <div class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Booking #{{ booking.id }}</h3>
                  <p class="text-sm text-gray-500">Booked on {{ booking.bookingDate | date }}</p>
                </div>
                <span [class]="getStatusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>
              
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Number of Travelers</p>
                  <p class="font-medium">{{ booking.numberOfTravelers }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Price</p>
                  <p class="font-medium">\${{ booking.totalPrice }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Special Requests</p>
                  <p class="font-medium">{{ booking.specialRequests || 'None' }}</p>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-4">
                @if (booking.status === 'pending' || booking.status === 'confirmed') {
                  <button (click)="openCancelDialog(booking)"
                          class="text-red-600 hover:text-red-700 font-medium">
                    Cancel Booking
                  </button>
                }
                @if (booking.status === 'completed') {
                  <a [routerLink]="['/reviews', 'new', booking.tripId]"
                     class="text-primary-600 hover:text-primary-700 font-medium">
                    Write a Review
                  </a>
                }
                <button (click)="downloadItinerary(booking.id)"
                        class="text-gray-600 hover:text-gray-700 font-medium">
                  Download Itinerary
                </button>
              </div>
            </div>
          </div>
        }

        @if (filteredBookings.length === 0) {
          <div class="text-center py-12 bg-white rounded-lg shadow">
            <p class="text-gray-500 mb-4">
              @if (statusFilter !== 'all') {
                No bookings found with the selected status.
              } @else {
                You haven't made any bookings yet.
              }
            </p>
            <a routerLink="/trips" 
               class="btn-primary inline-block">
              Browse Available Trips
            </a>
          </div>
        }
      </div>
    </div>

    @if (showCancelDialog) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">Cancel Booking</h3>
          <p class="text-gray-600 mb-4">Are you sure you want to cancel this booking? This action cannot be undone.</p>
          <form [formGroup]="cancelForm" (ngSubmit)="confirmCancellation()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Reason for cancellation</label>
              <select formControlName="reason" class="input-field mt-1">
                <option value="">Select a reason</option>
                <option value="change_of_plans">Change of plans</option>
                <option value="emergency">Emergency</option>
                <option value="better_price">Found better price</option>
                <option value="other">Other</option>
              </select>
            </div>
            @if (cancelForm.get('reason')?.value === 'other') {
              <div>
                <label class="block text-sm font-medium text-gray-700">Please specify</label>
                <textarea formControlName="otherReason" 
                          class="input-field mt-1" 
                          rows="2"></textarea>
              </div>
            }
            <div class="flex justify-end gap-4">
              <button type="button" 
                      (click)="showCancelDialog = false"
                      class="px-4 py-2 text-gray-600 hover:text-gray-700">
                Keep Booking
              </button>
              <button type="submit"
                      [disabled]="!cancelForm.valid"
                      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Confirm Cancellation
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class BookingsComponent {
  bookings: Booking[] = [
    {
      id: '1',
      userId: 'user1',
      tripId: 'trip1',
      status: 'confirmed',
      bookingDate: '2024-02-20',
      numberOfTravelers: 2,
      totalPrice: 2598,
      specialRequests: 'Vegetarian meals'
    },
    {
      id: '2',
      userId: 'user1',
      tripId: 'trip2',
      status: 'completed',
      bookingDate: '2024-01-15',
      numberOfTravelers: 1,
      totalPrice: 1299,
    }
  ];

  statusFilter = 'all';
  sortBy = 'date-desc';
  showCancelDialog = false;
  selectedBooking?: Booking;
  cancelForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cancelForm = this.fb.group({
      reason: ['', Validators.required],
      otherReason: ['']
    });

    this.cancelForm.get('reason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.cancelForm.get('otherReason');
      if (value === 'other') {
        otherReasonControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        otherReasonControl?.clearValidators();
      }
      otherReasonControl?.updateValueAndValidity();
    });
  }

  get filteredBookings(): Booking[] {
    let filtered = [...this.bookings];
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === this.statusFilter);
    }

    switch (this.sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
    }

    return filtered;
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
    
  }

  openCancelDialog(booking: Booking) {
    this.selectedBooking = booking;
    this.showCancelDialog = true;
    this.cancelForm.reset();
  }

  confirmCancellation() {
    if (this.cancelForm.valid && this.selectedBooking) {
      console.log('Cancelling booking:', {
        bookingId: this.selectedBooking.id,
        ...this.cancelForm.value
      });
      // TODO: Implement actual cancellation logic
      this.showCancelDialog = false;
      this.selectedBooking = undefined;
    }
  }

  downloadItinerary(bookingId: string) {
    console.log('Downloading itinerary for booking:', bookingId);
    // TODO: Implement itinerary download logic
  }

  applyFilters() {
    // Filters are automatically applied through the filteredBookings getter
  }
}