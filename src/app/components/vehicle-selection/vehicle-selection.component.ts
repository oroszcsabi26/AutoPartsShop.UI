import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CarService, CarBrand, CarModel } from '../../services/car.service';
import { PartService, PartsCategory } from '../../services/part.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-selection',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './vehicle-selection.component.html',
  styleUrls: ['./vehicle-selection.component.css']
})
export class VehicleSelectionComponent implements OnInit {
  carBrands: CarBrand[] = [];
  carModels: CarModel[] = [];
  partCategories: PartsCategory[] = [];

  selectedBrandId: number | null = null;
  selectedModelId: number | null = null;
  selectedCategoryId: number | null = null;

  @Output() selectedModelChange = new EventEmitter<number | null>(); // ✅ Engedélyezzük a null értéket
  @Output() selectedCategoryChange = new EventEmitter<number | null>(); // ✅ Engedélyezzük a null értéket

  constructor(private carService: CarService, private partService: PartService) {}

  ngOnInit(): void {
    this.loadCarBrands();
    this.loadPartCategories();
  }

  // 🔹 Autómárkák lekérése az API-ból
  loadCarBrands(): void {
    this.carService.getCarBrands().subscribe({
      next: (data) => {
        this.carBrands = data;
      },
      error: (error) => {
        console.error('Hiba történt az autómárkák betöltésekor:', error);
      }
    });
  }

  // 🔹 Autómodellek lekérése a kiválasztott márkához
  loadCarModels(): void {
    if (this.selectedBrandId) {
      this.carService.getCarModels(this.selectedBrandId).subscribe({
        next: (data) => {
          this.carModels = data;
        },
        error: (error) => {
          console.error('Hiba történt az autómodellek betöltésekor:', error);
        }
      });
    } else {
      this.resetModels();
    }
  }

  // 🔹 Alkatrészkategóriák lekérése
  loadPartCategories(): void {
    this.partService.getPartCategories().subscribe({
      next: (data) => {
        this.partCategories = data;
      },
      error: (error) => {
        console.error('Hiba történt az alkatrész kategóriák betöltésekor:', error);
      }
    });
  }

  // 🔹 Modell kiválasztása
  onModelSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedModelId = target.value ? Number(target.value) : null;

    console.log("📌 Kiválasztott autómodell ID:", this.selectedModelId);

    this.selectedModelChange.emit(this.selectedModelId);
}

onCategorySelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategoryId = target.value ? Number(target.value) : null;

    console.log("📌 Kiválasztott alkatrész kategória ID:", this.selectedCategoryId);

    this.selectedCategoryChange.emit(this.selectedCategoryId);
}


  // 🔹 Ha új márkát választunk, töröljük a modelleket és az alkatrész kategóriát
  resetModels(): void {
    this.carModels = [];
    this.selectedModelId = null;
    this.selectedModelChange.emit(null);
  }
}
