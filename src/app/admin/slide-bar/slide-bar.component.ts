import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent {

  toggleSwitch$ = new Observable(
    (observer) => {
      let sidebar = document.querySelector(".sidebar");
      observer.next(sidebar?.classList.toggle("close"))
    }
  )

  toogle() {
    this.toggleSwitch$.subscribe(x => console.log(x));
  }

  modeSwitch$ = new Observable(
    (observer) => {
      let body = document.querySelector("body")
      let modeText = document.querySelector(".mode-text");
      let light = document.querySelector<HTMLElement>(".sun");
      let dark = document.querySelector<HTMLElement>(".moon");



      body?.classList.toggle("dark");

      if (body?.classList.contains("dark") && modeText) {
        modeText.innerHTML = "Dark mode";
        if (dark && light) {
          dark.style.opacity = '1';
          light.style.opacity = '0';
        }
      } else if (modeText) {
        modeText.innerHTML = "Light mode"
        if (dark && light) {
          dark.style.opacity = '0';
          light.style.opacity = '1';
        }
      }
      observer.next(console.log("Je suis un vrai"));

    }
  )

  mode() {
    console.log("hello");
    this.modeSwitch$.subscribe(x => console.log(x));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    window.location.href = "/"
  }

}
