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

  years: number[] = [];
  selectedYear: number | null = null;
  engineVariants: { fuelType: string, engineSize: number }[] = [];
  selectedEngineVariant: string | null = null; // pl. 'benzin/1389'

  @Output() selectedBrandChange = new EventEmitter<number | null>();
  @Output() selectedYearChange = new EventEmitter<number | null>();
  @Output() selectedModelChange = new EventEmitter<number | null>(); // ✅ Engedélyezzük a null értéket
  @Output() selectedCategoryChange = new EventEmitter<number | null>(); // ✅ Engedélyezzük a null értéket
  @Output() selectedEngineVariantChange = new EventEmitter<string | null>();

  constructor(private carService: CarService, private partService: PartService) {}

  ngOnInit(): void {
    this.loadCarBrands();
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

onBrandSelected(): void {
  // Alaphelyzetbe állítjuk a modelleket, évjáratokat, motortípusokat
  this.selectedModelId = null;
  this.carModels = [];

  this.selectedYear = null;
  this.years = [];

  this.selectedEngineVariant = null;
  this.engineVariants = [];
  this.selectedCategoryId = null;

  this.selectedModelChange.emit(null); // szükséges ha külső komponens figyeli
  this.selectedBrandChange.emit(this.selectedBrandId);

  if (this.selectedBrandId) {
    this.loadCarModels();
  }
}

onCategorySelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategoryId = target.value ? Number(target.value) : null;

    console.log("📌 Kiválasztott alkatrész kategória ID:", this.selectedCategoryId);

    this.selectedCategoryChange.emit(this.selectedCategoryId);
}

  resetModels(): void {
    this.carModels = [];
    this.selectedModelId = null;
    this.selectedCategoryId = null;
    this.selectedModelChange.emit(null);
  }

  onModelSelected(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedModelId = target.value ? Number(target.value) : null;

  console.log("📌 Kiválasztott autómodell ID:", this.selectedModelId);
  this.selectedModelChange.emit(this.selectedModelId);
  this.selectedYear = null;
  this.years = [];
  this.selectedEngineVariant = null;
  this.engineVariants = [];
  this.selectedCategoryId = null;

  if (this.selectedModelId !== null) {
  this.loadCompatibleYears(this.selectedModelId);
  }
}

onYearSelected(): void {
  this.selectedEngineVariant = null;
  this.engineVariants = [];
  this.selectedCategoryId = null;
  this.selectedYearChange.emit(this.selectedYear);
  
  if (this.selectedModelId !== null && this.selectedYear !== null && this.selectedBrandId !== null) {
    const selectedModel = this.carModels.find(m => m.id === this.selectedModelId);
    if (!selectedModel) {
      console.error("❌ Modell nem található.");
      return;
    }

    this.carService.getEngineVariants(this.selectedBrandId, selectedModel.name, this.selectedYear).subscribe({
      next: (variants) => {
        this.engineVariants = variants.map(v => {
          const [fuelType, engineSizeStr] = v.split('/');
          return {
            fuelType: fuelType.trim(),
            engineSize: parseInt(engineSizeStr)
          };
        });
      },
      error: (err) => {
        console.error("❌ Hiba a motorváltozatok lekérdezésekor:", err);
        this.engineVariants = [];
      }
    });
  }
}

  loadCompatibleYears(modelId: number): void {
    this.selectedCategoryId = null;
  this.carService.getCompatibleYearsByModel(modelId).subscribe({
    next: (years: number[]) => {
      this.years = years;
    },
    error: (err) => {
      console.error("❌ Hiba az évjáratok lekérdezésekor:", err);
      this.years = [];
    }
  });
  }

  generateEngineVariantsForSelectedModel(): void {
  this.engineVariants = []; // először ürítjük

  const selectedModel = this.carModels?.find(model => model.id === this.selectedModelId);

  if (selectedModel && selectedModel.fuelType && selectedModel.engineSize) {
    this.engineVariants.push({
      fuelType: selectedModel.fuelType.toLowerCase(),
      engineSize: selectedModel.engineSize
    });
  }
}

onEngineVariantSelected(event: Event): void {
  this.loadPartCategories();
  const target = event.target as HTMLSelectElement;
  this.selectedEngineVariant = target.value || null;

  console.log("📌 Kiválasztott motorváltozat:", this.selectedEngineVariant);
  this.selectedEngineVariantChange.emit(this.selectedEngineVariant);
}
}
