import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faBell, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-profile-notifications',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">
          {{ 'profile.notifications.title' | translate }}
        </h3>
        <button class="text-sm text-primary-600 hover:text-primary-700" (click)="markAllAsRead()">
          {{ 'profile.notifications.markAllRead' | translate }}
        </button>
      </div>

      @for (notification of notifications; track notification.id) {
        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          [class.opacity-75]="notification.read">
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div
                [class]="
                  'rounded-full p-2 ' +
                  (notification.type === 'info'
                    ? 'bg-blue-100 text-blue-600'
                    : notification.type === 'success'
                      ? 'bg-green-100 text-green-600'
                      : notification.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600')
                ">
                <fa-icon [icon]="faBell"></fa-icon>
              </div>

              <div class="flex-1">
                <p class="text-gray-900" [class.font-medium]="!notification.read">
                  {{ notification.message }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ notification.date | date: 'medium' }}
                </p>
              </div>

              <button
                class="text-gray-400 hover:text-gray-500"
                (click)="toggleRead(notification)"
                [title]="
                  (notification.read
                    ? 'profile.notifications.markUnread'
                    : 'profile.notifications.markRead'
                  ) | translate
                ">
                <fa-icon [icon]="notification.read ? faTimes : faCheck"></fa-icon>
              </button>
            </div>
          </div>
        </div>
      }
      @if (notifications.length === 0) {
        <div class="text-center py-12">
          <div class="rounded-full bg-gray-100 p-3 mx-auto w-fit mb-4">
            <fa-icon [icon]="faBell" class="text-2xl text-gray-400"></fa-icon>
          </div>
          <p class="text-gray-500">
            {{ 'profile.notifications.empty' | translate }}
          </p>
        </div>
      }
    </div>
  `,
})
export class ProfileNotificationsComponent {
  notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      message: 'Your booking for Bali Paradise Escape has been confirmed!',
      date: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      message: 'New travel deals available for your favorite destinations!',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: true,
    },
  ];

  faBell = faBell;
  faCheck = faCheck;
  faTimes = faTimes;

  toggleRead(notification: Notification) {
    notification.read = !notification.read;
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }
}
