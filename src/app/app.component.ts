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

  isCartPage: boolean = false;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isAuthenticated: boolean = false;
  isOrderPage: boolean = false;
  isSuccessPage: boolean = false;
  isProfileMenuOpen: boolean = false;
  isProfilePage: boolean = false;
  isAdminPage: boolean = false;
  isAdminDashboardPage: boolean = false;
  isAdminCarsPage: boolean = false;
  IsAdminModelsPage: boolean = false;
  isAdminEquipmentCategoriesPage: boolean = false;
  isAdminEquipmentPage: boolean = false;
  isAdminPartsCategoriesPage: boolean = false;
  isAdminPartsPage: boolean = false;
  isAdminOrdersPage: boolean = false;
  isAdminUsersPage: boolean = false;
  isResetPasswordPage: boolean = false;
  userName: string | null = null;

  equipmentCategories: EquipmentCategory[] = [];
  selectedEquipmentCategoryId: number | null = null;
  equipmentSearchQuery: string = '';
  equipmentResults: Equipment[] = []; 

  selectedBrandId: number | null = null;
  selectedModelId: number | null = null;
  selectedYear: number | null = null;
  selectedEngineVariantId: number | null = null;
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCartPage = this.router.url.includes('/kosar');
        this.isLoginPage = this.router.url.includes('/bejelentkezes');
        this.isRegisterPage = this.router.url.includes('/regisztracio');
        this.isOrderPage = this.router.url.includes('/rendeles');
        this.isSuccessPage = this.router.url.includes('/success');
        this.isProfilePage = this.router.url.includes('/profil');
        this.isAdminPage = this.router.url.includes('/admin/login');
        this.isAdminDashboardPage = this.router.url.includes('/admin/dashboard');
        this.isAdminCarsPage = this.router.url.includes('/admin/cars');
        this.IsAdminModelsPage = this.router.url.includes('/admin/models');
        this.isAdminEquipmentCategoriesPage = this.router.url.includes('/admin/equipment-categories');
        this.isAdminEquipmentPage = this.router.url.includes('/admin/equipment');
        this.isAdminPartsCategoriesPage = this.router.url.includes('/admin/part-categories');
        this.isAdminPartsPage = this.router.url.includes('/admin/parts');
        this.isAdminOrdersPage = this.router.url.includes('/admin/orders');
        this.isAdminUsersPage = this.router.url.includes('/admin/users');
        this.isResetPasswordPage = this.router.url.includes('/reset-password');
        this.isProfileMenuOpen = false;
      }
    });

    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }

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

  logout(): void {
    this.authService.logout(); 
  
    localStorage.removeItem('cart'); 
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('user'); 
  
    this.isAuthenticated = false;
    this.userName = null;
    this.router.navigate(['/bejelentkezes']);
  }  

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

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onBrandChanged(brandId: number | null): void {
  this.selectedBrandId = brandId;
  this.selectedModelId = null;
  this.selectedYear = null;
  this.selectedEngineVariantId = null;
  this.selectedCategoryId = null;
}

onModelChanged(modelId: number | null): void {
  this.selectedModelId = modelId;
  this.selectedYear = null;
  this.selectedEngineVariantId = null;
  this.selectedCategoryId = null;
}

onYearChanged(year: number | null): void {
  this.selectedYear = year;
  this.selectedEngineVariantId = null;
  this.selectedCategoryId = null;
}

onEngineVariantChanged(variantId: number | null): void {
  this.selectedEngineVariantId = variantId;
  this.selectedCategoryId = null;
}

onCategoryChanged(categoryId: number | null): void {
  this.selectedCategoryId = categoryId;
}
}
