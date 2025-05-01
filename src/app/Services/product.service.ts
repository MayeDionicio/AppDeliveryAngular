import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://deliverylp.shop/api/Productos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // GET /api/Productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // GET /api/Productos/{id}
  getProductoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // POST /api/Productos
  registrarProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto, {
      headers: this.getHeaders()
    });
  }

  // POST /api/Productos (con imagen)
  registrarProductoConImagen(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders()
    });
  }

  // PUT /api/Productos/{id}
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto, {
      headers: this.getHeaders()
    });
  }

  // PUT /api/Productos/{id} (con imagen)
  actualizarProductoConImagen(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  // DELETE /api/Productos/{id}
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
} 
