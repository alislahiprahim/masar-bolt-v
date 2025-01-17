import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faStar,
  faSearch,
  faFilter,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Trip } from "../../models/trip.model";
import { TripCardComponent } from "../../components/trip-card/trip-card.component";
import { SearchFilterComponent } from "../../components/search-filter/search-filter.component";
import { CustomHeroSectionComponent } from "../../components/custom-hero-section/custom-hero-section.component";
import { TripsService } from "../../services/trips.service";
import { TripsStateService } from "../../state/trips.state";

@Component({
  selector: "app-trips",
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TripCardComponent,
    SearchFilterComponent,
    CustomHeroSectionComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Header -->
      <app-custom-hero-section
        [bannerImg]="
          'https://images.unsplash.com/photo-1488085061387-422e29b40080'
        "
        [title]="'Explore Our Trips'"
        [subTitle]="
          'Discover handcrafted journeys to the world\`s most extraordinary destinations'
        "
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Search and Filters -->
        <app-search-filter (loadTrips)="loadTrips()" />
        <!-- Trips Grid -->
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
          <button (click)="loadTrips()" class="mt-4 btn-primary">
            Try Again
          </button>
        </div>
        } @else if (state.trips().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-600">No trips found matching your criteria.</p>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (trip of state.trips(); track trip.id) {
          <app-trip-card [trip]="trip"></app-trip-card>
          }
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center gap-2">
          <button
            (click)="onPageChange(state.pagination().page - 1)"
            [disabled]="!state.hasPreviousPage()"
            class="btn-secondary"
            [class.opacity-50]="!state.hasPreviousPage()"
          >
            Previous
          </button>

          <span class="px-4 py-2 bg-white rounded-lg shadow">
            Page {{ state.pagination().page }} of {{ state.totalPages() }}
          </span>

          <button
            (click)="onPageChange(state.pagination().page + 1)"
            [disabled]="!state.hasNextPage()"
            class="btn-secondary"
            [class.opacity-50]="!state.hasNextPage()"
          >
            Next
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class TripsComponent implements OnInit {
  private tripsService = inject(TripsService);
  protected state = inject(TripsStateService);
  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;
  faSpinner = faSpinner;
  ngOnInit(): void {
    this.loadTrips();
  }
  protected loadTrips() {
    const { filters, pagination } = this.state;
    this.state.setLoading(true);

    this.tripsService
      .getTrips({
        ...filters(),
        ...pagination(),
      })
      .subscribe({
        next: ({ trips, total }) => {
          this.state.setTrips(trips, total);
          this.state.setLoading(false);
        },
        error: (error) => {
          this.state.setError(error.message);
        },
      });
  }

  protected onPageChange(page: number) {
    this.state.updatePagination({ page });
    this.loadTrips();
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
