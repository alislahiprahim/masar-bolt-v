import { Injectable, computed, signal } from "@angular/core";
import { GalleryState, GalleryImage } from "../models/gallary.model";

@Injectable({
  providedIn: "root",
})
export class GalleryStateService {
  // State signal
  private state = signal<GalleryState>({
    images: [],
    total: 0,
    selectedImage: null,
    loading: false,
    error: null,
    filters: {},
  });

  // Computed signals
  readonly images = computed(() => this.state().images);
  readonly selectedImage = computed(() => this.state().selectedImage);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);

  // Computed locations and tags for filtering
  readonly locations = computed(() =>
    Array.from(new Set(this.state().images.map((img) => img.city.name)))
  );

  readonly tags = computed(() =>
    Array.from(new Set(this.state().images.flatMap((img) => img.tags || [])))
  );

  // State updates
  setImages(images: GalleryImage[], length: number) {
    this.state.update((state) => ({
      ...state,
      images: images,
      total: length,
      error: null,
    }));
  }

  setSelectedImage(image: GalleryImage | null) {
    this.state.update((state) => ({
      ...state,
      selectedImage: image,
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

  updateFilters(filters: Partial<GalleryState["filters"]>) {
    this.state.update((state) => ({
      ...state,
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  }

  reset() {
    this.state.set({
      images: [],
      total: 0,
      selectedImage: null,
      loading: false,
      error: null,
      filters: {},
    });
  }
}
