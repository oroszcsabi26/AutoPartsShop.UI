import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPartsComponent } from './admin-parts.component';

describe('AdminPartsComponent', () => {
  let component: AdminPartsComponent;
  let fixture: ComponentFixture<AdminPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
