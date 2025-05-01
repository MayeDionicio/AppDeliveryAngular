import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../Services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (res: any[]) => this.orders = res,
      error: () => Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error')
    });
  }

  entregarPedido(id: number): void {
    Swal.fire({
      title: '¿Entregar pedido?',
      text: `¿Confirmas que el pedido #${id} fue entregado?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, entregar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.orderService.entregarPedido(id).subscribe({
          next: () => {
            Swal.fire('Entregado', `El pedido #${id} ha sido entregado.`, 'success');
            this.loadOrders();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo entregar el pedido.', 'error');
          }
        });
      }
    });
  }

  eliminarPedido(id: number): void {
    Swal.fire({
      title: '¿Eliminar pedido?',
      text: `Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Pedido eliminado correctamente.', 'success');
            this.loadOrders();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el pedido.', 'error');
          }
        });
      }
    });
  }
}
