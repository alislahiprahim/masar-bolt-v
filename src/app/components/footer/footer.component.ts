import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-footer",
  imports: [RouterLink, FontAwesomeModule],
  template: `
    <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <!-- Newsletter Section -->
      <div class="border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div class="text-center md:text-left">
              <h3 class="text-2xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p class="text-gray-400">
                Stay updated with our latest travel deals and adventures
              </p>
            </div>
            <div class="w-full md:w-auto">
              <form class="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                />
                <button type="submit" class="btn-primary whitespace-nowrap">
                  <fa-icon [icon]="faPaperPlane" class="mr-2"></fa-icon>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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
            <p class="text-gray-400">
              Your trusted travel partner for unforgettable adventures around
              the world.
            </p>
            <div class="flex space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                class="text-gray-400 hover:text-primary-500 transition-colors "
              >
                <fa-icon [icon]="faFacebook" size="lg"></fa-icon>
                <span class="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faInstagram" size="lg"></fa-icon>
                <span class="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faTwitter" size="lg"></fa-icon>
                <span class="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faYoutube" size="lg"></fa-icon>
                <span class="sr-only">YouTube</span>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <fa-icon [icon]="faLinkedin" size="lg"></fa-icon>
                <span class="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Quick Links</h3>
            <ul class="space-y-4">
              <li>
                <a
                  routerLink="/trips"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  routerLink="/gallery"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  routerLink="/reviews"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  routerLink="/about"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  routerLink="/contact"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Support</h3>
            <ul class="space-y-4">
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Contact Us</h3>
            <ul class="space-y-4">
              <li class="flex items-center text-gray-400">
                <fa-icon
                  [icon]="faMapMarker"
                  class="mx-2 text-primary-500"
                ></fa-icon>
                123 Travel Street, City, Country
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  class="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <fa-icon
                    [icon]="faPhone"
                    class="mx-2 text-primary-500"
                  ></fa-icon>
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@masar.com"
                  class="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <fa-icon
                    [icon]="faEnvelope"
                    class="mx-2 text-primary-500"
                  ></fa-icon>
                  contactmasar.com
                </a>
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
              &copy; {{ currentYear }} Masar. All rights reserved.
            </p>
            <div class="flex space-x-6">
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
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

  // Icons
  faFacebook = faFacebookF;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  faYoutube = faYoutube;
  faLinkedin = faLinkedinIn;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMapMarker = faMapMarkerAlt;
  faPaperPlane = faPaperPlane;
}