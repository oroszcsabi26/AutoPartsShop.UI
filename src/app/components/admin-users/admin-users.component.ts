import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUsersService, AdminUserListItemDto, AdminUserDetailsDto } from '../../services/admin-users.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  search = '';
  status: '' | 'active' | 'locked' | 'deleted' = '';
  from = '';
  to = '';

  users: AdminUserListItemDto[] = [];
  loading = false;
  errorMsg = '';
  resetMessage = '';
  confirmModalOpen = false;
  confirmTarget:{id: number; email: string; action: 'activate' | 'deactivate'} | null = null;
  busy = false;
  detailsOpen = false;
  detailsLoading = false;
  detailsError = '';
  details: AdminUserDetailsDto | null = null;
  deleteModalOpen = false;
  deleteTarget: { id: number; email: string } | null = null;

  constructor(private adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    if (this.from && this.to && this.from > this.to) {
      this.errorMsg = 'A „kezdő” dátum nem lehet későbbi, mint a „záró” dátum.';
      this.loading = false;
      return;
    }

    this.adminUsers.getUsers({
      search: this.search || undefined,
      status: (this.status || undefined),
      from: this.from || undefined,
      to: this.to || undefined,
    }).subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = 'Nem sikerült betölteni a felhasználókat.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  clearFilters(): void {
    this.search = '';
    this.status = '';
    this.from = '';
    this.to = '';
    this.load();
  }

  openToggleModal(u: AdminUserListItemDto): void {
    if (u.deletedAt) return; 
    const action: 'activate' | 'deactivate' = u.isActive ? 'deactivate' : 'activate';
    this.confirmTarget = { id: u.id, email: u.email, action };
    this.confirmModalOpen = true;
  }

  closeModal(): void {
    this.confirmModalOpen = false;
    this.confirmTarget = null;
  }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    this.busy = true;

    const call$ = this.confirmTarget.action === 'activate'
      ? this.adminUsers.activate(this.confirmTarget.id)
      : this.adminUsers.deactivate(this.confirmTarget.id);

    call$.subscribe({
      next: () => {
        this.busy = false;
        this.closeModal();
        this.load();
      },
      error: err => {
        this.busy = false;
        this.errorMsg = 'A művelet nem sikerült.';
        console.error(err);
      }
    });
  }

  openDetails(userId: number): void {
  this.detailsOpen = true;
  this.detailsError = '';
  this.details = null;
  this.loadDetails(userId, false);
}

loadOrdersForDetails(): void {
  if (!this.details) return;
  this.loadDetails(this.details.id, true);
}

closeDetails(): void {
  this.detailsOpen = false;
  this.details = null;
  this.detailsError = '';
}

private loadDetails(userId: number, includeOrders: boolean): void {
  this.detailsLoading = true;
  this.adminUsers.getUserDetails(userId, includeOrders).subscribe({
    next: d => {
      this.details = d;
      this.detailsLoading = false;
      this.detailsError = '';
    },
    error: err => {
      this.detailsLoading = false;
      this.detailsError = 'Nem sikerült betölteni a részleteket.';
      console.error(err);
    }
  });
}

openDeleteModal(u: AdminUserListItemDto): void {
  if (u.deletedAt) return; 
  this.deleteTarget = { id: u.id, email: u.email };
  this.deleteModalOpen = true;
}

closeDeleteModal(): void {
  this.deleteModalOpen = false;
  this.deleteTarget = null;
}

  confirmDelete(): void {
    if (!this.deleteTarget) return;
    this.busy = true;
    this.adminUsers.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.busy = false;
        this.closeDeleteModal();
        this.load(); 
      },
      error: err => {
        this.busy = false;
        this.errorMsg = err?.error || 'A törlés nem sikerült.';
        console.error(err);
      }
    });
  }

  sendResetForUser(email: string): void {
    if (!email) return;
    this.busy = true;
    const normalized = email.trim().toLowerCase();

    this.adminUsers.requestPasswordReset(normalized).subscribe({
      next: () => {
        this.busy = false;
        this.showResetMessage();
      },
      error: () => {
        this.busy = false;
        // privacy okból itt is ugyanazt az üzenetet adjuk
        this.showResetMessage();
      }
    });
  }

  showResetMessage(): void {
    this.resetMessage = 'Ha a cím létezik, elküldtük a jelszó-visszaállító linket.';
    setTimeout(() => (this.resetMessage = ''), 4000);
  }
}
