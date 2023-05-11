import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router"
import { AuthService } from "../service/auth.service";

export const HasRoleGuard = (route:ActivatedRouteSnapshot)=>{
  

  const authService = inject(AuthService);
  const router = inject(Router);
  //const route = inject(ActivatedRoute);
  //var snapshot = route.snapshot;
  if (authService.isLogged()) {
    let routeRoles = route.data['roles'];
    if (routeRoles == "*") return true;
    let authorized: boolean = false;

    console.log("c'est moi"+routeRoles);
    
      let hasRole: boolean = authService.hasRole(routeRoles);
      if (hasRole) {
         authorized = true;
      }
    
    console.log("auth guard is called");
    if (authorized == false) alert("Not Authorized");
    return authorized;
  } else{
    router.navigate(["/login"]);
    return false;
  }
}
