import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraCitaComponent } from './registra-cita.component';

describe('RegistraCitaComponent', () => {
  let component: RegistraCitaComponent;
  let fixture: ComponentFixture<RegistraCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistraCitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistraCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
