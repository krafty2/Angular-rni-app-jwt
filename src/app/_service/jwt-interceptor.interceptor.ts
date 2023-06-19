import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authService:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    let url=req.url;
    let token = this.authService.getToken();
    if (token != null && !url.includes("/public")) {
      authReq = this.addTokenHeader(req, token);
    } 
    return next.handle(authReq).pipe(
      catchError(
        error=>{
          if( error.status==401 && error instanceof HttpErrorResponse && !authReq.url.includes('/public')){
            this.authService.clear()
            window.location.href="/"
          }
           throw 'error in source. Details: ' ;
        }
       
      )
    );
  }

  // private handleRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);
  //     const refreshToken = this.authService.userProfile?.refreshToken;
  //     const accessToken = this.authService.userProfile?.accessToken;
     
  //     if (refreshToken)
  //       return this.authService.refreshToken(refreshToken).pipe(
  //         switchMap((token: any) => {
  //           this.isRefreshing = false;
  //           this.authService.authenticateUser(token);
  //           //console.log(token);
  //           this.refreshTokenSubject.next(accessToken);
  //           return next.handle(this.addTokenHeader(request, ''+this.authService.userProfile?.accessToken));
  //         }),
  //         catchError((err) => {
  //           console.log(err);
  //           this.isRefreshing = false;
  //           this.authService.logout();
  //           return throwError(err);
  //         })
  //       );
  //   }
  //   return this.refreshTokenSubject.pipe(
  //     filter(token => token !== null),
  //     take(1),
  //     switchMap((token) => next.handle(this.addTokenHeader(request, token)))
  //   );
  // }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, "Bearer "+token) });
  }
}
