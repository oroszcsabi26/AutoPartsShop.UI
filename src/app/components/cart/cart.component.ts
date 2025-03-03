import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
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

  increaseQuantity(item: CartItem): void {
    if (!item.id) return;
    this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Hiba történt a mennyiség növelésekor:', err)
    });
  }

  decreaseQuantity(item: CartItem): void {
    if (!item.id || item.quantity <= 1) return;
    this.cartService.updateCartItem(item.id, item.quantity - 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Hiba történt a mennyiség csökkentésekor:', err)
    });
  }

  removeItem(item: CartItem): void {
    if (!item.id) return;
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Hiba történt a termék eltávolításakor:', err)
    });
  }

  goToOrderPage(): void {
    this.router.navigate(['/rendeles']);
  }
}


