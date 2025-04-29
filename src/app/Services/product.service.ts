import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://deliverylp.shop/api/productos';

  constructor(private http: HttpClient) {}

  
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  
  registrarProductoConImagen(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/RegistrarConImagen`, formData, { headers });
  }
}
