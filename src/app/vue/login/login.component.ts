import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormGroup! : FormGroup;
  idToken : any;
  errorMessage :any;

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
        this.router.navigateByUrl("/sites");
      },
      error :err => {
        this.errorMessage = err.error.errorMessage;
      }
    })
  }
}
