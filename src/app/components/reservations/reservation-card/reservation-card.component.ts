import {
  Component,
  Input,
  Output,
  EventEmitter,
  viewChild,
  ElementRef,
  inject,
} from "@angular/core";
import { CommonModule, formatDate } from "@angular/common";
import {
  FaIconComponent,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import {
  faEdit,
  faTrash,
  faDownload,
  faSpinner,
  faCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { Reservation } from "../../../models/reservation.model";
import { RouterLink } from "@angular/router";
import { PrintService } from "../../../services/print.service";
import { QRCodeComponent } from "angularx-qrcode";
import { environment } from "../../../../environments/environment.development";

@Component({
  selector: "app-reservation-card",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FaIconComponent,
    RouterLink,
    QRCodeComponent,
  ],
  template: `
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="p-6">
        <!-- Reservation Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              <a
                class="text-primary-600 hover:text-primary-700"
                [routerLink]="['/trips', reservation.trip.id]"
              >
                {{ reservation.trip.name }}
              </a>
            </h3>
            <p class="text-sm text-gray-500">
              {{ "reservations.booking" | translate }} #{{ reservation.id }}
            </p>
          </div>
          <span [class]="getStatusClasses()">
            {{ "reservations.status." + reservation.status | translate }}
          </span>
        </div>

        <!-- Reservation Details -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{
              "reservations.travelers" | translate
            }}</span>
            <span class="font-medium">{{ reservation.numberOfTravelers }}</span>
          </div>
          <div *ngIf="reservation.tripHotel" class="flex justify-between text-sm">
            <span class="text-gray-600">{{
              "booking.Hotel" | translate
            }}</span>
            <span class="font-medium">{{
              reservation.tripHotel.hotel?.name
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{
              "reservations.totalPrice" | translate
            }}</span>
            <span class="font-medium">{{
              reservation.totalPrice | currency
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{
              "reservations.date" | translate
            }}</span>
            <span class="font-medium">{{ reservation.createdAt | date }}</span>
          </div>
        </div>
          

        <!-- Actions -->
        <div class="flex justify-between items-center">
          <div class="flex flex-row gap-2">
            @if (reservation.isEditable) {
            <button (click)="onEdit.emit()" class="btn-secondary text-sm">
              <fa-icon [icon]="faEdit" class="mx-2"></fa-icon>
              {{ "common.edit" | translate }}
            </button>
            <button (click)="onCancel.emit()" class="btn-danger text-sm">
              <fa-icon [icon]="faTrash" class="mx-2"></fa-icon>
              {{ "common.cancel" | translate }}
            </button>
            }
          </div>

          <div class="flex flex-row gap-2">
            @if (reservation.status === 'PAID' || reservation.status ===
            'COMPLETED') {
            <button
              (click)="
                printService.exportTicket(
                  reservation,
                  this.qrcode(),
                  'download'
                )
              "
              class="btn-secondary text-sm"
            >
              <fa-icon [icon]="faDownload" class="mx-2"></fa-icon>
              {{ "reservations.downloadTicket" | translate }}
            </button>
            <!-- <button class="btn-secondary text-sm">
              <fa-icon [icon]="faDownload" class="mx-2"></fa-icon>
              {{ "reservations.downloadInvoice" | translate }}
            </button> -->
            }
          </div>
        </div>

        <!-- payment Button -->
        @if (reservation.status === 'CONFIRMED') {
        <!-- TODO: add payment button second version -->
        <!--           
        <div class="mt-4 border-t pt-4">
          <button
            (click)="onConfirm.emit()"
            [disabled]="isProcessing"
            class="w-full btn-primary flex justify-center items-center"
          >
            @if (isProcessing) {
            <fa-icon [icon]="faSpinner" class="mx-2"></fa-icon>
            {{ "reservations.processing" | translate }}
            } @else {
            <fa-icon [icon]="faCreditCard" class="mx-2"></fa-icon>
            {{ "reservations.goToPayment" | translate }}
            }
          </button>
        </div> -->
        <!-- implement a message that says the reservation is confirmed by admin and the admin will contact you to complete the payement process -->
        <div class="mt-4 border-t pt-4">
          <p class="text-sm text-gray-800 font-bold">
            {{ "reservations.adminConfirmation" | translate }}
          </p>
        </div>
        }
      </div>
    </div>
    <div class="qrcodeImage">
      <qrcode
        #qrcode
        [qrdata]="
          environment.apiUrl + '/reservations/' + reservation.id + '/paid'
        "
        [allowEmptyString]="true"
        [cssClass]="'center'"
        [colorDark]="'#000000ff'"
        [colorLight]="'#ffffffff'"
        [elementType]="'canvas'"
        [errorCorrectionLevel]="'M'"
        [imageHeight]="75"
        [imageWidth]="75"
        [margin]="4"
        [scale]="1"
        [width]="300"
        class="hidden"
      ></qrcode>
    </div>
  `,
  styles: `
    .qrcodeImage {
  display: flex;
  flex: 1;
}

/* Add custom styles here */
.center {
  display: flex;
  flex: 1;
  justify-content: center;
}
  `,
})
export class ReservationCardComponent {
  qrcode = viewChild("qrcode", { read: ElementRef });
  printService = inject(PrintService);
  @Input({
    required: true,
    transform: (value: Reservation) => {
      value.trip.date = formatDate(value.trip.date, "dd/MM/yyyy", "en");
      return value;
    },
  })
  reservation!: Reservation;
  @Input() isProcessing = false;

  @Output() onEdit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onDownloadInvoice = new EventEmitter<any>();
  @Output() onDownloadTicket = new EventEmitter<void>();

  // Icons
  protected faEdit = faEdit;
  protected faTrash = faTrash;
  protected faDownload = faDownload;
  protected faSpinner = faSpinner;
  protected faCheck = faCheck;
  protected faCreditCard = faCreditCard;
  environment: any = environment;
  protected getStatusClasses(): string {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (this.reservation.status) {
      case "CONFIRMED":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "CANCELLED":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "COMPLETED":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
}
