import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent implements OnInit {
  ngOnInit(): void {
    const body = document.querySelector("body"),
      sidebar = document.querySelector(".sidebar"),
      toogle = document.querySelector(".toogle"),
      searchBtn = document.querySelector(".search-box"),
      modeSwitch = document.querySelector(".toogle-switch"),
      modeText = document.querySelector(".mode-text"),
      light = document.querySelector<HTMLElement>(".sun"),
      dark = document.querySelector<HTMLElement>(".moon")

      console.log(dark)
    modeSwitch?.addEventListener("click", () => {
      body?.classList.toggle("dark");
      if (body?.classList.contains("dark") && modeText) {
        modeText.innerHTML = "Dark mode";
        if(dark && light){
          dark.style.opacity='1';
          light.style.opacity='0';
        }
      } else if (modeText) {
        modeText.innerHTML = "Light mode"
        if(dark && light){
          dark.style.opacity='0';
          light.style.opacity='1';
        }
      }
    });

    toogle?.addEventListener("click", () => {
      sidebar?.classList.toggle("close");
    });

    searchBtn?.addEventListener("click", () => {
      sidebar?.classList.remove("close");
    });
  }

}
