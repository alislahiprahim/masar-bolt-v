import { inject } from "@angular/core";
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { AuthStateService } from "../state/auth.state";

let isRefreshing = false;

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authState = inject(AuthStateService);
  const authService = inject(AuthService);

  const token = authState.token();

  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        return handle401Error(request, next, authService, authState);
      }
      return throwError(() => error);
    })
  );
}

function addToken(
  request: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  authState: AuthStateService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;

    return authService.refreshToken().pipe(
      switchMap((success) => {
        isRefreshing = false;

        if (success) {
          const token = authState.token();
          return next(addToken(request, token!));
        }

        // If refresh failed, redirect to login
        authService.logout();
        return throwError(() => new Error("Session expired"));
      }),
      catchError((error) => {
        isRefreshing = false;
        return throwError(() => error);
      })
    );
  }
  return next(request);
}
