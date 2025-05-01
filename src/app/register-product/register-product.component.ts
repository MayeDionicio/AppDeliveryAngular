import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.css']
})
export class RegisterProductComponent {
  productoForm: FormGroup;
  imagenSeleccionada!: File;
  imagenPreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required],
      stock: [0, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    if (file) {
      if (file.type !== 'image/png') {
        Swal.fire('Formato inválido', 'Solo se permiten imágenes PNG', 'warning');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        Swal.fire('Imagen muy grande', 'La imagen debe pesar menos de 2MB', 'warning');
        return;
      }

      this.imagenSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  registrarProducto(): void {
    if (!this.imagenSeleccionada) {
      Swal.fire('Error', 'Selecciona una imagen', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value.toString());
    formData.append('stock', this.productoForm.get('stock')?.value.toString());
    formData.append('imagen', this.imagenSeleccionada);

    this.productService.registrarProductoConImagen(formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Producto registrado correctamente.', 'success');
        this.productoForm.reset();
        this.imagenPreviewUrl = null;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Hubo un problema al registrar el producto', 'error');
      }
    });
  }
}