import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUserListItemDto {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  deletedAt?: string | null;
  orderCount: number;
}

export interface AdminUserOrderDto {
  id: number;
  orderDate: string;
  status: string;
  itemCount: number;
  total: number;
}

export interface AdminUserDetailsDto {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  deletedAt?: string | null;
  orderCount: number;
  phoneNumber?: string;
  address?: string;
  shippingAddress?: string;
  orders?: AdminUserOrderDto[] | null;
}

export type UserStatusFilter = '' | 'active' | 'locked' | 'deleted';

export interface GetUsersQuery {
  search?: string;
  status?: UserStatusFilter;
  from?: string; 
  to?: string;   
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private base = `${environment.azureApiUrl}/api/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(q: GetUsersQuery): Observable<AdminUserListItemDto[]> {
    let params = new HttpParams();

    if (q.search) params = params.set('search', q.search);
    if (q.status) params = params.set('status', q.status);
    if (q.from)   params = params.set('from', q.from);
    if (q.to)     params = params.set('to', q.to);

    return this.http.get<AdminUserListItemDto[]>(this.base, { params });
  }

  getUserDetails(userId: number, includeOrders = false): Observable<AdminUserDetailsDto> {
    let params = new HttpParams();
    if (includeOrders) params = params.set('includeOrders', true);
    return this.http.get<AdminUserDetailsDto>(`${this.base}/${userId}`, { params });
  }

  deactivate(userId: number): Observable<any> {
    return this.http.put(`${this.base}/${userId}/deactivate`, {});
  }

  activate(userId: number): Observable<any> {
    return this.http.put(`${this.base}/${userId}/activate`, {});
  }

  delete(userId: number) {
  return this.http.delete(`${this.base}/${userId}`);
  }

  requestPasswordReset(email: string) {
    return this.http.post(
      `${environment.azureApiUrl}/api/user/reset-request`,
      { email }
    );
  }
}
