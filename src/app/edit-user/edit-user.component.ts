import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  usuarios: any[] = [];
  searchTerm: string = '';

  constructor(private usuarioService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    });
  }

  get usuariosFiltrados(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.usuarios.filter(u =>
      (u.nombre || '').toLowerCase().includes(term) || 
      (u.email || '').toLowerCase().includes(term)
    );
  }

  editarUsuario(usuario: any): void {
    const sanitize = (str: string) => str ? str.replace(/"/g, '&quot;') : '';

    Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${sanitize(usuario.nombre || '')}">
        <input id="email" class="swal2-input" placeholder="Email" value="${sanitize(usuario.email || '')}">
        <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${sanitize(usuario.telefono || '')}">
        <input id="direccion" class="swal2-input" placeholder="Dirección" value="${sanitize(usuario.direccion || '')}">
        <select id="rol" class="swal2-select">
          <option value="true" ${usuario.esAdmin ? 'selected' : ''}>Administrador</option>
          <option value="false" ${!usuario.esAdmin ? 'selected' : ''}>Usuario normal</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value.trim();
        const direccion = (document.getElementById('direccion') as HTMLInputElement).value.trim();
        const rolSeleccionado = (document.getElementById('rol') as HTMLSelectElement).value;

        if (!nombre || !email || !direccion) {
          Swal.showValidationMessage('Nombre, correo y dirección son obligatorios');
          return false;
        }

        if (!email.includes('@')) {
          Swal.showValidationMessage('Correo inválido');
          return false;
        }

        return {
          nombre,
          email,
          telefono: telefono || null,
          direccion,
          esAdmin: rolSeleccionado === 'true'
        };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const data = result.value;
        console.log('Datos a enviar:', data);

        this.usuarioService.actualizarUsuario(usuario.usuarioId || usuario.usuario_id, data).subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El usuario ha sido editado con éxito.', 'success');
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          }
        });
      }
    });
  }

  eliminarUsuario(usuario: any): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Esta acción eliminará a ${usuario.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.usuarioId || usuario.usuario_id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        });
      }
    });
  }
}
