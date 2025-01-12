import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faStar,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-search-filter",
    imports: [FormsModule, FontAwesomeModule],
    template: `<div class="glass-container mb-8 p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search -->
      <div class="relative">
        <fa-icon
          [icon]="faSearch"
          class="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-primary-600"
        ></fa-icon>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterTrips()"
          placeholder="Search destinations..."
          class="input-field pl-10"
        />
      </div>

      <!-- Price Range -->
      <div>
        <select
          [(ngModel)]="selectedPriceRange"
          (ngModelChange)="filterTrips()"
          class="input-field"
        >
          <option value="">All Price Ranges</option>
          <option value="0-1000">Under $1,000</option>
          <option value="1000-2000">$1,000 - $2,000</option>
          <option value="2000+">Over $2,000</option>
        </select>
      </div>

      <!-- Duration -->
      <div>
        <select
          [(ngModel)]="selectedDuration"
          (ngModelChange)="filterTrips()"
          class="input-field"
        >
          <option value="">All Durations</option>
          <option value="1-3">1-3 Days</option>
          <option value="4-7">4-7 Days</option>
          <option value="8+">8+ Days</option>
        </select>
      </div>
    </div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFilterComponent {
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;

  searchTerm = "";
  selectedPriceRange = "";
  selectedDuration = "";

  filterTrips() {}
}
