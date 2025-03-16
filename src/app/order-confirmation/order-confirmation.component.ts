import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../Services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  confirmOrder(): void {
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
        // Simula el envío y confirma el pedido
        this.cartService.clearCart();
        Swal.fire('Pedido confirmado!', 'Tu pedido ha sido confirmado.', 'success').then(() => {
          this.router.navigate(['/catalog']);
        });
      }
    });
  }

  cancelOrder(): void {
    this.router.navigate(['/catalog']);
  }
}
