import { Injectable, signal } from "@angular/core";

export type DialogType = "success" | "error" | "warning" | "info";

export interface DialogState {
  isOpen: boolean;
  message: string;
  type: DialogType;
  hasButton?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private state = signal<DialogState>({
    isOpen: false,
    message: "",
    type: "info",
    hasButton: false,
  });

  readonly dialog = this.state.asReadonly();

  show(message: string, type: DialogType = "info") {
    this.state.set({
      isOpen: true,
      message,
      type,
    });
  }

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string) {
    this.show(message, "error");
  }

  warning(message: string) {
    this.show(message, "warning");
  }

  info(message: string) {
    this.show(message, "info");
  }

  close() {
    this.state.set({
      isOpen: false,
      message: "",
      type: "info",
    });
  }
}
