import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartListComponent } from './part-list.component';
import { PartService } from '../../services/part.service';
import { EquipmentService } from '../../services/equipment.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Tesztcsoport létrehozása a PartListComponent számára
// A fdescribe() függvény használatával a tesztcsoportot kiemeljük, így csak ez a tesztcsoport fut le
fdescribe('PartListComponent', () => {
  let component: PartListComponent;
  let fixture: ComponentFixture<PartListComponent>;
  let mockPartService: any;
  let mockEquipmentService: any;
  let mockCartService: any;

  //searchParts() függvényt figyeljük és azt szimuláljuk, hogy visszatér egy alkatrész tömbbel.
  //A beforeach minden teszt előtt lefut itt készítjük elő a teszteléshez szükséges környezetet
  beforeEach(async () => {
    mockPartService = {
      searchParts: jasmine.createSpy('searchParts').and.returnValue(of([
        { id: 1, name: 'Teszt alkatrész', price: 1000, quantity: 1 }
      ]))
    };

    mockEquipmentService = {
      getEquipmentCategories: jasmine.createSpy('getEquipmentCategories').and.returnValue(of([]))
    };

    mockCartService = {
      addToCart: jasmine.createSpy('addToCart').and.returnValue(of())
    };

    //Teszteléshez szükséges modulok és szolgáltatások konfigurálása
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, PartListComponent],
      providers: [
        { provide: PartService, useValue: mockPartService },
        { provide: EquipmentService, useValue: mockEquipmentService },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    //komponens példányosítása és inicializálása
    fixture = TestBed.createComponent(PartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should search and set parts', () => {
    component.searchQuery = 'teszt';
    component.selectedModelId = 1;
    component.selectedCategoryId = 2;

    component.searchParts();

    expect(mockPartService.searchParts).toHaveBeenCalledWith('teszt', 1, 2);
    expect(component.parts.length).toBe(1);
    expect(component.parts[0].name).toBe('Teszt alkatrész');
  });
});
