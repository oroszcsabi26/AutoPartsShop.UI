import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  

// 🔹 Autómárka és modell interfészek
export interface CarBrand {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  name: string;
  carBrandId: number;
  fuelType?: string;
  engineSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.azureApiUrl}/api/cars`;

  constructor(private http: HttpClient) {}

  // 🔹 Összes autómárka lekérése
  getCarBrands(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.apiUrl}`);
  }

  // 🔹 Egy adott autómárkához tartozó modellek lekérése
  getCarModels(brandId: number): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/models/brand/${brandId}`);
  }

  // Egy adott autómodellhez tartozó kompatibilis évjáratok lekérése
  getCompatibleYearsByModel(modelId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/models/compatible-years/model/${modelId}`);
}
  getEngineVariants(brandId: number, modelName: string, year: number): Observable<string[]> {
  return this.http.get<string[]>(
    `${this.apiUrl}/models/brandId/${brandId}/modelName/${modelName}/year/${year}/engine-options`
  );
}
}
