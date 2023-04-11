import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFacturacionClienteComponent } from './data-facturacion-cliente.component';

describe('DataFacturacionClienteComponent', () => {
  let component: DataFacturacionClienteComponent;
  let fixture: ComponentFixture<DataFacturacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataFacturacionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFacturacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
