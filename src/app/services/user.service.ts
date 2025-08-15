import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  shippingAddress: string;
}

export interface UserOrder {
  id: number;               
  orderDate: string;         
  status: string;            
  totalPrice: number;        
  orderItems: OrderItem[];   
}

export interface OrderItem {
  name: string;  
  quantity: number;     
  price: number;        
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.azureApiUrl}/api/user`; 

  constructor(private http: HttpClient) {} 

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateUserProfile(userData: UserProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, userData);
  }

  getUserOrders(): Observable<UserOrder[]> {
    return this.http.get<UserOrder[]>(`${this.apiUrl}/my-orders`);
  }
}


