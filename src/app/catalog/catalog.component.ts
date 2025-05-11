import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CartService, Product } from '../Services/cart.service';
import { ProductService } from '../Services/product.service';
import { AssessmentService } from '../Services/assessment.service';
import { AuthService } from '../Services/auth.service';

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

  mostrarModal: boolean = false;
  productoSeleccionado: Product | null = null;
  valoracionSeleccionada: number = 5;
  comentarioValoracion: string = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res: any[]) => {
        this.products = res.map(p => ({
          id: p.productoId,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          image: p.imagenUrl,
          rating: 0
        }));

        this.products.forEach(product => {
          this.assessmentService.obtenerPromedioPorProducto(product.id).subscribe(data => {
            product.rating = data.promedio || 0;
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });

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
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
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

  navigateToHistory(): void {
  this.router.navigate(['/orden-historia']);
}
  abrirModal(product: Product): void {
    this.productoSeleccionado = product;
    this.valoracionSeleccionada = 5;
    this.comentarioValoracion = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  enviarValoracion(): void {
    if (!this.productoSeleccionado) return;

    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      Swal.fire('Error', 'Debes iniciar sesión para valorar.', 'warning');
      return;
    }

    const valoracion = {
      productoId: this.productoSeleccionado.id,
      usuarioId: usuarioId,
      calificacion: this.valoracionSeleccionada,
      comentario: this.comentarioValoracion
    };

    this.assessmentService.crear(valoracion).subscribe(() => {
      Swal.fire('¡Gracias!', 'Tu valoración ha sido enviada.', 'success');
      this.cerrarModal();

      // actualizar promedio
      this.assessmentService.obtenerPromedioPorProducto(this.productoSeleccionado!.id).subscribe(data => {
        const producto = this.products.find(p => p.id === this.productoSeleccionado!.id);
        if (producto) producto.rating = data.promedio;
      });

    }, err => {
      console.error('Error al enviar valoración', err);
      Swal.fire('Error', 'No se pudo enviar la valoración.', 'error');
    });
  }
  navigateToProfile(): void {
    this.router.navigate(['/perfil']);
  }
  
}
