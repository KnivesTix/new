import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[formControlName][appPhone]'
})
export class PhoneDirective {

  constructor(private el: ElementRef, public ngControl: NgControl) { }
  @Input('appPhone') phoneNumber: string;

 /* @HostListener('keydown', ['$event']) onModelChange(event){
    this.onInputChange(event.target.value, false);
  }
*/
  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  @HostListener('input', ['$event']) onModelChange(event){
    this.onInputChange(event.target.value, false);
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }



  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  private onInputChange(event, backspace){
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 9) {
      newVal = newVal.substring(0, newVal.length - 1);
    }


    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace((/^8|7|\+7/), '');
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 5) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, '($1)$2-$3-$4');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, '($1)$2-$3-$4');
    }
    this.ngControl.valueAccessor.writeValue(newVal);

  }
}
