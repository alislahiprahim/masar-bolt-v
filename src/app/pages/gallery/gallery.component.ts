import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgOptimizedImage } from '@angular/common';
import { CustomHeroSectionComponent } from '../../components/custom-hero-section/custom-hero-section.component';
import { LightboxService } from '../../components/image-lightbox/image-lightbox.service';
import { LightboxComponent } from '../../components/image-lightbox/image-lightbox.component';
import { SeoService } from '../../services/seo.service';
import { faSpinner, faSearch, faFilter, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { GalleryService } from '../../services/gallary.service';
import { GalleryStateService } from '../../state/gallary.state';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ImgUrlPipe } from '../../pipes/imgUrl.pipe';
import { GalleryImage } from '../../models/gallary.model';

@Component({
  selector: 'app-gallery',
  imports: [
    CustomHeroSectionComponent,
    LightboxComponent,
    AsyncPipe,
    FaIconComponent,
    FormsModule,
    ImgUrlPipe,
  ],
  template: `
    <!-- Hero Banner -->
    <app-custom-hero-section
      [bannerImg]="'https://images.unsplash.com/photo-1469474968028-56623f02e42e'"
      [title]="'Travel Gallery'"
      [subTitle]="'Immerse yourself in stunning destinations through our curated collection of travel photography'" />
    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="glass-container mb-12 p-6 shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div class="relative">
              <input
                type="text"
                [ngModel]="state.filters().search"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Search images..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              <fa-icon
                [icon]="faSearch"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></fa-icon>
            </div>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              [ngModel]="state.filters().location"
              (ngModelChange)="onLocationChange($event)"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">All Locations</option>
              @for (location of state.locations(); track location) {
                <option [value]="location">{{ location }}</option>
              }
            </select>
          </div>

          <!-- Tag Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <select
              [ngModel]="state.filters().tag"
              (ngModelChange)="onTagChange($event)"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">All Tags</option>
              @for (tag of state.tags(); track tag) {
                <option [value]="tag">{{ tag }}</option>
              }
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      @if (state.loading()) {
        <div class="flex justify-center items-center py-12">
          <fa-icon [icon]="faSpinner" class="text-4xl text-primary-600 animate-spin"></fa-icon>
        </div>
      } @else if (state.error()) {
        <div class="text-center py-12">
          <p class="text-red-600">{{ state.error() }}</p>
          <button (click)="loadGallery()" class="mt-4 btn-primary">Try Again</button>
        </div>
      } @else if (state.images().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-600">No images found matching your criteria.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (image of state.images(); track image.id) {
            <div
              class="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              (click)="openLightbox(image)">
              <img
                [src]="image.url | imgUrl"
                [alt]="image.title"
                class="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h3 class="text-xl font-semibold text-white">
                    {{ image.title }}
                  </h3>
                  <p class="text-white/90 flex items-center">
                    <fa-icon [icon]="faMapMarkerAlt" class="mx-1"></fa-icon>
                    {{ image.city.name }}
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <app-lightbox
      [isOpen]="(lightboxService.isOpen$ | async) || false"
      [image]="(lightboxService.currentImage$ | async)!"
      (closeEvent)="lightboxService.close()" />
  `,
})
export class GalleryComponent {
  private seoService = inject(SeoService);
  private galleryService = inject(GalleryService);
  protected state = inject(GalleryStateService);
  protected lightboxService = inject(LightboxService);

  // Icons
  protected faSpinner = faSpinner;
  protected faSearch = faSearch;
  protected faFilter = faFilter;
  protected faMapMarkerAlt = faMapMarkerAlt;

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'Gallary page',
      description: 'gallary page',
      keywords: [
        'travel',
        'vacation',
        // this.trip.destination,
        'tour package',
        'holiday',
        'masar tavels'.toLowerCase(),
      ],
      ogImage: '/assets/logo.png',
      ogType: 'masar travel',
      twitterCard: 'summary_large_image',
    });
    this.loadGallery();
  }

  protected loadGallery() {
    this.state.setLoading(true);

    this.galleryService.getGalleryImages(this.state.filters()).subscribe({
      next: images => {
        this.state.setImages(images.images, images.images.length);
        this.state.setLoading(false);
      },
      error: error => {
        this.state.setError(error.message);
      },
    });
  }

  protected onSearchChange(search: string) {
    this.state.updateFilters({ search });
    this.loadGallery();
  }

  protected onLocationChange(location: string) {
    this.state.updateFilters({ location });
    this.loadGallery();
  }

  protected onTagChange(tag: string) {
    this.state.updateFilters({ tag });
    this.loadGallery();
  }

  protected openLightbox(image: GalleryImage) {
    this.lightboxService.open(image);
  }
}
