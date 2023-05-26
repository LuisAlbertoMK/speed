import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticosComponent } from './automaticos.component';

describe('AutomaticosComponent', () => {
  let component: AutomaticosComponent;
  let fixture: ComponentFixture<AutomaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
