import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane, faSpinner, faUnlink, faCheck } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TelegramService } from '../../../services/telegram.service';
import { TelegramStatusBadgeComponent } from '../telegram-status-badge/telegram-status-badge.component';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-telegram-connection',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
    TelegramStatusBadgeComponent
  ],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <fa-icon [icon]="faPaperPlane" class="text-blue-500 mr-2"></fa-icon>
            {{ 'telegram.title' | translate }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ 'telegram.description' | translate }}
          </p>
        </div>
        
        <div class="mt-4 sm:mt-0">
          <telegram-status-badge 
            [isLinked]="(telegramService.isLinked$ | async) || false"
            [telegramUsername]="(telegramService.telegramUsername$ | async)"
          ></telegram-status-badge>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center py-4">
          <fa-icon [icon]="faSpinner" class="text-blue-500 text-xl"></fa-icon>
        </div>

        <!-- Call to Action -->
        <div *ngIf="!loading" class="mt-2">
          <!-- Not Connected -->
          <div *ngIf="!(telegramService.isLinked$ | async)" class="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              (click)="connect()" 
              class="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <fa-icon [icon]="faPaperPlane" class="mr-2"></fa-icon>
              {{ 'telegram.connect_button' | translate }}
            </button>
            <p class="text-xs text-gray-400">
              {{ 'telegram.connect_hint' | translate }}
            </p>
          </div>

          <!-- Connected -->
          <div *ngIf="(telegramService.isLinked$ | async)" class="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              (click)="disconnect()" 
              class="w-full sm:w-auto px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
            >
              <fa-icon [icon]="faUnlink" class="mr-2"></fa-icon>
              {{ 'telegram.disconnect_button' | translate }}
            </button>
            
            <!-- Test Notification (Admin only - optional visibility) -->
            <!-- 
            <button 
              (click)="sendTest()" 
              class="text-sm text-gray-500 hover:text-blue-500 underline"
            >
              Test Notification
            </button> 
            -->
          </div>
        </div>
      </div>
    </div>
  `
})
export class TelegramConnectionComponent implements OnInit, OnDestroy {
  loading = false;
  faPaperPlane = faPaperPlane;
  faSpinner = faSpinner;
  faUnlink = faUnlink;
  faCheck = faCheck;

  private pollingSub?: Subscription;

  constructor(public telegramService: TelegramService) { }

  ngOnInit(): void {
    // Initial status check
    this.refreshStatus();
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  refreshStatus(): void {
    this.loading = true;
    this.telegramService.getStatus()
      .pipe(finalize(() => this.loading = false))
      .subscribe();
  }

  connect(): void {
    this.loading = true;
    this.telegramService.generateLink()
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        if (response && response.deepLink) {
          window.open(response.deepLink, '_blank', 'noopener,noreferrer');
        }
      });
  }

  disconnect(): void {
    if (confirm('Are you sure you want to disconnect your Telegram account? You will stop receiving notifications.')) {
      this.loading = true;
      this.telegramService.unlinkAccount()
        .pipe(finalize(() => this.loading = false))
        .subscribe();
    }
  }

  sendTest(): void {
    this.telegramService.sendTestNotification().subscribe();
  }
}
