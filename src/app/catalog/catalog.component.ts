import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CartService, Product } from '../Services/cart.service';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar productos
    this.productService.getProducts().subscribe({
      next: (res: any[]) => {
        this.products = res.map(p => ({
          id: p.productoId,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          image: p.imagenUrl,
          rating: p.rating || 0
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });

    // Verificar si viene con mensaje desde otra vista
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { mensaje?: string };

    if (state?.mensaje) {
      Swal.fire({
        icon: 'success',
        title: state.mensaje,
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products;
    }
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);

    // Mostrar notificación tipo toast
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#f0f0f0',
      color: '#333',
      iconColor: '#00c851'
    });
  }

  get cartItemCount(): number {
    return this.cartService.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}
