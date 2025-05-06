import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cars.component.html',
  styleUrls: ['./admin-cars.component.css']
})
export class AdminCarsComponent implements OnInit {
  cars: any[] = []; // Autómárkák listája
  newCarName: string = ''; // Új autómárka neve
  editCarId: number | null = null;
  editCarName: string = '';
  errorMessage: string = ''; // Hibaüzenetek tárolására

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCars();
  }

  // Autómárkák betöltése az adatbázisból
  loadCars(): void {
    this.http.get<any[]>('http://localhost:5214/api/cars').subscribe({
      next: (data) => this.cars = data,
      error: (err) => {
        console.error('Hiba az autómárkák lekérésekor:', err);
        this.errorMessage = 'Nem sikerült betölteni az autómárkákat!';
      }
    });
  }

  // Új autómárka hozzáadása
  addCar(): void {
    this.errorMessage = '';
    if (!this.newCarName.trim()) {
      this.errorMessage = 'Az autómárka neve nem lehet üres!';
      return;
    }

    this.http.post('http://localhost:5214/api/cars', { name: this.newCarName }).subscribe({
      next: () => {
        this.newCarName = '';
        this.loadCars();
      },
      error: (err) => {
        console.error('Hiba az autómárka hozzáadásakor:', err);
        this.errorMessage = 'Hiba történt az új autómárka hozzáadásakor!';
      }
    });
  }

  // Autómárka szerkesztése
  startEdit(car: any): void {
    this.editCarId = car.id;
    this.editCarName = car.name;
  }

  saveEdit(): void {
    this.errorMessage = '';
    if (this.editCarId === null || !this.editCarName.trim()) return;

    this.http.put(`http://localhost:5214/api/cars/${this.editCarId}`, { name: this.editCarName }).subscribe({
      next: () => {
        this.editCarId = null;
        this.editCarName = '';
        this.loadCars();
      },
      error: (err) => {
        console.error('Hiba az autómárka módosításakor:', err);
        this.errorMessage = 'Hiba történt az autómárka módosításakor!';
      }
    });
  }

  // Autómárka törlése
  deleteCar(carId: number): void {
    this.errorMessage = '';
    if (!confirm('Biztosan törölni szeretnéd ezt az autómárkát?')) return;

    this.http.delete(`http://localhost:5214/api/cars/${carId}`).subscribe({
      next: () => this.loadCars(),
      error: (err) => {
        console.error('Hiba az autómárka törlésekor:', err);
        if (err.status === 400) {
          this.errorMessage = 'Az autómárka nem törölhető, mert még léteznek hozzá tartozó autómodellek!';
        } else {
          this.errorMessage = 'Hiba történt az autómárka törlésekor!';
        }
      }
    });
  }
}
