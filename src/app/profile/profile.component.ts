import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Simular carga de datos de perfil
    this.profileForm = this.fb.group({
      name: ['Juan Pérez', Validators.required],
      email: ['juan.perez@example.com', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      // Aquí iría una llamada a la API para actualizar el perfil
      this.message = 'Perfil actualizado correctamente.';
      console.log('Perfil actualizado:', this.profileForm.value);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        this.message = 'Las contraseñas no coinciden.';
        return;
      }
      // Aquí se llamaría a la API para cambiar la contraseña
      this.message = 'Contraseña cambiada correctamente.';
      console.log('Contraseña cambiada');
    }
  }
}
