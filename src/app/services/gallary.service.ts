import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ToastService } from "./toast.service";
import { BaseApiService } from "./base-api.service";
import { GalleryImage } from "../models/gallary.model";

@Injectable({
  providedIn: "root",
})
export class GalleryService extends BaseApiService<GalleryImage> {
  protected apiUrl = `${environment.apiUrl}/Gallery`;

  getGalleryImages(filters?: {
    location?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<{ images: GalleryImage[]; total: number }> {
    return this.getItems(filters, "images").pipe(
      map(({ items, total }) => ({ images: items, total }))
    );
  }

  getImageById(id: string): Observable<GalleryImage> {
    return this.getItemById(id);
  }

  getFeaturedImages(limit: number = 6): Observable<GalleryImage[]> {
    return this.getFeaturedItems(limit, "", "images");
  }

  protected getEntityName(): string {
    return "image";
  }
}
