import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://deliverylp.shop/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, data);
  }

  
  guardarDatosSesion(token: string, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
  }

  
  obtenerRol(): string {
    return localStorage.getItem('rol') || '';
  }

  
  obtenerToken(): string {
    return localStorage.getItem('token') || '';
  }

  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}
