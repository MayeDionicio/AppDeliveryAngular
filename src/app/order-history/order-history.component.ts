import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Order {
  id: number;
  date: string;  // Formato de fecha en string para simplificar
  total: number;
  status: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  // Datos estáticos para simular el historial de pedidos
  orders: Order[] = [
    { id: 1, date: '2023-11-01', total: 45.50, status: 'Enviado' },
    { id: 2, date: '2023-10-25', total: 23.99, status: 'Pendiente' },
    { id: 3, date: '2023-09-15', total: 67.20, status: 'Entregado' }
  ];
}
