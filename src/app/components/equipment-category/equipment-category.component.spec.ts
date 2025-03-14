import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentCategoryComponent } from './equipment-category.component';

describe('EquipmentCategoryComponent', () => {
  let component: EquipmentCategoryComponent;
  let fixture: ComponentFixture<EquipmentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
