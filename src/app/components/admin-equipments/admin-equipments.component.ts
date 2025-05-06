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
  newEquipment: { name: string; manufacturer: string; size: string; price: string; equipmentCategoryId: number | null; description: string; quantity: number | null; imageUrl: string; material: string; side: string } = 
  { name: '', manufacturer: '', size: '', price: '', equipmentCategoryId: null, description: '', quantity: null, imageUrl: '', material: '', side: '' };
  editEquipmentId: number | null = null;
  editEquipment: any = {};
  errorMessage: string = '';
  equipmentToDelete: any = null;
  selectedCategoryId: number | null = null; // Kiválasztott kategória ID
  searchQuery: string = ''; // Keresési lekérdezés
  selectedImageFile: File | null = null;
  
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
  const priceValue = parseFloat(this.newEquipment.price);

  if (
    !this.newEquipment.name.trim() ||
    !this.newEquipment.manufacturer.trim() ||
    isNaN(priceValue) || priceValue <= 0 ||
    !this.newEquipment.equipmentCategoryId
  ) {
    this.errorMessage = 'Minden kötelező mezőt ki kell tölteni!';
    return;
  }

  const formData = new FormData();
  formData.append('Name', this.newEquipment.name);
  formData.append('Manufacturer', this.newEquipment.manufacturer);
  formData.append('Price', priceValue.toString());
  formData.append('EquipmentCategoryId', this.newEquipment.equipmentCategoryId!.toString());

  if (this.newEquipment.size) formData.append('Size', this.newEquipment.size);
  if (this.newEquipment.description) formData.append('Description', this.newEquipment.description);
  if (this.newEquipment.quantity !== null && this.newEquipment.quantity !== undefined) formData.append('Quantity', this.newEquipment.quantity.toString());
  if (this.newEquipment.material) formData.append('Material', this.newEquipment.material);
  if (this.newEquipment.side) formData.append('Side', this.newEquipment.side);

  if (this.selectedImageFile) {
    formData.append('ImageFile', this.selectedImageFile);
  }

  this.http.post('http://localhost:5214/api/equipment', formData).subscribe({
    next: () => {
      this.newEquipment = {
        name: '',
        manufacturer: '',
        size: '',
        price: '',
        equipmentCategoryId: null,
        description: '',
        quantity: null,
        imageUrl: '',
        material: '',
        side: ''
      };
      this.selectedImageFile = null;
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

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }
}