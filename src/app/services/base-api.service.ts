import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, pipe, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { ToastService } from "./toast.service";
import { ApiResponse } from "../models/api.model";
import { inject } from "@angular/core";

export abstract class BaseApiService<T extends Record<string, any>> {
  protected abstract apiUrl: string;
  private featuredCache$?: Observable<T[]>;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private lastCacheTime = 0;
  protected http = inject(HttpClient);
  protected toastService = inject(ToastService);

  protected getItems(
    params: Record<string, any> = {},
    dataKey: string = ""
  ): Observable<{ items: T[]; total: number }> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.http
      .get<ApiResponse<Record<string, T> | T>>(
        `${this.apiUrl}?${queryParams.toString()}`
      )
      .pipe(
        map((response) => {
          const items = dataKey ? response.data[dataKey] : response.data;
          return {
            items,
            total: Array.isArray(items) ? items.length : 0, // Ensure total is calculated correctly
          };
        }),
        catchError(this.handleError.bind(this))
      );
  }

  protected getItemById(id: string, dataKey: string = ""): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => (dataKey ? response.data[dataKey] : response.data)),
      catchError(this.handleError.bind(this))
    );
  }

  protected getFeaturedItems(
    limit: number = 6,
    path: string = "",
    dataKey: string = ""
  ): Observable<T[]> {
    const now = Date.now();

    if (this.featuredCache$ && now - this.lastCacheTime < this.cacheDuration) {
      return this.featuredCache$;
    }

    this.featuredCache$ = this.http
      .get<ApiResponse<T>>(`${this.apiUrl}/${path}?limit=${limit}`)
      .pipe(
        map((response) => response.data[dataKey]),
        shareReplay(1),
        catchError(this.handleError.bind(this))
      );

    this.lastCacheTime = now;
    return this.featuredCache$;
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred. Please try again later.";

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.responseMessage) {
        errorMessage = error.error.responseMessage;
      } else {
        switch (error.status) {
          case 404:
            errorMessage = `The requested ${this.getEntityName()} was not found.`;
            break;
          case 401:
            errorMessage = "Please log in to access this content.";
            break;
          case 403:
            errorMessage = "You do not have permission to access this content.";
            break;
          case 429:
            errorMessage = "Too many requests. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
    }

    this.toastService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  protected abstract getEntityName(): string;
}
