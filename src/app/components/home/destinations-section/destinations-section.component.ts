import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TripsService } from "../../../services/trips.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { TripsStateService } from "../../../state/trips.state";

@Component({
  selector: "app-destinations-section",
  standalone: true,
  imports: [CommonModule, TranslateModule, FontAwesomeModule],
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
          @for (destination of state.destinations(); track destination) {
          <div class="rounded-xl overflow-hidden hover-card">
            <div class="relative h-64">
              <img
                loading="lazy"
                [src]="getDestinationImage(destination)"
                [alt]="destination"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
              >
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ destination }}
                  </h3>
                  <p class="text-white/90">
                    {{ getDestinationTripsCount(destination) }} trips available
                  </p>
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
  private tripsService = inject(TripsService);
  protected state = inject(TripsStateService);
  protected faSpinner = faSpinner;

  // Placeholder images for destinations
  private destinationImages: { [key: string]: string } = {
    default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  };

  ngOnInit() {
    this.loadDestinations();
  }

  private loadDestinations() {
    this.state.setLoading(true);

    this.tripsService.getTrips().subscribe({
      next: ({ trips }) => {
        this.state.setTrips(trips, trips.length);
        this.state.setLoading(false);
      },
      error: (error) => {
        this.state.setError(error.message);
      },
    });
  }

  protected getDestinationImage(destination: string): string {
    return this.destinationImages[destination] || "";
  }

  protected getDestinationTripsCount(destination: string): number {
    return this.state.trips().filter((trip) => trip.city === destination)
      .length;
  }
}
