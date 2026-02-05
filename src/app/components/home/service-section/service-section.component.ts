import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlane, faHotel, faRoute, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-services-section',
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <section class="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 section-header">
          {{ 'home.services.title' | translate }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (service of services; track service.title) {
            <div class="glass-container p-6 hover-card">
              <div class="text-primary-500 text-3xl mb-4">
                <fa-icon [icon]="service.icon"></fa-icon>
              </div>
              <h3 class="text-xl font-semibold mb-2">
                {{ service.title | translate }}
              </h3>
              <p class="text-gray-600">{{ service.description | translate }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  faPlane = faPlane;
  faHotel = faHotel;
  faRoute = faRoute;
  faGlobe = faGlobe;

  services = [
    {
      icon: this.faPlane,
      title: 'home.services.flight.title',
      description: 'home.services.flight.description',
    },
    {
      icon: this.faHotel,
      title: 'home.services.hotel.title',
      description: 'home.services.hotel.description',
    },
    {
      icon: this.faRoute,
      title: 'home.services.tours.title',
      description: 'home.services.tours.description',
    },
    {
      icon: this.faGlobe,
      title: 'home.services.packages.title',
      description: 'home.services.packages.description',
    },
  ];
}
