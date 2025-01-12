import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faComments,
  faPhone,
  faIdCard,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Trip } from "../../models/trip.model";
import { BookingService } from "../../services/booking.service";

@Component({
  selector: "app-booking-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      @if (error) {
      <div
        class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative"
      >
        {{ error }}
      </div>
      }

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- WhatsApp Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faPhone" class="mx-2 rtl:rotate-180"></fa-icon>
            WhatsApp Number
          </label>
          <div class="flex">
            <span
              class="inline-flex items-center px-3 rtl:rounded-r-md ltr:rounded-l-md border ltr:border-r-0 rtl:border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
            >
              +20
            </span>
            <input
              type="tel"
              formControlName="whatsappNumber"
              class="input-field ltr:rounded-l-none rtl:rounded-r-none"
              placeholder="1234567890"
            />
          </div>
          @if (bookingForm.get('whatsappNumber')?.errors?.['required'] &&
          bookingForm.get('whatsappNumber')?.touched) {
          <p class="mt-1 text-sm text-red-600">WhatsApp number is required</p>
          } @if (bookingForm.get('whatsappNumber')?.errors?.['pattern']) {
          <p class="mt-1 text-sm text-red-600">
            Please enter a valid Egyptian phone number
          </p>
          }
        </div>

        <!-- National ID Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faIdCard" class="mx-2"></fa-icon>
            National ID Image
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <div class="space-y-1 text-center">
              @if (!nationalIdPreview) {
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="national-id-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="national-id-upload"
                    type="file"
                    class="sr-only"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              } @else {
              <div class="relative">
                <img
                  [src]="nationalIdPreview"
                  alt="National ID Preview"
                  class="max-h-48 rounded"
                />
                <button
                  type="button"
                  (click)="removeImage()"
                  class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <fa-icon [icon]="faTimes"></fa-icon>
                </button>
              </div>
              }
            </div>
          </div>
          @if (bookingForm.get('nationalIdImage')?.errors?.['required'] &&
          bookingForm.get('nationalIdImage')?.touched) {
          <p class="mt-1 text-sm text-red-600">National ID image is required</p>
          }
        </div>

        <!-- Number of Travelers -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faUsers" class="mx-2"></fa-icon>
            Number of Travelers
          </label>
          <input
            type="number"
            formControlName="numberOfTravelers"
            min="1"
            class="input-field"
            (input)="updateTotalPrice()"
          />
          @if (bookingForm.get('numberOfTravelers')?.errors?.['required'] &&
          bookingForm.get('numberOfTravelers')?.touched) {
          <p class="mt-1 text-sm text-red-600">
            Number of travelers is required
          </p>
          }
        </div>

        <!-- Special Requests -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <fa-icon [icon]="faComments" class="mx-2"></fa-icon>
            Special Requests
          </label>
          <textarea
            formControlName="specialRequests"
            rows="3"
            class="input-field"
            placeholder="Any dietary requirements, accessibility needs, or special preferences?"
          ></textarea>
        </div>

        <!-- Total Price -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-6">
            <span class="text-lg font-medium text-gray-900">Total Price:</span>
            <span class="text-2xl font-bold text-primary-600">{{
              totalPrice | currency
            }}</span>
          </div>

          <button
            type="submit"
            [disabled]="!bookingForm.valid || isSubmitting"
            class="w-full btn-primary"
          >
            {{ isSubmitting ? "Processing..." : "Confirm Booking" }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) trip!: Trip;

  bookingForm: FormGroup;
  totalPrice = 0;
  isSubmitting = false;
  error: string | null = null;
  nationalIdPreview: string | null = null;

  // Icons
  faUsers = faUsers;
  faComments = faComments;
  faPhone = faPhone;
  faIdCard = faIdCard;
  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      whatsappNumber: [
        "",
        [Validators.required, Validators.pattern("^(10|11|12|15)[0-9]{8}$")],
      ],
      nationalIdImage: [null, Validators.required],
      numberOfTravelers: [1, [Validators.required, Validators.min(1)]],
      specialRequests: [""],
    });
  }

  ngOnInit() {
    this.updateTotalPrice();
    this.bookingForm.get("numberOfTravelers")?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }

  updateTotalPrice() {
    const travelers = this.bookingForm.get("numberOfTravelers")?.value || 1;
    this.totalPrice = this.trip.price * travelers;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.error = "File size should not exceed 10MB";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.nationalIdPreview = reader.result as string;
        this.bookingForm.patchValue({ nationalIdImage: file });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.nationalIdPreview = null;
    this.bookingForm.patchValue({ nationalIdImage: null });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append("tripId", this.trip.id);
        formData.append(
          "whatsappNumber",
          this.bookingForm.value.whatsappNumber
        );
        formData.append(
          "nationalIdImage",
          this.bookingForm.value.nationalIdImage
        );
        formData.append(
          "numberOfTravelers",
          this.bookingForm.value.numberOfTravelers
        );
        formData.append(
          "specialRequests",
          this.bookingForm.value.specialRequests || ""
        );
        formData.append("totalPrice", this.totalPrice.toString());

        const booking = this.bookingService.createBooking(formData);
        this.router.navigate(["/bookings", booking.id]);
      } catch (err) {
        this.error =
          "An error occurred while processing your booking. Please try again.";
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}