import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showSuccess(message: string, title?: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: title || 'Éxito',
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  showError(message: string, title?: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: title || 'Error',
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
  
  showInfo(message: string, title?: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: title || 'Información',
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
}
