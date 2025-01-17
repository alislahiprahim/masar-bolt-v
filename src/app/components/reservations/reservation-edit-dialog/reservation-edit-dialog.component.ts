import { Component, EventEmitter, input, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  Reservation,
  ReservationUpdate,
} from "../../../models/reservation.model";

@Component({
  selector: "app-reservation-edit-dialog",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `
    @if(isOpen()){
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        (click)="onClose.emit()"
      ></div>

      <!-- Dialog -->
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <!-- Header -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ "reservations.edit.title" | translate }}
              </h3>
              <button
                (click)="onClose.emit()"
                class="text-gray-400 hover:text-gray-500"
              >
                <fa-icon [icon]="faTimes"></fa-icon>
              </button>
            </div>

            <!-- Form -->
            <form
              [formGroup]="editForm"
              (ngSubmit)="handleSubmit()"
              class="space-y-4"
            >
              <!-- Number of Travelers -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ "reservations.edit.travelers" | translate }}
                </label>
                <input
                  type="number"
                  formControlName="numberOfTravelers"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="1"
                />
                @if (editForm.get('numberOfTravelers')?.errors?.['required'] &&
                editForm.get('numberOfTravelers')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  {{ "reservations.edit.errors.travelersRequired" | translate }}
                </p>
                } @if (editForm.get('numberOfTravelers')?.errors?.['min'] &&
                editForm.get('numberOfTravelers')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  {{ "reservations.edit.errors.travelersMin" | translate }}
                </p>
                }
              </div>

              <!-- WhatsApp Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ "reservations.edit.whatsapp" | translate }}
                </label>
                <input
                  type="tel"
                  formControlName="whatsappNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                @if (editForm.get('whatsappNumber')?.errors?.['required'] &&
                editForm.get('whatsappNumber')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  {{ "reservations.edit.errors.whatsappRequired" | translate }}
                </p>
                } @if (editForm.get('whatsappNumber')?.errors?.['pattern'] &&
                editForm.get('whatsappNumber')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  {{ "reservations.edit.errors.whatsappInvalid" | translate }}
                </p>
                }
              </div>

              <!-- Special Requests -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ "reservations.edit.specialRequests" | translate }}
                </label>
                <textarea
                  formControlName="specialRequests"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                ></textarea>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              (click)="handleSubmit()"
              [disabled]="!editForm.valid"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
            >
              {{ "common.save" | translate }}
            </button>
            <button
              type="button"
              (click)="onClose.emit()"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              {{ "common.cancel" | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class ReservationEditDialogComponent {
  isOpen = input(false);
  @Input({ required: true }) reservation!: Reservation | null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<ReservationUpdate>();

  editForm: FormGroup;
  faTimes = faTimes;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      numberOfTravelers: ["", [Validators.required, Validators.min(1)]],
      whatsappNumber: [
        "",
        [Validators.required, Validators.pattern("^(10|11|12|15)[0-9]{8}$")],
      ],
      specialRequests: [""],
    });
  }

  ngOnInit() {
    this.editForm.patchValue({
      numberOfTravelers: this.reservation?.numberOfTravelers,
      whatsappNumber: this.reservation?.whatsappNumber,
      specialRequests: this.reservation?.specialRequests,
    });
  }

  handleSubmit() {
    if (this.editForm.valid) {
      this.onSave.emit(this.editForm.value);
    }
  }
}
