import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordartoriosComponent } from './recordartorios.component';

describe('RecordartoriosComponent', () => {
  let component: RecordartoriosComponent;
  let fixture: ComponentFixture<RecordartoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordartoriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordartoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
