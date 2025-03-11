import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPartCategoriesComponent } from './admin-part-categories.component';

describe('AdminPartCategoriesComponent', () => {
  let component: AdminPartCategoriesComponent;
  let fixture: ComponentFixture<AdminPartCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPartCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPartCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
