import { TestBed } from '@angular/core/testing';

import { ReporteGastosService } from './reporte-gastos.service';

describe('ReporteGastosService', () => {
  let service: ReporteGastosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteGastosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
