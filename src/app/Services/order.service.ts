import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://deliverylp.shop/api/Pedidos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // GET /api/Pedidos
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // GET /api/Pedidos/{id}
  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // POST /api/Pedidos/crear
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, orderData, {
      headers: this.getHeaders()
    });
  }

  // DELETE /api/Pedidos/{id}
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  entregarPedido(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/entregar`, {}, {
      headers: this.getHeaders()
    });
  }
  
  
  
}
