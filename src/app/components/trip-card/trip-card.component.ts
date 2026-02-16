import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Trip } from '../../models/trip.model';
import { ImgUrlPipe } from '../../pipes/imgUrl.pipe';
import { SafeHTMLPipe } from '../../pipes/safeHTML.pipe';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, RouterLink, FontAwesomeModule, TranslateModule, ImgUrlPipe, SafeHTMLPipe],
  templateUrl: './trip-card.component.html',
})
export class TripCardComponent {
  protected router = inject(Router);
  @Input({ required: true }) trip!: Trip;
  @Input() rating: number = 4.8;

  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faStar = faStar;
}
