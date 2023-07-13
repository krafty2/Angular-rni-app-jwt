import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { RniService } from 'src/app/_service/rni.service';

import {MatPaginator} from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fichier-rni',
  templateUrl: './fichier-rni.component.html',
  styleUrls: ['./fichier-rni.component.css'],
  
})
export class FichierRniComponent implements OnInit {
 
  //injection de dependance
  rniService = inject(RniService);
  router=inject(Router);

  //variable

  @Input()
  annee!: number;

  @Output()
  anneeRapport = new EventEmitter<number>();

  @Input()
  ajoutRapport:boolean=true;

  @Input()
  annees!:number[];

  @Input() expand:boolean=false;

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  myDataArray: any;
  displayedColumns: string[] = ['nomSite', 'region', 'province', 'localite', 'dateMesure', 'moyenneSpatiale'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  visible = false;

  rapportForm = new FormGroup({
    rapport: new FormControl('', [Validators.required, Validators.pattern(/\.pdf$/)])
  });

  nomFichier!: string;
  fichier!: File;

  detailMesure:any=null;

  regions:any;
  ngOnInit(): void {
    
    this.rniService.detailsMesures(this.annee).subscribe((data) => {
      this.myDataArray = new MatTableDataSource(data);

      this.myDataArray.paginator = this.paginator;
      this.rniService.req_regions().subscribe(
        data=>{
            this.regions=data;
        }
      )

    });

     //-------close modal
     let closeBtns = document.querySelectorAll(".modal-close");

     closeBtns.forEach((element) => {
      
       element.addEventListener("click", () => {
         if (element.closest(".modal")) {
           let modal = element.closest(".modal") as HTMLElement;
           modal.style.display = 'none';
         }
 
       })
     });
 
     window.onclick = (e: any) => {
      
       if (e.target.className === "modal") {
         e.target.style.display = 'none';
       }
     };

  }
 
  toggle() {

    this.visible = !this.visible;
    if (this.visible) {
      this.displayedColumns = ['nomSite', 'region', 'province', 'localite', 'dateMesure', 'moyenneSpatiale', 'action']
    } else {
      this.displayedColumns = ['nomSite', 'region', 'province', 'localite', 'dateMesure', 'moyenneSpatiale']
    }
  }

  onFileSelected(event: any) {
    this.fichier = <File>event.target.files[0];
    this.fichier ? this.nomFichier = this.fichier.name : this.nomFichier = '';
    const date = new Date(this.fichier.lastModified);
    console.log(date);
  }

 /*  sequenceSubscriber(observer: Observer<any>,element:any) {
    // synchronously deliver 1, 2, and 3, then complete
    observer.next(element);
    observer.complete();
  } */



  openModal(e: any,element:any) {
    console.log(element)
   
    console.table(this.detailMesure)
    let valeur = new Observable(
      ()=>{
        this.detailMesure=element;
        console.table(this.detailMesure)
        this.modal(e);
      }
    )

    valeur.subscribe();
    //-------open modal
    
  }

  modal(e: any) {
    console.log(e.target)
    let modal = e.target.getAttribute("data-modal");
    let affiche = document.getElementById(modal) as HTMLElement;
    console.log(affiche)
    affiche.style.display = "block";
  }

  selectAnnee(e: any) {
    console.log(e);
    this.annee=e;
  }

  localites:any;
  region:any;
  provinces:any;
  selectRegion(e: any) {
    this.localites = null;
    console.log(e)
    this.region=e;
    //this.toutLesRegions$.subscribe(x=>console.log(x))
    //console.log(this.searchTerm.value.region)
    //this.provinces$.pipe(debounceTime(5000)).subscribe(x=>console.log(x))
    this.rniService.req_provinces(e).subscribe(x => {

      this.provinces = x;
    });
  }

  province:any;
  selectProvince(e: any) {
    
    this.province = e;
    // this.rniService.lesLocalites(e.target.value).subscribe((data)=>{
    //   this.localites=data;
    //   console.log(this.localites)
    // })

    this.rniService.req_localites(e).subscribe((data) => {
      this.localites = data;
      console.log(this.localites)
    })
  }

  localite:any;
  selectLocalite(e:any){
    this.localite=e;
  }

  searchTerm(){
    console.log(this.annee + " " + this.region + " " + this.province + " " + this.localite);
    if (this.region && this.province && this.localite && this.annee)
      this.rniService.rechercheAvance1(this.annee, this.region, this.province, this.localite).subscribe((data: any) => {
        console.log(data)
        this.myDataArray = new MatTableDataSource(data);
        this.myDataArray.paginator = this.paginator;
      })
  }

  gestionRapport(){
    this.anneeRapport.emit(this.annee);
    //console.log(this.anneeRapport);
    this.router.navigate(['/rapports',this.annee])
  }

  transfererRapport() {
  
    let extension = ["pdf"];
    let fileExtension = this.rapportForm.value.rapport?.split(".").pop();
    console.log(this.rapportForm.value.rapport)
    if (fileExtension) {
      if (extension.includes(fileExtension)) {
        console.log("Feliciation! Le format du fichier est correcte");
        console.log(this.fichier);
        const id = this.detailMesure.idMesure;
        let fd = new FormData();
        fd.append('file', this.fichier, this.fichier.name);
        fd.append('id', id.toString());
        console.log(fd.getAll)
        this.rniService.transfertRapport(fd).subscribe();
      } else {
        console.log("Ce type de fichier n'est pas accepte")
      }
    }
  }

}

//interface

export interface PeriodicElement {
  idSite: number;
  nomSite: string;
  idLocalite: number;
  region: string;
  province: string;
  localite: string;
  idMesure: number;
  longitude: number;
  latitude: number;
  prioritaire: string;
  dateMesure: Date;
  moyenneSpatiale: number;
  largeBande: string;
  bandeEtroite: string;
  commentaire: string;
  nomRapport: string;

}
