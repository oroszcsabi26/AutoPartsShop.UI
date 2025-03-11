import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEquipmentCategoriesComponent } from './admin-equipment-categories.component';

describe('AdminEquipmentCategoriesComponent', () => {
  let component: AdminEquipmentCategoriesComponent;
  let fixture: ComponentFixture<AdminEquipmentCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEquipmentCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEquipmentCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
