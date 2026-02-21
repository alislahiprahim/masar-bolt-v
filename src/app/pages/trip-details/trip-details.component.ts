import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Trip } from '../../models/trip.model';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';
import { TripsService } from '../../services/trips.service';
import { TripsStateService } from '../../state/trips.state';
import { SafeHTMLPipe } from '../../pipes/safeHTML.pipe';
import { ImgUrlPipe } from '../../pipes/imgUrl.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { ImageGalleryComponent } from '../../components/image-slider/image-slider.component';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { ReviewListComponent } from '../../components/review-list/review-list.component';
import { AuthStateService } from '../../state/auth.state';

@Component({
  selector: 'app-trip-details',
  imports: [
    CommonModule,
    FontAwesomeModule,
    BookingFormComponent,
    TranslatePipe,
    SafeHTMLPipe,
    ImageGalleryComponent,
    BreadcrumpComponent,
    RouterLink,
    ReviewListComponent
  ],
  templateUrl: './trip-details.component.html',
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
  private authState = inject(AuthStateService);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private tripsService = inject(TripsService);
  protected state = inject(TripsStateService);

  currentUser = this.authState.user;

  ngOnInit() {
    this.state.setLoading(true);
    this.route.data.subscribe({
      next: (data: any) => {
        this.trip = data['0'];
        this.state.setSelectedTrip(this.trip ?? null);
        this.state.setLoading(false);
      },
      error: error => {
        this.state.setError(error.message);
      },
    });
  }

  ngOnDestroy() {
    this.state.setSelectedTrip(null);
  }
}
