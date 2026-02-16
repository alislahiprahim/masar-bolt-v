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

import { TravelerInfo } from '../../models/booking.model';
import { BookingCalculatorService } from '../../services/booking-calculator.service';

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
  templateUrl: './booking-form.component.html',
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
    private router: Router,
    private bookingCalculator: BookingCalculatorService
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
    const travelers = this.getTravelerControls().map(control => ({
      type: control.get('type')?.value,
      age: control.get('age')?.value,
    })) as TravelerInfo[];

    return this.bookingCalculator.calculateTripPrice(
      this.trip,
      travelers,
      this.bookingForm.value.tripHotelId
    );
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
