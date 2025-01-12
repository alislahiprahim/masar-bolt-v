import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
} from "@fortawesome/free-solid-svg-icons";
import { Trip } from '../../models/trip.model';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: "app-trip-details",
  imports: [CommonModule, RouterLink, FontAwesomeModule, BookingFormComponent],
  template: `
    @if (trip) {
    <!-- Hero Section -->
    <div class="relative h-[70vh] min-h-[500px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          [src]="trip.imageUrl"
          [alt]="trip.title"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"
        ></div>
      </div>

      <!-- Hero Content -->
      <div class="absolute inset-0 flex items-end">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
          <div class="max-w-3xl">
            <h1 class="text-5xl font-bold text-white mb-4">{{ trip.title }}</h1>
            <div class="flex flex-wrap gap-4 text-white/90">
              <div class="flex items-center">
                <fa-icon [icon]="faMapMarkerAlt" class="mx-2"></fa-icon>
                {{ trip.destination }}
              </div>
              <div class="flex items-center">
                <fa-icon [icon]="faClock" class="mx-2"></fa-icon>
                {{ trip.duration }} days
              </div>
              <div class="flex items-center">
                <fa-icon [icon]="faCalendar" class="mx-2"></fa-icon>
                {{ trip.startDate | date }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Trip Details -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Overview -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="p-6">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                  Trip Overview
                </h2>
                <p class="text-gray-600 leading-relaxed">
                  {{ trip.description }}
                </p>

                <!-- Highlights -->
                <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faHotel"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Luxury Hotels</span>
                  </div>
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faUtensils"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Gourmet Meals</span>
                  </div>
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faCar"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Private Transport</span>
                  </div>
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faCamera"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Photo Spots</span>
                  </div>
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faWifi"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Free Wi-Fi</span>
                  </div>
                  <div class="flex items-center p-3 bg-primary-50 rounded-lg">
                    <fa-icon
                      [icon]="faUmbrellaBeach"
                      class="text-primary-600 mx-3"
                    ></fa-icon>
                    <span class="text-sm text-gray-700">Beach Access</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- What's Included -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                  <fa-icon
                    [icon]="faCheck"
                    class="mx-2 text-primary-600"
                  ></fa-icon>
                  What's Included
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @for (item of trip.included; track item) {
                  <div class="flex items-start">
                    <div class="flex-shrink-0 h-5 w-5 text-primary-600">
                      <fa-icon [icon]="faCheck"></fa-icon>
                    </div>
                    <p class="ml-3 text-gray-600">{{ item }}</p>
                  </div>
                  }
                </div>
              </div>
            </div>

            <!-- Itinerary -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">
                  Daily Itinerary
                </h2>
                <div class="space-y-8">
                  @for (day of trip.itinerary; track day.day) {
                  <div class="relative flex gap-6">
                    <!-- Day Circle -->
                    <div class="flex-none">
                      <div
                        class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-primary-600 font-semibold"
                          >Day {{ day.day }}</span
                        >
                      </div>
                      @if (!$last) {
                      <div
                        class="absolute top-16 bottom-0 left-8 w-0.5 bg-primary-100"
                      ></div>
                      }
                    </div>
                    <!-- Description -->
                    <div class="flex-grow pt-3">
                      <p class="text-gray-600 leading-relaxed">
                        {{ day.description }}
                      </p>
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div class="lg:col-span-1">
            <div class="sticky top-24">
              @if (authService.isAuthenticated()) {
              <app-booking-form [trip]="trip"></app-booking-form>
              } @else {
              <div class="bg-white p-6 rounded-xl shadow-sm text-center">
                <div
                  class="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                >
                  <fa-icon
                    [icon]="faPlane"
                    class="text-2xl text-primary-600"
                  ></fa-icon>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Book?
                </h3>
                <p class="text-gray-600 mb-6">
                  Sign in to book this amazing trip and start your adventure
                </p>
                <a
                  routerLink="/auth/login"
                  [queryParams]="{ returnUrl: '/trips/' + trip.id }"
                  class="btn-primary inline-block w-full"
                >
                  Sign In to Book
                </a>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="flex justify-center items-center h-96">
      <div class="animate-pulse">
        <p class="text-gray-600">Loading trip details...</p>
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

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    // Mock data loading
    this.trip = {
      id: "1",
      title: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      price: 1299,
      duration: 7,
      startDate: "2024-06-01",
      endDate: "2024-06-07",
      description:
        "Experience the magic of Bali with this week-long adventure. Explore ancient temples, relax on pristine beaches, and immerse yourself in the local culture. This carefully curated trip includes luxury accommodation, guided tours, and authentic local experiences. From the vibrant streets of Ubud to the serene beaches of Nusa Dua, every moment of your journey is designed to create unforgettable memories.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      included: [
        "Luxury hotel accommodation",
        "Daily breakfast and selected meals",
        "Private guided cultural tours",
        "Airport transfers",
        "All local transportation",
        "Professional tour guide",
        "Welcome dinner and cultural show",
        "Spa treatment session",
        "Cooking class with local chef",
        "Traditional craft workshop",
      ],
      itinerary: [
        {
          day: 1,
          description:
            "Arrive in Bali and transfer to your luxury resort. Enjoy a welcome dinner featuring traditional Balinese dance performances.",
        },
        {
          day: 2,
          description:
            "Visit the iconic temples of Tanah Lot and Uluwatu. Watch the sunset and enjoy a beachside seafood dinner.",
        },
        {
          day: 3,
          description:
            "Explore the cultural heart of Ubud, visit art galleries, the sacred Monkey Forest, and traditional craft villages.",
        },
        {
          day: 4,
          description:
            "Early morning trek to Mount Batur for sunrise, followed by a relaxing soak in natural hot springs.",
        },
        {
          day: 5,
          description:
            "Beach day at Nusa Dua with optional water sports activities. Evening spa treatment included.",
        },
        {
          day: 6,
          description:
            "Participate in a traditional cooking class and learn about Balinese spices and cooking techniques.",
        },
        {
          day: 7,
          description:
            "Free morning for shopping or relaxation. Transfer to airport for departure.",
        },
      ],
    };

    if (this.trip) {
      this.seoService.updateSeo({
        title: this.trip.title,
        description: this.trip.description,
        keywords: [
          "travel",
          "vacation",
          this.trip.destination,
          "tour package",
          "holiday",
          this.trip.title.toLowerCase(),
        ],
        ogImage: this.trip.imageUrl,
        ogType: "product",
        twitterCard: "summary_large_image",
      });

      // Set canonical URL
      this.seoService.setCanonicalUrl();
    }
  }
}