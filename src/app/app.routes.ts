import { Routes } from '@angular/router';
import { PartListComponent } from './components/part-list/part-list.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { SuccessComponent } from './components/success/success.component'; // 🆕 Új komponens importálása

export const routes: Routes = [
    { path: 'alkatreszek', component: PartListComponent },
    { path: 'kosar', component: CartComponent },
    { path: 'bejelentkezes', component: LoginComponent },
    { path: 'regisztracio', component: RegisterComponent },
    { path: 'rendeles', component: OrderComponent }, // 🆕 Rendelés oldal
    { path: 'success', component: SuccessComponent } // 🆕 Sikeres rendelés oldal
];
