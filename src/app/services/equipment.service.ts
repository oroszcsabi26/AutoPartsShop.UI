import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Equipment hozzáadásához/szerkesztéséhez használt interfész
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

// Bővített EquipmentDisplay csak megjelenítéshez
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
  private apiUrlGetEquipmentCategories = 'http://localhost:5214/api/equipmentcategories';  // API URL
  private apiUrlGetEquipments = 'http://localhost:5214/api/equipment/category';  // API URL

  constructor(private http: HttpClient) {}

  // 🔹 Egy adott kategóriához tartozó felszerelések lekérése
  getEquipmentsByCategory(categoryId: number): Observable<EquipmentDisplay[]> {
    return this.http.get<EquipmentDisplay[]>(`${this.apiUrlGetEquipments}/${categoryId}`);
  }

  // 🔹 Equipment kategóriák lekérése
  getEquipmentCategories(): Observable<EquipmentCategory[]> {
    return this.http.get<EquipmentCategory[]>(this.apiUrlGetEquipmentCategories);
  }
}
