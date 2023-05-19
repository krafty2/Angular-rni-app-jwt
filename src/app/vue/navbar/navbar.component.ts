import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

declare var M:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role:any;
  admin:boolean=false;
  constructor(private router: Router,private ngZone:NgZone) { }
  ngOnInit(): void {
    
    this.verify.subscribe();
      var elems = document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.dropdown-trigger');
        var options = {
          constrainWidth: false,
          inDuration: 500
        }
        M.Dropdown.init(elems, options);
      });
  
      document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
      });
  
      //
      const bouton = document.getElementById('test');
      bouton?.addEventListener('click',()=>{
        this.ngZone.run(()=>{
          console.log("Button clicker");
        })
      })
  }

  title = 'irt-app';

  onRouterLinkClick() {
    this.router.navigate(['/Sites']);
    //location.reload();
  }

  verify = new Observable(()=>{
    let role = "ADMIN";
    let storage = localStorage.getItem('userProfile');
    let userP;
    if(storage){
      userP = JSON.parse(storage);
    }
    console.log(userP.scope);
    this.role = userP.scope;
     if(userP.scope.includes(role)){
      this.admin = true
     }
  })

  logout(){
    
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    window.location.href="/"
  }
}
