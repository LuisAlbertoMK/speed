import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaRecepcionComponent } from './modifica-recepcion.component';

describe('ModificaRecepcionComponent', () => {
  let component: ModificaRecepcionComponent;
  let fixture: ComponentFixture<ModificaRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaRecepcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
