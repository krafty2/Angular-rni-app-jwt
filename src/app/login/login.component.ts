import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormGroup! : FormGroup;
  idToken : any;
  errorMessage :any;

  role:any;
  admin:boolean=false;

  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){}
  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
      username : this.fb.control(''),
      password : this.fb.control('')
    });
  }

  handleLogin(){
    let username=this.loginFormGroup.value.username;
    let password=this.loginFormGroup.value.password;
    console.log(password + " " + username);
    this.authService.login(username,password).subscribe({
      next: response => {
        this.idToken = response;
        this.authService.authenticateUser(this.idToken);
        this.verify$.subscribe();
        if(this.admin){
          this.router.navigateByUrl("/dash");
        } else{
          this.router.navigateByUrl("/carte");
        }
      },
      error :err => {
        this.errorMessage = err.error.errorMessage;
      }
    })
  }

  verify$ = new Observable(()=>{
    let role = "ADMIN";
    let storage = localStorage.getItem('userProfile');
    let userP;
    if(storage){
      userP = JSON.parse(storage);
    }
     if(userP.scope.includes(role)){
      this.admin = true
     }
  })
}
