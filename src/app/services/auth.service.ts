import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';  

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

export interface ResetPasswordConfirmDto {
  email: string;
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.azureApiUrl}/api/user`;
  private tokenKey = 'authToken';
  private userKey = 'user';

  private authState = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<LoginResponse['user'] | null>(null);
  private cartService = inject(CartService); 

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedUser && storedToken) {
      this.authState.next(true);
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

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

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getUser(): Observable<LoginResponse['user'] | null> {
    return this.userSubject.asObservable();
  }

  logout(): void {
    this.cartService.clearCartOnLogout().subscribe({
      next: () => console.log('✅ Kosár törölve a backendről kijelentkezéskor.'),
      error: (err) => console.error('❌ Hiba a kosár törlésekor kijelentkezéskor:', err),
      complete: () => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem('cartId'); 
        this.authState.next(false);
        this.userSubject.next(null);
        this.cartService.clearLocalCart(); 
      }
    });
  }

    requestPasswordReset(email: string) {
      const body = { email };
      return this.http.post(`${this.apiUrl}/reset-request`, body);
    }

    confirmPasswordReset(dto: ResetPasswordConfirmDto) {
      return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      dto
    );
  }
}
