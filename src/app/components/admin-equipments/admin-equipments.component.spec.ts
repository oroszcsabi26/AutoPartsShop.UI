import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEquipmentsComponent } from './admin-equipments.component';

describe('AdminEquipmentsComponent', () => {
  let component: AdminEquipmentsComponent;
  let fixture: ComponentFixture<AdminEquipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEquipmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
