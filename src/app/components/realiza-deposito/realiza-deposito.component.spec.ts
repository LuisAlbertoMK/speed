import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizaDepositoComponent } from './realiza-deposito.component';

describe('RealizaDepositoComponent', () => {
  let component: RealizaDepositoComponent;
  let fixture: ComponentFixture<RealizaDepositoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizaDepositoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizaDepositoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
