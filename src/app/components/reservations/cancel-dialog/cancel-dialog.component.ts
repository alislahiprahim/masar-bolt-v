import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, TranslateModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          (click)="onClose.emit()"></div>

        <!-- Dialog -->
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <!-- Header -->
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ 'reservations.cancel.title' | translate }}
                </h3>
                <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-500">
                  <fa-icon [icon]="faTimes"></fa-icon>
                </button>
              </div>

              <!-- Form -->
              <form [formGroup]="cancelForm" (ngSubmit)="handleSubmit()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    {{ 'reservations.cancel.reason' | translate }}
                  </label>
                  <textarea
                    formControlName="reason"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    [placeholder]="'reservations.cancel.reasonPlaceholder' | translate"></textarea>
                  @if (
                    cancelForm.get('reason')?.errors?.['required'] &&
                    cancelForm.get('reason')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600">
                      {{ 'reservations.cancel.errors.reasonRequired' | translate }}
                    </p>
                  }
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                (click)="handleSubmit()"
                [disabled]="!cancelForm.valid"
                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                {{ 'reservations.cancel.confirm' | translate }}
              </button>
              <button
                type="button"
                (click)="onClose.emit()"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                {{ 'common.cancel' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CancelDialogComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<string>();
  isOpen = input(false);
  cancelForm: FormGroup;
  faTimes = faTimes;

  constructor(private fb: FormBuilder) {
    this.cancelForm = this.fb.group({
      reason: ['', Validators.required],
    });
  }

  handleSubmit() {
    if (this.cancelForm.valid) {
      this.onConfirm.emit(this.cancelForm.get('reason')?.value);
    }
  }
}
