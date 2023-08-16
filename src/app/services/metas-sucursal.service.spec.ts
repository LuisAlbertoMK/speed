import { TestBed } from '@angular/core/testing';

import { MetasSucursalService } from './metas-sucursal.service';

describe('MetasSucursalService', () => {
  let service: MetasSucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetasSucursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
