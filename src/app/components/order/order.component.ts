import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, UserOrderData } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ShippingMethod } from '../../enums/shipping-method.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';

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

  shippingMethods = ['Házhozszállítás', 'Átvételi Pont', 'Személyes Átvétel'];
  paymentMethods = ['Készpénz', 'Bankkártya átvételkor', 'Átutalás', 'Online Bankkártya'];

  orderData = {
    shippingAddress: '',
    billingAddress: '',
    comment: '',
    name: '',
    phoneNumber: '',
    shippingMethod: 'Házhozszállítás',
    paymentMethod: 'Készpénz'
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
    const baseTotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalPrice = baseTotal + this.getExtraFee();
  }

  getExtraFee(): number {
    const method = this.orderData.paymentMethod;
    return method === 'Készpénz' || method === 'Bankkártya átvételkor' ? 1000 : 0;
  }

  normalizeEnum(value: string): string {
  return value.replace(/\s/g, ''); 
  }

    getShippingLabel(method: string): string {
    return ShippingMethod[method as keyof typeof ShippingMethod];
  }

  getPaymentLabel(method: string): string {
    return PaymentMethod[method as keyof typeof PaymentMethod];
  }

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

  const payload = {
    shippingAddress: this.orderData.shippingAddress,
    billingAddress: this.orderData.billingAddress,
    comment: this.orderData.comment,
    shippingMethod: this.normalizeEnum(this.orderData.shippingMethod),
    paymentMethod: this.normalizeEnum(this.orderData.paymentMethod),
    extraFee: this.getExtraFee()
  };

  console.log('Rendelés payload:', payload); 

  this.orderService.createOrder(payload).subscribe({
    next: (response) => {
      this.router.navigate(['/success']);
    },
    error: (err) => console.error('Hiba történt a rendelés leadásakor:', err)
  });
}
}
