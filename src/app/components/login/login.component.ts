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
  showReset = false;
  resetEmail = '';
  resetMsg = '';
  resetBusy = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials: LoginRequest = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']); 
      },
      error: () => {
        this.errorMessage = 'Hibás e-mail vagy jelszó!';
      }
    });
  }

   toggleReset(): void {
    this.showReset = !this.showReset;
    this.resetMsg = '';
    if (this.showReset && !this.resetEmail && this.email) {
      // ha már be van írva az email a login mezőbe, töltsük át
      this.resetEmail = this.email;
    }
  }

  sendResetLink(): void {
    if (!this.resetEmail) {
      this.resetMsg = 'Adj meg egy e-mail címet.';
      return;
    }

     const email = this.resetEmail.trim().toLowerCase();

    this.resetBusy = true;
    this.resetMsg = '';
    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.resetBusy = false;
        this.resetMsg = '✅ Ha létezik ilyen fiók, elküldtük a jelszó-visszaállító linket.';
      },
      error: () => {
        this.resetBusy = false;
        this.resetMsg = '✅ Ha létezik ilyen fiók, elküldtük a jelszó-visszaállító linket.';
      }
    });
  }
}
