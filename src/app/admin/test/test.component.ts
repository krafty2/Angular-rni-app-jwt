import { Component, Input, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone:true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatInputModule, FormsModule],
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  @Input() item = '';
  verifie:boolean=false;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  ngOnInit(): void {
    if(this.item==='hello'){
      this.verifie=true
    }
  }

}

interface Food {
  value: string;
  viewValue: string;
}