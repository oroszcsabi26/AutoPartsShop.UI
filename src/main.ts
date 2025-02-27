import { bootstrapApplication } from '@angular/platform-browser'; // ✅ Az Angular fő funkciója, amely elindítja az alkalmazást
import { appConfig } from './app/app.config'; // ✅ Az alkalmazás konfigurációja, amely beállítja az alapvető szolgáltatásokat
import { AppComponent } from './app/app.component';  // ✅ Az alkalmazás fő komponense, amely az egész UI-t összefogja

bootstrapApplication(AppComponent, appConfig)  //// ✅ Az alkalmazás elindítása az `AppComponent` betöltésével és az `appConfig` beállításaival
  .catch((err) => console.error(err));
