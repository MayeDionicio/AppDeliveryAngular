import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserService } from '../Services/usuario.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  perfilForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      fotoUrl: ['']
    });

    this.userService.getPerfil().subscribe({
      next: data => this.perfilForm.patchValue(data),
      error: err => console.error('Error al obtener perfil', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  subirFoto() {
    if (!this.selectedFile) {
      Swal.fire('Advertencia', 'Por favor selecciona una foto.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.selectedFile);

    this.userService.subirFotoPerfil(formData).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', 'Foto subida exitosamente.', 'success');
        this.perfilForm.patchValue({ fotoUrl: res.fotoUrl });
      },
      error: () => {
        Swal.fire('Error', 'Hubo un problema al subir la foto.', 'error');
      }
    });
  }

  actualizarPerfil() {
    if (this.perfilForm.invalid) {
      Swal.fire('Formulario inválido', 'Revisa los campos obligatorios.', 'warning');
      return;
    }

    const datos = this.perfilForm.value;
    this.userService.actualizarPerfil(datos).subscribe({
      next: () => Swal.fire('Actualizado', 'Perfil actualizado correctamente.', 'success'),
      error: () => Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error')
    });
  }

  eliminarFoto() {
    this.userService.eliminarFotoPerfil().subscribe({
      next: () => {
        Swal.fire('Eliminada', 'Foto eliminada correctamente.', 'success');
        this.perfilForm.patchValue({ fotoUrl: null });
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar la foto.', 'error')
    });
  }
}
