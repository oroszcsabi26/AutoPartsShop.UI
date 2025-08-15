import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})

export class CarListComponent {
  carBrands: any[] = [];
  expandedBrands: Set<number> = new Set();

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCarBrands();
  }

  loadCarBrands(): void {
    this.carService.getCarBrands().subscribe({
      next: (data) => {
        this.carBrands = data; 
        console.log('Autómárkák:', this.carBrands); 
      },
      error: (error) => {
        console.error('Hiba történt az API hívás során:', error);
      }
    });
  }

  toggleModels(brandId: number): void {
    if (this.expandedBrands.has(brandId)) {
      this.expandedBrands.delete(brandId);
    } else {
      this.expandedBrands.add(brandId); 
    }
  }

  isExpanded(brandId: number): boolean {
    return this.expandedBrands.has(brandId);
  }
}

