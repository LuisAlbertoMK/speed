import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosConfirmarComponent } from './servicios-confirmar.component';

describe('ServiciosConfirmarComponent', () => {
  let component: ServiciosConfirmarComponent;
  let fixture: ComponentFixture<ServiciosConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosConfirmarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
