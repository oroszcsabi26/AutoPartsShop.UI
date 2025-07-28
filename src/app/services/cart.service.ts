import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';  

// 🔹 Kosár elem interfész
export interface CartItem {
  id?: number;
  itemType: string; // "Part" vagy "Equipment"
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

  // 🔹 Ellenőrzi, hogy a felhasználó be van-e jelentkezve
  private isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // ✅ Ha van token, be van jelentkezve
  }

  // 🔹 Kosár lekérése (ha nem létezik, nem dob hibát)
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

  // 🔹 Termék hozzáadása a kosárhoz (ha nincs bejelentkezve, átirányítás a login oldalra!)
  addToCart(item: CartItem): Observable<void> {
    if (!this.isAuthenticated()) {
      console.warn("⚠️ Nincs bejelentkezve, átirányítás a bejelentkezésre...");
      this.router.navigate(['/bejelentkezes']);
      return of(); // Hibát elkerülő üres Observable
    }

    return this.http.post<void>(`${this.apiUrl}/add`, {
      itemType: item.itemType,
      quantity: item.quantity,
      partId: item.partId ?? null,
      equipmentId: item.equipmentId ?? null
    });
  }

  // 🔹 Kosárban lévő termék mennyiségének módosítása
  updateCartItem(cartItemId: number, newQuantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${cartItemId}/${newQuantity}`, {}).pipe(
      catchError(error => {
        console.error("❌ Hiba a kosár módosításakor:", error);
        return of();
      })
    );
  }

  // 🔹 Termék eltávolítása a kosárból
  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      catchError(error => {
        console.error("❌ Hiba a termék eltávolításakor:", error);
        return of();
      })
    );
  }

  // 🔹 Backend kosár törlése kijelentkezéskor
  clearCartOnLogout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`).pipe(
      catchError(error => {
        console.error("❌ Hiba a kosár törlésekor kijelentkezés után:", error);
        return of(null);
      })
    );
  }

  // 🔹 Frontend kosár törlése
  clearLocalCart(): void {
    localStorage.removeItem('cart');
  }
}
