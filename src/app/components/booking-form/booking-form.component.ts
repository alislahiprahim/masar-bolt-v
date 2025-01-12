import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUsers, faCreditCard, faComments } from '@fortawesome/free-solid-svg-icons';
import { Trip } from '../../models/trip.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      @if (error) {
        <div class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {{ error }}
        </div>
      }

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Number of Travelers -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faUsers" class="mr-2"></fa-icon>
            Number of Travelers
          </label>
          <input type="number"
                 formControlName="numberOfTravelers"
                 min="1"
                 class="input-field"
                 (input)="updateTotalPrice()">
          @if (bookingForm.get('numberOfTravelers')?.errors?.['required'] && bookingForm.get('numberOfTravelers')?.touched) {
            <p class="mt-1 text-sm text-red-600">Number of travelers is required</p>
          }
        </div>

        <!-- Travel Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <fa-icon [icon]="faCalendar" class="mr-2"></fa-icon>
              Start Date
            </label>
            <input type="date"
                   formControlName="startDate"
                   class="input-field"
                   [min]="trip.startDate">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <fa-icon [icon]="faCalendar" class="mr-2"></fa-icon>
              End Date
            </label>
            <input type="date"
                   formControlName="endDate"
                   class="input-field"
                   [max]="trip.endDate">
          </div>
        </div>

        <!-- Special Requests -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faComments" class="mr-2"></fa-icon>
            Special Requests
          </label>
          <textarea formControlName="specialRequests"
                    rows="3"
                    class="input-field"
                    placeholder="Any dietary requirements, accessibility needs, or special preferences?"></textarea>
        </div>

        <!-- Payment Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            <fa-icon [icon]="faCreditCard" class="mr-2"></fa-icon>
            Payment Information
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input type="text"
                     formControlName="cardNumber"
                     class="input-field"
                     placeholder="1234 5678 9012 3456">
              @if (bookingForm.get('cardNumber')?.errors?.['required'] && bookingForm.get('cardNumber')?.touched) {
                <p class="mt-1 text-sm text-red-600">Card number is required</p>
              }
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input type="text"
                       formControlName="expiryDate"
                       class="input-field"
                       placeholder="MM/YY">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text"
                       formControlName="cvv"
                       class="input-field"
                       placeholder="123">
              </div>
            </div>
          </div>
        </div>

        <!-- Total Price -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-6">
            <span class="text-lg font-medium text-gray-900">Total Price:</span>
            <span class="text-2xl font-bold text-primary-600">{{ totalPrice | currency }}</span>
          </div>

          <button type="submit"
                  [disabled]="!bookingForm.valid || isSubmitting"
                  class="w-full btn-primary">
            {{ isSubmitting ? 'Processing...' : 'Confirm Booking' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) trip!: Trip;
  
  bookingForm: FormGroup;
  totalPrice = 0;
  isSubmitting = false;
  error: string | null = null;

  // Icons
  faCalendar = faCalendar;
  faUsers = faUsers;
  faCreditCard = faCreditCard;
  faComments = faComments;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      numberOfTravelers: [1, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      specialRequests: [''],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit() {
    this.updateTotalPrice();
    this.bookingForm.get('numberOfTravelers')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }

  updateTotalPrice() {
    const travelers = this.bookingForm.get('numberOfTravelers')?.value || 1;
    this.totalPrice = this.trip.price * travelers;
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      try {
        const booking = this.bookingService.createBooking({
          tripId: this.trip.id,
          numberOfTravelers: this.bookingForm.value.numberOfTravelers,
          totalPrice: this.totalPrice,
          specialRequests: this.bookingForm.value.specialRequests
        });

        // Navigate to booking confirmation page
        this.router.navigate(['/bookings', booking.id]);
      } catch (err) {
        this.error = 'An error occurred while processing your booking. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}