import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../_service/auth.service';
import { Router, UrlSegment } from '@angular/router';
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
        this.admin?this.router.navigateByUrl("/dash"):this.router.navigateByUrl("/carte");
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
    storage?userP=JSON.parse(storage):userP=null

    userP.scope.includes(role)?this.admin=true:this.admin=false
  })
}
