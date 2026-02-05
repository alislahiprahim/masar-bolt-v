import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone, faChevronDown, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-secondary-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="bg-gray-900 text-white text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-10">
          <!-- Contact Numbers -->
          <div class="flex items-center">
            <div class="hidden lg:flex items-center space-x-4">
              @for (number of contactNumbers; track number) {
                <a
                  [href]="'tel:' + number"
                  class="flex items-center hover:text-primary-400 transition-colors">
                  <fa-icon [icon]="faPhone" class="mx-2 text-primary-500"></fa-icon>
                  {{ number }}
                </a>
              }
            </div>

            <!-- Mobile Dropdown -->
            <div class="relative lg:hidden">
              <button
                (click)="toggleMobileNumbers()"
                class="flex items-center hover:text-primary-400 transition-colors">
                <fa-icon [icon]="faPhone" class="mx-2 text-primary-500"></fa-icon>
                Contact Us
                <fa-icon
                  [icon]="faChevronDown"
                  class="ml-1"
                  [class.rotate-180]="showMobileNumbers"></fa-icon>
              </button>

              @if (showMobileNumbers) {
                <div
                  class="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                  (clickOutside)="showMobileNumbers = false">
                  @for (number of contactNumbers; track number) {
                    <a
                      [href]="'tel:' + number"
                      class="block px-4 py-2 hover:bg-gray-700 transition-colors">
                      {{ number }}
                    </a>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex items-center gap-2">
            <a
              [href]="socialLinks.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-400 transition-colors">
              <fa-icon [icon]="faFacebook"></fa-icon>
              <span class="sr-only">Facebook</span>
            </a>
            <a
              [href]="socialLinks.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-400 transition-colors">
              <fa-icon [icon]="faInstagram"></fa-icon>
              <span class="sr-only">Instagram</span>
            </a>
            <a
              [href]="socialLinks.tiktok"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-400 transition-colors">
              <fa-icon [icon]="faTiktok"></fa-icon>
              <span class="sr-only">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SecondaryNavbarComponent {
  showMobileNumbers = false;

  // Contact Information
  contactNumbers = ['01093886054', '01009700165', '01068332615', '01115245726'];

  socialLinks = {
    tiktok: 'https://vt.tiktok.com/ZS6q4qepy/',
    instagram: 'https://www.instagram.com/masar_tours1?igsh=MTBpeWZ0M2ZhNmtmcg==',
    facebook: 'https://www.facebook.com/share/15w9kk7sjL/',
  };

  // Icons
  protected faPhone = faMobileAlt;
  protected faChevronDown = faChevronDown;
  protected faFacebook = faFacebookF;
  protected faInstagram = faInstagram;
  protected faTiktok = faTiktok;

  toggleMobileNumbers() {
    this.showMobileNumbers = !this.showMobileNumbers;
  }
}
