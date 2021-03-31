import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-locomotive',
  templateUrl: './locomotive.component.html',
  styleUrls: ['./locomotive.component.css']
})

export class LocomotiveComponent implements OnInit {

  result : string;

  locomotiveForm: FormGroup;

  constructor() { }

  ngOnInit(): void {

    /* we create a form containing one element with validators */
    this.locomotiveForm = new FormGroup({
      serialNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]{11}")
      ])
    })

  }

  /* Method used for input validation on business side */
  validateInput(input: string) : boolean {

    /*
      Input must be an 11 digits long string.

      Unlike Validators.pattern function, which automatically adds ^ and $ characters at the beginning 
      and end of the string argument (if they do not already exist), we need to explicitly use those 
      characters when creating a RegExp. Otherwise, the regular expression would accept strings that 
      also contain other characters besides the 11 consecutive digits.
    */
    let myRe = new RegExp("^[0-9]{11}$");
    return myRe.test(input);

  }

  /* This method receives data from the form and sets the processing result */
  processForm(data) {

    if(this.validateInput(data.serialNumber)==true)
      this.result = "The check digit for locomotive "+data.serialNumber+" is "+this.generateCheckDigit(data.serialNumber)+".";
    else
      this.result = "You submitted an invalid input.";
  }

  /* This method clears the form and any other displayed messages */
  clearAll(){
    this.locomotiveForm.reset();
    this.result='';
  }

  /* This method generates the check digit of a locomotive */
  generateCheckDigit(serialNumber: String) : number {

    let mask: string = "21212121212";
    let i: number;
    let size: number = serialNumber.length;
    let finalSequence: string = "";
    let lastDigit: number;
    let checkDigit: number;

    /* 
    we multiply each digit from the locomotive serial number by each digit from the mask,
    and put (by appending) everything into a string called "finalSequence" 
    */
    for (i = 0; i < size; i++) {
      finalSequence += Number(serialNumber.charAt(i))*Number(mask.charAt(i));
    } 

    let sum: number = 0;

    /* we add (as numbers) all the digits from the obtained string */
    for (i = 0; i < finalSequence.length; i++) {
      sum += Number(finalSequence.charAt(i));
    }

    /* we get the last digit of the sum */
    lastDigit = sum%10;

    /* we calculate the check digit */
    if (lastDigit==0){
      checkDigit = 0;
    }
    else{ 
      checkDigit = 10 - lastDigit;
    }

    return checkDigit;

  }

  /* 
  This method helps us access serialNumber easier in the html page, 
  by using its assigned formControlName without having to explicitly
  call 'get' method for it every time, in the html page. 
  */
  get serialNumber() {
    return this.locomotiveForm.get("serialNumber"); 
  }

}
