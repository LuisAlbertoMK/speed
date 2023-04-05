import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaOrdenComponent } from './entrega-orden.component';

describe('EntregaOrdenComponent', () => {
  let component: EntregaOrdenComponent;
  let fixture: ComponentFixture<EntregaOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregaOrdenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
