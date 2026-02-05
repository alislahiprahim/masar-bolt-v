import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faPencilAlt,
  faDownload,
  faBell,
  faCheck,
  faTrash,
  faPlane,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { ProfileHeaderComponent } from '../../components/profile/profile-header/profile-header.component';
import { ProfileDetailsComponent } from '../../components/profile/profile-details/profile-details.component';
import { ProfileTabsComponent } from '../../components/profile/profile-tabs/profile-tabs.component';
import { ProfileTripsComponent } from '../../components/profile/profile-trips/profile-trips.component';
import { ProfileInvoicesComponent } from '../../components/profile/profile-invoices/profile-invoices.component';
import { ProfileNotificationsComponent } from '../../components/profile/profile-notifications/profile-notifications.component';
import { ReservationsComponent } from '../reservations/reservations.component';
import { RouterOutlet } from '@angular/router';

interface ProfileTab {
  id: 'details' | 'trips' | 'invoices' | 'notifications' | 'reservations';
  label: string;
  icon: any;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface Invoice {
  id: string;
  tripName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

@Component({
  selector: 'app-profile',
  imports: [ProfileHeaderComponent, ProfileTabsComponent, RouterOutlet],
  template: `
    <app-profile-header [user]="user" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <app-profile-tabs />

      <div class="mt-8">
        <router-outlet />
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  user = this.authService.getCurrentUser();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {}
}
