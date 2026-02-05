import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faSpinner, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ReservationService } from '../../services/reservation.service';
import { DialogService } from '../../services/dialog.service';
import { ToastService } from '../../services/toast.service';
import { ReservationCardComponent } from '../../components/reservations/reservation-card/reservation-card.component';
import { ReservationEditDialogComponent } from '../../components/reservations/reservation-edit-dialog/reservation-edit-dialog.component';
import { CancelDialogComponent } from '../../components/reservations/cancel-dialog/cancel-dialog.component';
import { Reservation, ReservationUpdate } from '../../models/reservation.model';
import { ReservationsStateService } from '../../state/reservation.state';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TranslateModule,
    ReservationCardComponent,
    ReservationEditDialogComponent,
    CancelDialogComponent,
  ],
  template: `
    <div class="min-h-screen  ">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <!-- <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ "reservations.title" | translate }}
          </h1>
          <p class="mt-2 text-gray-600">
            {{ "reservations.subtitle" | translate }}
          </p>
        </div> -->

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ 'reservations.filters.status' | translate }}
              </label>
              <select
                [ngModel]="state.filters().status"
                (ngModelChange)="onStatusChange($event)"
                class="input-field">
                <option value="">
                  {{ 'reservations.filters.allStatuses' | translate }}
                </option>
                <option value="pending">
                  {{ 'reservations.status.pending' | translate }}
                </option>
                <option value="confirmed">
                  {{ 'reservations.status.confirmed' | translate }}
                </option>
                <option value="paid">
                  {{ 'reservations.status.paid' | translate }}
                </option>
                <option value="completed">
                  {{ 'reservations.status.completed' | translate }}
                </option>
                <option value="cancelled">
                  {{ 'reservations.status.cancelled' | translate }}
                </option>
              </select>
            </div>

            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ 'reservations.filters.search' | translate }}
              </label>
              <input
                type="text"
                [ngModel]="state.filters().search"
                (ngModelChange)="onSearchChange($event)"
                class="input-field"
                [placeholder]="'reservations.filters.searchPlaceholder' | translate" />
            </div>
          </div>
        </div>

        <!-- Reservations List -->
        @if (state.loading()) {
          <div class="flex justify-center items-center py-12">
            <fa-icon [icon]="faSpinner" class="text-4xl text-primary-600 animate-spin"></fa-icon>
          </div>
        } @else if (state.error()) {
          <div class="text-center py-12">
            <p class="text-red-600">{{ state.error() }}</p>
            <button (click)="loadReservations()" class="mt-4 btn-primary">
              {{ 'common.tryAgain' | translate }}
            </button>
          </div>
        } @else if (state.filteredReservations().length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-600">
              {{ 'reservations.empty' | translate }}
            </p>
          </div>
        } @else {
          <div class="flex flex-col gap-2">
            @for (reservation of state.filteredReservations(); track reservation.id) {
              <app-reservation-card
                [reservation]="reservation"
                [isProcessing]="processingReservationId === reservation.id"
                (onEdit)="openEditDialog(reservation)"
                (onCancel)="openCancelDialog(reservation)"
                (onConfirm)="handleConfirmReservation(reservation)"
                (onDownloadInvoice)="handleDownloadInvoice($event)"
                (onDownloadTicket)="handleDownloadTicket(reservation)" />
            }
          </div>
        }
      </div>
    </div>

    <!-- Edit Dialog -->
    <app-reservation-edit-dialog
      [isOpen]="showEditDialog"
      [reservation]="state.selectedReservation()"
      (onClose)="closeEditDialog()"
      (onSave)="handleUpdateReservation($event)" />

    <!-- Cancel Dialog -->
    <app-cancel-dialog
      [isOpen]="showCancelDialog"
      (onClose)="closeCancelDialog()"
      (onConfirm)="handleCancelReservation($event)" />
  `,
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  protected state = inject(ReservationsStateService);
  private dialogService = inject(DialogService);

  private toastService = inject(ToastService);

  protected showEditDialog = false;
  protected showCancelDialog = false;
  protected processingReservationId: string | null = null;

  // Icons
  protected faSpinner = faSpinner;
  protected faFilter = faFilter;

  ngOnInit() {
    this.loadReservations();
  }

  protected loadReservations() {
    this.state.setLoading(true);

    this.reservationService.getUserReservations().subscribe({
      next: data => {
        this.reservationService.setUserReservationsInLocalStorage(data.reservations);
        this.state.setReservations(
          data.reservations
          // data.total
        );
        this.state.setLoading(false);
      },
      error: error => {
        this.state.setError(error.message);
      },
    });
  }

  protected onStatusChange(status: string) {
    this.state.updateFilters({ status });
  }

  protected onSearchChange(search: string) {
    this.state.updateFilters({ search });
  }

  protected openEditDialog(reservation: any) {
    this.state.setSelectedReservation(reservation);
    this.showEditDialog = true;
  }

  protected closeEditDialog() {
    this.showEditDialog = false;
    this.state.setSelectedReservation(null);
  }

  protected openCancelDialog(reservation: any) {
    this.state.setSelectedReservation(reservation);
    this.showCancelDialog = true;
  }

  protected closeCancelDialog() {
    this.showCancelDialog = false;
    this.state.setSelectedReservation(null);
  }

  protected handleUpdateReservation(updates: ReservationUpdate) {
    const reservation = this.state.selectedReservation();
    if (!reservation) return;

    this.reservationService.updateReservation(reservation.id, updates).subscribe({
      next: updatedReservation => {
        this.state.updateReservation(updatedReservation);
        this.toastService.success('reservations.messages.updateSuccess');
        this.closeEditDialog();
      },
      error: error => {
        this.toastService.error(error.message);
      },
    });
  }

  protected handleCancelReservation(reason: string) {
    const reservation = this.state.selectedReservation();
    if (!reservation) return;

    this.reservationService.cancelReservation(reservation.id, reason).subscribe({
      next: () => {
        this.state.updateReservation({
          ...reservation,
          status: 'CANCELLED',
          cancellationReason: reason,
        });
        this.toastService.success('reservations.messages.cancelSuccess');
        this.closeCancelDialog();
      },
      error: error => {
        this.toastService.error(error.message);
      },
    });
  }

  protected handleConfirmReservation(reservation: any) {
    this.processingReservationId = reservation.id;

    this.reservationService.confirmReservation(reservation.id).subscribe({
      next: ({ paymentUrl }) => {
        window.location.href = paymentUrl;
      },
      error: error => {
        this.toastService.error(error.message);
        this.processingReservationId = null;
      },
    });
  }

  protected handleDownloadInvoice(ticket: any) {
    console.log(ticket);
    const printContent = ticket.nativeElement.innerHTML;
    const printContentWindow = window.open('', '_blank');
    printContentWindow?.document.write(`
      <html>
        <head>
          <style>
          /* General Styles */
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                padding: 20px;
            }
                
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
    
          </style
          </head>
          <body>
          ${printContent}
          </body>
        <script>
  
    setTimeout(() => {
      window.print(); 
    }, 3330);
   
</script>

      </html>
      `);
  }

  protected handleDownloadTicket(reservation: any) {
    this.reservationService.downloadTicket(reservation.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${reservation.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        this.toastService.error(error.message);
      },
    });
  }

  ngOnDestroy() {
    this.state.reset();
  }
}
