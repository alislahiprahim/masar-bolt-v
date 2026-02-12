import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMapMarkerAlt,
  faClock,
  faStar,
  faSearch,
  faFilter,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Trip } from '../../models/trip.model';
import { TripCardComponent } from '../../components/trip-card/trip-card.component';
import { SearchFilterComponent } from '../../components/search-filter/search-filter.component';
import { CustomHeroSectionComponent } from '../../components/custom-hero-section/custom-hero-section.component';
import { TripsService } from '../../services/trips.service';
import { TripsStateService } from '../../state/trips.state';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-trips',
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TripCardComponent,
    SearchFilterComponent,
    CustomHeroSectionComponent,
    TranslatePipe,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Header -->
      <app-custom-hero-section
        [bannerImg]="'https://images.unsplash.com/photo-1488085061387-422e29b40080'"
        [title]="'Explore Our Trips' | translate"
        [subTitle]="
          'Discover handcrafted journeys to the world\`s most extraordinary destinations'
            | translate
        " />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Search and Filters -->
        <app-search-filter (loadTrips)="tripsService.loadTrips()" />
        <!-- Trips Grid -->
        @if (state.loading()) {
          <div class="flex justify-center items-center py-12">
            <fa-icon [icon]="faSpinner" class="text-4xl text-primary-600 animate-spin"></fa-icon>
          </div>
        } @else if (state.error()) {
          <div class="text-center py-12">
            <p class="text-red-600">{{ state.error() }}</p>
            <button (click)="tripsService.loadTrips()" class="mt-4 btn-primary">
              {{ 'common.try_again' | translate }}
            </button>
          </div>
        } @else if (state.trips().length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-600">{{ 'common.no_trips_found' | translate }}</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (trip of state.trips(); track trip.id) {
              <app-trip-card [trip]="trip"></app-trip-card>
            }
          </div>

          <!-- Show More Button -->
          <div class="mt-12 flex justify-center">
            <button *ngIf="state.hasNextPage()" (click)="onShowMore()" class="btn-secondary">
              {{ 'common.show_more' | translate }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class TripsComponent implements OnInit {
  protected tripsService = inject(TripsService);
  protected route = inject(ActivatedRoute);
  protected state = inject(TripsStateService);
  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;
  faSpinner = faSpinner;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tag = params['tag'] || undefined;
      this.state.updateFilters({ ...this.state.filters(), tag });
      this.tripsService.loadTrips();
    });
  }

  protected onShowMore() {
    const nextPage = this.state.pagination().page + 1;
    this.state.updatePagination({ page: nextPage });
    this.tripsService.loadTrips();
    // Optionally scroll to the new items
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
