import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfilUtilisateur } from '../models/profil-utilisateur';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public host:string="http://localhost:8080/auth/token";

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
    return this.http.post(`${this.host}`, params,options);
  }

  public authenticateUser(idToken : any){
    let jwtHelperService=new JwtHelperService();
    let accessToken=idToken['accessToken'];
    let refreshToken = idToken['refreshToken'];
    console.log(accessToken)
    let decodedJWTAccessToken = jwtHelperService.decodeToken(accessToken);
    this.saveToken(accessToken);
    this.userProfile= {
      username : decodedJWTAccessToken.sub,
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

  public hasRole(role : string) :boolean{
    //
    let storage = localStorage.getItem('userProfile');
    let userP;
    if(storage){
      userP = JSON.parse(storage);
    }
    console.log(userP.scope);
    return userP.scope.includes(role);
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
