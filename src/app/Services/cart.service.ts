// src/app/Services/cart.service.ts
import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  addItem(product: Product): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    // Imprime el contenido del carrito para verificar que se esté agregando
    console.log('Carrito actual:', this.items);
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  clearCart(): void {
    this.items = [];
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }
}
