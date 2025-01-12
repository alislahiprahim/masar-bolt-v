import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-testimonials-section",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <section class="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 section-header">
          {{ "home.testimonials.title" | translate }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (testimonial of testimonials; track testimonial.name) {
          <div class="glass-container p-6 hover-card">
            <div class="flex items-center mb-4">
              <img
                loading="lazy"
                [src]="testimonial.avatar"
                [alt]="testimonial.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="ml-4">
                <h4 class="text-lg font-semibold">{{ testimonial.name }}</h4>
                <div class="flex text-yellow-400">
                  @for (star of [1,2,3,4,5]; track star) {
                  <fa-icon [icon]="faStar"></fa-icon>
                  }
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "{{ testimonial.comment | translate }}"
            </p>
          </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsSectionComponent {
  faStar = faStar;

  testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      comment: "home.testimonials.sarah",
    },
    // ... other testimonials
  ];
}
