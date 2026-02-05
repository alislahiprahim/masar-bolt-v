// city.state.ts

import { signal, computed, Injectable } from '@angular/core';
import { City, CityState } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class CityStateService {
  private state = signal<CityState>({
    cities: [],
    loading: false,
    error: null,
    total: 0,
    filters: { search: '', destination: '' },
    pagination: { page: 1, limit: 10 },
  });

  readonly cities = computed(() => this.state().cities);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly total = computed(() => this.state().total);
  readonly filters = computed(() => this.state().filters);
  readonly pagination = computed(() => this.state().pagination);

  setCities(cities: City[], total: number) {
    this.state.update(state => ({
      ...state,
      cities,
      total,
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
    }));
  }

  updateFilters(filters: Partial<CityState['filters']>) {
    this.state.update(state => ({
      ...state,
      filters: { ...state.filters, ...filters },
    }));
  }

  updatePagination(pagination: Partial<CityState['pagination']>) {
    this.state.update(state => ({
      ...state,
      pagination: { ...state.pagination, ...pagination },
    }));
  }

  reset() {
    this.state.update(state => ({
      ...state,
      cities: [],

      filters: { search: '', destination: '' },
      pagination: { page: 1, limit: 10 },
    }));
  }
}
