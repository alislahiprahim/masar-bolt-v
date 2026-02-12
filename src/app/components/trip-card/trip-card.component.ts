import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Trip } from '../../models/trip.model';
import { ImgUrlPipe } from '../../pipes/imgUrl.pipe';
import { SafeHTMLPipe } from '../../pipes/safeHTML.pipe';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, RouterLink, FontAwesomeModule, TranslateModule, ImgUrlPipe, SafeHTMLPipe],
  template: `
    <a [routerLink]="['/trips', trip.id]" class="group">
      <div class="card overflow-hidden">
        <!-- Image -->
        <div class="relative h-64 overflow-hidden">
          <img
            loading="lazy"
            [src]="trip.tripPhotos[0] | imgUrl"
            onerror="this.src='assets/full-logo.png'"
            [alt]="trip.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div class="absolute bottom-4 left-4 rtl:right-4">
              <div class="flex items-center text-white justify-between">
              <!-- Tags -->
              
              <div class="flex items-center text-white">
                <fa-icon [icon]="faMapMarkerAlt" class="ltr:mr-2 rtl:ml-2"></fa-icon>
                {{ trip.city.name }}
              </div>
              <div class="flex flex-wrap gap-2 mt-3" *ngIf="trip.tags?.length">
                <span
                  *ngFor="let tag of trip.tags"
                  (click)="$event.preventDefault(); $event.stopPropagation(); router.navigate(['/trips'], { queryParams: { tag: tag } })"
                  class="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full cursor-pointer hover:bg-primary-100 transition-colors"
                >
                  #{{ tag }}
                </span>
              </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3
            class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {{ trip.name }}
          </h3>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center text-gray-600">
              <fa-icon [icon]="faClock" class="ltr:mr-2 rtl:ml-2"></fa-icon>
              {{ trip.days }} {{ 'common.days' | translate }}
            </div>
            <div class="flex items-center text-primary-600">
              <fa-icon [icon]="faStar" class="ltr:mr-1 rtl:ml-1"></fa-icon>
              {{ rating }}
            </div>
          </div>

          <p class="text-gray-600 mb-2 line-clamp-2" [innerHTML]="trip.description | safeHTML"></p>


          <div class="flex justify-between items-center mt-4">
            <span class="text-2xl font-bold text-primary-600">
              {{ trip.price | currency: ' ج.م' }}
            </span>
            <span class="text-sm text-gray-500">{{ 'common.perPerson' | translate }}</span>
          </div>
        </div>
      </div>
    </a>
  `,
})
export class TripCardComponent {
  protected router = inject(Router);
  @Input({ required: true }) trip!: Trip;
  @Input() rating: number = 4.8;

  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
}
