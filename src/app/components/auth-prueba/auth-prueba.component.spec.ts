import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPruebaComponent } from './auth-prueba.component';

describe('AuthPruebaComponent', () => {
  let component: AuthPruebaComponent;
  let fixture: ComponentFixture<AuthPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
