// image-gallery.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faImage, faImagePortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

 

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,TranslatePipe],
  template: `
    <div class="container mx-auto px-4">
      <!-- Main Gallery Flex Layout -->
      <div class="flex flex-wrap">
        <!-- First Image (Full Height) - Always visible -->
        <div 
          *ngIf="images.length > 0"
          class="w-full md:w-1/2 lg:w-1/3 p-2 relative"
        >
          <div 
            class="relative overflow-hidden rounded-lg h-full min-h-64"
          >
            <img 
              [src]="images[0]" 
              alt="Image"
              class="w-full h-full object-cover"
            />
            <!-- "All Photos" Button -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <button 
                class="py-2 px-4 bg-gray-800 bg-opacity-40 border border-white border-opacity-70 box-border rounded-lg text-white font-medium text-base leading-5-opacity-80 flex items-center justify-center"
                (click)="openLightbox(0)"
              >
              <fa-icon
            [icon]="faImagePortrait"
            class="mx-2 "
          ></fa-icon>
                {{'common.all_photos' | translate}}
              </button>
            </div>
          </div>
        </div>

        <!-- Remaining Images (Hidden on Mobile, Visible on Tablet/Desktop) -->
        <div class="hidden md:flex md:w-1/2 lg:w-2/3 flex-wrap">
          <ng-container *ngFor="let image of images.slice(1); let i = index">
            <div class="w-full sm:w-1/2 lg:w-1/3 p-2 relative">
              <div class="relative overflow-hidden rounded-lg h-64">
                <img 
                  [src]="image" 
                  [alt]="image"
                  class="w-full h-full object-cover"
                />
                
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Lightbox Overlay -->
      <div 
        *ngIf="lightboxOpen" 
        class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        (click)="closeLightbox()"
      >
        <div class="max-w-6xl mx-auto px-4 relative" (click)="$event.stopPropagation()">
          <!-- Close Button -->
          <button 
            class="absolute top-4 right-4 text-white text-2xl z-10"
            (click)="closeLightbox()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Navigation Buttons -->
          <button 
            *ngIf="images.length > 1" 
            class="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl z-10"
            (click)="prevImage($event)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            *ngIf="images.length > 1" 
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl z-10"
            (click)="nextImage($event)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Current Image with Zoom Functionality -->
          <div class="relative overflow-hidden lightbox-image-container">
            <img 
              [src]="images[currentImageIndex]" 
              [alt]="images[currentImageIndex]"
              class="max-w-full max-h-[85vh] mx-auto object-contain"
              [ngClass]="{'scale-150': isZoomed}"
              (click)="toggleZoom()"
            />
          </div>

          <!-- Caption and Counter -->
          <div class="text-white text-center mt-4">
            <p class="text-sm opacity-75">{{ currentImageIndex + 1 }} / {{ images.length }}</p>
            <!-- <p class="text-lg">{{ images[currentImageIndex] }}</p> -->
          </div>

          <!-- Thumbnails -->
          <div *ngIf="images.length > 1" class="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
            <div 
              *ngFor="let image of images; let i = index" 
              class="w-16 h-16 cursor-pointer rounded-md overflow-hidden flex-shrink-0"
              [ngClass]="{'ring-2 ring-blue-500': i === currentImageIndex}"
              (click)="setCurrentImage(i, $event)"
            >
              <img 
                [src]="image" 
                [alt]="image"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scale-150 {
      transform: scale(1.5);
      transition: transform 0.3s ease;
      cursor: zoom-out;
    }
    .lightbox-image-container {
      cursor: zoom-in;
    }
    .lightbox-image-container img {
      transition: transform 0.3s ease;
    }
    @media (max-width: 768px) {
      .min-h-64 {
        min-height: 16rem;
      }
    }
  `]
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: string[] = [];
  
  lightboxOpen = false;
  currentImageIndex = 0;
  isZoomed = false;
  faImagePortrait = faImage
  constructor() {}

  ngOnInit(): void {}

  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    this.isZoomed = false;
    document.body.classList.add('overflow-hidden');
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.isZoomed = false;
    document.body.classList.remove('overflow-hidden');
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    this.isZoomed = false;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    this.isZoomed = false;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  setCurrentImage(index: number, event: Event): void {
    event.stopPropagation();
    this.currentImageIndex = index;
    this.isZoomed = false;
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }
}