import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { LocomotiveComponent } from './locomotive.component';

describe('LocomotiveComponent', () => {
  let component: LocomotiveComponent;
  let fixture: ComponentFixture<LocomotiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocomotiveComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(LocomotiveComponent);
    component = fixture.componentInstance;

    component.locomotiveForm = new FormGroup({
      serialNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]{11}")
      ])
    });

    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the locomotive picture', () => {
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('img').src).toContain('assets/images/EA060.png');
  });

  it('should render input request message in a h3 tag', () => {
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('h3').textContent).toContain('Enter locomotive serial number:');
  });

  it('should render text input element', () => {
    const el = fixture.debugElement.nativeElement;
    const serialNumberInput = el.querySelector('input[id="serialNumber"]');
    expect(serialNumberInput).toBeTruthy();
  });

  it(`should render 'Generate' button`, () => {
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    expect(button).toBeTruthy();
  });

  it(`should render 'Clear All' button`, () => {
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Clear All'
    );
    expect(button).toBeTruthy();
  });

  it('form should be valid for correct input', () => {
    component.locomotiveForm.controls['serialNumber'].setValue('91530478001');
    fixture.detectChanges();
    expect(component.locomotiveForm.valid).toBeTruthy(); 
  });

  it('form should not be valid for incorrect input', () => {
    component.locomotiveForm.controls['serialNumber'].setValue('9X');
    fixture.detectChanges();
    expect(component.locomotiveForm.valid).toBeFalsy(); 
  });

  it(`'Generate' button should be disabled when input is not valid`, () => {
    component.locomotiveForm.controls['serialNumber'].setValue('2020');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`'Generate' button should be enabled when input is valid`, () => {
    component.locomotiveForm.controls['serialNumber'].setValue('91530478001');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it(`should generate 'pattern' validation error and render it`, () => {

    let testValue: string = '9X';
    component.locomotiveForm.controls['serialNumber'].setValue(testValue);
    fixture.detectChanges();

    const numberInput = component.locomotiveForm.controls.serialNumber;
    expect(numberInput.errors.pattern).toBeTruthy();

    /*
      For validation error rendering, we need to use the native element to update the form, 
      rather than use the component itself. That way, we simulate user input, which will 
      make the framework see the new input and run validations on the real form, displaying 
      validation error messages if it is the case.
    */
    testValue='2020'; /* we use another invalid test value, just to make sure input change works */
    const serialNumberInputElement = fixture.debugElement.nativeElement.querySelector('#serialNumber');
    serialNumberInputElement.value = testValue;
    serialNumberInputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.locomotiveForm.controls.serialNumber.value).toEqual(testValue);

    const serialNumberValidationError = fixture.debugElement.nativeElement.querySelector('.invalid-input');
    expect(serialNumberValidationError.textContent).toContain('Input must be an 11 digits long decimal number.');

  });

  it(`should generate 'required' validation error and render it`, () => {
    component.locomotiveForm.controls['serialNumber'].setValue('');
    fixture.detectChanges();

    const numberInput = component.locomotiveForm.controls.serialNumber;
    expect(numberInput.errors.pattern).toBeFalsy();
    expect(numberInput.errors.required).toBeTruthy();

    /*
      For validation error rendering, we need to use the native element to update the form, 
      rather than use the component itself. That way, we simulate user input, which will 
      make the framework see the new input and run validations on the real form, displaying 
      validation error messages if it is the case.
    */
    const serialNumberInputElement = fixture.debugElement.nativeElement.querySelector('#serialNumber');
    serialNumberInputElement.value = '';
    serialNumberInputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const serialNumberValidationError = fixture.debugElement.nativeElement.querySelector('.invalid-input');
    expect(serialNumberValidationError.textContent).toContain('Input required.');
  });

  it('should not generate validation errors when input is correct', () => {
    component.locomotiveForm.controls['serialNumber'].setValue('91530478001');
    fixture.detectChanges();
    const numberInput = component.locomotiveForm.controls.serialNumber;
    expect(numberInput.errors).toBeNull();
  });

  it(`should call 'processForm' method when 'Generate' button is pressed in a valid form`, fakeAsync(() => {
    /* we set a valid input value that would enable the submit button, so it could be clicked */
    component.locomotiveForm.controls['serialNumber'].setValue('91530478001');
    fixture.detectChanges();

    spyOn(component, "processForm");

    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    button.nativeElement.click();

    tick(); /* This function requires call within fakeAsync block */
    expect(component.processForm).toHaveBeenCalled();
  }));

  it(`should not call 'processForm' method when 'Generate' button is pressed in an invalid form that makes it disabled`, fakeAsync(() => {
    /* we set an invalid input value that would disable the submit button, so it could not be clicked */
    component.locomotiveForm.controls['serialNumber'].setValue('9X');
    fixture.detectChanges();

    spyOn(component, "processForm");
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    button.nativeElement.click();

    tick(); /* This function requires call within fakeAsync block */

    /* since the submit button is disabled, we cannot click it and will not call any method */
    expect(component.processForm).not.toHaveBeenCalled();
  }));

  it(`should submit valid form on 'Generate' button click and render the correct result`, fakeAsync(() => {
    const testValue : string = '91530478001';
    const checkDigit: number = 7;
    component.locomotiveForm.controls['serialNumber'].setValue(testValue);
    fixture.detectChanges();

    /*
      By using 'and.callThrough()', the spy will also delegate calls to the actual implementations. 
      We need 'processForm' method to also execute 'generateCheckDigit' method that it calls and to set 
      'result' property on component.
    */
    spyOn(component, "processForm").and.callThrough();
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    button.nativeElement.click();

    tick(); /* This function requires call within fakeAsync block */
    expect(component.processForm).toHaveBeenCalled();
    expect(component.result).toBeDefined();
    expect(component.result).toEqual('The check digit for locomotive '+testValue+' is '+checkDigit+".");

    /* we trigger a change detection, because the processing result should be rendered */
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(component.result);
  }));

  it(`should call 'clearAll' method when 'Clear All' button is pressed`, fakeAsync(() => {
    const testValue : string = '91530478001';
    component.locomotiveForm.controls['serialNumber'].setValue(testValue);
    fixture.detectChanges();

    /* 
      We check if the test value was successfully set.
      Later, after 'clearAll' method execution, this value will be verified to be null.
    */
    expect(component.locomotiveForm.controls.serialNumber.value).toEqual(testValue);

    spyOn(component, 'clearAll').and.callThrough();
    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Clear All'
    );
    button.nativeElement.click();

    tick(); /* This function requires call within fakeAsync block */
    expect(component.clearAll).toHaveBeenCalled();

    fixture.detectChanges();
    expect(component.locomotiveForm.controls.serialNumber.value).toBeNull();
  }));

  it(`method 'generateCheckDigit' should return correct results`, () => {
    let testValue : string = '';
    let checkDigit : number = -1;

    testValue = '91530410008';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(3);

    testValue = '91530474001';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(1);

    testValue = '91530474004';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(5);

    testValue = '91530474006';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(0);

    testValue = '91530478001';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(7);

    testValue = '91530480001';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(3);

    testValue = '91530480009';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(6);

    testValue = '91530480014';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(6);

    testValue = '91530480019';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(5);

    testValue = '91550478002';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(3);

    testValue = '92530800015';
    checkDigit = component.generateCheckDigit(testValue);
    expect(checkDigit).toEqual(5);

  });

  it('back-end validation should reject invalid input', fakeAsync(() => {

    const testValue : string = 'abc';
    const expectedResult : string = 'Invalid input.';

    component.locomotiveForm.controls['serialNumber'].setValue(testValue);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Generate'
    );
    /* because input is invalid, submit button is disabled as a result of front-end validation */
    expect(button.nativeElement.disabled).toBeTruthy();

    /* we enable submit button, so we can click on it and submit the invalid form */
    button.nativeElement.disabled = false;
    fixture.detectChanges();
    expect(button.nativeElement.disabled).toBeFalsy();

    /*
      By using 'and.callThrough()', the spy will also delegate calls to the actual implementations. 
      We need 'processForm' method to execute and set 'result' component property.
    */
    spyOn(component, "processForm").and.callThrough();
    button.nativeElement.click();
    tick(); /* This function requires call within fakeAsync block */
    expect(component.processForm).toHaveBeenCalled();
    expect(component.result).toBeDefined();
    expect(component.result).toEqual(expectedResult);

    /* we trigger a change detection, because the processing result should be rendered */
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(component.result);

  }));

});
