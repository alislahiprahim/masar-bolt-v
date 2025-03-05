import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { Location } from "@angular/common";
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
import { TranslatePipe } from "@ngx-translate/core";
import { CityStateService } from "../../state/city.state";
import { CitiesService } from "../../services/cities.service";
import { debounceTime, Subject } from "rxjs";

@Component({
  selector: "app-search-filter",
  imports: [FormsModule, FontAwesomeModule, TranslatePipe],
  template: `
    <div class="glass-container mb-12 p-6 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            "search_filter.search" | translate
          }}</label>
          <input
            type="text"
            [ngModel]="state.filters().search"
            (ngModelChange)="onSearchChange($event)"
            placeholder="{{ 'search_filter.search_placeholder' | translate }}"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Destination Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            "search_filter.destination" | translate
          }}</label>
          <select
            [ngModel]="state.filters().cityId"
            (ngModelChange)="onDestinationChange($event)"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">
              {{ "search_filter.all_destinations" | translate }}
            </option>
            @for (city of cityState.cities(); track city.id) {
            <option [value]="city.id">{{ city.name }}</option>
            }
          </select>
        </div>

        <!-- Price Range -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >{{ 'search_filter.price_range' | translate }}</label
          >
          <div class="flex items-center gap-2">
            <input
              type="number"
              [ngModel]="state.filters().minPrice"
              (ngModelChange)="onPriceChange('min', $event)"
              placeholder="{{ 'search_filter.min' | translate }}"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span class="text-gray-500">-</span>
            <input
              type="number"
              [ngModel]="state.filters().maxPrice"
              (ngModelChange)="onPriceChange('max', $event)"
              placeholder="{{ 'search_filter.max' | translate }}"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div> -->
        <!-- add duration filter -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >{{ 'search_filter.duration' | translate }}</label
          >
          <select
            [ngModel]="state.filters().duration"
            (ngModelChange)="onDurationChange($event)"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{{ 'search_filter.all_durations' | translate }}</option>
          </select>
        </div> -->

        <!-- clear filters small button -->
        @if (state.filters().search || state.filters().cityId ||
        state.filters().minPrice || state.filters().maxPrice ) {
        <button class="btn-primary mt-6" (click)="onClearFilters()">
          {{ "search_filter.clear_filters" | translate }}
        </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  protected state = inject(TripsStateService);
  protected cityState = inject(CityStateService);
  protected location = inject(Location);
  loadTrips = output<void>();
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;

  searchTerm = "";
  selectedPriceRange = "";
  selectedDuration = "";
  private searchTermSubject = new Subject<string>();

  ngOnInit() {
    this.searchTermSubject.pipe(debounceTime(500)).subscribe((search) => {
      this.state.updateFilters({ search });
      this.loadTrips.emit();
    });
  }

  protected onSearchChange(search: string) {
    this.searchTerm = search;
    this.searchTermSubject.next(search);
    // this.clearQueryParamsWithoutLifecycleHooks(window.location.pathname);
  }

  protected onDestinationChange(cityId: string) {
    this.state.updateFilters({ cityId });
    this.loadTrips.emit();
  }

  protected onPriceChange(type: "min" | "max", value: number) {
    this.state.updateFilters({
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    });
    this.loadTrips.emit();
  }

  protected onClearFilters() {
    this.state.updateFilters({
      search: "",
      cityId: "",
    });
    this.loadTrips.emit();
  }

  clearQueryParamsWithoutLifecycleHooks(url: string) {
    // Get the base URL without query params
    const baseUrl = window.location.pathname;

    // Replace the current state without triggering navigation events
    window.history.replaceState({}, "", baseUrl);

    // If you need to update Angular's knowledge of the URL without navigation
    this.location.replaceState(baseUrl);
  }
}
