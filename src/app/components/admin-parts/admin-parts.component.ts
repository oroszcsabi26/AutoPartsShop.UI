import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';  

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
  engineVariants: any[] = [];                 
  selectedEngineVariantIds: number[] = [];    
  editSelectedEngineVariantIds: number[] = []; 

  newPart = {
    name: '',
    price: '' as string | number,
    carModelId: null as number | null,
    partsCategoryId: null as number | null,
    manufacturer: '',
    side: '',
    shape: '',
    size: '',
    type: '',
    material: '',
    description: '',
    quantity: '' as string | number
  };
  selectedImageFile: File | null = null;
  editImageFile: File | null = null;
  editPartId: number | null = null;
  editPart: any = {};
  errorMessage: string = '';
  partToDelete: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCarBrands();
    this.loadCategories();
  }

  loadCarBrands(): void {
    this.http.get<any[]>(`${environment.azureApiUrl}/api/cars`).subscribe({
      next: (data) => this.carBrands = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómárkákat!'
    });
  }

  loadCarModels(): void {
    this.carModels = [];
    this.selectedModelId = null;
    this.parts = [];

    if (!this.selectedBrandId) return;

    this.http.get<any[]>(`${environment.azureApiUrl}/api/cars/models/brand/${this.selectedBrandId}`).subscribe({
      next: (data) => this.carModels = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómodelleket!'
    });
  }

  loadCategories(): void {
    this.http.get<any[]>(`${environment.azureApiUrl}/api/parts/categories`).subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az alkatrész kategóriákat!'
    });
  }

  loadParts(): void {
    this.parts = [];
    if (!this.selectedModelId || !this.selectedCategoryId) return;

    let url = `${environment.azureApiUrl}/api/parts/search?carModelId=${this.selectedModelId}&partsCategoryId=${this.selectedCategoryId}`;

    if (this.selectedEngineVariantIds && this.selectedEngineVariantIds.length === 1) {
      url += `&engineVariantId=${this.selectedEngineVariantIds[0]}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => this.parts = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az alkatrészeket!'
    });
  }

  addPart(): void {
    if (!this.newPart.name.trim() || parseFloat(this.newPart.price as string) <= 0 || !this.selectedModelId || !this.selectedCategoryId || !this.newPart.manufacturer.trim()) {
      this.errorMessage = 'Minden mező kitöltése kötelező!';
      return;
    }
  
    if (this.selectedEngineVariantIds.length === 0) {
      this.errorMessage = 'Válassz legalább egy motorváltozatot!';
      return;
    }

    if (this.newPart.quantity === null || isNaN(Number(this.newPart.quantity))) {
      this.newPart.quantity = 1;
    }

    this.newPart.carModelId = this.selectedModelId;
    this.newPart.partsCategoryId = this.selectedCategoryId;
    this.newPart.price = parseFloat(this.newPart.price as string);
    this.newPart.quantity = parseInt(this.newPart.quantity as string) || 1;
  
    const formData = new FormData();
  
    for (const key in this.newPart) {
      const value = (this.newPart as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    }

    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }
    
    if (this.selectedEngineVariantIds?.length) {
      [...new Set(this.selectedEngineVariantIds)].forEach(id => {
      formData.append('engineVariantIds', id.toString());
    });
}

    this.http.post(`${environment.azureApiUrl}/api/parts`, formData).subscribe({
      next: () => {
        this.newPart = {
          name: '',
          price: 0,
          carModelId: null,
          partsCategoryId: null,
          manufacturer: '',
          side: '',
          shape: '',
          size: '',
          type: '',
          material: '',
          description: '',
          quantity: 1
        };
        this.selectedImageFile = null;
        this.loadParts();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész hozzáadásakor!'
    });
  }  

startEdit(part: any): void {
  this.editPartId = part.id;
  this.editPart = { ...part };

  // EV ID-k alaphelyzetben
  this.editSelectedEngineVariantIds = [];

  this.selectedModelId = part.carModelId;
  this.http.get<any[]>(`${environment.azureApiUrl}/api/enginevariants/carModel/${this.selectedModelId}`)
    .subscribe({
      next: (evList) => {
        this.engineVariants = evList;

        this.http.get<any>(`${environment.azureApiUrl}/api/parts/${part.id}`).subscribe({
          next: (data) => {
            const partEvIds: number[] = Array.isArray(data.engineVariantIds) ? (data.engineVariantIds as number[]) : [];
              this.editSelectedEngineVariantIds = partEvIds.filter((id: number) =>
              this.engineVariants.some((ev: any) => ev.id === id)
            );
          },
          error: () => {
            this.errorMessage = 'Nem sikerült lekérni a motorváltozatokat az alkatrészhez.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a motorváltozatokat a modellhez.';
      }
    });
}

  saveEdit(): void {
    if (!this.editPart.name.trim() || this.editPart.price <= 0) {
      return;
    }
  
    if (this.editPart.quantity === null || isNaN(Number(this.editPart.quantity))) {
      this.editPart.quantity = 1;
    }
  
    this.editPart.price = parseFloat(this.editPart.price);
    this.editPart.quantity = parseInt(this.editPart.quantity) || 1;
  
    const formData = new FormData();
  
    for (const key in this.editPart) {
      const value = this.editPart[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    }
  
    if (this.editImageFile) {
      formData.append('imageFile', this.editImageFile);
    }

    if (this.editSelectedEngineVariantIds?.length) {
      [...new Set(this.editSelectedEngineVariantIds)].forEach(id => {
        formData.append('engineVariantIds', id.toString());
      });
    }

    this.http.put(`${environment.azureApiUrl}/api/parts/${this.editPartId}`, formData).subscribe({
      next: () => {
        this.editPartId = null;
        this.editPart = {};
        this.editImageFile = null;
        this.loadParts();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész módosításakor!'
    });
  }  

  openDeleteModal(part: any): void {
    this.partToDelete = part;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  closeDeleteModal(): void {
    this.partToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  confirmDelete(): void {
    if (!this.partToDelete) return;

    this.http.delete(`${environment.azureApiUrl}/api/parts/${this.partToDelete.id}`).subscribe({
      next: () => {
        this.loadParts();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt az alkatrész törlésekor!'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }
  
  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editImageFile = input.files[0];
    }
  }

  onModelChange(): void {
  this.loadEngineVariants();
  this.loadParts(); 
}

onEngineVariantChange(event: any, mode: 'add' | 'edit'): void {
  const evId = +event.target.value;
  const list = mode === 'add' ? this.selectedEngineVariantIds : this.editSelectedEngineVariantIds;

  if (event.target.checked) {
    if (!list.includes(evId)) list.push(evId);
  } else {
    const index = list.indexOf(evId);
    if (index > -1) list.splice(index, 1);
  }

    if (mode === 'add') {
    this.loadParts();
  }
}

  loadEngineVariants(): void {
  this.engineVariants = [];
  this.selectedEngineVariantIds = [];
  this.editSelectedEngineVariantIds = [];

  if (!this.selectedModelId) return;

  this.http.get<any[]>(`${environment.azureApiUrl}/api/enginevariants/carModel/${this.selectedModelId}`)
    .subscribe({
      next: (data) => this.engineVariants = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni a motorváltozatokat!'
    });
}
}
