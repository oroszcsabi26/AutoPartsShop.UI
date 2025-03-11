import { Routes } from '@angular/router';
import { PartListComponent } from './components/part-list/part-list.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { SuccessComponent } from './components/success/success.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { adminGuard } from './guards/admin.guard'; // ✅ Importáljuk az Admin Guardot

// 🔹 Importáljuk az admin komponenseket
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminCarsComponent } from './components/admin-cars/admin-cars.component';
import { AdminModelsComponent } from './components/admin-models/admin-models.component';
import { AdminPartsComponent } from './components/admin-parts/admin-parts.component';
import { AdminPartCategoriesComponent } from './components/admin-part-categories/admin-part-categories.component';
import { AdminEquipmentsComponent } from './components/admin-equipments/admin-equipments.component';
import { AdminEquipmentCategoriesComponent } from './components/admin-equipment-categories/admin-equipment-categories.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

export const routes: Routes = [
    { path: 'alkatreszek', component: PartListComponent },
    { path: 'kosar', component: CartComponent },
    { path: 'bejelentkezes', component: LoginComponent },
    { path: 'regisztracio', component: RegisterComponent },
    { path: 'rendeles', component: OrderComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'profil', component: ProfileComponent },
    { path: 'rendeleseim', component: UserOrdersComponent },

    // 🔹 Admin oldalak
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'admin/cars', component: AdminCarsComponent },
    { path: 'admin/models', component: AdminModelsComponent },
    { path: 'admin/parts', component: AdminPartsComponent },
    { path: 'admin/part-categories', component: AdminPartCategoriesComponent },
    { path: 'admin/equipments', component: AdminEquipmentsComponent },
    { path: 'admin/equipment-categories', component: AdminEquipmentCategoriesComponent },
    { path: 'admin/orders', component: AdminOrdersComponent },
];
