import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CarService, CarBrand, CarModel, EngineVariant } from '../../services/car.service';
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
  engineVariants: EngineVariant[] = [];
  filteredEngineVariants: EngineVariant[] = [];
  selectedEngineVariantId: number | null = null;

  @Output() selectedBrandChange = new EventEmitter<number | null>();
  @Output() selectedYearChange = new EventEmitter<number | null>();
  @Output() selectedModelChange = new EventEmitter<number | null>(); 
  @Output() selectedCategoryChange = new EventEmitter<number | null>(); 
  @Output() selectedEngineVariantChange = new EventEmitter<number | null>();

  constructor(private carService: CarService, private partService: PartService) {}

  ngOnInit(): void {
    this.loadCarBrands();
  }

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
  this.selectedModelId = null;
  this.carModels = [];

  this.selectedYear = null;
  this.years = [];

  this.selectedEngineVariantId = null;
  this.engineVariants = [];
  this.filteredEngineVariants = [];
  this.selectedCategoryId = null;

  this.selectedModelChange.emit(null); 
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
  this.selectedEngineVariantId = null;
  this.engineVariants = [];
  this.selectedCategoryId = null;
  this.filteredEngineVariants = [];

  if (this.selectedModelId != null) {
      this.loadCompatibleYears(this.selectedModelId);
      this.carService.getEngineVariantsByCarModel(this.selectedModelId).subscribe({
        next: (variants: EngineVariant[]) => {
          this.engineVariants = variants;
          this.applyYearFilter(); 
        },
        error: (err: unknown) => {
          console.error('❌ Hiba a motorváltozatok lekérdezésekor:', err);
          this.engineVariants = [];
          this.filteredEngineVariants = []; 
        }
      });
    }
}

onYearSelected(): void {
  this.selectedEngineVariantId = null;
  this.selectedCategoryId = null;
  this.selectedYearChange.emit(this.selectedYear);
  this.applyYearFilter();
  
  if (this.selectedModelId !== null && this.selectedYear !== null && this.selectedBrandId !== null) {
    const selectedModel = this.carModels.find(m => m.id === this.selectedModelId);
    if (!selectedModel) {
      console.error("❌ Modell nem található.");
      return;
    }

        this.carService.getEngineVariantsByCarModel(this.selectedModelId!).subscribe({
      next: (variants: EngineVariant[]) => {
        this.engineVariants = variants;
        this.applyYearFilter(); 
      },
      error: (err: unknown) => {
        console.error("❌ Hiba a motorváltozatok lekérdezésekor:", err);
        this.engineVariants = [];
        this.filteredEngineVariants = [];
      }
    });
  }
}

  private applyYearFilter(): void {
    if (this.selectedYear == null) {
      this.filteredEngineVariants = this.engineVariants.slice();
    } else {
      this.filteredEngineVariants = this.engineVariants
        .filter(ev => ev.yearFrom <= this.selectedYear! && this.selectedYear! <= ev.yearTo);
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

onEngineVariantSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedEngineVariantId = target.value ? Number(target.value) : null;
    this.loadPartCategories();
    this.selectedEngineVariantChange.emit(this.selectedEngineVariantId);
  }
}
