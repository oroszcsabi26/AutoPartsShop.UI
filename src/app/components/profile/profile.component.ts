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
  userProfile: UserProfile = { 
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

  loadUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data; 
      },
      error: (err) => console.error('Hiba történt a felhasználói adatok lekérésekor:', err)
    });
  }

  updateProfile(): void {
    this.userService.updateUserProfile(this.userProfile).subscribe({
      next: () => {
        this.successMessage = '✅ A profil sikeresen frissítve!';
        setTimeout(() => this.successMessage = '', 3000); 
      },
      error: (err) => console.error('Hiba történt a profil frissítésekor:', err)
    });
  }
}
