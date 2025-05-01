import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem, Product } from '../Services/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Carga los ítems actuales del carrito
  loadCart(): void {
    this.cartItems = this.cartService.getItems();
  }

  // Retorna el total del carrito
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // Confirma con SweetAlert2 y vacía el carrito
  clearCart(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas vaciar el carrito?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        this.loadCart();
        Swal.fire('Vaciado!', 'El carrito ha sido vaciado.', 'success');
      }
    });
  }

  // Navega al componente de confirmación de pedido
  navigateToOrderConfirmation(): void {
    if (this.cartItems.length === 0) {
      Swal.fire('Carrito vacío', 'Agrega productos antes de confirmar el pedido.', 'info');
      return;
    }
    this.router.navigate(['/order-confirmation']);
  }

  // Método público para navegar al catálogo (para usar en el template)
  public navigateToCatalog(): void {
    this.router.navigate(['/catalogo']);
  }

  // Incrementa la cantidad de un ítem
  incrementQuantity(item: CartItem): void {
    item.quantity++;
  }

  // Disminuye la cantidad; si llega a 0, elimina el ítem
  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item.product.id);
    }
  }

  // Confirma con SweetAlert2 y elimina un ítem
  removeItem(productId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeItem(productId);
        this.loadCart();
        Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
      }
    });
  }
}
