import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials: LoginRequest = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']); // Sikeres bejelentkezés után átirányítás a főoldalra
      },
      error: () => {
        this.errorMessage = 'Hibás e-mail vagy jelszó!';
      }
    });
  }
}
