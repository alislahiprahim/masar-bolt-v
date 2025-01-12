import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faExpand, faTimes } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryImage } from "../../../models/gallary.model";

@Component({
  selector: "app-gallery-section",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-header mb-4">
            {{ "home.gallery.title" | translate }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ "home.gallery.subtitle" | translate }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (image of galleryImages; track image.url) {
          <div
            class="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            (click)="selectedImage = image"
          >
            <img
              [loading]="'lazy'"
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
              <div class="absolute top-4 right-4">
                <fa-icon
                  [icon]="faExpand"
                  class="text-white text-xl opacity-75 hover:opacity-100"
                ></fa-icon>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class GallerySectionComponent {
  faExpand = faExpand;

  galleryImages: GalleryImage[] = [
    {
      url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
      title: "Tropical Paradise",
      location: "Bali, Indonesia",
    },
    // ... other images
  ];

  selectedImage: GalleryImage | null = null;
}
