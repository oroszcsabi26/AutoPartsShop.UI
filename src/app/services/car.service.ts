import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Autómárka és modell interfészek
export interface CarBrand {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  name: string;
  carBrandId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:5214/api/cars';

  constructor(private http: HttpClient) {}

  // 🔹 Összes autómárka lekérése
  getCarBrands(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.apiUrl}`);
  }

  // 🔹 Egy adott autómárkához tartozó modellek lekérése
  getCarModels(brandId: number): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/models/brand/${brandId}`);
  }
}
