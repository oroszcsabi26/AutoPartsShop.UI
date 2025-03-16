import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-part-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-part-categories.component.html',
  styleUrls: ['./admin-part-categories.component.css']
})
export class AdminPartCategoriesComponent implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';
  editCategoryId: number | null = null;
  editCategoryName: string = '';
  errorMessage: string = '';
  categoryToDelete: any = null; // A törlendő kategória adatai

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // 🔹 Kategóriák betöltése
  loadCategories(): void {
    this.http.get<any[]>('http://localhost:5214/api/parts/categories').subscribe({
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

    this.http.post('http://localhost:5214/api/parts/categories', { name: this.newCategoryName }).subscribe({
      next: () => {
        this.newCategoryName = ''; // Mező törlése
        this.loadCategories(); // Kategóriák frissítése
      },
      error: () => this.errorMessage = 'Hiba történt az új kategória hozzáadásakor!'
    });
  }

  // 🔹 Szerkesztés indítása
  startEdit(category: any): void {
    this.editCategoryId = category.id;
    this.editCategoryName = category.name;
  }

  // 🔹 Szerkesztés mentése
  saveEdit(): void {
    if (!this.editCategoryName.trim()) {
      this.errorMessage = 'A kategória neve nem lehet üres!';
      return;
    }

    this.http.put(`http://localhost:5214/api/parts/categories/${this.editCategoryId}`, { name: this.editCategoryName }).subscribe({
      next: () => {
        this.editCategoryId = null;
        this.editCategoryName = '';
        this.loadCategories(); // Kategóriák frissítése
      },
      error: () => this.errorMessage = 'Hiba történt a kategória módosításakor!'
    });
  }

  // 🔹 Törlés megerősítő modal megnyitása
  openDeleteModal(category: any): void {
    this.categoryToDelete = category;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  // 🔹 Modal bezárása
  closeDeleteModal(): void {
    this.categoryToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  // 🔹 Kategória törlése
  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    this.http.delete(`http://localhost:5214/api/parts/categories/${this.categoryToDelete.id}`).subscribe({
      next: () => {
        this.loadCategories();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Nem törölhető, mert vannak hozzá tartozó alkatrészek!'
    });
  }
}
