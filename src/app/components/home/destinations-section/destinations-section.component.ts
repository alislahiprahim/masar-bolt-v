import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TripsService } from "../../../services/trips.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { TripsStateService } from "../../../state/trips.state";
import { CitiesService } from "../../../services/cities.service";
import { CityStateService } from "../../../state/city.state";
import { ImgUrlPipe } from "../../../pipes/imgUrl.pipe";

@Component({
  selector: "app-destinations-section",
  standalone: true,
  imports: [CommonModule, TranslateModule, FontAwesomeModule, ImgUrlPipe],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 section-header">
          {{ "home.destinations.title" | translate }}
        </h2>

        @if (state.loading()) {
        <div class="flex justify-center items-center py-12">
          <fa-icon
            [icon]="faSpinner"
            class="text-4xl text-primary-600 animate-spin"
          ></fa-icon>
        </div>
        } @else if (state.error()) {
        <div class="text-center py-12">
          <p class="text-red-600">{{ state.error() }}</p>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (city of state.cities(); track city.id) {
          <div class="rounded-xl overflow-hidden hover-card">
            <div class="relative h-64">
              <img
                loading="lazy"
                [src]="city.imageUrl | imgUrl"
                [alt]="city.name"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
              >
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ city.name }}
                  </h3>
                  @if (city._count.trips > 0) {
                  <p class="text-white/90">
                    {{ city._count.trips }} trips available
                  </p>
                  }
                </div>
              </div>
            </div>
          </div>
          }
        </div>
        }
      </div>
    </section>
  `,
})
export class DestinationsSectionComponent implements OnInit {
  private citiesService = inject(CitiesService);
  protected state = inject(CityStateService);
  protected faSpinner = faSpinner;

  // Placeholder images for destinations
  private destinationImages: { [key: string]: string } = {
    default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  };

  ngOnInit() {}

  protected getDestinationImage(destination: string): string {
    return this.destinationImages[destination] || "";
  }

  protected getDestinationTripsCount(destination: string): number {
    return this.state.cities().filter((city) => city.name === destination)
      .length;
  }
}
