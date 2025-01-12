import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LightboxImage } from "./image-lightbox.component";

@Injectable({
  providedIn: "root",
})
export class LightboxService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private currentImageSubject = new BehaviorSubject<LightboxImage | null>(null);

  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  currentImage$: Observable<LightboxImage | null> =
    this.currentImageSubject.asObservable();

  open(image: LightboxImage): void {
    this.currentImageSubject.next(image);
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
    this.currentImageSubject.next(null);
  }
}
