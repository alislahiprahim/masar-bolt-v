import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { ToastService, Toast } from '../../services/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div 
      class="fixed bottom-0 right-0 p-4 z-50 max-h-screen overflow-hidden pointer-events-none"
      [class.rtl:left-0]="true"
      [class.rtl:right-auto]="true"
    >
      <div class="flex flex-col gap-2">
        @for (toast of toastService.toasts(); track toast.id) {
          <div 
            class="pointer-events-auto flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md transform transition-all duration-300 animate-toast"
            [class]="getToastClasses(toast)"
            role="alert"
          >
            <fa-icon 
              [icon]="getIcon(toast.type)" 
              [class]="getIconClasses(toast.type)"
              size="lg">
            </fa-icon>
            
            <p class="flex-1">{{ toast.message }}</p>
            
            <button 
              (click)="toastService.remove(toast.id)"
              class="text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <fa-icon [icon]="faTimes"></fa-icon>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes toast-enter {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    :host-context([dir="rtl"]) {
      @keyframes toast-enter {
        from {
          opacity: 0;
          transform: translateX(-100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }

    .animate-toast {
      animation: toast-enter 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;
  faTimes = faTimes;

  constructor(public toastService: ToastService) {}

  getIcon(type: Toast['type']) {
    switch (type) {
      case 'success': return this.faCheckCircle;
      case 'error': return this.faExclamationCircle;
      case 'warning': return this.faExclamationTriangle;
      default: return this.faInfoCircle;
    }
  }

  getToastClasses(toast: Toast): string {
    const baseClasses = 'border-l-4';
    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-800`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`;
    }
  }

  getIconClasses(type: Toast['type']): string {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  }
}
