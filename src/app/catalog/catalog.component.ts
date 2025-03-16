// src/app/catalog/catalog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, Product } from '../Services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  searchTerm: string = '';

  products: Product[] = [
    {
      id: 1,
      name: 'Pizza Margarita',
      description: 'Pizza clásica con tomate, mozzarella y albahaca fresca.',
      price: 9.99,
      image: 'assets/pizza-margarita.jpeg',
      rating: 4
    },
    {
      id: 2,
      name: 'Hamburguesa Gourmet',
      description: 'Hamburguesa con ingredientes premium y pan artesanal.',
      price: 12.49,
      image: 'assets/hamburguesa-gourmet.jpeg',
      rating: 5
    },
    {
      id: 3,
      name: 'Ensalada César',
      description: 'Ensalada fresca con pollo a la parrilla, crutones y aderezo César.',
      price: 8.50,
      image: 'assets/ensalada-cesar.jpeg',
      rating: 3
    }
  ];

  constructor(private cartService: CartService, private router: Router) {}

  // Filtra productos según el término de búsqueda
  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products;
    }
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  // Agrega el producto al carrito usando el servicio
  addToCart(product: Product): void {
    this.cartService.addItem(product);
    console.log('Producto agregado al carrito:', product);
  }

  // Getter para obtener el total de ítems en el carrito
  get cartItemCount(): number {
    return this.cartService.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Navega a la pantalla del carrito
  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}
