import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faTimesCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'telegram-status-badge',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, TranslateModule],
    template: `
    <div 
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
      [ngClass]="isLinked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
    >
      <fa-icon [icon]="isLinked ? faCheckCircle : faPaperPlane" class="mr-2"></fa-icon>
      
      <span *ngIf="isLinked">
        {{ 'telegram.connected' | translate }} 
        <span *ngIf="showUsername && telegramUsername" class="font-bold ml-1">
          {{ telegramUsername }}
        </span>
      </span>
      
      <span *ngIf="!isLinked">
        {{ 'telegram.not_connected' | translate }}
      </span>
    </div>
  `
})
export class TelegramStatusBadgeComponent {
    @Input() isLinked: boolean = false;
    @Input() telegramUsername: string | null = null;
    @Input() showUsername: boolean = true;

    faCheckCircle = faCheckCircle;
    faTimesCircle = faTimesCircle;
    faPaperPlane = faPaperPlane;
}
