import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { OrderService } from '../Services/order.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NgChartsModule], // ✅ Módulo importado correctamente
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  totalPedidos = 0;
  totalEntregados = 0;
  totalPendientes = 0;
  totalIngresos = 0;

  doughnutData!: ChartData<'doughnut'>;
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders: any[]) => {
      this.totalPedidos = orders.length;
      this.totalEntregados = orders.filter(p => p.estado === 'Entregado').length;
      this.totalPendientes = orders.filter(p => p.estado === 'Pendiente').length;
      this.totalIngresos = orders
        .filter(p => p.estado === 'Entregado')
        .reduce((acc, p) => acc + p.total, 0);

      this.doughnutData = {
        labels: ['Entregados', 'Pendientes'],
        datasets: [
          {
            data: [this.totalEntregados, this.totalPendientes],
            backgroundColor: ['#2ecc71', '#f1c40f']
          }
        ]
      };
    });
  }
}
