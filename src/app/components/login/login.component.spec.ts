import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of({
        token: 'dummy-token',
        user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate to home on success', () => {
    component.email = 'test@example.com';
    component.password = 'pass123';
    component.login();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on failed login', () => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.email = 'wrong@example.com';
    component.password = 'wrongpass';
    component.login();

    expect(component.errorMessage).toBe('Hibás e-mail vagy jelszó!');
  });
});
