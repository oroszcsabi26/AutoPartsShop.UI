import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../enums/order-status.enum';

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
  searchQuery: string = '';
  orderStatuses: { key: string, label: string }[] = [];
  selectedStatusMap: { [orderId: number]: string } = {};
  statusUpdateMessageMap: { [orderId: number]: string } = {};

  statusNumberToLabelMap: { [key: number]: string } = {
  0: 'Feldolgozás',
  1: 'Kiszállítva',
  2: 'Teljesítve',
  3: 'Törölve'
  };
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.orderStatuses = Object.values(OrderStatus).map(value => ({
    key: value,
    label: value
    }));
  this.loadOrders();
  }

  // Összes rendelés lekérése
  loadOrders(): void {
    this.http.get<any[]>('http://localhost:5214/api/orders/all').subscribe({
      next: (data) => {
        const query = this.searchQuery.toLowerCase().trim();
  
        this.orders = data.filter(e => {
          const fullName = `${e.user?.firstName ?? ''} ${e.user?.lastName ?? ''}`.toLowerCase();
          return fullName.includes(query);
        });

      //this.selectedStatusMap = {};
        // minden rendeléshez beállítjuk a jelenlegi státuszt
      this.orders.forEach(order => {
      const statusString = this.statusNumberToLabelMap[order.status];
      this.selectedStatusMap[order.id] = statusString;

      console.log('selectedStatusMap:', this.selectedStatusMap);
      console.log('orders:', this.orders);
      console.log('orderStatuses:', this.orderStatuses);
    })
      },
      error: () => this.errorMessage = 'Nem sikerült betölteni a rendeléseket!'
    });
  }

  // Törlés megerősítő modal megnyitása
  openDeleteModal(order: any): void {
    this.orderToDelete = order;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  // Modal bezárása
  closeDeleteModal(): void {
    this.orderToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  // Rendelés törlése
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

  updateStatus(orderId: number): void {
    const newStatus = this.selectedStatusMap[orderId];
    const body = { newStatus };

    this.http.put(`http://localhost:5214/api/orders/update-status/${orderId}`, body).subscribe({
      next: () => {
        this.statusUpdateMessageMap[orderId] = '✅ Sikeresen frissítve!';

        // Vizuálisan frissíted a státuszt az orders tömbben
        const updatedOrder = this.orders.find(o => o.id === orderId);
        if (updatedOrder) {
          updatedOrder.status = Object.keys(this.statusNumberToLabelMap)
            .find(key => this.statusNumberToLabelMap[+key] === newStatus);
        }

        // Üzenet eltűntetése 3 másodperc után
        setTimeout(() => {
          delete this.statusUpdateMessageMap[orderId];
        }, 3000);
      },
      error: () => this.errorMessage = 'Hiba történt a státusz frissítésekor!'
    });
  }
}
