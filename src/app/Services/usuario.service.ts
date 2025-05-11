// src/app/Services/user.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://deliverylp.shop/api/Usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`, {
      headers: this.getHeaders()
    });
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil`, {
      headers: this.getHeaders()
    });
  }
  
  actualizarPerfil(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/editar`, data, {
      headers: this.getHeaders()
    });
  }
  
  subirFotoPerfil(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfil/foto`, data, {
      headers: this.getHeaders()
    });
  }
  
  eliminarFotoPerfil(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perfil/foto`, {
      headers: this.getHeaders()
    });
  }
  
  
}
