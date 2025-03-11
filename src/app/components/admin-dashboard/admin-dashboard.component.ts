import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // ✅ Hozzáadva!

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ RouterModule hozzáadása
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  // Kilépés gomb megnyomásakor töröljük az admin belépési adatokat
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    this.router.navigate(['/admin/login']);
  }
}
