import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://deliverylp.shop/api/auth';

  constructor(private http: HttpClient) {}

  // POST: /api/auth/login
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // POST: /api/auth/registrar
  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, data);
  }

  // Guarda el token y rol en localStorage
  guardarDatosSesion(token: string, rol: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
  }

  // Obtiene el rol guardado
  obtenerRol(): string {
    return localStorage.getItem('rol') || '';
  }

  // Obtiene el token guardado
  obtenerToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Verifica si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Extrae el usuarioId del payload del token JWT
  getUsuarioId(): number | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.usuarioId || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Cierra sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}
