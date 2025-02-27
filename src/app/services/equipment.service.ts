import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Equipment és EquipmentCategory interfészek
export interface Equipment {
  id: number;
  name: string;
  manufacturer: string;
  size?: string;  // Kiszerelés (opcionális)
  price: number;
  equipmentCategoryId: number;
  quantity?: number;
}

export interface EquipmentCategory {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrlGetEquipmentCategories = 'http://localhost:5214/api/equipmentcategories';  // API URL
  private apiUrlGetEquipments = 'http://localhost:5214/api/equipment/category';  // API URL

  constructor(private http: HttpClient) {}

  // 🔹 Összes Equipment lekérése
  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrlGetEquipmentCategories);
  }

  // 🔹 Egy adott kategóriához tartozó felszerelések lekérése
  getEquipmentsByCategory(categoryId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrlGetEquipments}/${categoryId}`);
  }

  // 🔹 Új Equipment hozzáadása
  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrlGetEquipmentCategories, equipment);
  }

  // 🔹 Equipment kategóriák lekérése
  getEquipmentCategories(): Observable<EquipmentCategory[]> {
    return this.http.get<EquipmentCategory[]>(this.apiUrlGetEquipmentCategories);
  }
}
