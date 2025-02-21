import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";

export interface ImageFile {
  file: File;
  preview: string;
}

@Component({
  selector: "app-image-picker",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      @for (i of getNumberSequence(); track i) {
      <div class="relative">
        @if (images[i]) {
        <div class="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            [src]="images[i].preview"
            class="w-full h-24 object-cover"
            [alt]="label + ' ' + (i + 1)"
          />
          <button
            type="button"
            class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            (click)="removeImage(i)"
          >
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
        } @else {
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors cursor-pointer"
          (click)="triggerFileInput(i)"
          [class.border-red-300]="showError"
        >
          <fa-icon
            [icon]="faUpload"
            class="text-2xl text-gray-400 mb-2"
          ></fa-icon>
          <p class="text-sm text-gray-600">{{ label }} #{{ i + 1 }}</p>
        </div>
        }
        <input
          type="file"
          [id]="'image-' + i"
          class="hidden"
          accept="image/*"
          (change)="onFileSelected($event, i)"
        />
      </div>
      }
    </div>

    @if (showError && errorMessage) {
    <p class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </p>
    }
  `,
})
export class ImagePickerComponent implements ControlValueAccessor {
  @Input() minLength = 1;
  @Input() maxFileSize = 5; // in MB
  @Input() label = "Upload Image";
  @Input() errorMessage = "Please upload all required images";
  @Input() showError = false;

  images: (ImageFile | null)[] = [];
  disabled = false;

  // Icons
  protected faUpload = faUpload;
  protected faTimes = faTimes;

  // ControlValueAccessor methods
  private onChange: (value: ImageFile[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(images: ImageFile[]): void {
    this.images = images || new Array(this.minLength).fill(null);
  }

  registerOnChange(fn: (value: ImageFile[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Component methods
  protected getNumberSequence(): number[] {
    return Array.from({ length: this.minLength }, (_, i) => i);
  }

  protected triggerFileInput(index: number): void {
    if (this.disabled) return;
    document.getElementById("image-" + index)?.click();
  }

  protected onFileSelected(event: Event, index: number): void {
    if (this.disabled) return;

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      this.emitError("Please upload an image file");
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize * 1024 * 1024) {
      this.emitError(`Image size should not exceed ${this.maxFileSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...this.images];
      newImages[index] = {
        file,
        preview: e.target?.result as string,
      };
      this.updateValue(newImages);
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(index: number): void {
    if (this.disabled) return;

    const newImages = [...this.images];
    newImages[index] = null;
    this.updateValue(newImages);
  }

  private updateValue(newImages: (ImageFile | null)[]): void {
    this.images = newImages;
    this.onChange(this.images.filter((img): img is ImageFile => img !== null));
    this.onTouched();
  }

  private emitError(message: string): void {
    // You can emit an event here if you want to handle errors in the parent component
    console.error(message);
  }
}
