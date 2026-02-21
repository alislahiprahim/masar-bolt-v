import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review, ReviewService } from '../../services/review.service';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-review-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './review-list.component.html',
    styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
    @Input() tripId!: string;
    @Input() currentUser: any; // Pass current user to check if logged in

    reviewService = inject(ReviewService);
    fb = inject(FormBuilder);

    reviews = signal<Review[]>([]);
    totalReviews = signal(0);
    loading = signal(false);

    showReviewForm = signal(false);
    reviewForm: FormGroup;
    submitting = signal(false);

    errorMsg = signal('');
    successMsg = signal('');

    constructor() {
        this.reviewForm = this.fb.group({
            rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
            content: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit(): void {
        if (this.tripId) {
            this.fetchReviews();
        }
    }

    fetchReviews() {
        this.loading.set(true);
        this.reviewService.getReviews(this.tripId).subscribe({
            next: (res) => {
                this.reviews.set(res.reviews);
                this.totalReviews.set(res.total);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    toggleReviewForm() {
        this.showReviewForm.update(v => !v);
        this.successMsg.set('');
        this.errorMsg.set('');
    }

    submitReview() {
        if (this.reviewForm.invalid) return;

        this.submitting.set(true);
        this.errorMsg.set('');

        this.reviewService.addReview({
            ...this.reviewForm.value,
            tripId: this.tripId
        }).subscribe({
            next: (res) => {
                this.successMsg.set('Review submitted for approval!');
                this.reviewForm.reset({ rating: 5 });
                this.showReviewForm.set(false);
                this.submitting.set(false);
                // We don't fetchReviews because it needs approval
            },
            error: (err) => {
                this.errorMsg.set(err.error?.message || 'Failed to submit review');
                this.submitting.set(false);
            }
        });
    }
}
