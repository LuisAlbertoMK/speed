import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGastosComponent } from './reporte-gastos.component';

describe('ReporteGastosComponent', () => {
  let component: ReporteGastosComponent;
  let fixture: ComponentFixture<ReporteGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteGastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
