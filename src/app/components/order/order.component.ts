import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, UserOrderData } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OrderComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  showSuccessModal: boolean = false;

  orderData = {
    shippingAddress: '',
    billingAddress: '',
    comment: '',
    name: '',
    phoneNumber: ''
  };

  constructor(private orderService: OrderService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadUserOrderData();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items ?? [];
        this.calculateTotalPrice();
      },
      error: (err) => console.error('Hiba a kosár betöltésekor:', err)
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // 🔹 Felhasználói rendelési adatok betöltése az űrlapba
  loadUserOrderData(): void {
    this.orderService.getUserOrderData().subscribe({
      next: (data: UserOrderData) => {
        this.orderData.name = data.name;
        this.orderData.phoneNumber = data.phoneNumber;
        this.orderData.shippingAddress = data.shippingAddress;
        this.orderData.billingAddress = data.billingAddress;
      },
      error: (err) => console.error('Hiba történt a felhasználói adatok betöltésekor:', err)
    });
  }

  placeOrder(): void {
    if (!this.orderData.shippingAddress || !this.orderData.billingAddress) {
      alert('A szállítási és számlázási cím kitöltése kötelező!');
      return;
    }

    this.orderService.createOrder({
      shippingAddress: this.orderData.shippingAddress,
      billingAddress: this.orderData.billingAddress,
      comment: this.orderData.comment
    }).subscribe({
      next: (response) => {
        this.showSuccessModal = true; // ✅ Sikeres rendelés esetén mutatja a modált
        //this.cartService.clearCartOnLogout().subscribe(); // ✅ Töröljük a kosarat a backendből
       },
      error: (err) => console.error('Hiba történt a rendelés leadásakor:', err)
    });
  }
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/success']); // ✅ Navigálás a sikeres rendelési oldalra
  }
}
