import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  

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

export interface EngineVariant {
  id: number;
  carModelId: number;
  fuelType: string;
  engineSize: number;
  yearFrom: number;
  yearTo: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.azureApiUrl}/api/cars`;
  private engineApi = `${environment.azureApiUrl}/api/enginevariants`;

  constructor(private http: HttpClient) {}

  getCarBrands(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.apiUrl}`);
  }

  getCarModels(brandId: number): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/models/brand/${brandId}`);
  }

  getCompatibleYearsByModel(modelId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/models/compatible-years/model/${modelId}`);
  }
  getEngineVariantsByCarModel(carModelId: number): Observable<EngineVariant[]> {
    return this.http.get<EngineVariant[]>(`${this.engineApi}/carModel/${carModelId}`);
  }
}
