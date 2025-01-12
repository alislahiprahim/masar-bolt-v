import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomHeroSectionComponent } from "../../components/custom-hero-section/custom-hero-section.component";

interface GalleryImage {
  url: string;
  title: string;
  location: string;
}

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [CommonModule, CustomHeroSectionComponent],
  template: `
    <!-- Hero Banner -->
    <app-custom-hero-section
      [bannerImg]="
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
      "
      [title]="'Travel Gallery'"
      [subTitle]="
        'Immerse yourself in stunning destinations through our curated collection of travel photography'
      "
    />

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (image of galleryImages; track image.url) {
        <div
          class="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            loading="lazy"
            [src]="image.url"
            [alt]="image.title"
            class="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-xl font-semibold text-white">
                {{ image.title }}
              </h3>
              <p class="text-white/90">{{ image.location }}</p>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class GalleryComponent {
  galleryImages: GalleryImage[] = [
    {
      url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
      title: "Tropical Paradise",
      location: "Bali, Indonesia",
    },
    {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      title: "Mountain Retreat",
      location: "Swiss Alps",
    },
    {
      url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      title: "Venice Canals",
      location: "Venice, Italy",
    },
    {
      url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be",
      title: "Desert Adventure",
      location: "Dubai, UAE",
    },
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      title: "Paris Landmarks",
      location: "Paris, France",
    },
    {
      url: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd",
      title: "Japanese Gardens",
      location: "Kyoto, Japan",
    },
  ];
}