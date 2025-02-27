import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; // 🔹 FormsModule hozzáadása
import { EquipmentService } from './services/equipment.service';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // ✅ Importáljuk az AuthInterceptort

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])), // ✅ Hozzáadjuk az AuthInterceptort
    importProvidersFrom(FormsModule), // 🔹 FormsModule engedélyezése az `ngModel`-hez
  ]
};
