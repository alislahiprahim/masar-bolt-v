import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review.model';

@Component({
  selector: "app-reviews",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Customer Reviews</h1>
          <p class="text-gray-600 mt-2">
            {{ reviews.length }} reviews • Average rating: {{ averageRating }}
          </p>
        </div>
        <div class="flex gap-4">
          <select
            [(ngModel)]="sortBy"
            (change)="applySort()"
            class="input-field"
          >
            <option value="date-desc">Most Recent</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
          </select>
          <select
            [(ngModel)]="ratingFilter"
            (change)="applyFilters()"
            class="input-field"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <!-- Rating Summary -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Rating Distribution</h3>
            @for (rating of [5,4,3,2,1]; track rating) {
            <div class="flex items-center gap-4 mb-2">
              <span class="w-12 text-sm text-gray-600">{{ rating }} stars</span>
              <div class="flex-grow bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-yellow-400 h-2.5 rounded-full"
                  [style.width.%]="getRatingPercentage(rating)"
                ></div>
              </div>
              <span class="w-12 text-sm text-gray-600">{{
                getRatingCount(rating)
              }}</span>
            </div>
            }
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Review Highlights</h3>
            <div class="space-y-2">
              <p class="text-gray-600">
                <span class="font-medium"
                  >{{ getPositiveReviewsPercentage() }}%</span
                >
                of reviews are 4 stars or higher
              </p>
              <p class="text-gray-600">Most mentioned highlights:</p>
              <div class="flex flex-wrap gap-2">
                @for (tag of getCommonTags(); track tag.text) {
                <span
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {{ tag.text }} ({{ tag.count }})
                </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Write Review Form -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Write a Review
          </h2>
          <form
            [formGroup]="reviewForm"
            (ngSubmit)="submitReview()"
            class="space-y-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Rating</label
              >
              <div class="mt-1 flex items-center space-x-2">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                <button
                  type="button"
                  (click)="setRating(star)"
                  class="text-2xl focus:outline-none transition-colors duration-200"
                  [class.text-yellow-400]="
                    star <= (reviewForm.get('rating')?.value || 0)
                  "
                  [class.text-gray-300]="
                    star > (reviewForm.get('rating')?.value || 0)
                  "
                  [class.hover:text-yellow-300]="
                    star > (reviewForm.get('rating')?.value || 0)
                  "
                >
                  ★
                </button>
                }
                <span class="text-sm text-gray-500 ml-2">
                  {{ getRatingLabel(reviewForm.get("rating")?.value || 0) }}
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Your Review</label
              >
              <textarea
                formControlName="comment"
                rows="4"
                class="input-field mt-1"
                placeholder="Share your experience..."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                {{ reviewForm.get("comment")?.value?.length || 0 }}/1000
                characters
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Highlights</label
              >
              <div class="mt-1 flex flex-wrap gap-2">
                @for (tag of availableTags; track tag) {
                <button
                  type="button"
                  (click)="toggleTag(tag)"
                  [class.bg-primary-100]="selectedTags.includes(tag)"
                  [class.text-primary-700]="selectedTags.includes(tag)"
                  [class.bg-gray-100]="!selectedTags.includes(tag)"
                  [class.text-gray-700]="!selectedTags.includes(tag)"
                  class="px-3 py-1 rounded-full text-sm hover:bg-primary-50 transition-colors duration-200"
                >
                  {{ tag }}
                </button>
                }
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                [disabled]="!reviewForm.valid"
                class="btn-primary"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="space-y-6">
        @for (review of filteredReviews; track review.id) {
        <div
          class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ review.userName }}
                </h3>
                <p class="text-sm text-gray-500">{{ review.date | date }}</p>
              </div>
              <div class="flex text-yellow-400">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                <span
                  [class.text-yellow-400]="star <= review.rating"
                  [class.text-gray-300]="star > review.rating"
                >
                  ★
                </span>
                }
              </div>
            </div>
            <p class="text-gray-600">{{ review.comment }}</p>
            @if (review?.helpful !== undefined) {
            <div class="mt-4 flex items-center gap-4">
              <button
                (click)="markHelpful(review.id)"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Was this review helpful? ({{ review?.helpful }})
              </button>
            </div>
            }
          </div>
        </div>
        } @if (filteredReviews.length === 0) {
        <div class="text-center py-12 bg-white rounded-lg shadow">
          <p class="text-gray-500">No reviews found matching your filters.</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class ReviewsComponent {
  reviewForm: FormGroup;
  sortBy = "date-desc";
  ratingFilter = "all";
  selectedTags: string[] = [];
  availableTags = [
    "Great Service",
    "Clean Accommodation",
    "Friendly Staff",
    "Good Value",
    "Amazing Food",
    "Beautiful Location",
    "Well Organized",
  ];

  reviews: Review[] = [
    {
      id: "1",
      userId: "user1",
      tripId: "trip1",
      rating: 5,
      comment:
        "Amazing experience! The trip was perfectly organized and exceeded all our expectations.",
      date: "2024-02-15",
      userName: "John Doe",
      helpful: 3,
    },
    {
      id: "2",
      userId: "user2",
      tripId: "trip1",
      rating: 4,
      comment:
        "Great trip overall. The guides were knowledgeable and friendly. Would recommend!",
      date: "2024-02-10",
      userName: "Jane Smith",
      helpful: 1,
    },
  ];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  get averageRating(): string {
    const avg =
      this.reviews.reduce((acc, review) => acc + review.rating, 0) /
      this.reviews.length;
    return avg.toFixed(1);
  }

  get filteredReviews(): Review[] {
    let filtered = [...this.reviews];

    if (this.ratingFilter !== "all") {
      filtered = filtered.filter(
        (r) => r.rating === parseInt(this.ratingFilter)
      );
    }

    switch (this.sortBy) {
      case "date-desc":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date-asc":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    return filtered;
  }

  getRatingLabel(rating: number): string {
    switch (rating) {
      case 5:
        return "Excellent";
      case 4:
        return "Very Good";
      case 3:
        return "Average";
      case 2:
        return "Poor";
      case 1:
        return "Terrible";
      default:
        return "Select a rating";
    }
  }

  getRatingCount(rating: number): number {
    return this.reviews.filter((r) => r.rating === rating).length;
  }

  getRatingPercentage(rating: number): number {
    return (this.getRatingCount(rating) / this.reviews.length) * 100;
  }

  getPositiveReviewsPercentage(): number {
    const positiveReviews = this.reviews.filter((r) => r.rating >= 4).length;
    return Math.round((positiveReviews / this.reviews.length) * 100);
  }

  getCommonTags() {
    return [
      { text: "Great Service", count: 12 },
      { text: "Clean Rooms", count: 8 },
      { text: "Friendly Staff", count: 7 },
    ];
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  submitReview() {
    if (this.reviewForm.valid) {
      console.log("Review submitted:", {
        ...this.reviewForm.value,
        tags: this.selectedTags,
      });
      this.reviewForm.reset();
      this.selectedTags = [];
    }
  }

  markHelpful(reviewId: string) {
    console.log("Marked review as helpful:", reviewId);
    // TODO: Implement helpful marking logic
  }

  applySort() {
    // Sorting is handled by the filteredReviews getter
  }

  applyFilters() {
    // Filtering is handled by the filteredReviews getter
  }
}