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
  templateUrl: './trips.component.html',
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
