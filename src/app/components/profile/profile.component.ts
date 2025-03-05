import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = { // ✅ Változó név javítva, interfész típust kapott!
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    shippingAddress: ''
  };
  
  successMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // 🔹 Felhasználói adatok betöltése
  loadUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data; // ✅ Helyes változó használat
      },
      error: (err) => console.error('Hiba történt a felhasználói adatok lekérésekor:', err)
    });
  }

  // 🔹 Felhasználói adatok frissítése
  updateProfile(): void {
    this.userService.updateUserProfile(this.userProfile).subscribe({
      next: () => {
        this.successMessage = '✅ A profil sikeresen frissítve!';
        setTimeout(() => this.successMessage = '', 3000); // Üzenet eltüntetése 3 mp után
      },
      error: (err) => console.error('Hiba történt a profil frissítésekor:', err)
    });
  }
}
