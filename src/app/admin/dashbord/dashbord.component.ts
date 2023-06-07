import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { RniService } from 'src/app/service/rni.service';

declare var M:any;
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit{

  regions:any;
  provinces:any;
  localites:any;
  villes:any;
  annee = [2023,2021,2019];
  detailsMesure:any;

  fichier!: File;

  excelImportForm = new FormGroup({
    fileRni: new FormControl('', [Validators.required, Validators.pattern(/\.xlsx$/)])
  });

  constructor(private rniService:RniService,private router:Router){}

  ngOnInit(): void {
    
    forkJoin([this.rniService.annees(),this.rniService.lesRegions()]).subscribe(
      (([data1,data2])=>{
        this.annee=data1;
        this.rniService.detailsMesures(this.annee[0]).subscribe((data)=>{
          this.detailsMesure=data
        })
        this.regions = data2
        console.log(this.regions)
      })
    );
    this.modal();
  }

  selectAnnee(e:any){
    console.log(e.target.value);
    this.rniService.detailsMesures(e.target.value).subscribe((data)=>{
     
      this.detailsMesure=data;
    })
  }

  selectRegion(e:any){
    this.provinces=null;
    this.rniService.lesProvinces(e.target.value).subscribe((data)=>{
      this.provinces=data;
    })
  }

  selectProvince(e:any){
    console.log(e.target.value)
    this.rniService.lesLocalites(e.target.value).subscribe((data)=>{
      this.localites=data;
      console.log(this.localites)
    })
  }

  onSubmit() {
    let extension = ["xlsx"];
    let fileExtension = this.excelImportForm.value.fileRni?.split(".").pop();
    //Permet de verifier l'extension du fichier
    if (fileExtension)
      if (extension.includes(fileExtension)) {

        const fd = new FormData();
        fd.append('file', this.fichier, this.fichier.name);
        console.log(fd);
        this.rniService.importerFichierExcel(fd).subscribe();
        //this.router.navigateByUrl("/map");
      } else {
        console.log("le fichier n'est pas autorise");
      }
    console.log(this.excelImportForm.value);
  }

  get file() { return this.excelImportForm.get('file'); }

  onFileSelected(event: any) {
    this.fichier = <File>event.target.files[0];
    const date = new Date(this.fichier.lastModified);
    console.log(date);
  }

  modal() {
    var elems = document.querySelectorAll('.modal');
    if (typeof elems !== undefined && elems !== null) {
      let options = {

      };
      var instance = M.Modal.init(elems, options);
    }
  }

}
