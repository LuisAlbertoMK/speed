import { TestBed } from '@angular/core/testing';

import { PdfEntregaService } from './pdf-entrega.service';

describe('PdfEntregaService', () => {
  let service: PdfEntregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfEntregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
