import { Injectable, computed, signal } from '@angular/core';
import { Reservation } from '../models/reservation.model';

export interface ReservationsState {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  loading: boolean;
  error: string | null;
  total: number;
  filters: {
    status: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsStateService {
  // State signal
  private state = signal<ReservationsState>({
    reservations: [],
    selectedReservation: null,
    loading: false,
    error: null,
    total: 0,
    filters: {
      status: '',
      search: '',
    },
    pagination: {
      page: 1,
      limit: 10,
    },
  });

  // Computed signals
  readonly reservations = computed(() => this.state().reservations);
  readonly selectedReservation = computed(() => this.state().selectedReservation);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);
  readonly pagination = computed(() => this.state().pagination);
  readonly total = computed(() => this.state().total);

  // Computed signals for UI
  readonly hasNextPage = computed(() => {
    const { page, limit } = this.state().pagination;
    return page * limit < this.state().total;
  });

  readonly hasPreviousPage = computed(() => this.state().pagination.page > 1);

  readonly totalPages = computed(() =>
    Math.ceil(this.state().total / this.state().pagination.limit)
  );

  // State updates
  setReservations(reservations: Reservation[], total?: number) {
    this.state.update(state => ({
      ...state,
      reservations,
      total: total ?? reservations.length,
      error: null,
    }));
  }

  setSelectedReservation(reservation: Reservation | null) {
    this.state.update(state => ({
      ...state,
      selectedReservation: reservation,
    }));
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error,
      loading: false,
    }));
  }

  updateReservation(updatedReservation: Reservation) {
    this.state.update(state => ({
      ...state,
      reservations: state.reservations.map(reservation =>
        reservation.id === updatedReservation.id ? updatedReservation : reservation
      ),
    }));
  }

  updateFilters(filters: Partial<ReservationsState['filters']>) {
    this.state.update(state => ({
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

  updatePagination(pagination: Partial<ReservationsState['pagination']>) {
    this.state.update(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    }));
  }

  reset() {
    this.state.set({
      reservations: [],
      selectedReservation: null,
      loading: false,
      error: null,
      total: 0,
      filters: {
        status: '',
        search: '',
      },
      pagination: {
        page: 1,
        limit: 10,
      },
    });
  }

  // Add this computed signal after the other computed signals
  readonly filteredReservations = computed(() => {
    const { status, search } = this.state().filters;
    let filtered = this.state().reservations;

    // Filter by status
    if (status) {
      filtered = filtered.filter(reservation => reservation.status === status);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        reservation =>
          reservation.id.toLowerCase().includes(searchLower) ||
          reservation.title?.toLowerCase().includes(searchLower) ||
          reservation.whatsappNumber.includes(search)
      );
    }

    return filtered;
  });
}
