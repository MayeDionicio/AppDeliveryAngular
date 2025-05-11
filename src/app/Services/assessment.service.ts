import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'https://deliverylp.shop/api/Valoraciones';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  obtenerPorProducto(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  obtenerPromedioPorProducto(productoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/producto/${productoId}/promedio`);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
