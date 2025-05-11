import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../Services/order.service';
import { AuthService } from '../Services/auth.service';

export interface Order {
  pedidoId: number;
  fechaPedido: string;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(pedidos => {
      const usuarioId = Number(this.authService.getUsuarioId());
      this.orders = pedidos.filter(p => p.usuario.usuarioId === usuarioId);
    });
  }
}
