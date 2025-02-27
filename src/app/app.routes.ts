import { Routes } from '@angular/router';
import { PartListComponent } from './components/part-list/part-list.component';
import { CartComponent } from './components/cart/cart.component'; // 🛒 Kosár komponens importálása
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'; // 🆕 Regisztrációs komponens importálása

export const routes: Routes = [
    { path: 'alkatreszek', component: PartListComponent }, // 🔹 Alkatrész kereső oldal
    { path: 'kosar', component: CartComponent }, // 🆕 Kosár oldal útvonala
    { path: 'bejelentkezes', component: LoginComponent }, // ✅ Bejelentkezési útvonal
    { path: 'regisztracio', component: RegisterComponent }, // 🆕 Regisztráció útvonal
];
