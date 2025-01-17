import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faStar,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { TripsStateService } from "../../state/trips.state";

@Component({
  selector: "app-search-filter",
  imports: [FormsModule, FontAwesomeModule],
  template: `
    <div class="glass-container mb-12 p-6 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <input
            type="text"
            [ngModel]="state.filters().search"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search trips..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Destination Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Destination</label
          >
          <select
            [ngModel]="state.filters().destination"
            (ngModelChange)="onDestinationChange($event)"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Destinations</option>
            @for (destination of state.destinations(); track destination) {
            <option [value]="destination">{{ destination }}</option>
            }
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Price Range</label
          >
          <div class="flex items-center gap-2">
            <input
              type="number"
              [ngModel]="state.filters().minPrice"
              (ngModelChange)="onPriceChange('min', $event)"
              placeholder="Min"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span class="text-gray-500">-</span>
            <input
              type="number"
              [ngModel]="state.filters().maxPrice"
              (ngModelChange)="onPriceChange('max', $event)"
              placeholder="Max"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  protected state = inject(TripsStateService);
  loadTrips = output<void>();
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;

  searchTerm = "";
  selectedPriceRange = "";
  selectedDuration = "";

  protected onSearchChange(search: string) {
    this.state.updateFilters({ search });
    this.loadTrips.emit();
  }

  protected onDestinationChange(destination: string) {
    this.state.updateFilters({ destination });
    this.loadTrips.emit();
  }

  protected onPriceChange(type: "min" | "max", value: number) {
    this.state.updateFilters({
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    });
    this.loadTrips.emit();
  }
}
