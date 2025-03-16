import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string = '';
  orderToDelete: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // 🔹 Összes rendelés lekérése
  loadOrders(): void {
    this.http.get<any[]>('http://localhost:5214/api/orders/all').subscribe({
      next: (data) => this.orders = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni a rendeléseket!'
    });
  }

  // 🔹 Törlés megerősítő modal megnyitása
  openDeleteModal(order: any): void {
    this.orderToDelete = order;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  // 🔹 Modal bezárása
  closeDeleteModal(): void {
    this.orderToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  // 🔹 Rendelés törlése
  confirmDelete(): void {
    if (!this.orderToDelete) return;

    this.http.delete(`http://localhost:5214/api/orders/delete/${this.orderToDelete.id}`).subscribe({
      next: () => {
        this.loadOrders();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt a rendelés törlésekor!'
    });
  }
}
