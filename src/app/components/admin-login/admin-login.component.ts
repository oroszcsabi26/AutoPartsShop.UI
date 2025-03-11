import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.errorMessage = ''; // Hibaüzenet törlése az új próbálkozás előtt

    this.http.post<{ token: string, user: any }>('http://localhost:5214/api/user/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.user.isAdmin) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('adminUser', JSON.stringify(response.user));
          this.router.navigate(['/admin/dashboard']); // Sikeres belépés esetén átirányítás
        } else {
          this.errorMessage = 'Nincs admin jogosultság!';
        }
      },
      error: () => {
        this.errorMessage = 'Hibás e-mail vagy jelszó!';
      }
    });
  }
}
