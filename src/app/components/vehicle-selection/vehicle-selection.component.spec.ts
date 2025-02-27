import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleSelectionComponent } from './vehicle-selection.component';
import { provideHttpClient } from '@angular/common/http';

describe('VehicleSelectionComponent', () => {
  let component: VehicleSelectionComponent;
  let fixture: ComponentFixture<VehicleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSelectionComponent],
      providers: [provideHttpClient()] // ✅ HttpClient hozzáadása a tesztkörnyezethez
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
