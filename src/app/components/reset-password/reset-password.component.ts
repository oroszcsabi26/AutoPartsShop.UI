import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, ResetPasswordConfirmDto } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  email = '';

  newPassword = '';
  confirmPassword = '';

  errorMsg = '';
  infoMsg = '';
  submitting = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // token + email kiolvasása az URL-ből
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = (params.get('email') || '').trim().toLowerCase();

      if (!this.token || !this.email) {
        this.errorMsg = 'A jelszó-visszaállító link érvénytelen.';
      }
    });
  }

  submit(): void {
    this.errorMsg = '';
    this.infoMsg = '';

    if (!this.token || !this.email) {
      this.errorMsg = 'Hiányzó token vagy e-mail.';
      return;
    }
    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMsg = 'A jelszó legyen legalább 8 karakter.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'A jelszavak nem egyeznek.';
      return;
    }

    const dto: ResetPasswordConfirmDto = {
      email: this.email.trim().toLowerCase(),
      token: this.token,
      newPassword: this.newPassword
    };

    this.submitting = true;
    this.auth.confirmPasswordReset(dto).subscribe({
      next: (res) => {
        this.submitting = false;
        this.infoMsg = res.message ?? 'A jelszó sikeresen frissült. Átirányítás…';
        setTimeout(() => this.router.navigate(['/bejelentkezes']), 2000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error ?? 'A link érvénytelen vagy lejárt.';
        console.error(err);
      }
    });
  }
}
