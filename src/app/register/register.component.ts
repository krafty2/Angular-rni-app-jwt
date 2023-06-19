import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../_service/auth.service';
import { UniqueUtilisateurValidators } from '../_validators/unique-utilisateur.validators';
import { Router } from '@angular/router';
import { passwordMatchValidators } from '../_validators/password.match.validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage: any;

  formStatus: number = 0;

  constructor(
    private fb: FormBuilder, private authService: AuthService,
    
    private router:Router
  ) { }

  registrationFormGroup = this.fb.group({
    username: this.fb.control('', {
      
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
      data => {
        console.log(data)
        this.router.navigateByUrl("/login");
      }
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
