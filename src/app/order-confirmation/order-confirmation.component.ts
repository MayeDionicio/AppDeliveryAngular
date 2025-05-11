import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../Services/cart.service';
import { OrderService } from '../Services/order.service';
import { PaymentMethodService } from '../Services/payment-method.service';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit, AfterViewInit {
  cartItems: CartItem[] = [];
  metodoPagoTexto: string = '';

  selectedLat: number = 0;
  selectedLng: number = 0;
  mapInitialized = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
  }

  ngAfterViewInit(): void {
    // ✅ Redefinir íconos de Leaflet para usar rutas de Angular
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Pin rojo de entrega
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });

    if (!this.mapInitialized) {
      const iniciarMapa = (lat: number, lng: number) => {
        this.selectedLat = lat;
        this.selectedLng = lng;

        const map = L.map('map').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          this.selectedLat = pos.lat;
          this.selectedLng = pos.lng;
        });

        this.mapInitialized = true;
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            iniciarMapa(position.coords.latitude, position.coords.longitude);
          },
          () => {
            iniciarMapa(14.2978, -90.7869); // Escuintla por defecto
          }
        );
      } else {
        iniciarMapa(14.2978, -90.7869);
      }
    }
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  confirmOrder(): void {
    if (this.cartItems.length === 0) return;

    const usuarioId = Number(this.authService.getUsuarioId());
    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener tu usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (!this.metodoPagoTexto.trim()) {
      Swal.fire('Debes escribir un método de pago', '', 'warning');
      return;
    }

    const metodoPago = {
      usuarioId: usuarioId,
      tipo: this.metodoPagoTexto,
      detalles: '',
      activo: true
    };

    Swal.fire({
      title: '¿Confirmar Pedido?',
      text: '¿Estás seguro de confirmar tu pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentMethodService.createPaymentMethod(metodoPago).subscribe({
          next: (mp) => {
            const pedido = {
              usuarioId: usuarioId,
              total: this.getTotal(),
              estado: 'Pendiente',
              fechaPedido: new Date().toISOString(),
              metodoPagoId: mp.metodoPagoId,
              customerLat: this.selectedLat,
              customerLng: this.selectedLng,
              detalles: this.cartItems.map(item => ({
                productoId: item.product.id,
                cantidad: item.quantity,
                precioUnitario: item.product.price
              }))
            };

            this.orderService.createOrder(pedido).subscribe({
              next: (res) => {
                this.cartService.clearCart();

                Swal.fire({
                  icon: 'success',
                  title: '¡Pedido confirmado!',
                  text: 'Redirigiendo al rastreo...',
                  showConfirmButton: false,
                  timer: 2000
                }).then(() => {
                  this.router.navigate(['/order-tracking', res.pedidoId]);
                });
              },
              error: () => {
                Swal.fire('Error', 'No se pudo registrar el pedido.', 'error');
              }
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo registrar el método de pago.', 'error');
          }
        });
      }
    });
  }

  cancelOrder(): void {
    Swal.fire({
      icon: 'info',
      title: 'Pedido cancelado',
      text: 'Has cancelado la confirmación. Regresando al catálogo...',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.router.navigate(['/catalogo'], {
        state: { mensaje: '¡Bienvenido de vuelta!' }
      });
    });
  }
}
