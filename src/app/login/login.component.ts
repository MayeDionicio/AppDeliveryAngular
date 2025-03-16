// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  login() {
    // Por ahora, simplemente mostramos los datos en la consola.
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Aquí podrías agregar lógica de validación o navegación.
  }
}
