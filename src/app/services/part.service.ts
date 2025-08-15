import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  

export interface Part {
  id: number;
  name: string;
  price: number;
  carModelId: number;
  partsCategoryId: number;
  quantity: number;
  imageUrl?: string;
}

export interface PartDisplay {
  id: number;
  name: string;
  price: number;
  manufacturer: string;
  side?: string;
  shape?: string;
  size?: string;
  type?: string;
  material?: string;
  description?: string;
  quantity: number;
  categoryName: string;
  carModelName: string;
  carBrandName: string;

  carModelId: number;
  partsCategoryId: number;
  imageUrl?: string;
}

export interface PartsCategory {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartService {
  private apiUrl = `${environment.azureApiUrl}/api/parts`;  

  constructor(private http: HttpClient) {}

  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl);
  }

  getPartById(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`);
  }

  addPart(part: Part): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part);
  }

  updatePart(id: number, part: Part): Observable<Part> {
    return this.http.put<Part>(`${this.apiUrl}/${id}`, part);
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPartCategories(): Observable<PartsCategory[]> {
    return this.http.get<PartsCategory[]>(`${this.apiUrl}/categories`);
  }

  searchParts(
  query: string,
  carModelId: number | null,
  partsCategoryId: number | null,
  engineVariantId: number | null
): Observable<PartDisplay[]> {
  const params: string[] = [];
  if (query?.trim()) params.push(`name=${encodeURIComponent(query)}`);
  if (carModelId != null)      params.push(`carModelId=${carModelId}`);
  if (partsCategoryId != null) params.push(`partsCategoryId=${partsCategoryId}`);
  if (engineVariantId != null) params.push(`engineVariantId=${engineVariantId}`);
  const url = `${this.apiUrl}/search${params.length ? '?' + params.join('&') : ''}`;
  return this.http.get<PartDisplay[]>(url);
}
}
