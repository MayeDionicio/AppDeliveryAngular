import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface PaymentMethod {
  id: number;
  type: string; // 'Credit Card', 'Debit Card', 'PayPal'
  cardNumber?: string;
  expiryDate?: string;
}

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent {
  paymentForm: FormGroup;
  paymentMethods: PaymentMethod[] = [];

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      type: ['', Validators.required],
      cardNumber: [''],
      expiryDate: ['']
    });
  }

  addPaymentMethod(): void {
    if (this.paymentForm.valid) {
      const newMethod: PaymentMethod = {
        id: this.paymentMethods.length + 1,
        ...this.paymentForm.value
      };

      // Si el método es tarjeta (Crédito o Débito), se puede enmascarar el número
      if (newMethod.type !== 'PayPal' && newMethod.cardNumber) {
        newMethod.cardNumber = this.maskCardNumber(newMethod.cardNumber);
      }
      this.paymentMethods.push(newMethod);
      this.paymentForm.reset();
    }
  }

  maskCardNumber(cardNumber: string): string {
    // Enmascara todos los dígitos excepto los últimos 4
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  deletePaymentMethod(id: number): void {
    this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== id);
  }
}
