import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent implements OnInit {
  reviewForm: FormGroup;
  submitted: boolean = false;
  // Aquí podrías almacenar las reseñas para mostrarlas, simulando que se guardan
  reviews: { rating: number; comment: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [0, Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  submitReview(): void {
    this.submitted = true;
    if (this.reviewForm.valid) {
      // Simulamos el guardado de la reseña
      this.reviews.push(this.reviewForm.value);
      console.log('Reseña enviada: ', this.reviewForm.value);
      // Reiniciamos el formulario
      this.reviewForm.reset({ rating: 0, comment: '' });
      this.submitted = false;
    }
  }
}
