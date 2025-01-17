import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { LightboxService } from "./image-lightbox.service";
import { ImgUrlPipe } from "../../pipes/imgUrl.pipe";

export interface LightboxImage {
  filePath: string;
  title: string;
  description?: string;
}

@Component({
  selector: "app-lightbox",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ImgUrlPipe],
  template: `
    @if (isOpen) {
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300"
      (click)="close()"
    >
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          class="absolute top-4 right-4 text-white/75 hover:text-white transition-colors"
          (click)="close()"
        >
          <fa-icon [icon]="faTimes" size="2x"></fa-icon>
        </button>

        <img
          [src]="image.filePath | imgUrl"
          [alt]="image.title"
          class="max-h-[90vh] w-auto mx-auto rounded-lg shadow-2xl"
          (click)="$event.stopPropagation()"
        />

        <div class="text-center mt-4">
          <h3 class="text-2xl font-semibold text-white">{{ image.title }}</h3>
          @if (image.description) {
          <p class="text-white/75">{{ image.description }}</p>
          }
        </div>
      </div>
    </div>
    }
  `,
})
export class LightboxComponent {
  @Input() isOpen = false;
  @Input() image!: LightboxImage;
  @Output() closeEvent = new EventEmitter<void>();

  faTimes = faTimes;

  close(): void {
    this.closeEvent.emit();
  }
}
