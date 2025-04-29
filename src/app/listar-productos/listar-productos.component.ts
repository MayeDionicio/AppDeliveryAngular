import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  productos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.http.get<any[]>('http://localhost:5235/api/productos')
      .subscribe(data => this.productos = data);
  }

  editarProducto(producto: any): void {
    // Podés navegar a una ruta de edición y pasarle el ID
    this.router.navigate(['/editar-producto', producto.productoId]);
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5235/api/productos/${id}`)
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
              this.obtenerProductos(); // actualizar lista
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
          });
      }
    });
  }
}
