import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { faExpand, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GalleryImage } from "../../models/gallary.model";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "app-image-lightbox",
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <!-- Lightbox -->
    @if (selectedImage()) {
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300"
      (click)="closeLightbox()"
    >
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          class="absolute top-4 right-4 text-white/75 hover:text-white"
          (click)="closeLightbox()"
        >
          <fa-icon [icon]="faTimes" size="2x"></fa-icon>
        </button>
        <img
          loading="lazy"
          [src]="selectedImage()?.url"
          [alt]="selectedImage()?.title"
          class="max-h-[90vh] w-auto mx-auto rounded-lg shadow-2xl"
        />
        <div class="text-center mt-4">
          <h3 class="text-2xl font-semibold text-white">
            {{ selectedImage()?.title }}
          </h3>
          <p class="text-white/75">{{ selectedImage()?.location }}</p>
        </div>
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLightboxComponent {
  faExpand = faExpand;
  faTimes = faTimes;
  image = input<GalleryImage | null>(null);
  selectedImage = computed<GalleryImage | null>(() => this.image());

  openLightbox(image: GalleryImage): void {
    // this.selectedImage = image;
  }

  closeLightbox(): void {
    // this.selectedImage.set = null;
  }
}
