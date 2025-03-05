import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faChevronLeft,
  faExpand,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { LightboxComponent } from "../../image-lightbox/image-lightbox.component";
import { GalleryImage } from "../../../models/gallary.model";
import { GalleryService } from "../../../services/gallary.service";
import { GalleryStateService } from "../../../state/gallary.state";
import { LightboxService } from "../../image-lightbox/image-lightbox.service";
import { ImgUrlPipe } from "../../../pipes/imgUrl.pipe";

@Component({
  selector: "app-gallery-section",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule,
    TranslateModule,
    LightboxComponent,
    ImgUrlPipe,
  ],
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

        @if (state.loading()) {
        <div class="flex justify-center items-center py-12">
          <fa-icon
            [icon]="faSpinner"
            class="text-4xl text-primary-600 animate-spin"
          ></fa-icon>
        </div>
        } @else if (state.error()) {
        <div class="text-center py-12">
          <p class="text-red-600">{{ state.error() }}</p>
          <button (click)="loadFeaturedImages()" class="mt-4 btn-primary">
            Try Again
          </button>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (image of state.images(); track image.id) {
          <div
            class="group relative overflow-hidden  rounded-lg shadow-lg cursor-pointer"
            (click)="openLightbox(image)"
          >
            <img
              loading="lazy"
              [src]="image.url | imgUrl"
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
                <p class="text-white/90">{{ image.city.name }}</p>
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
        <div class="text-center mt-12">
          <a routerLink="/gallery" class="btn-primary inline-flex items-center">
            {{ "home.gallery.viewAll" | translate }}
            <fa-icon [icon]="faChevronLeft" class="mx-2"></fa-icon>
          </a>
        </div>

        }
      </div>
    </section>

    <app-lightbox
      [isOpen]="(lightboxService.isOpen$ | async) || false"
      [image]="(lightboxService.currentImage$ | async)!"
      (closeEvent)="lightboxService.close()"
    />
  `,
})
export class GallerySectionComponent implements OnInit {
  private galleryService = inject(GalleryService);
  protected state = inject(GalleryStateService);
  protected lightboxService = inject(LightboxService);

  // Icons
  protected faExpand = faExpand;
  protected faSpinner = faSpinner;
  protected faChevronLeft = faChevronLeft;
  ngOnInit() {
    this.loadFeaturedImages();
  }

  protected loadFeaturedImages() {
    this.state.setLoading(true);

    this.galleryService.getFeaturedImages(6).subscribe({
      next: (images) => {
        this.state.setImages(images, images.length);
        this.state.setLoading(false);
      },
      error: (error) => {
        this.state.setError(error.message);
      },
    });
  }

  protected openLightbox(image: GalleryImage) {
    this.lightboxService.open(image);
  }

  ngOnDestroy() {
    this.state.reset();
  }
}
