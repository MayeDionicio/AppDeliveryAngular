import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../Services/product.service'; // Corregido

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
    private productService: ProductService // Servicio inyectado
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
    this.imagenSeleccionada = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreviewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  registrarProducto(): void {
    if (!this.imagenSeleccionada) {
      Swal.fire('Error', 'Selecciona una imagen', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('Nombre', this.productoForm.get('nombre')?.value);
    formData.append('Descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('Precio', this.productoForm.get('precio')?.value);
    formData.append('Stock', this.productoForm.get('stock')?.value);
    formData.append('imagen', this.imagenSeleccionada);

    this.productService.registrarProductoConImagen(formData).subscribe({
      next: (res) => {
        Swal.fire('Éxito', `Producto registrado correctamente.<br><strong>Imagen:</strong><br><a href="${res.urlImagen}" target="_blank">${res.urlImagen}</a>`, 'success');
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
