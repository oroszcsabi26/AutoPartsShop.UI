import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';  

@Component({
  selector: 'app-admin-equipment-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-equipment-categories.component.html',
  styleUrls: ['./admin-equipment-categories.component.css']
})
export class AdminEquipmentCategoriesComponent implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';
  editCategoryId: number | null = null;
  editCategoryName: string = '';
  errorMessage: string = '';
  categoryToDelete: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // 🔹 Kategóriák betöltése
  loadCategories(): void {
    this.http.get<any[]>(`${environment.azureApiUrl}/api/equipmentcategories`).subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni a kategóriákat!'
    });
  }

  // 🔹 Új kategória hozzáadása
  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.errorMessage = 'A kategória neve nem lehet üres!';
      return;
    }

    const newCategory = { name: this.newCategoryName };
    this.http.post(`${environment.azureApiUrl}/api/equipmentcategories`, newCategory).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: () => this.errorMessage = 'Hiba történt az új kategória hozzáadásakor!'
    });
  }

  // 🔹 Kategória szerkesztésének megkezdése
  startEdit(category: any): void {
    this.editCategoryId = category.id;
    this.editCategoryName = category.name;
  }

  // 🔹 Kategória mentése
  saveEdit(): void {
    if (this.editCategoryId === null || !this.editCategoryName.trim()) return;

    const updatedCategory = { name: this.editCategoryName };
    this.http.put(`${environment.azureApiUrl}/api/equipmentcategories/${this.editCategoryId}`, updatedCategory).subscribe({
      next: () => {
        this.editCategoryId = null;
        this.editCategoryName = '';
        this.loadCategories();
      },
      error: () => this.errorMessage = 'Hiba történt a kategória módosításakor!'
    });
  }

  // 🔹 Modal megnyitása törléshez
  openDeleteModal(category: any): void {
    this.categoryToDelete = category;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'block';
  }

  // 🔹 Modal bezárása
  closeDeleteModal(): void {
    this.categoryToDelete = null;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
  }

  // 🔹 Kategória törlésének megerősítése
  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    this.http.delete(`${environment.azureApiUrl}/api/equipmentcategories/${this.categoryToDelete.id}`).subscribe({
      next: () => {
        this.loadCategories();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt a kategória törlésekor!'
    });
  }
}
