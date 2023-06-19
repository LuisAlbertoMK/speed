import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesClienteComponent } from './cotizaciones-cliente.component';

describe('CotizacionesClienteComponent', () => {
  let component: CotizacionesClienteComponent;
  let fixture: ComponentFixture<CotizacionesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
