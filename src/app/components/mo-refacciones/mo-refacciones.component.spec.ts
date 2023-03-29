import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoRefaccionesComponent } from './mo-refacciones.component';

describe('MoRefaccionesComponent', () => {
  let component: MoRefaccionesComponent;
  let fixture: ComponentFixture<MoRefaccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoRefaccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoRefaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
