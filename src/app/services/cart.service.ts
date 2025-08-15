import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';  

export interface CartItem {
  id?: number;
  itemType: string; 
  quantity: number;
  name: string;
  price: number;
  partId?: number;
  equipmentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.azureApiUrl}/api/cart`;
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {}

  private isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); 
  }

  getCart(): Observable<CartItem[] | null> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/my-cart`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn("⚠️ A felhasználónak még nincs kosara.");
          return of(null);
        } else {
          console.error("❌ Hiba a kosár lekérésekor:", error);
          return of(null);
        }
      })
    );
  }

  addToCart(item: CartItem): Observable<void> {
    if (!this.isAuthenticated()) {
      console.warn("⚠️ Nincs bejelentkezve, átirányítás a bejelentkezésre...");
      this.router.navigate(['/bejelentkezes']);
      return of(); 
    }

    return this.http.post<void>(`${this.apiUrl}/add`, {
      itemType: item.itemType,
      quantity: item.quantity,
      partId: item.partId ?? null,
      equipmentId: item.equipmentId ?? null
    });
  }

  updateCartItem(cartItemId: number, newQuantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${cartItemId}/${newQuantity}`, {}).pipe(
      catchError(error => {
        console.error("❌ Hiba a kosár módosításakor:", error);
        return of();
      })
    );
  }

  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      catchError(error => {
        console.error("❌ Hiba a termék eltávolításakor:", error);
        return of();
      })
    );
  }

  clearCartOnLogout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`).pipe(
      catchError(error => {
        console.error("❌ Hiba a kosár törlésekor kijelentkezés után:", error);
        return of(null);
      })
    );
  }

  clearLocalCart(): void {
    localStorage.removeItem('cart');
  }
}
