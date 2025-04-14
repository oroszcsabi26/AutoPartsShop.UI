import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-equipments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-equipments.component.html',
  styleUrls: ['./admin-equipments.component.css']
})
export class AdminEquipmentsComponent implements OnInit {
  equipments: any[] = [];
  categories: any[] = [];
  newEquipment = { name: '', manufacturer: '', size: '', price: '', equipmentCategoryId: null, description : '', quantity: null, imageUrl: '' , material: '', side: '' };
  editEquipmentId: number | null = null;
  editEquipment: any = {};
  errorMessage: string = '';
  equipmentToDelete: any = null;
  selectedCategoryId: number | null = null; // Kiválasztott kategória ID
  searchQuery: string = ''; // Keresési lekérdezés

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    //this.loadEquipments();
    this.loadCategories();
  }

  loadEquipments(): void {
    // Ha nincs keresési kifejezés, ne jelenítsünk meg semmit
    if (!this.searchQuery.trim()) {
      this.equipments = [];
      return;
    }
  
    this.http.get<any[]>('http://localhost:5214/api/equipment').subscribe({
      next: (data) => {
        const query = this.searchQuery.toLowerCase();
        this.equipments = data.filter(e =>
          e.name.toLowerCase().includes(query) ||
          e.manufacturer.toLowerCase().includes(query)
        );
      },
      error: () => this.errorMessage = 'Nem sikerült betölteni a felszereléseket!'
    });
  }
   

  // Kategóriák betöltése
  loadCategories(): void {
    this.http.get<any[]>('http://localhost:5214/api/equipmentcategories').subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Nem sikerült betölteni a kategóriákat!'
    });
  }

  // Új felszerelés hozzáadása
  addEquipment(): void {
    const priceValue = parseFloat(this.newEquipment.price); // string → number
  
    if (
      !this.newEquipment.name.trim() ||
      !this.newEquipment.manufacturer.trim() ||
      isNaN(priceValue) || priceValue <= 0 ||
      !this.newEquipment.equipmentCategoryId
    ) {
      this.errorMessage = 'Minden mező kitöltése kötelező!';
      return;
    }
  
    // Frissített objektum szám formátumú árral
    const equipmentToSend = {
      ...this.newEquipment,
      price: priceValue
    };
  
    this.http.post('http://localhost:5214/api/equipment', equipmentToSend).subscribe({
      next: () => {
        this.newEquipment = {
          name: '',
          manufacturer: '',
          size: '',
          price: '',
          equipmentCategoryId: null,
          description : '',
          quantity: null,
          imageUrl: '' ,
          material: '',
          side: ''
        };
        this.loadEquipments();
      },
      error: () => this.errorMessage = 'Hiba történt az új felszerelés hozzáadásakor!'
    });
  }  

  // Szerkesztés indítása
  startEdit(equipment: any): void {
    this.editEquipmentId = equipment.id;
    this.editEquipment = { ...equipment };
  }

  // Módosítás mentése
  saveEdit(): void {
    if (!this.editEquipment.name.trim() || !this.editEquipment.manufacturer.trim() || this.editEquipment.price <= 0 || !this.editEquipment.equipmentCategoryId) {
      return;
    }

    this.http.put(`http://localhost:5214/api/equipment/${this.editEquipmentId}`, this.editEquipment).subscribe({
      next: () => {
        this.editEquipmentId = null;
        this.editEquipment = {};
        this.loadEquipments();
      },
      error: () => this.errorMessage = 'Hiba történt a felszerelés módosításakor!'
    });
  } 
  // Törlés megerősítő modal megnyitása
  openDeleteModal(equipment: any): void {
    this.equipmentToDelete = equipment;
    document.getElementById('deleteModal')!.style.display = 'block';
  }
  // Modal bezárása
  closeDeleteModal(): void {
    this.equipmentToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none';
  }

  confirmDelete(): void {
    if (!this.equipmentToDelete) return;

    this.http.delete(`http://localhost:5214/api/equipment/${this.equipmentToDelete.id}`).subscribe({
      next: () => {
        this.loadEquipments();
        this.closeDeleteModal();
      },
      error: () => this.errorMessage = 'Hiba történt a felszerelés törlésekor!'
    });
  }
}