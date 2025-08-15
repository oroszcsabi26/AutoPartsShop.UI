import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  

export interface Equipment {
  id: number;
  name: string;
  manufacturer: string;
  size?: string;
  price: number;
  equipmentCategoryId: number;
  quantity?: number;
  imageUrl?: string;
  material?: string;
  side?: string;
  description?: string;
}

export interface EquipmentDisplay {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  size?: string;
  description?: string;
  quantity: number;
  imageUrl?: string;
  material?: string;
  side?: string;
  equipmentCategoryId: number;
  categoryName: string;
}

export interface EquipmentCategory {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrlGetEquipmentCategories = `${environment.azureApiUrl}/api/equipmentcategories`;  
  private apiUrlGetEquipments = `${environment.azureApiUrl}/api/equipment/category`;  

  constructor(private http: HttpClient) {}

  getEquipmentsByCategory(categoryId: number): Observable<EquipmentDisplay[]> {
    return this.http.get<EquipmentDisplay[]>(`${this.apiUrlGetEquipments}/${categoryId}`);
  }

  getEquipmentCategories(): Observable<EquipmentCategory[]> {
    return this.http.get<EquipmentCategory[]>(this.apiUrlGetEquipmentCategories);
  }
}
