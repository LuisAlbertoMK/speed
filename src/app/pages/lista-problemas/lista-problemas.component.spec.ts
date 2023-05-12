import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProblemasComponent } from './lista-problemas.component';

describe('ListaProblemasComponent', () => {
  let component: ListaProblemasComponent;
  let fixture: ComponentFixture<ListaProblemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaProblemasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaProblemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
