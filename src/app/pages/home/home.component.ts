import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';
import { DestinationsSectionComponent } from '../../components/home/destinations-section/destinations-section.component';
import { PopularTripsSectionComponent } from '../../components/home/popular-trips-section/popular-trips-section.component';
import { TestimonialsSectionComponent } from '../../components/home/testimonials-section/testimonials-section.component';
import { GallerySectionComponent } from '../../components/home/gallary-section/gallary-section.component';
import { ServicesSectionComponent } from '../../components/home/service-section/service-section.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
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
        <p>{{ 'common.loading' | translate }}</p>
      </div>
    }
    @defer (on viewport) {
      <app-gallery-section />
    } @placeholder {
      <div class="h-20 flex items-center justify-center">
        <p>{{ 'common.loading' | translate }}</p>
      </div>
    }
    @defer (on viewport) {
      <app-testimonials-section />
    } @placeholder {
      <div class="h-20 flex items-center justify-center">
        <p>{{ 'common.loading' | translate }}</p>
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








  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'home page',
      description: 'home page',
      keywords: [
        'travel',
        'vacation',
        // this.trip.destination,
        'tour package',
        'holiday',
        'masar tavels'.toLowerCase(),
      ],
      ogImage: '/assets/logo.png',
      ogType: 'masar travel',
      twitterCard: 'summary_large_image',
    });
  }

  openLightbox(image: any): void {
    this.selectedImage = image;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }
}
