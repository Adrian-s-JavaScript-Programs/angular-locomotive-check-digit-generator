import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LocomotiveComponent } from './locomotive/locomotive.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LocomotiveComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.destroy();
  });

  it(`should have as title 'locomotive-check-digit-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('locomotive-check-digit-app');
    fixture.destroy();
  });
});
