import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../Services/notification.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit {
  trackingSteps: string[] = [
    'Pedido Confirmado',
    'Preparando Pedido',
    'Pedido en Camino',
    'Pedido Entregado'
  ];
  // Simula el estado actual del pedido (índice del arreglo)
  currentStepIndex: number = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Simula un cambio de estado después de 5 segundos
    setTimeout(() => {
      this.currentStepIndex = 2; // Cambia a "Pedido en Camino"
      this.notificationService.showInfo("Tu pedido está en camino", "Actualización de Pedido");
    }, 5000);

    // Puedes simular otro cambio, por ejemplo, a "Pedido Entregado"
    setTimeout(() => {
      this.currentStepIndex = 3; // "Pedido Entregado"
      this.notificationService.showSuccess("Tu pedido ha sido entregado", "Actualización de Pedido");
    }, 10000);
  }
}
