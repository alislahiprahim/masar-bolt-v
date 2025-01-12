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
import { Booking } from '../../models/booking.model';

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
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-600 to-primary-800 py-16">
      <div class="absolute inset-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080"
             alt="Profile Background"
             class="w-full h-full object-cover opacity-10">
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-8">
          <!-- Profile Picture -->
          <div class="relative">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white">
              <img [src]="user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.firstName + '+' + user?.lastName"
                   [alt]="user?.firstName"
                   class="w-full h-full object-cover">
            </div>
            <button class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
              <fa-icon [icon]="faPencilAlt" class="text-primary-600 text-sm"></fa-icon>
            </button>
          </div>
          
          <!-- User Info -->
          <div>
            <h1 class="text-3xl font-bold text-white">
              Welcome back, {{ user?.firstName }}!
            </h1>
            <p class="text-primary-100 mt-1">Manage your profile and explore your travel journey</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8">
        @for (tab of tabs; track tab.id) {
          <button 
            (click)="activeTab = tab.id"
            [class]="'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ' + 
                    (activeTab === tab.id ? 
                      'bg-primary-600 text-white shadow-lg scale-[1.02]' : 
                      'text-gray-600 hover:bg-gray-50')"
          >
            <fa-icon [icon]="tab.icon" class="mr-2"></fa-icon>
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Tab Content -->
      <div [ngSwitch]="activeTab">
        <!-- Personal Details Tab -->
        @if (activeTab === 'details') {
          <div class="bg-white rounded-xl shadow-sm p-6">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    First name
                  </label>
                  <input type="text" 
                         formControlName="firstName"
                         class="input-field mt-1">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    Last name
                  </label>
                  <input type="text" 
                         formControlName="lastName"
                         class="input-field mt-1">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
                    Email
                  </label>
                  <input type="email" 
                         formControlName="email"
                         class="input-field mt-1">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faPhone" class="mr-2"></fa-icon>
                    Phone number
                  </label>
                  <input type="tel" 
                         formControlName="phoneNumber"
                         class="input-field mt-1">
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Travel Preferences</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm text-gray-700">Preferred destinations</label>
                    <select multiple 
                            formControlName="preferredDestinations"
                            class="input-field mt-1">
                      <option value="beach">Beach destinations</option>
                      <option value="mountain">Mountain destinations</option>
                      <option value="city">City breaks</option>
                      <option value="cultural">Cultural experiences</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm text-gray-700">Travel style</label>
                    <select formControlName="travelStyle"
                            class="input-field mt-1">
                      <option value="luxury">Luxury</option>
                      <option value="adventure">Adventure</option>
                      <option value="budget">Budget-friendly</option>
                      <option value="family">Family-oriented</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm text-gray-700">Dietary restrictions</label>
                    <input type="text" 
                           formControlName="dietaryRestrictions"
                           class="input-field mt-1"
                           placeholder="e.g., vegetarian, gluten-free">
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-4">
                <button type="button" 
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit"
                        class="btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        }

        <!-- My Trips Tab -->
        @if (activeTab === 'trips') {
          <div class="space-y-6">
            @for (booking of bookings; track booking.id) {
              <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="p-6">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">{{ booking.tripName }}</h3>
                      <p class="text-gray-600">{{ booking.date | date }}</p>
                    </div>
                    <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + 
                                 (booking.status === 'upcoming' ? 'bg-primary-100 text-primary-800' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800')">
                      {{ booking.status | titlecase }}
                    </span>
                  </div>
                  
                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button class="text-primary-600 hover:text-primary-700 font-medium">
                        View Details
                      </button>
                      <button class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                        <fa-icon [icon]="faDownload" class="mr-2"></fa-icon>
                        Download Confirmation
                      </button>
                    </div>
                    <span class="text-lg font-semibold text-primary-600">
                      {{ booking.amount | currency }}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Invoices Tab -->
        @if (activeTab === 'invoices') {
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (invoice of invoices; track invoice.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{{ invoice.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ invoice.tripName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ invoice.amount | currency }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ invoice.date | date }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                                   (invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')">
                        {{ invoice.status | titlecase }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-primary-600 hover:text-primary-900">
                        <fa-icon [icon]="faDownload" class="mr-1"></fa-icon>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Notifications Tab -->
        @if (activeTab === 'notifications') {
          <div class="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
            <div class="p-4 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Recent Notifications</h3>
              <div class="flex space-x-4">
                <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  <fa-icon [icon]="faCheck" class="mr-2"></fa-icon>
                  Mark all as read
                </button>
                <button class="text-sm text-red-600 hover:text-red-700 font-medium">
                  <fa-icon [icon]="faTrash" class="mr-2"></fa-icon>
                  Clear all
                </button>
              </div>
            </div>
            
            @for (notification of notifications; track notification.id) {
              <div [class]="'p-4 hover:bg-gray-50 transition-colors ' + 
                           (notification.read ? 'opacity-60' : '')">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                    <p class="mt-1 text-sm text-gray-600">{{ notification.description }}</p>
                    <span class="mt-2 text-xs text-gray-500">{{ notification.timestamp }}</span>
                  </div>
                  @if (!notification.read) {
                    <span class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full"></span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  activeTab: 'details' | 'trips' | 'invoices' | 'notifications' = 'details';
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
    { id: 'details', label: 'Personal Details', icon: faUser },
    { id: 'trips', label: 'My Trips', icon: faPlane },
    { id: 'invoices', label: 'Invoices', icon: faReceipt },
    { id: 'notifications', label: 'Notifications', icon: faBell }
  ];

  // Mock data
  bookings: any[] = [
    {
      id: '1',
      tripName: 'Bali Paradise Escape',
      date: '2024-06-01',
      status: 'upcoming',
      amount: 1299
    },
    {
      id: '2',
      tripName: 'Dubai Desert Safari',
      date: '2024-03-15',
      status: 'completed',
      amount: 1599
    }
  ];

  invoices: Invoice[] = [
    {
      id: 'INV-001',
      tripName: 'Bali Paradise Escape',
      amount: 1299,
      date: '2024-02-15',
      status: 'paid'
    },
    {
      id: 'INV-002',
      tripName: 'Dubai Desert Safari',
      amount: 1599,
      date: '2024-01-20',
      status: 'paid'
    }
  ];

  notifications: Notification[] = [
    {
      id: '1',
      title: 'Booking Confirmed',
      description: 'Your booking for Bali Paradise Escape has been confirmed.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Special Offer',
      description: 'Get 20% off on your next booking!',
      timestamp: '1 day ago',
      read: true
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      preferredDestinations: [[]],
      travelStyle: [''],
      dietaryRestrictions: ['']
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        preferredDestinations: this.user.preferences?.preferredDestinations,
        travelStyle: this.user.preferences?.travelStyle,
        dietaryRestrictions: this.user.preferences?.dietaryRestrictions?.join(', ')
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile form submitted:', this.profileForm.value);
      // TODO: Implement profile update logic
    }
  }
}