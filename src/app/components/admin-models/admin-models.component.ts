import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-models',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-models.component.html',
  styleUrls: ['./admin-models.component.css']
})
export class AdminModelsComponent implements OnInit {
  carBrands: any[] = [];
  selectedBrandId: number | null = null;
  carModels: any[] = [];
  newModelName: string = '';
  newModelYear: number | null = null;
  editModelId: number | null = null;
  editModelName: string = '';
  editModelYear: number | null = null;
  errorMessage: string = '';
  modelToDelete: any = null; // 🔹 Törlendő modell eltárolása

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.http.get<any[]>('http://localhost:5214/api/cars').subscribe({
      next: (data) => this.carBrands = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómárkákat!'
    });
  }

  loadModels(): void {
    if (this.selectedBrandId === null) {
      this.carModels = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:5214/api/cars/models/brand/${this.selectedBrandId}`).subscribe({
      next: (data) => this.carModels = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómodelleket!'
    });
  }

  addModel(): void {
    if (!this.newModelName.trim() || this.newModelYear === null) {
      this.errorMessage = 'A modell neve és az évszám kötelező!';
      return;
    }

    const newModel = { name: this.newModelName, year: this.newModelYear };
    this.http.post(`http://localhost:5214/api/cars/models/${this.selectedBrandId}`, newModel).subscribe({
      next: () => {
        this.newModelName = '';
        this.newModelYear = null;
        this.loadModels();
      },
      error: () => this.errorMessage = 'Hiba történt az új autómodell hozzáadásakor!'
    });
  }

  startEdit(model: any): void {
    this.editModelId = model.id;
    this.editModelName = model.name;
    this.editModelYear = model.year;
  }

  saveEdit(): void {
    if (this.editModelId === null || !this.editModelName.trim() || this.editModelYear === null) return;

    const updatedModel = { name: this.editModelName, year: this.editModelYear };
    this.http.put(`http://localhost:5214/api/cars/models/${this.editModelId}`, updatedModel).subscribe({
      next: () => {
        this.editModelId = null;
        this.editModelName = '';
        this.editModelYear = null;
        this.loadModels();
      },
      error: () => this.errorMessage = 'Hiba történt az autómodell módosításakor!'
    });
  }

  // 🔹 Modal megnyitása törléshez
  openDeleteModal(model: any): void {
    this.modelToDelete = model;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'block';
  }

  // 🔹 Modal bezárása
  closeDeleteModal(): void {
    this.modelToDelete = null;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
  }

  // 🔹 Modell törlésének megerősítése
  confirmDelete(): void {
    if (!this.modelToDelete) return;

    this.http.delete(`http://localhost:5214/api/cars/models/${this.modelToDelete.id}`).subscribe({
      next: () => {
        this.loadModels();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt az autómodell törlésekor!'
    });
  }
}
