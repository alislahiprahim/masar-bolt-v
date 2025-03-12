import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faClock,
  faMapMarkerAlt,
  faCalendar,
  faList,
  faCheck,
  faUtensils,
  faHotel,
  faCar,
  faPlane,
  faUmbrellaBeach,
  faCamera,
  faWifi,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Trip } from "../../models/trip.model";
import { BookingFormComponent } from "../../components/booking-form/booking-form.component";
import { AuthService } from "../../services/auth.service";
import { SeoService } from "../../services/seo.service";
import { TripsService } from "../../services/trips.service";
import { TripsStateService } from "../../state/trips.state";
import { SafeHTMLPipe } from "../../pipes/safeHTML.pipe";
import { ImgUrlPipe } from "../../pipes/imgUrl.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-trip-details",
  imports: [
    CommonModule,
    FontAwesomeModule,
    BookingFormComponent,
    ImgUrlPipe,
    TranslatePipe,
  ],
  template: `
    @if (state.loading()) {
    <div class="flex justify-center items-center min-h-[60vh]">
      <fa-icon
        [icon]="faSpinner"
        class="text-4xl text-primary-600 animate-spin"
      ></fa-icon>
    </div>
    } @else if (state.error()) {
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ state.error() }}</h2>
      <button (click)="router.navigate(['/trips'])" class="btn-primary">
        Back to Trips
      </button>
    </div>
    } @else if (state.selectedTrip()) {
    <div class="bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Hero Section -->
      <div class="relative h-[60vh] overflow-hidden">
        <img
          [src]="state.selectedTrip()!.tripPhotos[0] | imgUrl"
          [alt]="state.selectedTrip()!.name"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ state.selectedTrip()!.name }}
            </h1>
            <p class="text-xl text-white/90">
              {{ state.selectedTrip()!.destination }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Trip Details -->
          <div class="lg:col-span-2">
            <!-- Description -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {{ "trip.description.description" | translate }}
              </h2>
              <p class="text-gray-600">
                {{ state.selectedTrip()!.notes }}
              </p>
              <!-- <span
                [innerHTML]="state.selectedTrip()!.description | safeHTML"
              ></span> -->
            </div>

            <!-- Included -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {{ "trip.includes.title" | translate }}
              </h2>
              <ul class="space-y-2">
                @for (item of state.selectedTrip()!.includes; track item) {
                <li class="flex items-center text-gray-600">
                  <span class="w-2 h-2 bg-primary-500 rounded-full mx-2"></span>
                  {{ item.includes.name }}
                </li>
                }
              </ul>
            </div>

            <!-- Available Hotels -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 class="text-2xl font-bold mb-4">
                {{ "trip.hotels.title" | translate }}
              </h2>
              <ul class="space-y-2">
                @for (hotel of state.selectedTrip()!.TripHotel; track hotel.id) {
                <li class="flex items-center text-gray-600">
                  <span class="w-2 h-2 bg-primary-500 rounded-full mx-2"></span>
                  {{ hotel.hotel.name }} ({{ hotel.costPerPerson | currency }})
                </li>
                }
              </ul>
            </div>

            <!-- Itinerary -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-2xl font-bold mb-4">
                {{ "trip.itinerary.title" | translate }}
              </h2>
              <div class="space-y-6">
                @for (day of state.selectedTrip()!.itinerary; track day.day) {
                <div>
                  <h3 class="text-lg font-semibold text-primary-600 mb-2">{{"trip.itinerary.day" | translate}} {{ day.day }} - <span class="text-gray-600 text-sm font-normal">{{ day.description }}</span></h3>
                </div>
                }
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div class="lg:col-span-1 sticky top-0">
            <app-booking-form [trip]="state.selectedTrip()!" />
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class TripDetailsComponent implements OnInit {
  trip?: Trip;

  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faCalendar = faCalendar;
  faList = faList;
  faCheck = faCheck;
  faUtensils = faUtensils;
  faHotel = faHotel;
  faCar = faCar;
  faPlane = faPlane;
  faUmbrellaBeach = faUmbrellaBeach;
  faCamera = faCamera;
  faWifi = faWifi;
  protected faSpinner = faSpinner;

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private tripsService = inject(TripsService);
  protected state = inject(TripsStateService);

  ngOnInit() {
    this.state.setLoading(true);
    this.route.data.subscribe({
      next: (data: any) => { 
        this.trip = data['0'];
        this.state.setSelectedTrip(this.trip?? null);
        this.state.setLoading(false);
      },
      error: (error) => {
        this.state.setError(error.message);
      },
    });
  }

  ngOnDestroy() {
    this.state.setSelectedTrip(null);
  }
}
