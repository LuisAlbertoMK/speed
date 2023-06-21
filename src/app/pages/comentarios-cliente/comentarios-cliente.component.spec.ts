import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosClienteComponent } from './comentarios-cliente.component';

describe('ComentariosClienteComponent', () => {
  let component: ComentariosClienteComponent;
  let fixture: ComponentFixture<ComentariosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentariosClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentariosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
