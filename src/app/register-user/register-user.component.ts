import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  user: { [key: string]: string } = {
    nombre: '',
    email: '',
    contrasena: '',
    direccion: '',
    telefono: ''
  };

  campos = [
    { label: 'Nombre completo', id: 'nombre', model: 'nombre', type: 'text' },
    { label: 'Correo electrónico', id: 'email', model: 'email', type: 'email' },
    { label: 'Contraseña', id: 'contrasena', model: 'contrasena', type: 'password' },
    { label: 'Dirección', id: 'direccion', model: 'direccion', type: 'text' },
    { label: 'Teléfono', id: 'telefono', model: 'telefono', type: 'text' }
  ];

  constructor(private authService: AuthService) {}

  register() {
    for (const campo of this.campos) {
      if (!this.user[campo.model] || this.user[campo.model].trim() === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Campo obligatorio',
          text: `El campo "${campo.label}" no puede estar vacío`
        });
        return;
      }
    }

    this.authService.registrar(this.user).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ahora puedes iniciar sesión',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err.error?.title || 'Ocurrió un problema'
        });
      }
    });
  }
}
