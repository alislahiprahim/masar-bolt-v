import { Component } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faStar,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { Trip } from "../../models/trip.model";
import { TripCardComponent } from "../../components/trip-card/trip-card.component";
import { SearchFilterComponent } from "../../components/search-filter/search-filter.component";
import { CustomHeroSectionComponent } from "../../components/custom-hero-section/custom-hero-section.component";

@Component({
  selector: "app-trips",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TripCardComponent,
    SearchFilterComponent,
    CustomHeroSectionComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Header -->
      <app-custom-hero-section
        [bannerImg]="
          'https://images.unsplash.com/photo-1488085061387-422e29b40080'
        "
        [title]="'Explore Our Trips'"
        [subTitle]="
          'Discover handcrafted journeys to the world\`s most extraordinary destinations'
        "
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Search and Filters -->
        <app-search-filter />
        <!-- Trips Grid -->
        @if (filteredTrips.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (trip of filteredTrips; track trip.id) {
          <app-trip-card [trip]="trip" [rating]="4.8"></app-trip-card>
          }
        </div>
        } @else {
        <div class="text-center py-12">
          <p class="text-gray-600">No trips found matching your criteria.</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class TripsComponent {
  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
  faSearch = faSearch;
  faFilter = faFilter;

  // Filter states

  // Mock data for trips
  trips: Trip[] = [
    {
      id: "1",
      title: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      price: 1299,
      duration: 7,
      startDate: "2024-06-01",
      endDate: "2024-06-07",
      description:
        "Experience the magic of Bali with this week-long adventure. Explore ancient temples, relax on pristine beaches, and immerse yourself in the local culture.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      included: [],
      itinerary: [],
    },
    {
      id: "2",
      title: "Dubai Desert Safari",
      destination: "Dubai, UAE",
      price: 1599,
      duration: 5,
      startDate: "2024-07-15",
      endDate: "2024-07-20",
      description:
        "Embark on an unforgettable desert adventure in Dubai. Experience luxury camping, dune bashing, and traditional Arabian hospitality.",
      imageUrl: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3",
      included: [],
      itinerary: [],
    },
    {
      id: "3",
      title: "Turkish Delight",
      destination: "Istanbul, Turkey",
      price: 1099,
      duration: 6,
      startDate: "2024-08-10",
      endDate: "2024-08-16",
      description:
        "Discover the enchanting city where East meets West. Visit historic mosques, shop at the Grand Bazaar, and cruise the Bosphorus.",
      imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
      included: [],
      itinerary: [],
    },
    {
      id: "4",
      title: "Moroccan Magic",
      destination: "Marrakech, Morocco",
      price: 1399,
      duration: 8,
      startDate: "2024-09-01",
      endDate: "2024-09-08",
      description:
        "Journey through the vibrant souks, stunning riads, and Sahara Desert. Experience the rich culture and warm hospitality of Morocco.",
      imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70",
      included: [],
      itinerary: [],
    },
    {
      id: "5",
      title: "Greek Island Hopping",
      destination: "Greek Islands, Greece",
      price: 2199,
      duration: 10,
      startDate: "2024-06-15",
      endDate: "2024-06-25",
      description:
        "Explore the stunning Cyclades islands, from Santorini`s caldera to Mykonos`s windmills. Enjoy crystal-clear waters and charming villages.",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      included: [],
      itinerary: [],
    },
    {
      id: "6",
      title: "Japan Cherry Blossom Tour",
      destination: "Tokyo, Japan",
      price: 2499,
      duration: 9,
      startDate: "2024-03-25",
      endDate: "2024-04-03",
      description:
        "Experience Japan during the magical cherry blossom season. Visit ancient temples, modern cities, and picturesque gardens.",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      included: [],
      itinerary: [],
    },
  ];

  filteredTrips: Trip[] = this.trips;
}
