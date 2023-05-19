import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfilUtilisateur } from '../models/profil-utilisateur';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public host:string="http://localhost:8080/public";
  
  public auth:string=this.host+"/auth";
  public register:string=this.host+"/register";
  public isUsernameAvailable:string = this.host+"/isUsernameAvailable";
  public emailActivation:string=this.host+"/emailActivation";
  public forgotPassword:string=this.host+"/forgotPassword";
  public requestForPasswordInit:string=this.host+"/requestForPasswordInit";
  public passwordInitialization:string=this.host+"/passwordInitialization"

  public userProfile : ProfilUtilisateur | null =null;
  public ts:number=0;

  isLoggedIn = false;

  constructor(private http:HttpClient) { }

  public login(username : string, password : string):Observable<any>{
    let options= {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    let params=new HttpParams()
      .set("grantType","password")
      .set('username',username)
      .set('password',password)
      .set('withRefreshToken',true)
    return this.http.post(`${this.auth}`, params,options);
  }

  public authenticateUser(idToken : any){
    let jwtHelperService=new JwtHelperService();
    let accessToken=idToken['acces-token'];
    let refreshToken = idToken['refresh-token'];
    console.log(accessToken)
    let decodedJWTAccessToken = jwtHelperService.decodeToken(accessToken);
    this.saveToken(accessToken);
    this.userProfile= {
     
      username:decodedJWTAccessToken.sub,
      email:decodedJWTAccessToken.email,
      scope : decodedJWTAccessToken.scope,
      accessToken : accessToken,
      refreshToken:refreshToken,
    }

    this.isLoggedIn = true;
    localStorage.setItem('userProfile',JSON.stringify(this.userProfile));
  }

  public refreshToken(refreshToken:string){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
      .set("grantType", "refreshToken")
      .set("refreshToken",this.userProfile!.refreshToken)
      .set('withRefreshToken',true)
    return this.http.post(`${this.host}`, params,options)
  }
  logout(){
    
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    window.location.href="/"
  }

  isAuthenticated() {
    let test = localStorage.getItem('userProfile');
    let userP;
    if(test!==null)
    userP = JSON.parse(test);
    console.log(userP.username)
    return this.userProfile!=null;
    //return localStorage.getItem('userProfile')!=null
  }

  loadProfile(){
    let profile =localStorage.getItem("userProfile");
    if(profile==undefined) return;
    let item = JSON.parse(profile);
    this.authenticateUser({"access-token":item.accessToken,"refresh-token":item.refreshToken});
  }

  setCurrentUser() {
    localStorage.setItem('userProfile',JSON.stringify(this.userProfile));
  }

  registerUser(user :any) {
    let options= {
      headers: new HttpHeaders().set('Content-Type','application/json')
    }
    return this.http.post(`${this.register}`,user, options);
  }

  isUsernameAvailableF(username: string) {
    return this.http.get<boolean>(this.host+"/existeU?username="+username);
  }

  hasRole(role : string) :boolean{
    //
    let storage = localStorage.getItem('userProfile');
    let userP;
    if(storage){
      userP = JSON.parse(storage);
    }
    console.log(userP.scope);
    return userP.scope.includes(role);
  }

  forgotPasswordF(data :any, state : number) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    if(state == 1) {
      let params = new HttpParams()
        .set("email", data.email)
      return this.http.post<any>(this.host+"/forgotPassword", params,options)
    } else if(state == 2){
      let params = new HttpParams()
        .set("email", data.email)
        .set("authorizationCode", data.secretCode)
      ;
      return this.http.post<any>(this.host+"/requestForPasswordInit", params,options)

    }
    else {
      let params = new HttpParams()
        .set("email", data.email)
        .set("password",data.password)
        .set("confirmPassword",data.confirmPassword)
        .set("authorizationCode", data.secretCode)
      ;
      return this.http.post<any>(this.host+"/passwordInitialization", params,options)
    }
  }

  isEmailAvailable(email: string) {
    return this.http.get<boolean>(this.host+"/isEmailAvailable?email="+email);
  }

  saveToken(token:string):void{
    localStorage.setItem('token',token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLogged():boolean{
    const token = localStorage.getItem('token');
    return !! token;
  }
}
