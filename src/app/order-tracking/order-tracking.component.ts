import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { OrderService } from '../Services/order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  private motoMarker!: L.Marker;
  private routeCoords: L.LatLng[] = [];
  private currentStep = 0;

  estimatedMinutes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const pedidoId = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.getOrderById(pedidoId).subscribe(pedido => {
      const store = L.latLng(pedido.storeLat, pedido.storeLng);
      const customer = L.latLng(pedido.customerLat, pedido.customerLng);

      this.initMap(store);

      const apiKey = '5b3ce3597851110001cf6248a305f1584b5642799cf5256fd6a283c1'; // Reemplázalo por tu API Key real
      const coords = [[store.lng, store.lat], [customer.lng, customer.lat]];

      this.http.post(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        { coordinates: coords },
        { headers: { 'Authorization': apiKey } }
      ).subscribe((res: any) => {
        const steps = res.features[0].geometry.coordinates;
        this.routeCoords = steps.map((coord: number[]) => L.latLng(coord[1], coord[0]));

        const durationInMinutes = res.features[0].properties.summary.duration / 60;
        this.estimatedMinutes = Math.ceil(durationInMinutes);

        this.drawRoute();
        this.simulateMovement();
      });
    });
  }

  private initMap(center: L.LatLng): void {
    this.map = L.map('map').setView(center, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private drawRoute(): void {
    L.polyline(this.routeCoords, { color: 'blue' }).addTo(this.map);

    const motoIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    this.motoMarker = L.marker(this.routeCoords[0], { icon: motoIcon }).addTo(this.map);
  }

  private simulateMovement(): void {
    const estimatedTimeMs = this.estimatedMinutes * 60000;
    const intervalMs = estimatedTimeMs / this.routeCoords.length;

    const interval = setInterval(() => {
      this.currentStep++;
      if (this.currentStep >= this.routeCoords.length) {
        clearInterval(interval);

        L.popup()
          .setLatLng(this.routeCoords[this.routeCoords.length - 1])
          .setContent('✅ Pedido entregado')
          .openOn(this.map);

        return;
      }

      this.motoMarker.setLatLng(this.routeCoords[this.currentStep]);
    }, intervalMs);
  }
}