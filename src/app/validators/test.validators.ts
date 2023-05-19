import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const valueMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if(password && confirmPassword && password?.value!==confirmPassword?.value){
      return {valuesNotMatch: true}
    }
    return null;
    //return password && confirmPassword && password.value === confirmPassword.value ? { valuesNotMatch: true } : null;
  };