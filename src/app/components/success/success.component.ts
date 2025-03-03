import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  standalone: true,
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  imports: [CommonModule]
})
export class SuccessComponent {
  orderId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] ? Number(params['orderId']) : null;
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
