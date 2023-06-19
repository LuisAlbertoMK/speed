import { TestBed } from '@angular/core/testing';

import { GuardCliente2Guard } from './guard-cliente2.guard';

describe('GuardCliente2Guard', () => {
  let guard: GuardCliente2Guard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardCliente2Guard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
