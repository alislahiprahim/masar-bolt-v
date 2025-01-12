import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { Trip } from "../../../models/trip.model";
import { TripCardComponent } from "../../trip-card/trip-card.component";

@Component({
  selector: "app-popular-trips-section",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule,
    TranslateModule,
    TripCardComponent,
  ],
  template: `
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-header mb-4">
            {{ "home.popularTrips.title" | translate }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ "home.popularTrips.subtitle" | translate }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (trip of popularTrips; track trip.id) {
          <app-trip-card [trip]="trip" [rating]="4.8" />

          }
        </div>

        <div class="text-center mt-12">
          <a
            routerLink="/trips"
            class="btn-primary inline-flex items-center gap-2"
          >
            {{ "home.popularTrips.viewAll" | translate }}
            <fa-icon
              [icon]="faArrowRight"
              [classList]="'rtl:rotate-180'"
            ></fa-icon>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class PopularTripsSectionComponent {
  faArrowRight = faChevronRight;
  popularTrips: Trip[] = [
    {
      id: "1",
      title: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      price: 1299,
      duration: 7,
      startDate: "2024-06-01",
      endDate: "2024-06-07",
      description:
        "Experience the magic of Bali with this week-long adventure. Explore ancient temples, relax on pristine beaches, and immerse yourself in the local culture.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      included: [],
      itinerary: [],
    },
    // ... other trips
  ];
}
