import { Component, Input, OnInit } from '@angular/core'; 
import { PartService, PartDisplay } from '../../services/part.service';
import { EquipmentService, Equipment } from '../../services/equipment.service';
import { CartService, CartItem } from '../../services/cart.service'; // Kosárkezelő szolgáltatás importálása
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.css']
})
export class PartListComponent implements OnInit {
  parts: PartDisplay[] = []; // Az API-ból érkező alkatrészek listája
  equipments: Equipment[] = [];  
  searchQuery: string = '';   // Keresési mező tartalma
  equipmentSearchQuery: string = ''; 
  equipmentCategories: { id: number, name: string }[] = []; 
  showSuccessMessage = false;   // Sikeres hozzáadás üzenet megjelenítése
  selectedImageUrl: string | null = null; // Kép URL tárolása

  @Input() selectedModelId: number | null = null;
  @Input() selectedCategoryId: number | null = null;
  @Input() selectedEquipmentCategoryId: number | null = null; 

  constructor(
    private partService: PartService,
    private equipmentService: EquipmentService,
    private cartService: CartService // Kosárkezelő szolgáltatás injektálása
  ) {}

  ngOnInit(): void {
    this.loadEquipmentCategories();
  }

  // Felszerelési kategóriák betöltése
  loadEquipmentCategories(): void {
    this.equipmentService.getEquipmentCategories().subscribe({
      next: (categories) => {
        this.equipmentCategories = categories;
      },
      error: (error) => {
        console.error("❌ Hiba történt a kategóriák betöltésekor:", error);
      }
    });
  }

  // Alkatrészek keresése
  searchParts(): void {
    if (this.searchQuery.trim() === '') {
      this.parts = [];
      return;
    }

    this.partService.searchParts(this.searchQuery, this.selectedModelId, this.selectedCategoryId).subscribe({
      next: (data) => {
        this.parts = data.map(part => ({ ...part, quantity: part.quantity || 1 }));
      },
      error: (error) => {
        console.error("❌ Hiba történt az alkatrészek keresése során:", error);
      }
    });
  }

  // Felszerelési cikkek keresése
  searchEquipments(): void {
    if (!this.selectedEquipmentCategoryId || this.equipmentSearchQuery.trim() === '') {
      this.equipments = [];
      return;
    }

    this.equipmentService.getEquipmentsByCategory(this.selectedEquipmentCategoryId).subscribe({
      next: (data) => {
        this.equipments = data.filter(equipment =>
          equipment.name.toLowerCase().includes(this.equipmentSearchQuery.toLowerCase())
        ).map(equipment => ({ ...equipment, quantity: equipment.quantity || 1 }));
      },
      error: (error) => {
        console.error("❌ Hiba történt a felszerelések keresése során:", error);
      }
    });
  }

  // Mennyiség növelése
  increaseQuantity(item: PartDisplay | Equipment): void {
    item.quantity = (item.quantity || 1) + 1;
  }

  // Mennyiség csökkentése (minimum 1)
  decreaseQuantity(item: PartDisplay | Equipment): void {
    if (item.quantity && item.quantity > 1) {
      item.quantity -= 1;
    }
  }

  // Kosárba helyezés
  addToCart(item: PartDisplay | Equipment): void {
    if (!item || !item.id || !item.name || !item.price || !item.quantity) {
      console.error("Hiba: Érvénytelen adat küldése a kosárhoz!", item);
      return;
    }

    const isPart = 'partsCategoryId' in item; // Ellenőrizzük, hogy alkatrész-e 

    const cartItem: CartItem = {
      itemType: isPart ? "Part" : "Equipment",
      quantity: item.quantity || 1,
      name: item.name,
      price: item.price,
      partId: isPart ? item.id : undefined,
      equipmentId: isPart ? undefined : item.id
    };

    console.log("🛒 Kosárba helyezett termék:", cartItem);

    // Termék hozzáadása a kosárhoz
    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        console.log("Sikeresen hozzáadva a kosárhoz!", cartItem);
        this.showSuccessMessage = true;
        setTimeout(() => {this.showSuccessMessage = false;}, 3000);
      },
      error: (error) => {
        console.error("Hiba történt a kosárba helyezéskor:", error);
      }
    });
  }

  openImageModal(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
