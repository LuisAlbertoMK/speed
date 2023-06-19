import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasClienteComponent } from './estadisticas-cliente.component';

describe('EstadisticasClienteComponent', () => {
  let component: EstadisticasClienteComponent;
  let fixture: ComponentFixture<EstadisticasClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
