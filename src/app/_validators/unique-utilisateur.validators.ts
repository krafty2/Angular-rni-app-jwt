import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable, map } from "rxjs";
import { AuthService } from "../_service/auth.service";

@Injectable()
export class UniqueUtilisateurValidators implements AsyncValidator {
    constructor(private authService:AuthService){}
    validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        let username = control.value;
        return this.authService.isUsernameAvailableF(username).pipe(
            map((result)=>{
              if(result==false) return null
              else return {usernameDuplicated : true}
            })
          );
    }
    
}
