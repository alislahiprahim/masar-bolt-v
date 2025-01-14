import { Component, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { DialogService, DialogType } from "../../services/dialog.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    @if (dialogService.dialog().isOpen) {
    <div
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        (click)="dialogService.close()"
      ></div>

      <!-- Dialog -->
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          [class.animate-dialog-enter]="true"
        >
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div [class]="getIconContainerClasses()">
                <fa-icon
                  [icon]="getIcon()"
                  [class]="getIconClasses()"
                  size="lg"
                >
                </fa-icon>
              </div>

              <div class="flex-1">
                <p
                  class="text-lg font-medium text-center"
                  [class]="getTextClasses()"
                >
                  {{ dialogService.dialog().message }}
                </p>
              </div>
            </div>
          </div>

          @if(dialogService.dialog().hasButton){
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              class="btn-primary"
              (click)="dialogService.close()"
            >
              {{ "common.close" | translate }}
            </button>
          </div>
          }
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      @keyframes dialog-enter {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .animate-dialog-enter {
        animation: dialog-enter 0.2s ease-out;
      }
    `,
  ],
})
export class DialogComponent {
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;
  faTimes = faTimes;

  constructor(public dialogService: DialogService) {}

  @HostListener("document:keydown.escape")
  onEscape() {
    this.dialogService.close();
  }

  getIcon() {
    const type = this.dialogService.dialog().type;
    switch (type) {
      case "success":
        return this.faCheckCircle;
      case "error":
        return this.faExclamationCircle;
      case "warning":
        return this.faExclamationTriangle;
      default:
        return this.faInfoCircle;
    }
  }

  getIconContainerClasses(): string {
    const type = this.dialogService.dialog().type;
    switch (type) {
      case "success":
        return "rounded-full p-3 bg-green-100";
      case "error":
        return "rounded-full p-3 bg-red-100";
      case "warning":
        return "rounded-full p-3 bg-yellow-100";
      default:
        return "rounded-full p-3 bg-blue-100";
    }
  }

  getIconClasses(): string {
    const type = this.dialogService.dialog().type;
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  }

  getTextClasses(): string {
    const type = this.dialogService.dialog().type;
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      default:
        return "text-blue-800";
    }
  }
}
