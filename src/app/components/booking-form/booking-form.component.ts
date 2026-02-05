import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faComments,
  faPhone,
  faIdCard,
  faLock,
  faCheckCircle,
  faMobileAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Trip } from '../../models/trip.model';
import { DialogService } from '../../services/dialog.service';
import { AuthService } from '../../services/auth.service';
import { ImageFile, ImagePickerComponent } from '../image-picker/image-picker.component';
import { AuthStateService } from '../../state/auth.state';
import { ReservationService } from '../../services/reservation.service';

interface TravelerInfo {
  type: 'adult' | 'childUnder12' | 'childUnder6';
  age?: number;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslatePipe,
    ImagePickerComponent,
    RouterLink,
  ],
  template: `
    @if (reservationService.getBookingStatus(trip.id) !== 'CANCELLED') {
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="text-center">
          <div
            class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <fa-icon [icon]="faCheckCircle" class="text-2xl text-green-600"></fa-icon>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ 'booking.success.title' | translate }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ 'booking.success.message' | translate }}
          </p>

          <!-- Next Steps -->
          <div class="text-start bg-gray-50 rounded-lg p-4 mb-6">
            <h4 class="font-medium text-gray-900 mb-3">
              {{ 'booking.success.nextSteps' | translate }}
            </h4>
            <ul class="space-y-2">
              @for (step of 'booking.success.steps' | translate; track step) {
                <li class="flex items-start">
                  <span class="w-2 h-2 mt-2 bg-primary-500 rounded-full mx-2"></span>
                  <span class="text-sm text-gray-600">{{ step }}</span>
                </li>
              }
            </ul>
          </div>
          <a
            routerLink="/profile/reservations"
            class="btn-primary inline-block w-full cursor-pointer">
            {{ 'booking.success.viewDetails' | translate }}
          </a>
        </div>
      </div>
    } @else {
      <!-- Important Information -->
      <div class="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">
          {{ 'booking.hints.title' | translate }}
        </h3>

        <!-- Required Documents -->
        <div class="mb-4">
          <h4 class="font-medium text-blue-800 mb-2">
            {{ 'booking.hints.documents' | translate }}
          </h4>
          <ul class="space-y-1 text-sm text-blue-700">
            <li>• {{ 'booking.hints.adult' | translate }}</li>
            <li>• {{ 'booking.hints.child' | translate }}</li>
          </ul>
          <p class="text-sm text-blue-600 mt-2 italic">
            {{ 'booking.hints.note' | translate }}
          </p>
        </div>

        <!-- Booking Process -->
        <div>
          <h4 class="font-medium text-blue-800 mb-2">
            {{ 'booking.hints.process' | translate }}
          </h4>
          <ul class="space-y-1">
            @for (step of 'booking.hints.steps' | translate; track step) {
              <li class="flex items-start text-sm text-blue-700">
                <span class="w-2 h-2 mt-2 bg-blue-400 rounded-full mr-2"></span>
                {{ step }}
              </li>
            }
          </ul>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- WhatsApp Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <fa-icon [icon]="faPhone" class="mr-2"></fa-icon>
              {{ 'booking.whatsapp' | translate }}
            </label>
            <input
              type="tel"
              formControlName="whatsappNumber"
              [attr.disabled]="!!userState.user()"
              class="input-field text-end"
              [placeholder]="'booking.whatsappPlaceholder' | translate" />
            @if (
              bookingForm.get('whatsappNumber')?.errors?.['required'] &&
              bookingForm.get('whatsappNumber')?.touched
            ) {
              <p class="mt-1 text-sm text-red-600">
                {{ 'booking.errors.whatsappRequired' | translate }}
              </p>
            }
            @if (
              bookingForm.get('whatsappNumber')?.errors?.['pattern'] &&
              bookingForm.get('whatsappNumber')?.touched
            ) {
              <p class="mt-1 text-sm text-red-600">
                {{ 'booking.errors.whatsappInvalid' | translate }}
              </p>
            }
          </div>

          @if (authService.isAuthenticated()) {
            <!-- Travelers Information -->
            <div formArrayName="travelers" class="space-y-4">
              <h4 class="font-medium text-gray-900">
                {{ 'booking.travelers' | translate }}
              </h4>

              @for (traveler of getTravelerControls(); let i = $index; track i) {
                <div
                  [formGroupName]="i"
                  class="relative grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <!-- Remove Traveler Button -->
                  @if (i > 0) {
                    <button
                      type="button"
                      (click)="removeTraveler(i)"
                      class="absolute top-2 ltr:right-2 rtl:left-2 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                      [title]="'booking.removeTraveler' | translate">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  }

                  <!-- Traveler Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      {{ 'booking.travelerTypes.type' | translate }}
                    </label>
                    <select
                      formControlName="type"
                      class="mt-1 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500">
                      <option value="adult">
                        {{ 'booking.travelerTypes.adult' | translate }}
                      </option>
                      <option value="childUnder12">
                        {{ 'booking.travelerTypes.childUnder12' | translate }}
                      </option>
                      <option value="childUnder6">
                        {{ 'booking.travelerTypes.childUnder6' | translate }}
                      </option>
                    </select>
                  </div>

                  <!-- Age (for children) -->
                  @if (traveler.get('type')?.value !== 'adult') {
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        {{ 'booking.travelerTypes.age' | translate }}
                      </label>
                      <input
                        type="number"
                        formControlName="age"
                        min="0"
                        max="17"
                        class="mt-1 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                      @if (
                        traveler.get('age')?.errors?.['required'] && traveler.get('age')?.touched
                      ) {
                        <p class="mt-1 text-sm text-red-600">
                          {{ 'booking.travelerTypes.ageRequired' | translate }}
                        </p>
                      }
                    </div>
                  }
                </div>
              }

              <button type="button" (click)="addTraveler()" class="btn-secondary w-full">
                {{ 'booking.addTraveler' | translate }}
              </button>
            </div>

            <!-- National ID Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <fa-icon [icon]="faIdCard" class="mr-2"></fa-icon>
                {{ 'booking.nationalId' | translate }}
              </label>

              <app-image-picker
                [minLength]="requiredDocumentsCount"
                [label]="'booking.uploadId' | translate"
                [errorMessage]="'booking.errors.nationalIdRequired' | translate"
                [showError]="showNationalIdError"
                formControlName="documents"></app-image-picker>
            </div>

            <!-- Trip hotels -->
            <!-- Trip hotels -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ 'booking.Hotel' | translate }}
              </label>
              <select
                formControlName="tripHotelId"
                class="mt-1 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500">
                <option value="" selected>{{ 'booking.selectHotel' | translate }}</option>
                @for (hotel of trip.TripHotel; track hotel.id) {
                  <option [value]="hotel.id">
                    {{ hotel.hotel.name }} - {{ hotel.costPerPerson | currency: ' ج.م' }}
                  </option>
                }
              </select>
            </div>
            <!-- Special Requests -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <fa-icon [icon]="faComments" class="mr-2"></fa-icon>
                {{ 'booking.specialRequests' | translate }}
              </label>
              <textarea
                formControlName="specialRequests"
                rows="3"
                class="input-field"
                [placeholder]="'booking.specialRequestsPlaceholder' | translate"></textarea>
            </div>

            <!-- Pricing Information -->
            <div class="mb-8 bg-primary-50 rounded-lg p-4">
              <h4 class="font-semibold text-primary-900 mb-2">
                {{ 'booking.pricing.title' | translate }}
              </h4>
              <div class="space-y-2 text-sm text-primary-800">
                <p class="font-medium">
                  {{ 'booking.pricing.childPolicy' | translate }}
                </p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>{{ 'booking.pricing.firstChild' | translate }}</li>
                  <li>{{ 'booking.pricing.secondChild' | translate }}</li>
                  <li>{{ 'booking.pricing.otherChildren' | translate }}</li>
                </ul>
                <p class="text-xs italic mt-2">
                  {{ 'booking.pricing.note' | translate }}
                </p>
              </div>
            </div>
            <!-- Total Price -->
            <div class="border-t pt-4">
              <div class="flex justify-between items-center text-lg">
                <span class="font-medium">{{ 'booking.totalPrice' | translate }}</span>
                <span class="font-bold text-primary-600">
                  {{ calculateTotalPrice() | currency }}
                </span>
              </div>
            </div>
          } @else {
            <!-- Auth Required Message -->
            <div class="border rounded-lg p-4 bg-gray-50">
              <div class="flex items-center gap-3">
                <fa-icon [icon]="faLock" class="text-gray-400"></fa-icon>
                <div>
                  <p class="text-sm text-gray-600">
                    {{ 'booking.authRequired' | translate }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ 'booking.authRequiredHint' | translate }}
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="!isFormValid() || isSubmitting"
            class="w-full btn-primary flex justify-center items-center disabled:opacity-50"
            [ngClass]="{
              'pointer-events-none': !isFormValid() || isSubmitting,
            }">
            @if (isSubmitting) {
              <span class="loading-spinner mr-2"></span>
              {{ 'common.processing' | translate }}
            } @else {
              {{
                authService.isAuthenticated()
                  ? ('booking.confirmBooking' | translate)
                  : ('booking.requestBooking' | translate)
              }}
            }
          </button>
        </form>
      </div>
    }
  `,
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) trip!: Trip;

  userState = inject(AuthStateService);

  bookingForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  showNationalIdError = false;

  // Icons
  protected faUsers = faUsers;
  protected faComments = faComments;
  protected faPhone = faMobileAlt;
  protected faIdCard = faIdCard;
  protected faLock = faLock;
  protected faCheckCircle = faCheckCircle;
  protected faTrash = faTrash;
  constructor(
    private fb: FormBuilder,
    public reservationService: ReservationService,
    public authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      whatsappNumber: [
        {
          value: this.userState.user()?.phoneNumber || '',
          disabled: !!this.userState.user(),
        },
        [Validators.required, Validators.pattern('^0(10|11|12|15)[0-9]{8}$')],
      ],
      travelers: this.fb.array([this.createTravelerGroup()]),
      documents: [[]],
      specialRequests: [''],
      tripHotelId: this.trip?.TripHotel?.length ? ['', Validators.required] : [''],
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAuthenticated()) {
        this.bookingForm
          .get('documents')
          ?.setValidators([Validators.required, Validators.minLength(this.requiredDocumentsCount)]);
      }
    }
  }

  isFormValid(): boolean {
    if (!this.authService.isAuthenticated()) {
      return this.bookingForm.get('whatsappNumber')?.valid || false;
    }

    return (
      this.bookingForm.valid &&
      this.bookingForm.get('documents')?.value?.length === this.getTravelerControls().length
    );
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      if (
        this.authService.isAuthenticated() &&
        this.bookingForm.get('documents')?.value?.length !== this.getTravelerControls().length
      ) {
        this.showNationalIdError = true;
      }
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.showNationalIdError = false;

    try {
      if (this.authService.isAuthenticated()) {
        await this.handleAuthenticatedBooking();
      } else {
        await this.handleUnauthenticatedBooking();
      }
    } catch (err) {
      this.dialogService.error('booking.errors.generic');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleAuthenticatedBooking() {
    const formData = new FormData();
    formData.append('tripId', this.trip.id);
    formData.append('whatsappNumber', this.bookingForm.getRawValue().whatsappNumber);
    formData.append('travelers', JSON.stringify(this.bookingForm.value.travelers));
    formData.append('specialRequests', this.bookingForm.value.specialRequests || '');
    formData.append('totalPrice', this.calculateTotalPrice().toString());
    if (this.bookingForm.value.tripHotelId) {
      formData.append('tripHotelId', this.bookingForm.value.tripHotelId);
    }
    this.bookingForm.value.documents.forEach((img: ImageFile, index: number) => {
      formData.append(`documents`, img.file);
    });

    this.reservationService.createReservation(formData).subscribe(isSuccess => {
      if (isSuccess) {
        this.router.navigate(['/profile/reservations']);
      }
    });
  }

  private async handleUnauthenticatedBooking() {
    const { whatsappNumber } = this.bookingForm.value;

    this.authService.checkPhoneNumber(whatsappNumber).subscribe(isRegistered => {
      if (isRegistered) {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate(['/auth/register']);
      }
    });
  }

  createTravelerGroup() {
    return this.fb.group({
      type: ['adult'],
      age: [null],
    });
  }

  getTravelerControls() {
    return (this.bookingForm.get('travelers') as FormArray).controls;
  }

  addTraveler() {
    const travelers = this.bookingForm.get('travelers') as FormArray;
    travelers.push(this.createTravelerGroup());

    // Update documents validator
    this.bookingForm
      .get('documents')
      ?.setValidators([Validators.required, Validators.minLength(travelers.length)]);
  }

  calculateTotalPrice(): number {
    const basePrice = this.bookingForm.value.tripHotelId
      ? this.trip.TripHotel?.find(hotel => hotel.id === this.bookingForm.value.tripHotelId)
          ?.costPerPerson || this.trip.price
      : this.trip.price;
    let totalPrice = 0;
    let childrenUnder12 = 0;
    let childrenUnder6 = 0;

    this.getTravelerControls().forEach(control => {
      const type = control.get('type')?.value;

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

  get requiredDocumentsCount() {
    return this.getTravelerControls().length;
  }
  removeTraveler(index: number) {
    if (index === 0) return; // Don't remove the first traveler
    const travelers = this.bookingForm.get('travelers') as FormArray;
    travelers.removeAt(index);

    // Update documents validator
    this.bookingForm
      .get('documents')
      ?.setValidators([Validators.required, Validators.minLength(travelers.length)]);
    this.bookingForm.get('documents')?.updateValueAndValidity();
  }
}
