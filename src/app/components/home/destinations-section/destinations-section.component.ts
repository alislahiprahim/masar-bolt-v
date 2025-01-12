import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-destinations-section",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 section-header">
          {{ "home.destinations.title" | translate }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (destination of destinations; track destination.title) {
          <div class="rounded-xl overflow-hidden hover-card">
            <div class="relative h-64">
              <img
                loading="lazy"
                [src]="destination.image"
                [alt]="destination.title | translate"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
              >
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ destination.title | translate }}
                  </h3>
                  <p class="text-white/90">
                    {{ destination.description | translate }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class DestinationsSectionComponent {
  destinations = [
    {
      title: "home.destinations.bali.title",
      description: "home.destinations.bali.description",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    },
    {
      title: "home.destinations.santorini.title",
      description: "home.destinations.santorini.description",
      image: "https://images.unsplash.com/photo-1570077188670-6e65c2d60666",
    },
    {
      title: "home.destinations.swiss.title",
      description: "home.destinations.swiss.description",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
    },
  ];
}
