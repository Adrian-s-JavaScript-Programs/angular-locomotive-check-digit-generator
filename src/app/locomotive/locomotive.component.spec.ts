import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocomotiveComponent } from './locomotive.component';

describe('LocomotiveComponent', () => {
  let component: LocomotiveComponent;
  let fixture: ComponentFixture<LocomotiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocomotiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocomotiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
