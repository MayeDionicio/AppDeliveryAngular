import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  opciones = [
    { titulo: 'Usuarios', icono: '👥', ruta: '/admin/usuarios' },
    { titulo: 'Productos', icono: '📦', ruta: '/admin/productos' },
    { titulo: 'Reportes', icono: '📈', ruta: '/admin/reportes' },
    { titulo: 'Configuración', icono: '⚙️', ruta: '/admin/configuracion' }
  ];
}
