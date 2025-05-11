import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required],
      stock: [0, Validators.required]
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://localhost:5235/api/productos/${this.productId}`)
      .subscribe(data => {
        this.productForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          stock: data.stock
        });
      });
  }

  actualizarProducto(): void {
    const formValue = this.productForm.value;

    if (!formValue.nombre || formValue.nombre.trim() === '') {
      Swal.fire('Error', 'El nombre del producto es obligatorio.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('Nombre', formValue.nombre);
    formData.append('Descripcion', formValue.descripcion);
    formData.append('Precio', formValue.precio.toString());
    formData.append('Stock', formValue.stock.toString());

    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      formData.append('Imagen', file);
    } else {
      const fakeImage = new Blob([''], { type: 'image/png' });
      formData.append('Imagen', fakeImage, 'imagen-fake.png');
    }

    this.productService.actualizarProductoConImagen(this.productId, formData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
        this.router.navigate(['/listar-productos']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      }
    });
  }
}
