import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://deliverylp.shop/api/pedidos';

  constructor(private http: HttpClient) {}

  confirmarPedido(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido);
  }
}
