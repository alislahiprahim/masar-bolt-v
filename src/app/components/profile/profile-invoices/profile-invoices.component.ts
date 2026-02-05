import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-invoices',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div class="space-y-6">
      @for (invoice of invoices; track invoice.id) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ 'profile.invoices.invoice' | translate }} #{{ invoice.id }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ invoice.bookingDate | date }}
                </p>
              </div>
              <span class="text-2xl font-bold text-primary-600">
                {{ invoice.totalPrice | currency }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <div class="space-y-1">
                <p class="text-sm text-gray-600">
                  {{ 'profile.invoices.travelers' | translate }}:
                  {{ invoice.numberOfTravelers }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ 'profile.invoices.status' | translate }}:
                  <span
                    [class]="
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' +
                      (invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800')
                    ">
                    {{ 'profile.invoices.statuses.' + invoice.status | translate }}
                  </span>
                </p>
              </div>

              <div class="flex space-x-2 rtl:space-x-reverse">
                <button class="btn-secondary flex items-center">
                  <fa-icon [icon]="faEye" class="mx-2"></fa-icon>
                  {{ 'profile.invoices.view' | translate }}
                </button>
                <button class="btn-primary flex items-center">
                  <fa-icon [icon]="faDownload" class="mx-2"></fa-icon>
                  {{ 'profile.invoices.download' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      @if (invoices.length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500">{{ 'profile.invoices.empty' | translate }}</p>
        </div>
      }
    </div>
  `,
})
export class ProfileInvoicesComponent {
  @Input() invoices: any[] = [];

  faDownload = faDownload;
  faEye = faEye;
}
