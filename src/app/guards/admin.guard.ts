import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminUser = localStorage.getItem('adminUser'); 

  if (adminUser) {
    return true;
  } else {
    router.navigate(['/admin/login']); 
    return false;
  }
};
