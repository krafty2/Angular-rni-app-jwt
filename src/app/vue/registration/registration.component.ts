import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NG_ASYNC_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { passwordMatch } from 'src/app/validators/password-match.validators.directive';
import { passwordMatchValidators } from 'src/app/validators/password.match.validators';
import { valueMatchValidator } from 'src/app/validators/test.validators';
import { UniqueUtilisateurValidators } from 'src/app/validators/unique-utilisateur.validators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [UniqueUtilisateurValidators]
})
export class RegistrationComponent implements OnInit {

  //registrationFormGroup!: FormGroup;



  errorMessage: any;

  formStatus: number = 0;

  constructor(
    private fb: FormBuilder, private authService: AuthService,
    private uniqueUtilisateurValidators: UniqueUtilisateurValidators
  ) { }

  registrationFormGroup = this.fb.group({
    username: this.fb.control('', {
      asyncValidators: [this.uniqueUtilisateurValidators.validate.bind(this.uniqueUtilisateurValidators)],
      validators: [Validators.required],
      updateOn: 'blur'
    }),
    nom: ['',[Validators.required]],
    prenom: ['',[Validators.required]],
    email: [''],
    password: this.fb.control(null,Validators.required),
    confirmPassword: this.fb.control(null,
      [
        Validators.required,passwordMatchValidators('password'),
        
      ]),
    roleName: ["INVITE"],
    genre: ['']
  }
  );
  ngOnInit() {
    /* this.registrationFormGroup = this.fb.group({
      username: ['',[this.utilisateurControl],[Validators.required] ],
      nom: [''],
      prenom: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      roleName: ["INVITE"],
      genre: ['']
    }); */
  }


  registerUser() {
    //this.registrationFormGroup.reset();
    console.log(this.registrationFormGroup?.value);
    this.authService.registerUser(this.registrationFormGroup?.value).subscribe(
      data => console.log(data)
    );
  }

  conforme = new Observable()

  /* uniqueUtilisateurValidator(control:AbstractControl):ValidationErrors|null{
    let username=control.value;
    return this.authService.isUsernameAvailableF(username).pipe(
      map((result)=>{
        if(result==true) return null
        else return {usernameDuplicated : true}
      })
    )
  } */

  get username() {
    
    return this.registrationFormGroup.controls['username'];
  }

  get nom(){
    return this.registrationFormGroup.controls['nom'];
  }

  get prenom(){
    return this.registrationFormGroup.controls['prenom'];
  }

  get email() {
    return this.registrationFormGroup.controls['email'];
  }
  get password() {
    return this.registrationFormGroup.controls['password'];
  }
  get confirmPassword() {
    return this.registrationFormGroup.controls['confirmPassword'];
  }
}

