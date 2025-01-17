import { Injectable, computed, signal } from "@angular/core";
import { Trip } from "../models/trip.model";

export interface TripsState {
  trips: Trip[];
  popularTrips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  total: number;
  filters: {
    search: string;
    destination: string;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  pagination: {
    page: number;
    limit: number;
  };
}

@Injectable({
  providedIn: "root",
})
export class TripsStateService {
  // State signals
  private state = signal<TripsState>({
    trips: [],
    popularTrips: [],
    selectedTrip: null,
    loading: false,
    error: null,
    total: 0,
    filters: {
      search: "",
      destination: "",
      minPrice: null,
      maxPrice: null,
      sortBy: "price",
      sortOrder: "asc",
    },
    pagination: {
      page: 1,
      limit: 12,
    },
  });

  // Computed signals for derived state
  readonly trips = computed(() => this.state().trips);
  readonly popularTrips = computed(() => this.state().popularTrips);
  readonly selectedTrip = computed(() => this.state().selectedTrip);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly total = computed(() => this.state().total);
  readonly filters = computed(() => this.state().filters);
  readonly pagination = computed(() => this.state().pagination);

  // Additional computed signals for UI
  readonly hasNextPage = computed(() => {
    const { page, limit } = this.state().pagination;
    return page * limit < this.state().total;
  });

  readonly hasPreviousPage = computed(() => this.state().pagination.page > 1);

  readonly totalPages = computed(() =>
    Math.ceil(this.state().total / this.state().pagination.limit)
  );

  readonly priceRange = computed(() => {
    const prices = this.state().trips.map((trip) => trip.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  });

  readonly destinations = computed(() =>
    Array.from(new Set(this.state().trips.map((trip) => trip.destination)))
  );

  // State updates
  setTrips(trips: Trip[], total: number) {
    this.state.update((state) => ({
      ...state,
      trips,
      total,
      error: null,
    }));
  }

  setPopularTrips(trips: Trip[]) {
    this.state.update((state) => ({
      ...state,
      popularTrips: trips,
      error: null,
    }));
  }

  setSelectedTrip(trip: Trip | null) {
    this.state.update((state) => ({
      ...state,
      selectedTrip: trip,
      error: null,
    }));
  }

  setLoading(loading: boolean) {
    this.state.update((state) => ({
      ...state,
      loading,
    }));
  }

  setError(error: string | null) {
    this.state.update((state) => ({
      ...state,
      error,
      loading: false,
    }));
  }

  updateFilters(filters: Partial<TripsState["filters"]>) {
    this.state.update((state) => ({
      ...state,
      filters: {
        ...state.filters,
        ...filters,
      },
      pagination: {
        ...state.pagination,
        page: 1, // Reset to first page when filters change
      },
    }));
  }

  updatePagination(pagination: Partial<TripsState["pagination"]>) {
    this.state.update((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    }));
  }

  reset() {
    this.state.update((state) => ({
      ...state,
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      filters: {
        search: "",
        destination: "",
        minPrice: null,
        maxPrice: null,
        sortBy: "price",
        sortOrder: "asc",
      },
      pagination: {
        page: 1,
        limit: 12,
      },
    }));
  }
}
