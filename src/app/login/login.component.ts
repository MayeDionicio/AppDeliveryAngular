import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  mostrarPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credentials = {
      email: this.email,
      contrasena: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);

        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: 'Bienvenido de nuevo',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          const rol = res.rol;

          if (rol === 'admin') {
            this.router.navigate(['/admin']);
          } else if (rol === 'usuario') {
            this.router.navigate(['/catalogo']);
          } else {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: err.error?.mensaje || 'Credenciales incorrectas'
        });
      }
    });
  }
}
