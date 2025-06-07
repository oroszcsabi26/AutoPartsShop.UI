import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  address: string;
  shippingAddress: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5214/api/user';
  private tokenKey = 'authToken';
  private userKey = 'user';

  private authState = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<LoginResponse['user'] | null>(null);
  private cartService = inject(CartService); // 🔹 Így nincs ciklikus függőség

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Betölti a felhasználói adatokat a localStorage-ból
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedUser && storedToken) {
      this.authState.next(true);
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  // Bejelentkezés a backend API-n keresztül
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.authState.next(true);
        this.userSubject.next(response.user);
      })
    );
  }

  // Regisztráció a backend API-n keresztül
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Token visszaadása
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Figyeljük, hogy be van-e jelentkezve
  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Lekéri a bejelentkezett felhasználó adatait
  getUser(): Observable<LoginResponse['user'] | null> {
    return this.userSubject.asObservable();
  }

  // Kijelentkezés (backend + frontend kosár törlés)
  logout(): void {
    this.cartService.clearCartOnLogout().subscribe({
      next: () => console.log('✅ Kosár törölve a backendről kijelentkezéskor.'),
      error: (err) => console.error('❌ Hiba a kosár törlésekor kijelentkezéskor:', err),
      complete: () => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem('cartId'); // Kijelentkezéskor a cartId is törlődik!
        this.authState.next(false);
        this.userSubject.next(null);
        this.cartService.clearLocalCart(); // Frontend kosár törlése
      }
    });
  }
}
