import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialClienteVehiculoComponent } from './historial-cliente-vehiculo.component';

describe('HistorialClienteVehiculoComponent', () => {
  let component: HistorialClienteVehiculoComponent;
  let fixture: ComponentFixture<HistorialClienteVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialClienteVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialClienteVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
