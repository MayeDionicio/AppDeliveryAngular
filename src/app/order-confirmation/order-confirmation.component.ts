import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../Services/cart.service';
import { OrderService } from '../Services/order.service';
import { PaymentMethodService } from '../Services/payment-method.service';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  cartItems: CartItem[] = [];
  metodoPagoTexto: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  confirmOrder(): void {
    if (this.cartItems.length === 0) return;

    const usuarioId = Number(this.authService.getUsuarioId());
    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener tu usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (!this.metodoPagoTexto.trim()) {
      Swal.fire('Debes escribir un método de pago', '', 'warning');
      return;
    }

    const metodoPago = {
      usuarioId: usuarioId,
      tipo: this.metodoPagoTexto,
      detalles: '',
      activo: true
    };

    Swal.fire({
      title: '¿Confirmar Pedido?',
      text: '¿Estás seguro de confirmar tu pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentMethodService.createPaymentMethod(metodoPago).subscribe({
          next: (mp) => {
            const pedido = {
              usuarioId: usuarioId,
              total: this.getTotal(),
              estado: 'Pendiente',
              fechaPedido: new Date().toISOString(),
              metodoPagoId: mp.metodoPagoId,
              detalles: this.cartItems.map(item => ({
                productoId: item.product.id,
                cantidad: item.quantity,
                precioUnitario: item.product.price
              }))
            };

            this.orderService.createOrder(pedido).subscribe({
              next: () => {
                this.cartService.clearCart();

                Swal.fire({
                  icon: 'success',
                  title: '¡Pedido confirmado!',
                  text: 'Redirigiendo al catálogo...',
                  showConfirmButton: false,
                  timer: 2000
                }).then(() => {
                  this.router.navigate(['/catalogo']);
                });
              },
              error: () => {
                Swal.fire('Error', 'No se pudo registrar el pedido.', 'error');
              }
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo registrar el método de pago.', 'error');
          }
        });
      }
    });
  }

  cancelOrder(): void {
    Swal.fire({
      icon: 'info',
      title: 'Pedido cancelado',
      text: 'Has cancelado la confirmación. Regresando al catálogo...',
      showConfirmButton: false,
      timer: 2000
  }).then(() => {
    this.router.navigate(['/catalogo'], {
      state: { mensaje: '¡Bienvenido de vuelta!' }
    });
  });
}
}