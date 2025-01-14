import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

@Injectable()
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  show(message: string, type: Toast["type"] = "info", duration: number = 3000) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, duration };

    this.toasts.next([...this.toasts.value, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, "success", duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, "error", duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, "warning", duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, "info", duration);
  }

  remove(id: string) {
    this.toasts.next(this.toasts.value.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts.next([]);
  }
}
