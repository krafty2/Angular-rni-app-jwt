import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  menu() {

    let menu = document.querySelector('#menu-icon');
    let navBar = document.querySelector('.nav-bar');

    console.log(menu)

    menu?.classList.toggle('bx-x');
    navBar?.classList.toggle('open');

  }

logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('userProfile');
  window.location.href = "/"
}
}
