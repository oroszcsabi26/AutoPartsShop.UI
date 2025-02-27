import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🔹 Importáljuk a CommonModule-t az *ngFor és *ngIf direktívákhoz
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true, // 🔹 Megjelöljük, hogy ez egy önálló komponens
  imports: [CommonModule], // 🔹 Hozzáadjuk a CommonModule-t, hogy használhassuk az Angular beépített direktíváit
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})

export class CarListComponent {
  carBrands: any[] = []; // 🔹 Az API-ból érkező adatokat tároló tömb
  expandedBrands: Set<number> = new Set(); // 🔹 Az éppen megnyitott autómárkák ID-jait tároljuk

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCarBrands();
  }

  // 🔹 API-hívás az autómárkák és modellek lekérésére
  loadCarBrands(): void {
    this.carService.getCarBrands().subscribe({
      next: (data) => {
        this.carBrands = data; // 🔹 Az API válaszát eltároljuk a `carBrands` tömbben
        console.log('Autómárkák:', this.carBrands); // 🔹 Ellenőrzés a konzolon
      },
      error: (error) => {
        console.error('Hiba történt az API hívás során:', error);
      }
    });
  }

  toggleModels(brandId: number): void {
    if (this.expandedBrands.has(brandId)) {
      this.expandedBrands.delete(brandId); // 🔹 Ha már nyitva van, zárjuk be
    } else {
      this.expandedBrands.add(brandId); // 🔹 Ha zárva van, nyissuk meg
    }
  }

  // 🔹 Ellenőrizzük, hogy az adott autómárka nyitva van-e
  isExpanded(brandId: number): boolean {
    return this.expandedBrands.has(brandId);
  }
}

