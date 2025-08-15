import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class RegisterComponent {
  user: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    address: '',
    shippingAddress: '',
    phoneNumber: ''
  };

  errorMessage: string = ''; 
  successMessage: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  validateFields(): boolean {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.passwordHash || 
        !this.user.address || !this.user.shippingAddress || !this.user.phoneNumber) {
      this.errorMessage = '❌ Minden mező kitöltése kötelező!';
      return false;
    }

    if (!this.user.email.includes('@')) {
      this.errorMessage = '❌ Érvénytelen e-mail cím!';
      return false;
    }

    if (this.user.passwordHash.length < 8) {
      this.errorMessage = '❌ A jelszónak legalább 8 karakter hosszúnak kell lennie!';
      return false;
    }

    if (!/^\d{10,15}$/.test(this.user.phoneNumber)) {
      this.errorMessage = '❌ A telefonszám csak számjegyeket tartalmazhat (10-15 karakter)!';
      return false;
    }

    this.errorMessage = ''; 
    return true;
  }

  register(): void {
    if (!this.validateFields()) return;

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = '✅ Sikeres regisztráció! Átirányítás...';
        setTimeout(() => {
          this.router.navigate(['/bejelentkezes']); 
        }, 2000);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = '❌ Ezzel az e-mail címmel már regisztráltak!';
        } else {
          this.errorMessage = '⚠️ Hiba történt a regisztráció során. Próbáld újra!';
        }
      }
    });
  }  
}
