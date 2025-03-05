import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { TripCardComponent } from "../../trip-card/trip-card.component";
import { TripsService } from "../../../services/trips.service";
import { TripsStateService } from "../../../state/trips.state";

@Component({
  selector: "app-popular-trips-section",
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

        @if (state.loading()) {
        <div class="flex justify-center items-center py-12">
          <fa-icon
            [icon]="faSpinner"
            class="text-4xl text-primary-600 animate-spin"
          ></fa-icon>
        </div>
        } @else if (state.error()) {
        <div class="text-center py-12">
          <p class="text-red-600">{{ state.error() }}</p>
          <button (click)="loadPopularTrips()" class="mt-4 btn-primary">
            Try Again
          </button>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (trip of state.popularTrips(); track trip.id) {
          <app-trip-card [trip]="trip"></app-trip-card>
          }
        </div>

        <div class="text-center mt-12">
          <a routerLink="/trips" class="btn-primary inline-flex items-center">
            {{ "home.popularTrips.viewAll" | translate }}
            <fa-icon [icon]="faChevronLeft" class="mx-2"></fa-icon>
          </a>
        </div>
        }
      </div>
    </section>
  `,
})
export class PopularTripsSectionComponent {
  private tripsService = inject(TripsService);
  protected state = inject(TripsStateService);

  // Icons
  protected faSpinner = faSpinner;
  protected faChevronLeft = faChevronLeft;
  ngOnInit() {
    this.loadPopularTrips();
  }

  protected loadPopularTrips() {
    this.state.setLoading(true);

    this.tripsService.getPopularTrips().subscribe({
      next: (trips) => {
        this.state.setPopularTrips(trips);
        this.state.setLoading(false);
      },
      error: (error) => {
        this.state.setError(error.message);
      },
    });
  }
}
