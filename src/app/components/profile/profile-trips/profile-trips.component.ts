import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-trips',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div class="space-y-6">
      @for (booking of bookings; track booking.id) {
        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="space-y-6">
            @for (booking of bookings; track booking.id) {
              <div
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="p-6">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        {{ booking.tripName }}
                      </h3>
                      <p class="text-gray-600">{{ booking.date | date }}</p>
                    </div>
                    <span
                      [class]="
                        'px-3 py-1 rounded-full text-sm font-medium ' +
                        (booking.status === 'upcoming'
                          ? 'bg-primary-100 text-primary-800'
                          : booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800')
                      ">
                      {{ 'profile.trips.status.' + booking.status | translate }}
                    </span>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                      <button class="text-primary-600 hover:text-primary-700 font-medium">
                        {{ 'profile.trips.viewDetails' | translate }}
                      </button>
                      <button
                        class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                        <fa-icon [icon]="faDownload" class="mx-2"></fa-icon>
                        {{ 'profile.trips.download' | translate }}
                      </button>
                    </div>
                    <span class="text-lg font-semibold text-primary-600">
                      {{ booking.amount | currency }}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ProfileTripsComponent {
  @Input() bookings: any[] = [];
  faDownload = faDownload;
}
