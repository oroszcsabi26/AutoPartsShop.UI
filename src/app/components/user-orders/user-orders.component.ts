import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserOrder } from '../../services/user.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
  imports: [CommonModule]
})
export class UserOrdersComponent implements OnInit {
  orders: UserOrder[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserOrders();
  }

  // 🔹 Felhasználói rendelések lekérése
  loadUserOrders(): void {
    this.userService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          ...order,
          totalPrice: order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) // 🔹 Végösszeg számítása
        }));
        console.log("🔹 Betöltött rendelések:", this.orders);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Hiba történt a rendelések lekérésekor:', err);
        this.errorMessage = 'Nem sikerült betölteni a rendeléseket. Próbáld újra később.';
        this.isLoading = false;
      }
    });
  }
}
