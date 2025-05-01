import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  productos: any[] = [];
  searchTerm: string = '';
  imagenPreview: string | ArrayBuffer | null = null;
  imagenFile: File | null = null;

  constructor(private ProductService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.ProductService.getProducts().subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
      }
    });
  }

  get productosFiltrados(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(p =>
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.descripcion || '').toLowerCase().includes(term)
    );
  }

  editarProducto(producto: any): void {
    this.imagenPreview = producto.imagenUrl || null;
    this.imagenFile = null;

    Swal.fire({
      title: 'Editar Producto',
      html: `
      <style>
        .swal-form-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .swal-form-container input[type="text"],
        .swal-form-container input[type="number"] {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .swal-img-preview {
          max-width: 100px;
          max-height: 100px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .swal-label {
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: -5px;
          font-size: 14px;
          color: #444;
        }
        @media (max-width: 480px) {
          .swal-form-container {
            gap: 6px;
          }
          .swal-form-container input {
            font-size: 16px;
          }
        }
      </style>

      <div class="swal-form-container">
        <input id="nombre" type="text" placeholder="Nombre" value="${producto.nombre || ''}" />
        <input id="descripcion" type="text" placeholder="Descripción" value="${producto.descripcion || ''}" />
        <input id="precio" type="number" placeholder="Precio" value="${producto.precio || 0}" />
        <input id="stock" type="number" placeholder="Stock" value="${producto.stock || 0}" />

        <span class="swal-label">Imagen actual:</span>
        <img id="imagen-preview" src="${producto.imagenUrl || ''}" class="swal-img-preview" />

        <input id="imagen" type="file" accept="image/png" style="margin-top: 5px;" />
      </div>
      `,

      didOpen: () => {
        const fileInput = document.getElementById('imagen') as HTMLInputElement;
        const previewImg = document.getElementById('imagen-preview') as HTMLImageElement;

        fileInput.addEventListener('change', (event: any) => {
          const file = event.target.files[0];
          const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

          if (file) {
            if (file.type !== 'image/png') {
              Swal.fire({
                icon: 'warning',
                title: 'Formato no válido',
                text: 'Solo se permiten imágenes en formato PNG.'
              });
              fileInput.value = '';
              this.imagenFile = null;
              this.imagenPreview = null;
              previewImg.src = producto.imagenUrl || '';
              return;
            }

            if (file.size > MAX_IMAGE_SIZE) {
              Swal.fire({
                icon: 'warning',
                title: 'Archivo demasiado grande',
                text: 'La imagen debe ser menor a 2 MB.'
              });
              fileInput.value = '';
              this.imagenFile = null;
              this.imagenPreview = null;
              previewImg.src = producto.imagenUrl || '';
              return;
            }

            this.imagenFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
              previewImg.src = e.target?.result as string;
              this.imagenPreview = e.target?.result ?? null;
            };
            reader.readAsDataURL(file);
          }
        });
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
        const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value.trim();
        const precio = parseFloat((document.getElementById('precio') as HTMLInputElement).value.trim());
        const stock = parseInt((document.getElementById('stock') as HTMLInputElement).value.trim(), 10);

        if (!nombre || isNaN(precio) || isNaN(stock)) {
          Swal.showValidationMessage('Todos los campos son obligatorios y válidos.');
          return false;
        }

        return { nombre, descripcion, precio, stock };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const data = result.value;

        if (this.imagenFile) {
          const formData = new FormData();
          formData.append('nombre', data.nombre);
          formData.append('descripcion', data.descripcion);
          formData.append('precio', data.precio.toString());
          formData.append('stock', data.stock.toString());
          formData.append('imagen', this.imagenFile);

          this.ProductService.actualizarProductoConImagen(producto.productoId || producto.producto_id, formData).subscribe({
            next: () => {
              Swal.fire('Actualizado', 'El producto ha sido editado con imagen nueva.', 'success');
              this.cargarProductos();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
            }
          });
        } else {
          this.ProductService.actualizarProducto(producto.productoId || producto.producto_id, data).subscribe({
            next: () => {
              Swal.fire('Actualizado', 'El producto ha sido editado con éxito.', 'success');
              this.cargarProductos();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
            }
          });
        }
      }
    });
  }

  eliminarProducto(producto: any): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `Esta acción eliminará ${producto.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.ProductService.eliminarProducto(producto.productoId || producto.producto_id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.cargarProductos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
      }
    });
  }
}