import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { Trip } from "../../models/trip.model";

@Component({
    selector: "app-trip-card",
    imports: [CommonModule, RouterLink, FontAwesomeModule, TranslateModule],
    template: `
    <a [routerLink]="['/trips', trip.id]" class="group">
      <div class="card overflow-hidden">
        <!-- Image -->
        <div class="relative h-64 overflow-hidden">
          <img
            loading="lazy"
            [src]="trip.imageUrl"
            [alt]="trip.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          >
            <div class="absolute bottom-4 left-4 rtl:right-4">
              <div class="flex items-center text-white">
                <fa-icon
                  [icon]="faMapMarkerAlt"
                  class="ltr:mr-2 rtl:ml-2"
                ></fa-icon>
                {{ trip.destination }}
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3
            class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
          >
            {{ trip.title }}
          </h3>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center text-gray-600">
              <fa-icon [icon]="faClock" class="ltr:mr-2 rtl:ml-2"></fa-icon>
              {{ trip.duration }} {{ "common.days" | translate }}
            </div>
            <div class="flex items-center text-primary-600">
              <fa-icon [icon]="faStar" class="ltr:mr-1 rtl:ml-1"></fa-icon>
              {{ rating }}
            </div>
          </div>

          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ trip.description }}
          </p>

          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-primary-600">
              {{ trip.price | currency }}
            </span>
            <span class="text-sm text-gray-500">{{
              "common.perPerson" | translate
            }}</span>
          </div>
        </div>
      </div>
    </a>
  `
})
export class TripCardComponent {
  @Input({ required: true }) trip!: Trip;
  @Input() rating: number = 4.8;

  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
}
