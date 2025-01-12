import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faPencilAlt, faDownload, 
  faBell, faCheck, faTrash, faPlane, faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
 import { ProfileHeaderComponent } from "../../components/profile/profile-header/profile-header.component";
 import { ProfileDetailsComponent } from "../../components/profile/profile-details/profile-details.component";
 import { ProfileTabsComponent } from "../../components/profile/profile-tabs/profile-tabs.component";
 import { ProfileTripsComponent } from "../../components/profile/profile-trips/profile-trips.component";
 import { ProfileInvoicesComponent } from "../../components/profile/profile-invoices/profile-invoices.component";
 import { ProfileNotificationsComponent } from "../../components/profile/profile-notifications/profile-notifications.component";

interface ProfileTab {
  id: 'details' | 'trips' | 'invoices' | 'notifications';
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
  selector: "app-profile",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ProfileHeaderComponent,
    ProfileDetailsComponent,
    ProfileTabsComponent,
    ProfileTripsComponent,
    ProfileInvoicesComponent,
    ProfileNotificationsComponent,
  ],
  template: `
    <app-profile-header [user]="user" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <app-profile-tabs
        [activeTab]="activeTab"
        (activeTabChange)="activeTab = $event"
      />

      <div [ngSwitch]="activeTab">
        @if (activeTab === 'details') {
        <app-profile-details
          [profileForm]="profileForm"
          (onSubmit)="onSubmit()"
        />
        } @if (activeTab === 'trips') {
        <app-profile-trips [bookings]="bookings" />
        } @if (activeTab === 'invoices') {
        <app-profile-invoices [invoices]="bookings" />
        } @if (activeTab === 'notifications') {
        <app-profile-notifications />
        }
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  activeTab: "details" | "trips" | "invoices" | "notifications" = "details";
  user: User | null = null;

  // Icons
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faPencilAlt = faPencilAlt;
  faDownload = faDownload;
  faBell = faBell;
  faCheck = faCheck;
  faTrash = faTrash;
  faPlane = faPlane;
  faReceipt = faReceipt;

  tabs: ProfileTab[] = [
    { id: "details", label: "Personal Details", icon: faUser },
    { id: "trips", label: "My Trips", icon: faPlane },
    { id: "invoices", label: "Invoices", icon: faReceipt },
    { id: "notifications", label: "Notifications", icon: faBell },
  ];

  // Mock data
  bookings: any[] = [
    {
      id: "1",
      tripName: "Bali Paradise Escape",
      date: "2024-06-01",
      status: "upcoming",
      amount: 1299,
    },
    {
      id: "2",
      tripName: "Dubai Desert Safari",
      date: "2024-03-15",
      status: "completed",
      amount: 1599,
    },
  ];

  invoices: Invoice[] = [
    {
      id: "INV-001",
      tripName: "Bali Paradise Escape",
      amount: 1299,
      date: "2024-02-15",
      status: "paid",
    },
    {
      id: "INV-002",
      tripName: "Dubai Desert Safari",
      amount: 1599,
      date: "2024-01-20",
      status: "paid",
    },
  ];

  notifications: Notification[] = [
    {
      id: "1",
      title: "Booking Confirmed",
      description: "Your booking for Bali Paradise Escape has been confirmed.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Special Offer",
      description: "Get 20% off on your next booking!",
      timestamp: "1 day ago",
      read: true,
    },
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: [""],
      preferredDestinations: [[]],
      travelStyle: [""],
      dietaryRestrictions: [""],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.profileForm.valid) {
      console.log("Profile form submitted:", this.profileForm.value);
      // TODO: Implement profile update logic
    }
  }
}