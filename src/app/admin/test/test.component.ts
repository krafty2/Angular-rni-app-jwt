import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone:true,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  @Input() item = '';
  verifie:boolean=false;

  ngOnInit(): void {
    if(this.item==='hello'){
      this.verifie=true
    }
  }

}
