import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
    private router: Router
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`http://localhost:5235/api/productos/${this.productId}`, this.productForm.value, { headers })
      .subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
          this.router.navigate(['/listar-productos']);
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
        }
      });
  }
}
