import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faSearch,
  faStar,
  faPlane,
  faHotel,
  faRoute,
  faGlobe,
  faExpand,
  faTimes,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { HeroSectionComponent } from "../../components/home/hero-section/hero-section.component";
import { DestinationsSectionComponent } from "../../components/home/destinations-section/destinations-section.component";
import { PopularTripsSectionComponent } from "../../components/home/popular-trips-section/popular-trips-section.component";
import { TestimonialsSectionComponent } from "../../components/home/testimonials-section/testimonials-section.component";
import { GallerySectionComponent } from "../../components/home/gallary-section/gallary-section.component";
import { ServicesSectionComponent } from "../../components/home/service-section/service-section.component";
import { TranslateModule } from "@ngx-translate/core";
import { SeoService } from "../../services/seo.service";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    FontAwesomeModule,
    ServicesSectionComponent,
    DestinationsSectionComponent,
    PopularTripsSectionComponent,
    GallerySectionComponent,
    TestimonialsSectionComponent,
    HeroSectionComponent,
    TranslateModule,
  ],
  template: ` <app-hero-section />

    <app-services-section />
    <app-destinations-section #destinationsSection />
    @defer (on viewport(destinationsSection)) {
    <app-popular-trips-section />
    } @placeholder {
    <div class="h-20 flex items-center justify-center">
      <p>{{ "common.loading" | translate }}</p>
    </div>
    } @defer (on viewport) {
    <app-gallery-section />
    } @placeholder {
    <div class="h-20 flex items-center justify-center">
      <p>{{ "common.loading" | translate }}</p>
    </div>
    } @defer (on viewport) {
    <app-testimonials-section />
    } @placeholder {
    <div class="h-20 flex items-center justify-center">
      <p>{{ "common.loading" | translate }}</p>
    </div>
    }`,
})
export class HomeComponent implements OnInit {
  seoService = inject(SeoService);
  faSearch = faSearch;
  faStar = faStar;
  faPlane = faPlane;
  faHotel = faHotel;
  faRoute = faRoute;
  faGlobe = faGlobe;
  faExpand = faExpand;
  faTimes = faTimes;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;

  selectedImage: any | null = null;

  popularTrips: any[] = [
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
  ];
  services = [
    {
      icon: this.faPlane,
      title: "Flight Bookings",
      description: "Find the best deals on flights to your dream destinations.",
    },
    {
      icon: this.faHotel,
      title: "Luxury Hotels",
      description: "Stay in hand-picked luxury accommodations worldwide.",
    },
    {
      icon: this.faRoute,
      title: "Guided Tours",
      description: "Experience local culture with our expert guides.",
    },
    {
      icon: this.faGlobe,
      title: "Custom Packages",
      description: "Tailor-made travel packages to suit your preferences.",
    },
  ];

  destinations = [
    {
      title: "Bali, Indonesia",
      description: "Paradise island with rich culture",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    },
    {
      title: "Santorini, Greece",
      description: "Stunning sunsets and white architecture",
      image: "https://images.unsplash.com/photo-1570077188670-6e65c2d60666",
    },
    {
      title: "Swiss Alps",
      description: "Majestic mountains and scenic views",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
    },
  ];

  testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      comment:
        "Amazing experience! The trip was perfectly organized and exceeded all our expectations.",
    },
    {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      comment:
        "Professional service and incredible destinations. Will definitely book again!",
    },
    {
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      comment:
        "The attention to detail and personalized service made our trip unforgettable.",
    },
  ];

  galleryImages: any[] = [
    {
      url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
      title: "Tropical Paradise",
      location: "Bali, Indonesia",
    },
    {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      title: "Mountain Retreat",
      location: "Swiss Alps",
    },
    {
      url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      title: "Venice Canals",
      location: "Venice, Italy",
    },
    {
      url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be",
      title: "Desert Adventure",
      location: "Dubai, UAE",
    },
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      title: "Paris Landmarks",
      location: "Paris, France",
    },
    {
      url: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd",
      title: "Japanese Gardens",
      location: "Kyoto, Japan",
    },
  ];

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: "home page",
      description: "home page",
      keywords: [
        "travel",
        "vacation",
        // this.trip.destination,
        "tour package",
        "holiday",
        "masar tavels".toLowerCase(),
      ],
      ogImage: "/assets/logo.png",
      ogType: "masar travel",
      twitterCard: "summary_large_image",
    });
  }

  openLightbox(image: any): void {
    this.selectedImage = image;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }
}
