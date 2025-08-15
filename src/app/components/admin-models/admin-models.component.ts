import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';  

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
  modelToDelete: any = null; 
  engineVariants: any[] = [];
  openedEvModelId: number | null = null;
  evLoading: boolean = false;
  evError: string = '';
  editEvId: number | null = null;
  evToDelete: { id: number; label: string } | null = null;
  isEvDeleteOpen: boolean = false;

  editEvForm: any = {
    fuelType: '',
    engineSize: null as number | null,
    yearFrom: null as number | null,
    yearTo: null as number | null
  };

  evForm: any = {
    fuelType: '',
    engineSize: null as number | null,
    yearFrom: null as number | null,
    yearTo: null as number | null
  };
  evFormError: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.http.get<any[]>(`${environment.azureApiUrl}/api/cars`).subscribe({
      next: (data) => this.carBrands = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni az autómárkákat!'
    });
  }

  loadModels(): void {
    if (this.selectedBrandId === null) {
      this.carModels = [];
      return;
    }

    this.http.get<any[]>(`${environment.azureApiUrl}/api/cars/models/brand/${this.selectedBrandId}`).subscribe({
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
    this.http.post(`${environment.azureApiUrl}/api/cars/models/${this.selectedBrandId}`, newModel).subscribe({
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
    this.http.put(`${environment.azureApiUrl}/api/cars/models/${this.editModelId}`, updatedModel).subscribe({
      next: () => {
        this.editModelId = null;
        this.editModelName = '';
        this.editModelYear = null;
        this.loadModels();
      },
      error: () => this.errorMessage = 'Hiba történt az autómodell módosításakor!'
    });
  }

  openDeleteModal(model: any): void {
    this.modelToDelete = model;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'flex';
  }

  closeDeleteModal(): void {
    this.modelToDelete = null;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
  }

  confirmDelete(): void {
    if (!this.modelToDelete) return;

    this.http.delete(`${environment.azureApiUrl}/api/cars/models/${this.modelToDelete.id}`).subscribe({
      next: () => {
        this.loadModels();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt az autómodell törlésekor!'
    });
  }

  openEvDeleteModal(ev: any): void {
  this.evToDelete = {
    id: ev.id,
    label: `${ev.fuelType} – ${ev.engineSize} cm³ (${ev.yearFrom} - ${ev.yearTo})`
  };
  this.isEvDeleteOpen = true;
}

closeEvDeleteModal(): void {
  this.isEvDeleteOpen = false;
  this.evToDelete = null;
}

confirmEvDelete(): void {
  if (!this.evToDelete) return;
  const id = this.evToDelete.id;

  this.http.delete(`${environment.azureApiUrl}/api/enginevariants/${id}`).subscribe({
    next: () => {
      this.closeEvDeleteModal();
      if (this.openedEvModelId) this.loadEngineVariants(this.openedEvModelId);
    },
    error: () => {
      this.closeEvDeleteModal();
      alert('Hiba történt a törlésnél.');
    }
  });
}

  toggleEvPanel(model: any): void {
  if (this.openedEvModelId === model.id) {
    this.openedEvModelId = null;
    this.resetEvState();
    return;
  }

  this.openedEvModelId = model.id;
  this.resetEvState();
  this.loadEngineVariants(model.id);
}

  private loadEngineVariants(modelId: number): void {
    this.evLoading = true;
    this.evError = '';
    this.engineVariants = [];

    this.http
      .get<any[]>(`${environment.azureApiUrl}/api/enginevariants/carModel/${modelId}`)
      .subscribe({
        next: (data) => {
          this.engineVariants = data ?? [];
          this.evLoading = false;
        },
        error: () => {
          this.evError = 'Nem sikerült betölteni a motorváltozatokat.';
          this.evLoading = false;
        }
      });
  }
   addEngineVariant(): void {
    this.evFormError = '';
    if (!this.openedEvModelId) {
      this.evFormError = 'Nincs kiválasztott autómodell.';
      return;
    }

    const f = this.evForm;
    if (!f.fuelType.trim()) {
      this.evFormError = 'Az üzemanyag megadása kötelező.';
      return;
    }
    if (!f.engineSize || f.engineSize <= 0) {
      this.evFormError = 'A hengerűrtartalom legyen pozitív.';
      return;
    }
    if (!f.yearFrom || !f.yearTo || f.yearFrom <= 0 || f.yearTo <= 0) {
      this.evFormError = 'Az évszámok legyenek pozitívak.';
      return;
    }
    if (f.yearFrom > f.yearTo) {
      this.evFormError = 'A kezdő év nem lehet nagyobb a vég évnél.';
      return;
    }

    const payload = {
      CarModelId: this.openedEvModelId,
      FuelType: f.fuelType.trim(),
      EngineSize: f.engineSize,
      YearFrom: f.yearFrom,
      YearTo: f.yearTo
    };

    this.evLoading = true;
    this.http.post(`${environment.azureApiUrl}/api/enginevariants`, payload).subscribe({
      next: () => {
        this.evForm = { fuelType: '', engineSize: null, yearFrom: null, yearTo: null };
        this.loadEngineVariants(this.openedEvModelId!);
      },
      error: () => {
        this.evLoading = false;
        this.evFormError = 'Nem sikerült hozzáadni a motorváltozatot.';
      }
    });
  }

  startEvEdit(ev: any) {
  this.editEvId = ev.id;
  this.editEvForm = {
    fuelType: ev.fuelType,
    engineSize: ev.engineSize,
    yearFrom: ev.yearFrom,
    yearTo: ev.yearTo
  };
}

cancelEvEdit() {
  this.editEvId = null;
}

saveEvEdit(id: number) {
  if (!this.openedEvModelId) return;

  const f = this.editEvForm;

  if (!f.fuelType?.trim() || !f.engineSize || !f.yearFrom || !f.yearTo) {
    alert('Minden mező kötelező (üzemanyag, hengerűrtartalom, év eleje/vége)!');
    return;
  }

  if (f.yearFrom <= 0 || f.yearTo <= 0) {
    alert('Az évszámok legyenek pozitívak!');
    return;
  }
  if (f.yearFrom > f.yearTo) {
    alert('A kezdő év nem lehet nagyobb a záró évnél.');
    return;
  }

  const payload = {
    id,
    carModelId: this.openedEvModelId,
    fuelType: f.fuelType.trim(),
    engineSize: f.engineSize,
    yearFrom: f.yearFrom,
    yearTo: f.yearTo
  };

  this.http.put(`${environment.azureApiUrl}/api/enginevariants/${id}`, payload).subscribe({
    next: () => {
      this.editEvId = null;
      this.loadEngineVariants(this.openedEvModelId!);
    },
    error: () => alert('Hiba történt a módosításnál.')
  });
}

private resetEvState(): void {
  this.engineVariants = [];
  this.evError = '';
  this.evLoading = false;

  this.evForm = { fuelType: '', engineSize: null, yearFrom: null, yearTo: null };
  this.evFormError = '';

  this.editEvId = null;
  this.editEvForm = { fuelType: '', engineSize: null, yearFrom: null, yearTo: null };
}

@HostListener('document:keydown.escape', ['$event'])
onEsc(event: KeyboardEvent) {
  if (this.isEvDeleteOpen) {
    this.closeEvDeleteModal();
  }
}
}
