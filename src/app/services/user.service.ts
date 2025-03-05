import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 DTO a felhasználói adatokhoz
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  shippingAddress: string;
}

// 🔹 DTO a rendelési adatokhoz
export interface UserOrder {
  id: number;                // Rendelés azonosítója
  orderDate: string;         // Rendelés leadásának dátuma
  status: string;            // Rendelés állapota (pl.: "Feldolgozás alatt")
  totalPrice: number;        // Rendelés végösszege
  orderItems: OrderItem[];   // Rendelési tételek listája
}

export interface OrderItem {
  name: string;  // Termék neve
  quantity: number;     // Megrendelt mennyiség
  price: number;        // Egy darab ára
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5214/api/user'; // Backend API URL

  constructor(private http: HttpClient) {} // 🔹 Itt injektáljuk a HttpClient-et!

  // 🔹 Felhasználói adatok lekérése
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  // 🔹 Felhasználói adatok frissítése
  updateUserProfile(userData: UserProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, userData);
  }

  // 🔹 🔥 ÚJ: Felhasználói rendeléseinek lekérése
  getUserOrders(): Observable<UserOrder[]> {
    return this.http.get<UserOrder[]>(`${this.apiUrl}/my-orders`);
  }
}


