import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loginv1Component } from './loginv1.component';

describe('Loginv1Component', () => {
  let component: Loginv1Component;
  let fixture: ComponentFixture<Loginv1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Loginv1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Loginv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
