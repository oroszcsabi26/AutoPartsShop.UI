import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-parts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-parts.component.html',
  styleUrls: ['./admin-parts.component.css']
})
export class AdminPartsComponent implements OnInit {
  parts: any[] = [];
  categories: any[] = [];
  carBrands: any[] = [];
  carModels: any[] = [];

  selectedBrandId: number | null = null;
  selectedModelId: number | null = null;
  selectedCategoryId: number | null = null;

  newPart = { name: '', price: 0, carModelId: null as number | null, partsCategoryId: null as number | null };
  editPartId: number | null = null;
  editPart: any = {};
  errorMessage: string = '';
  partToDelete: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCarBrands();
    this.loadCategories();
  }

  // 🔹 Autómárkák betöltése
  loadCarBrands(): void {
    this.http.get<any[]>('http://localhost:5214/api/cars').subscribe({
      next: (data) => this.carBrands = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómárkákat!'
    });
  }

  // 🔹 Modellek betöltése a kiválasztott márka alapján
  loadCarModels(): void {
    this.carModels = [];
    this.selectedModelId = null;
    this.parts = [];

    if (!this.selectedBrandId) return;

    this.http.get<any[]>(`http://localhost:5214/api/cars/models/brand/${this.selectedBrandId}`).subscribe({
      next: (data) => this.carModels = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómodelleket!'
    });
  }

  // 🔹 Alkatrész kategóriák betöltése
  loadCategories(): void {
    this.http.get<any[]>('http://localhost:5214/api/parts/categories').subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az alkatrész kategóriákat!'
    });
  }

  // 🔹 Alkatrészek betöltése (csak ha minden szűrési feltétel megvan)
  loadParts(): void {
    this.parts = [];

    if (!this.selectedModelId || !this.selectedCategoryId) return;

    this.http.get<any[]>(`http://localhost:5214/api/parts/search?carModelId=${this.selectedModelId}&partsCategoryId=${this.selectedCategoryId}`)
      .subscribe({
        next: (data) => this.parts = data,
        error: () => this.errorMessage = 'Nem sikerült betölteni az alkatrészeket!'
      });
  }

  // 🔹 Új alkatrész hozzáadása
  addPart(): void {
    if (!this.newPart.name.trim() || this.newPart.price <= 0 || !this.selectedModelId || !this.selectedCategoryId) {
      this.errorMessage = 'Minden mező kitöltése kötelező!';
      return;
    }

    this.newPart.carModelId = this.selectedModelId;
    this.newPart.partsCategoryId = this.selectedCategoryId;

    this.http.post('http://localhost:5214/api/parts', this.newPart).subscribe({
      next: () => {
        this.newPart = { name: '', price: 0, carModelId: null, partsCategoryId: null };
        this.loadParts();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész hozzáadásakor!'
    });
  }

  // 🔹 Szerkesztés indítása
  startEdit(part: any): void {
    this.editPartId = part.id;
    this.editPart = { ...part };
  }

  // 🔹 Módosítás mentése
  saveEdit(): void {
    if (!this.editPart.name.trim() || this.editPart.price <= 0) {
      return;
    }

    this.http.put(`http://localhost:5214/api/parts/${this.editPartId}`, this.editPart).subscribe({
      next: () => {
        this.editPartId = null;
        this.editPart = {};
        this.loadParts();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész módosításakor!'
    });
  }

  // 🔹 Törlés megerősítő modal megnyitása
  openDeleteModal(part: any): void {
    this.partToDelete = part;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  // 🔹 Modal bezárása
  closeDeleteModal(): void {
    this.partToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  // 🔹 Alkatrész törlése
  confirmDelete(): void {
    if (!this.partToDelete) return;

    this.http.delete(`http://localhost:5214/api/parts/${this.partToDelete.id}`).subscribe({
      next: () => {
        this.loadParts();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész törlésekor!'
    });
  }
}
