import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Pizza Margarita', description: 'Pizza clásica con tomate, mozzarella y albahaca fresca.', price: 9.99, image: 'assets/pizza-margarita.jpg' },
    { id: 2, name: 'Hamburguesa Gourmet', description: 'Hamburguesa con ingredientes premium y pan artesanal.', price: 12.49, image: 'assets/hamburguesa-gourmet.jpg' },
    { id: 3, name: 'Ensalada César', description: 'Ensalada fresca con pollo a la parrilla, crutones y aderezo César.', price: 8.50, image: 'assets/ensalada-cesar.jpg' }
  ];

  productForm: FormGroup;
  isEditing: boolean = false;
  currentProductId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        id: this.products.length + 1, // Asignación sencilla de ID
        ...this.productForm.value
      };
      this.products.push(newProduct);
      this.productForm.reset();
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
  }

  updateProduct(): void {
    if (this.productForm.valid && this.currentProductId !== null) {
      const updatedProduct: Product = {
        id: this.currentProductId,
        ...this.productForm.value
      };
      const index = this.products.findIndex(p => p.id === this.currentProductId);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
      this.isEditing = false;
      this.currentProductId = null;
      this.productForm.reset();
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
