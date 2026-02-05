// TODO: print ticket service

import {
  ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Reservation } from '../models/reservation.model';
import html2canvas from 'html2canvas';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private renderer!: Renderer2;
  private platformId = inject(PLATFORM_ID);
  private rendererFactory = inject(RendererFactory2);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
    }
  }

  exportTicket(
    reservation: Reservation,
    qrcode: ElementRef | undefined,
    type: 'download' | 'print'
  ) {
    let qrCodeDataUrl = null;
    if (qrcode && qrcode?.nativeElement) {
      // Get the canvas element inside the QR code component
      const canvasElement = qrcode.nativeElement.querySelector('canvas');
      if (canvasElement) {
        // To get the image data as a base64 string:
        qrCodeDataUrl = canvasElement.toDataURL('image/png');
      }
    }
    if (type === 'download') {
      this.downloadTicketAsImage(reservation, qrCodeDataUrl);
    } else {
      this.printTicket(reservation, qrCodeDataUrl);
    }
  }

  private printTicket(reservation: Reservation, qrCodeDataUrl: string) {
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(this.getTemplate(reservation, qrCodeDataUrl));
      printWindow?.document.close();
      printWindow?.print();
    }, 2000);
  }

  private getTemplate(reservation: Reservation, qrCodeDataUrl: string) {
    return `
    
    
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
    
    body {
      font-family: 'Tajawal', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f7fa;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .ticket-container {
      width: 350px; /* Standard ticket width */
      transform: scale(1);
      transform-origin: center;
    }
    
    .ticket {
      background: white;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
      direction: rtl;
    }
    
    .ticket-header {
      background: linear-gradient(135deg, #1e5799 0%, #2989d8 100%);
      color: white;
      padding: 12px 15px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-container img{
      width: 100px;
    } 
    
    .ticket-title {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }
    
    .ticket-body {
      padding: 12px 15px;
    }
    
    .trip-info {
      text-align: center;
      padding-bottom: 10px;
    }
    
    .trip-name {
      font-size: 16px;
      color: #1e5799;
      font-weight: 700;
      margin: 5px 0;
    }
    
    .trip-city {
      font-size: 14px;
      color: #28a745;
      font-weight: 600;
      margin: 3px 0;
    }
    
    .trip-date {
      display: inline-block;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 3px 10px;
      font-size: 12px;
      color: #6c757d;
      font-weight: 500;
      margin: 5px 0;
    }
    
    .trip-details {
      display: flex;
      justify-content: space-around;
      margin: 8px 0;
      border-top: 1px dashed #dee2e6;
      border-bottom: 1px dashed #dee2e6;
      padding: 8px 0;
    }
    
    .detail-item {
      text-align: center;
      flex: 1;
    }
    
    .detail-label {
      font-size: 10px;
      color: #6c757d;
      margin: 0 0 2px 0;
    }
    
    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: #343a40;
      margin: 0;
    }
    .middle-container {
      display: flex;
      border-top: 1px dashed #dee2e6;
      border-bottom: 1px dashed #dee2e6;
      padding: 10px 0;
    }
    
    .trip-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      padding-left: 5px;
    }
    
    .detail-item {
      text-align: center;
      margin-bottom: 5px;
    }
    
    .detail-label {
      font-size: 10px;
      color: #6c757d;
      margin: 0 0 2px 0;
    }
    
    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: #343a40;
      margin: 0;
    }
    
    .qrcode-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 5px;
      border-right: 1px dashed #dee2e6;
    }
    
    
    
    .qrcode img {
      width: 100px;
    }

    
    .divider {
      height: 10px;
      background: repeating-linear-gradient(
        -45deg,
        #f8f9fa,
        #f8f9fa 5px,
        #e9ecef 5px,
        #e9ecef 10px
      );
      position: relative;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: #f5f7fa;
      border-radius: 50%;
      top: -3px;
    }
    
    .divider::before {
      left: -8px;
    }
    
    .divider::after {
      right: -8px;
    }
    
    .ticket-footer {
      padding: 10px 15px;
      background: #f8f9fa;
      font-size: 10px;
    }
    
    .instructions-title {
      font-size: 11px;
      font-weight: 700;
      color: #343a40;
      margin: 0 0 2px 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .instructions-title i {
      color: #ffc107;
      font-size: 10px;
    }
    
    .instructions-text {
      color: #6c757d;
      margin: 0 0 5px 0;
      font-size: 10px;
      line-height: 1.3;
    }
    
    .barcode {
      text-align: center;
      margin-top: 8px;
    }
    
    .barcode-img {
      height: 30px;
      width: 80%;
      margin: 0 auto;
      background: linear-gradient(90deg, #000 0%, #000 10%, transparent 10%, transparent 15%, #000 15%, #000 20%, transparent 20%, transparent 25%, #000 25%, #000 35%, transparent 35%, transparent 40%, #000 40%, #000 50%, transparent 50%, transparent 55%, #000 55%, #000 65%, transparent 65%, transparent 70%, #000 70%, #000 80%, transparent 80%, transparent 85%, #000 85%, #000 95%, transparent 95%, transparent 100%);
    }
    
    .ticket-number {
      font-size: 9px;
      color: #6c757d;
      margin: 3px 0 0 0;
    }

    .punch-hole {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #f5f7fa;
      border-radius: 50%;
      border: 1px dashed #dee2e6;
      top: 50%;
      transform: translateY(-50%);
    }

    .punch-hole.left {
      left: -6px;
    }

    .punch-hole.right {
      right: -6px;
    }

    
}

    @media print {
      body {
        background: none;
        padding: 0;
      }
      .ticket-container {
        width: 100%;
        max-width: 350px;
      }
    }
  </style>
</head>
<body>
   <div class="ticket-container">
    <div class="ticket">
      <div class="ticket-header">
        <div class="logo-container">
          <img  src="../assets/logo.png" alt="Masar" />
        </div>
        <h2 class="ticket-title">تذكرة الرحلة</h2>
      </div>
      
      <div class="ticket-body">
        <div class="trip-info">
          <p class="trip-name">${reservation.trip.name}</p>
          <p class="trip-city">${reservation.trip.city.name}</p>
          <p class="trip-date">${reservation.trip.date}</p>
        </div>
        
        <div class="middle-container">
          <div class="qrcode-container">
            <div class="qrcode">
                <img src="${qrCodeDataUrl}" alt="QR Code" />
            </div>
          </div>
          
          <div class="trip-details">
            <div class="detail-item">
              <p class="detail-label">عدد المسافرين</p>
              <p class="detail-value">${reservation.numberOfTravelers}</p>
            </div>
            <div class="detail-item">
              <p class="detail-label">السعر الإجمالي</p>
              <p class="detail-value">${reservation.totalPrice} جنيه</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="punch-hole left"></div>
      <div class="punch-hole right"></div>
      
      <div class="divider"></div>
      
      <div class="ticket-footer">
        <p class="instructions-title"><i class="bi bi-info-circle-fill"></i> تعليمات</p>
        <p class="instructions-text">يرجى إبراز هذه التذكرة عند الوصول إلى نقطة التجمع.</p>
        
        <p class="instructions-title"><i class="bi bi-exclamation-triangle-fill"></i> ملاحظة</p>
        <p class="instructions-text">هذه التذكرة صالحة فقط للتاريخ والوقت الموضحين أعلاه.</p>
      </div>
    
    </div>
  </div>
</body>
</html>
    
    
    `;
  }

  private downloadTicketAsImage(reservation: any, qrCodeDataUrl: string) {
    // إنشاء عنصر `div` وإضافة الـ HTML داخله
    const tempContainer = this.renderer.createElement('div');
    this.renderer.setStyle(tempContainer, 'position', 'absolute');
    this.renderer.setStyle(tempContainer, 'left', '-9999px'); // إخفاء العنصر

    tempContainer.innerHTML = this.getTemplate(reservation, qrCodeDataUrl);
    document.body.appendChild(tempContainer); // إضافته إلى الـ DOM

    // استخدام `html2canvas` لالتقاط صورة من العنصر
    html2canvas(tempContainer, { scale: 2 }).then(canvas => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ticket.png';
      link.click();

      // إزالة العنصر بعد الالتقاط
      document.body.removeChild(tempContainer);
    });
  }
}
