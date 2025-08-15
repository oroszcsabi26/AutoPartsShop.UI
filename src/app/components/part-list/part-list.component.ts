import { Component, Input, OnInit } from '@angular/core'; 
import { PartService, PartDisplay } from '../../services/part.service';
import { EquipmentService, Equipment } from '../../services/equipment.service';
import { CartService, CartItem } from '../../services/cart.service'; 
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
  parts: PartDisplay[] = []; 
  equipments: Equipment[] = [];  
  searchQuery: string = '';   
  equipmentSearchQuery: string = ''; 
  equipmentCategories: { id: number, name: string }[] = []; 
  showSuccessMessage = false;   
  selectedImageUrl: string | null = null; 

  @Input() selectedBrandId: number | null = null;
  @Input() selectedModelId: number | null = null;
  @Input() selectedYear: number | null = null;
  @Input() selectedCategoryId: number | null = null;
  @Input() selectedEquipmentCategoryId: number | null = null; 
  @Input() selectedEngineVariantId: number | null = null;

  constructor(
    private partService: PartService,
    private equipmentService: EquipmentService,
    private cartService: CartService 
  ) {}

  ngOnInit(): void {
    this.loadEquipmentCategories();
  }

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

  searchParts(): void {
    if (this.searchQuery.trim() === '') {
      this.parts = [];
      return;
    }

    this.partService
      .searchParts(
        this.searchQuery,                
        this.selectedModelId,
        this.selectedCategoryId,
        this.selectedEngineVariantId     
      )
      .subscribe({
        next: (data) => {
          this.parts = data.map(p => ({ ...p, quantity: p.quantity || 1 }));
        },
        error: (err) => console.error("❌ Hiba történt az alkatrészek keresése során:", err)
      });
  }

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

  increaseQuantity(item: PartDisplay | Equipment): void {
    item.quantity = (item.quantity || 1) + 1;
  }

  decreaseQuantity(item: PartDisplay | Equipment): void {
    if (item.quantity && item.quantity > 1) {
      item.quantity -= 1;
    }
  }

  addToCart(item: PartDisplay | Equipment): void {
    if (!item || !item.id || !item.name || !item.price || !item.quantity) {
      console.error("Hiba: Érvénytelen adat küldése a kosárhoz!", item);
      return;
    }

    const isPart = 'partsCategoryId' in item; 

    const cartItem: CartItem = {
      itemType: isPart ? "Part" : "Equipment",
      quantity: item.quantity || 1,
      name: item.name,
      price: item.price,
      partId: isPart ? item.id : undefined,
      equipmentId: isPart ? undefined : item.id
    };

    console.log("🛒 Kosárba helyezett termék:", cartItem);

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
