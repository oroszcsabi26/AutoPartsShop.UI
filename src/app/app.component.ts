import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { EquipmentService, EquipmentCategory, Equipment } from './services/equipment.service';
import { VehicleSelectionComponent } from './components/vehicle-selection/vehicle-selection.component';
import { PartListComponent } from './components/part-list/part-list.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleSelectionComponent, PartListComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AutoPartsShop.UI';

  // 🔹 Oldal állapotok
  isCartPage: boolean = false;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isAuthenticated: boolean = false;
  userName: string | null = null;

  // 🔹 Equipment kereséshez szükséges változók
  equipmentCategories: EquipmentCategory[] = [];
  selectedEquipmentCategoryId: number | null = null;
  equipmentSearchQuery: string = '';
  equipmentResults: Equipment[] = []; // ✅ Ez most már nem tűnik el!

  selectedModelId: number | null = null;
  selectedCategoryId: number | null = null;

  constructor(
    private equipmentService: EquipmentService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEquipmentCategories();
    this.checkAuthenticationStatus();

    // 🔹 Figyeljük az útvonal változásait, hogy frissítsük az állapotokat
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCartPage = this.router.url.includes('/kosar');
        this.isLoginPage = this.router.url.includes('/bejelentkezes');
        this.isRegisterPage = this.router.url.includes('/regisztracio');
      }
    });

    // 🔹 Figyeljük a bejelentkezési állapotot
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;

      // ✅ Nem kérdezzük le automatikusan a kosarat, csak ha a user először rak bele terméket!
    });
  }

  // 🔹 Ellenőrzi, hogy a felhasználó be van-e jelentkezve
  private checkAuthenticationStatus(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;

      if (this.isAuthenticated) {
        this.authService.getUser().subscribe((user) => {
          if (user) {
            this.userName = `${user.firstName} ${user.lastName}`;
          } else {
            this.userName = null;
          }
        });
      } else {
        this.userName = null;
      }
    });
  }

  // 🔹 Kijelentkezési funkció (kosár, user és token törlése is)
  logout(): void {
    this.authService.logout(); // ❌ Elegendő csak ezt meghívni!
  
    localStorage.removeItem('cart'); // ❌ Kosár törlése (ezt már az auth.service.ts elvégzi)
    localStorage.removeItem('authToken'); // ❌ Token törlése (ezt is)
    localStorage.removeItem('user'); // ❌ User törlése (ez is felesleges, mert az authService már kezeli)
  
    this.isAuthenticated = false;
    this.userName = null;
    this.router.navigate(['/bejelentkezes']);
  }  

  // 🔹 Felszerelési kategóriák betöltése
  loadEquipmentCategories(): void {
    this.equipmentService.getEquipmentCategories().subscribe({
      next: (categories) => {
        this.equipmentCategories = categories;
        console.log("✅ Equipment kategóriák betöltve:", this.equipmentCategories);
      },
      error: (error) => {
        console.error("❌ Hiba történt a kategóriák betöltésekor:", error);
      }
    });
  }

  // 🔹 Felszerelési cikkek keresése
  searchEquipment(): void {
    if (this.equipmentSearchQuery.trim() === '') {
      console.warn('⚠️ A keresési mező üres!');
      this.equipmentResults = [];
      return;
    }

    this.equipmentService.getEquipmentsByCategory(this.selectedEquipmentCategoryId!).subscribe({
      next: (equipments) => {
        this.equipmentResults = equipments.filter(equipment =>
          equipment.name.toLowerCase().includes(this.equipmentSearchQuery.toLowerCase())
        );
      },
      error: (error) => {
        console.error('❌ Hiba történt a keresés során:', error);
      }
    });
  }
}
