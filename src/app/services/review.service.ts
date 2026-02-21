import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Review {
    id: string;
    content: string;
    rating: number;
    source: string;
    userDisplayName?: string;
    userAvatar?: string;
    createdAt: string;
    user?: {
        firstName: string;
        lastName: string;
        profilePicture: string | null;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reviews`;

    getReviews(tripId: string, page: number = 1, limit: number = 5): Observable<{ reviews: Review[]; total: number }> {
        let params = new HttpParams()
            .set('tripId', tripId)
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<{ reviews: Review[]; total: number }>(this.apiUrl, { params });
    }

    getGlobalReviews(limit: number = 6): Observable<{ reviews: Review[]; total: number }> {
        const params = new HttpParams().set('limit', limit.toString());
        return this.http.get<{ reviews: Review[]; total: number }>(this.apiUrl, { params });
    }

    addReview(data: { content: string; rating: number; tripId: string }): Observable<Review> {
        return this.http.post<Review>(this.apiUrl, data);
    }
}
