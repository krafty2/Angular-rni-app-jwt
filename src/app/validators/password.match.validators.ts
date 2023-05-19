import { AbstractControl, FormGroup } from "@angular/forms";

export function passwordMatchValidators (matchingControlName:string) {
    return (control : AbstractControl) => {
       
        let password = control.root.get(matchingControlName);
       
        return (password && control.value !== password.value)?{valuesNotMatch:true}:null
      }
}

