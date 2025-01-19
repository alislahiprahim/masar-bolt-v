import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faLocationDot,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, TranslateModule],
  template: `
    <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <!-- Newsletter Section -->
      <!-- <div class="border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div class="text-center md:text-left">
              <h3 class="text-2xl font-bold mb-2">
                {{ "footer.newsletter.title" | translate }}
              </h3>
              <p class="text-gray-400">
                {{ "footer.newsletter.subtitle" | translate }}
              </p>
            </div>
            <div class="w-full md:w-auto">
              <form class="flex gap-2">
                <input
                  type="email"
                  [placeholder]="'footer.newsletter.placeholder' | translate"
                  class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                />
                <button type="submit" class="btn-primary whitespace-nowrap">
                  <fa-icon [icon]="faPaperPlane" class="mx-2"></fa-icon>
                  {{ "footer.newsletter.subscribe" | translate }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <!-- Company Info -->
          <div class="space-y-6">
            <div class="flex items-center space-x-2">
              <img
                src="/assets/logo.png"
                alt="Masar Logo"
                class="h-10 w-auto"
              />
            </div>
            <p class="text-gray-400">{{ slogan }}</p>
            <div class="flex gap-2">
              <a
                [href]="socialLinks.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faFacebook" size="lg"></fa-icon>
                <span class="sr-only">Facebook</span>
              </a>
              <a
                [href]="socialLinks.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faInstagram" size="lg"></fa-icon>
                <span class="sr-only">Instagram</span>
              </a>
              <a
                [href]="socialLinks.tiktok"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faTiktok" size="lg"></fa-icon>
                <span class="sr-only">TikTok</span>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-6">
              {{ "footer.quickLinks" | translate }}
            </h3>
            <ul class="space-y-4">
              <li>
                <a
                  routerLink="/trips"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ "footer.links.destinations" | translate }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/gallery"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ "footer.links.gallery" | translate }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/reviews"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ "footer.links.reviews" | translate }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/about"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ "footer.links.about" | translate }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/contact"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ "footer.links.contact" | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-6">
              {{ "footer.contact" | translate }}
            </h3>
            <ul class="space-y-4">
              <!-- Headquarters -->
              <li class="flex items-start text-gray-400">
                <fa-icon
                  [icon]="faLocationDot"
                  class="mx-3 mt-1 text-primary-500"
                ></fa-icon>
                <div>
                  <p class="font-medium text-white">
                    {{ companyHeadquarters }}
                  </p>
                  @for (branch of branches; track branch.location) {
                  <div class="mt-2">
                    <p class="font-medium">{{ branch.location }}</p>
                    <p class="text-sm">{{ branch.address }}</p>
                  </div>
                  }
                </div>
              </li>

              <!-- Phone Numbers -->
              @for (number of contactNumbers; track number) {
              <li>
                <a
                  [href]="'tel:' + number"
                  class="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <fa-icon
                    [icon]="faPhone"
                    class="mx-3 text-primary-500"
                  ></fa-icon>
                  {{ number }}
                </a>
              </li>
              }
            </ul>
          </div>

          <!-- Working Hours -->
          <div>
            <h3 class="text-lg font-semibold mb-6">
              {{ "footer.workingHours" | translate }}
            </h3>
            <ul class="space-y-2 text-gray-400">
              <li class="flex justify-between">
                <span>{{ "footer.weekdays" | translate }}</span>
                <span>10:00 - 22:00</span>
              </li>
              <li class="flex justify-between">
                <span>{{ "footer.weekend" | translate }}</span>
                <span>10:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-700">
          <div
            class="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p class="text-gray-400 text-center md:text-left">
              &copy; {{ currentYear }} Masar. {{ "footer.rights" | translate }}
            </p>
            <div class="flex space-x-6">
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {{ "footer.privacy" | translate }}
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {{ "footer.terms" | translate }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Company Information
  companyHeadquarters = "مقر الشركة";
  branches = [
    {
      location: "فرع الفيوم",
      address: "شارع الرمله، أمام مطعم أسماك أفندينا",
    },
  ];
  slogan = "#رحله_واحده_بتقربنا_كلنا";
  contactNumbers = ["01093886054", "01009700165", "01068332615", "01115245726"];
  socialLinks = {
    tiktok: "https://vt.tiktok.com/ZS6q4qepy/",
    instagram:
      "https://www.instagram.com/masar_tours1?igsh=MTBpeWZ0M2ZhNmtmcg==",
    facebook: "https://www.facebook.com/share/15w9kk7sjL/",
  };

  // Icons
  protected faFacebook = faFacebookF;
  protected faInstagram = faInstagram;
  protected faTiktok = faTiktok;
  protected faEnvelope = faEnvelope;
  protected faPhone = faMobileAlt;
  protected faMapMarker = faMapMarkerAlt;
  protected faPaperPlane = faPaperPlane;
  protected faLocationDot = faLocationDot;
}