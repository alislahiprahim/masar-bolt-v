import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Create a signal for the toasts array with readonly access from components
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, duration };

    // Add new toast to the array
    this.toastsSignal.update(toasts => [...toasts, toast]);

    // Remove toast after duration (if specified)
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  remove(id: string) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear() {
    this.toastsSignal.set([]);
  }
}
