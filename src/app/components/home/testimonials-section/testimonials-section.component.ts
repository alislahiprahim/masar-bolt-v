import { Component, OnInit, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewService, Review } from '../../../services/review.service';

@Component({
  selector: 'app-testimonials-section',
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    swiper-container {
      --swiper-pagination-color: var(--color-primary-600, #2563eb);
      --swiper-pagination-bullet-inactive-color: #d1d5db;
      --swiper-pagination-bullet-inactive-opacity: 1;
      --swiper-navigation-color: var(--color-primary-600, #2563eb);
      padding-bottom: 48px !important;
    }
    swiper-slide {
      height: auto;
    }
  `],
  template: `
    <section class="py-20 bg-gradient-to-br from-primary-50 to-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 section-header">
          {{ 'home.testimonials.title' | translate }}
        </h2>

        <!-- Skeleton Loader -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (item of skeletonItems; track item) {
              <div class="glass-container p-6 animate-pulse">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div class="ml-4 flex-1">
                    <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Swiper Carousel -->
        @if (!loading() && reviews().length > 0) {
          <swiper-container
            slides-per-view="1"
            space-between="24"
            navigation="true"
            pagination="true"
            pagination-clickable="true"
            autoplay-delay="4000"
            autoplay-pause-on-mouse-enter="true"
            loop="true"
            breakpoints='{"768":{"slidesPerView":2},"1024":{"slidesPerView":3}}'
            grab-cursor="true"
          >
            @for (review of reviews(); track review.id) {
              <swiper-slide>
                <div class="glass-container p-6 hover-card h-full flex flex-col">
                  <div class="flex items-center mb-4">
                    <img
                      loading="lazy"
                      [src]="getAvatar(review)"
                      [alt]="getDisplayName(review)"
                      class="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      (error)="onAvatarError($event)" />
                    <div class="ml-4 min-w-0">
                      <h4 class="text-lg font-semibold truncate">{{ getDisplayName(review) }}</h4>
                      <div class="flex gap-0.5">
                        @for (n of [1, 2, 3, 4, 5]; track n) {
                          <fa-icon
                            [icon]="faStar"
                            [class]="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'">
                          </fa-icon>
                        }
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-600 italic flex-1">"{{ review.content }}"</p>
                </div>
              </swiper-slide>
            }
          </swiper-container>
        }

        <!-- Empty State -->
        @if (!loading() && reviews().length === 0) {
          <p class="text-center text-gray-400 py-8">
            {{ 'home.testimonials.empty' | translate }}
          </p>
        }
      </div>
    </section>
  `,
})
export class TestimonialsSectionComponent implements OnInit {
  private reviewService = inject(ReviewService);

  faStar = faStar;
  reviews = signal<Review[]>([]);
  loading = signal(true);
  skeletonItems = [1, 2, 3];
  readonly defaultAvatar = 'assets/icon.png';

  ngOnInit(): void {
    this.reviewService.getGlobalReviews(9).subscribe({
      next: ({ reviews }) => {
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getDisplayName(review: Review): string {
    if (review.user) return `${review.user.firstName} ${review.user.lastName}`.trim();
    return review.userDisplayName ?? 'Anonymous';
  }

  getAvatar(review: Review): string {
    if (review.user?.profilePicture) return review.user.profilePicture;
    if (review.userAvatar) return review.userAvatar;
    return this.defaultAvatar;
  }

  onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultAvatar;
  }
}
