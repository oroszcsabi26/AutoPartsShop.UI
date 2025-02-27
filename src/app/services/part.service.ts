import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Alkatrész modell interfészek
export interface Part {
  id: number;
  name: string;
  price: number;
  carModelId: number;
  partsCategoryId: number;
  quantity: number;
}

export interface PartsCategory {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartService {
  private apiUrl = 'http://localhost:5214/api/parts';  // Backend API URL

  constructor(private http: HttpClient) {}

  // 🔹 Összes alkatrész lekérése
  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl);
  }

  // 🔹 Alkatrész lekérése ID alapján
  getPartById(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Alkatrész hozzáadása
  addPart(part: Part): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part);
  }

  // 🔹 Alkatrész módosítása
  updatePart(id: number, part: Part): Observable<Part> {
    return this.http.put<Part>(`${this.apiUrl}/${id}`, part);
  }

  // 🔹 Alkatrész törlése
  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Alkatrész kategóriák lekérése
  getPartCategories(): Observable<PartsCategory[]> {
    return this.http.get<PartsCategory[]>(`${this.apiUrl}/categories`);
  }

  // 🔹 Alkatrészek keresése név alapján
  // 🔹 Alkatrészek keresése név, autómodell és alkatrész kategória szerint
  searchParts(query: string, carModelId: number | null, partsCategoryId: number | null): Observable<Part[]> {
    let url = `${this.apiUrl}/search?name=${query}`;
    
    if (carModelId !== null) {
      url += `&carModelId=${carModelId}`;
    }
    if (partsCategoryId !== null) {
      url += `&partsCategoryId=${partsCategoryId}`;
    }
  
    return this.http.get<Part[]>(url);
  }  
}
