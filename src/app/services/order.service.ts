import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShippingMethod } from '../enums/shipping-method.enum';
import { environment } from '../../environments/environment';  

export interface OrderRequest {
  shippingAddress: string;
  billingAddress: string;
  comment?: string;
  shippingMethod: string;
  paymentMethod: string;
  extraFee: number;
}

export interface UserOrderData {
  name: string;
  phoneNumber: string;
  shippingAddress: string;
  billingAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.azureApiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, orderData);
  }

  getUserOrderData(): Observable<UserOrderData> {
    return this.http.get<UserOrderData>(`${this.apiUrl}/user-data`);
  }
}
