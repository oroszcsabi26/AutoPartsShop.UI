import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminUser = localStorage.getItem('adminUser'); // 🔹 Ellenőrizzük, van-e admin adat

  if (adminUser) {
    return true; // ✅ Admin belépve, mehet tovább
  } else {
    router.navigate(['/admin/login']); // ❌ Nincs bejelentkezve → átirányítás
    return false;
  }
};
