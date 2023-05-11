import { inject } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";

export const AuthorizationGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  //const route = inject(ActivatedRoute);
  //var snapshot = route.snapshot;
  if (authService.isLogged()) {
    //let routeRoles = snapshot.data['roles'];
    //if (routeRoles == "*") return true;
    //let authorized: boolean = false;

    //console.log(routeRoles);
    
      //let hasRole: boolean = authService.hasRole(routeRoles);
    //   if (hasRole) {
    //     authorized = true;
        
    //   }
    
    // console.log("auth guard is called");
    // if (authorized == false) alert("Not Authorized");
    return true;
  } else{
    router.navigate(["/login"]);
    return false;
  }
}