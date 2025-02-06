import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import {
  faClock,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Reservation } from "../../models/reservation.model";
import { Trip } from "../../models/trip.model";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-ticket",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div class="ticket-container">
      <div class="ticket-layout">
        <!-- Left Column: Trip Image -->
        <div class="ticket-image">
          <img
            src="https://img.freepik.com/free-photo/swimming-pool_74190-2115.jpg?ga=GA1.1.732563681.1732377385&semt=ais_incoming"
            [alt]="trip.name"
          />
        </div>

        <!-- Right Column: Ticket Details -->
        <div class="ticket-details">
          <!-- Header -->
          <div class="ticket-header">
            <img src="src/assets/icon.png" alt="Masar Logo" class="logo" />
            <div class="title">
              <h1>
                {{
                  languageService.getCurrentLang() === "ar"
                    ? "مسار للسياحة"
                    : "Masar Travel"
                }}
              </h1>
              <p>{{ "ticket.subtitle" | translate }}</p>
            </div>
          </div>

          <!-- Trip Details -->
          <div class="trip-info">
            <div>
              <span>{{ "ticket.date" | translate }}:</span>
              <strong>{{ trip.date | date }}</strong>
            </div>
            <div>
              <span>{{ "ticket.time" | translate }}:</span>
              <strong>{{ trip.date }}</strong>
            </div>
            <div>
              <span>{{ "ticket.location" | translate }}:</span>
              <strong>{{ trip.destination }}</strong>
            </div>
            <div>
              <span>{{ "ticket.travelers" | translate }}:</span>
              <strong>{{ reservation.numberOfTravelers }}</strong>
            </div>
            <div>
              <span>{{ "ticket.contact" | translate }}:</span>
              <strong>{{ reservation.whatsappNumber }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="ticket-footer">
        <p>{{ "ticket.instructions" | translate }}</p>
        <p>{{ "ticket.validationNote" | translate }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      /* Ticket Container */
      .ticket-container {
        width: 800px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Layout: Image on Left, Details on Right */
      .ticket-layout {
        display: flex;
        flex-direction: row;
        width: 100%;
      }

      /* Trip Image */
      .ticket-image {
        flex: 1;
      }

      .ticket-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px 0 0 10px;
      }

      /* Ticket Details */
      .ticket-details {
        flex: 2;
        padding: 20px;
      }

      /* Header */
      .ticket-header {
        display: flex;
        align-items: center;
        gap: 10px;
        border-bottom: 2px solid #ddd;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }

      .logo {
        width: 50px;
        height: 50px;
      }

      .ticket-header h1 {
        font-size: 22px;
        margin: 0;
        color: #2c3e50;
      }

      .ticket-header p {
        font-size: 14px;
        color: #7f8c8d;
      }

      /* Barcode Section */
      .barcode-section {
        text-align: center;
        margin: 15px 0;
      }

      .barcode-section img {
        height: 40px;
      }

      .barcode-text {
        font-size: 12px;
        color: #777;
      }

      /* Trip Info */
      .trip-info {
        margin-top: 15px;
      }

      .trip-title {
        font-size: 18px;
        font-weight: bold;
        color: #34495e;
        margin-bottom: 10px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .info-row .icon {
        font-size: 18px;
        color: #2980b9;
      }

      .info-row label {
        font-size: 12px;
        color: #7f8c8d;
        display: block;
      }

      .info-row span {
        font-size: 14px;
        font-weight: bold;
      }

      /* Footer */
      .ticket-footer {
        margin-top: 20px;
        text-align: center;
        padding-top: 10px;
        border-top: 2px solid #ddd;
      }

      .ticket-footer p {
        font-size: 14px;
        color: #2c3e50;
        font-weight: bold;
      }

      .note {
        font-size: 12px;
        color: #777;
      }

      /* Print Styles */
      @media print {
        body {
          background: none;
          padding: 0;
        }

        .ticket-container {
          width: 100%;
          box-shadow: none;
          border: none;
          padding: 10px;
        }

        .ticket-header,
        .barcode-section,
        .trip-info,
        .ticket-footer {
          page-break-inside: avoid;
        }

        .ticket-image {
          display: none;
        }
      }
    `,
  ],
})
export class TicketComponent {
  @Input({ required: true }) reservation!: Reservation;
  @Input({ required: true }) trip!: Trip;

  // Icons
  protected faCalendarAlt = faCalendarAlt;
  protected faClock = faClock;
  protected faMapMarkerAlt = faMapMarkerAlt;
  protected faUsers = faUsers;
  protected faPhone = faPhone;

  constructor(protected languageService: LanguageService) {}
}
