import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { Observable, forkJoin, fromEvent } from 'rxjs';
import { RniService } from 'src/app/_service/rni.service';

@Component({
  selector: 'app-gestion-site',
  templateUrl: './gestion-site.component.html',
  styleUrls: ['./gestion-site.component.css']
})
export class GestionSiteComponent implements AfterViewInit {

  idSite!: string;
  
  _detail_site!: any;

  site = {
    "idSite": '',
    "nomSite": ''
  };
  mesures: any[] = [];

  mesure: any;

  dataMesureArray: any;
  colums: string[] = ['longitude', 'latitude', 'date-mesure', 'moyenne-spatiale', 'action'];

  myDataArray: any;
  displayedColumns: string[] = ['nomSite', 'region', 'province', 'localite', 'action'];

  nomFichier!: string;
  fichier!: File;

  rapportForm = new FormGroup({
    rapport: new FormControl('', [Validators.required, Validators.pattern(/\.pdf$/)])
  });

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  fichierRni:any;

  constructor(private rniService: RniService) { }

  ngAfterViewInit() {
    forkJoin([this.rniService.req_sites(), this.rniService.req_fichiers_rni()]).subscribe(
      ([data1, data2]) => {

        this.myDataArray = new MatTableDataSource(data1);
        this.myDataArray.sort = this.sort;
        this.myDataArray.paginator = this.paginator;

        data2.length!=0? this.fichierRni = data2:this.fichierRni=undefined
      }
    )

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

  /**
   * exemple d'observable viable plus fonctionnelle
   */
  openModal$ = new Observable(
    (observer) => {

      //---------------------------
      let modal = document.querySelector(".modal-open");
      observer.next(modal)
    }
  )

  openModal(e: any, id: number) {
    this.rniService.trouverLieu(id).subscribe(
      (data) => {
        this.site = {
          "idSite": data[0].idSite,
          "nomSite": data[0].nomSite
        }

        console.log(this.site.idSite)
        this.mesures = [];
        data.forEach((element: any) => {
          let mesure = {
            "idMesure": element.idMesure,
            "longitude": element.longitude,
            "latitude": element.latitude,
            "dateMesure": element.dateMesure,
            "moyenneSpatiale": element.moyenneSpatiale
          }

          this.mesures.push(mesure)
        });
        this.dataMesureArray = new MatTableDataSource(this.mesures)
        console.table(this.mesures)
      }
    )
    //-------open modal
    this.modal(e);
  }

  modal(e: any) {
    let modal = e.target.getAttribute("data-modal");
    let affiche = document.getElementById(modal) as HTMLElement;
    affiche.style.display = "block";
  }

  modalRapport(e: any, id: number) {
    console.log(id)
    console.table(this.mesures)
    this.mesure = this.mesures.filter(mesure => { return mesure.idMesure == id });
    console.log("mesure")
    console.log(this.mesure[0].longitude)
    this.modal(e);
  }

  onFileSelected(e: any) {
    this.fichier = <File>e.target.files[0];
    this.fichier ? this.nomFichier = this.fichier.name : this.nomFichier = '';
  }

  onSubmit2(mesure: any) {
    let extension = ["pdf"];
    let fileExtension = this.rapportForm.value.rapport?.split(".").pop();
    console.log(this.rapportForm.value.rapport)
    if (fileExtension) {
      if (extension.includes(fileExtension)) {
        console.log("Feliciation! Le format du fichier est correcte");
        console.log(this.fichier);
        const id = mesure[0].idMesure;
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

  /* modal(e: any, _id_site: number) {

    let modalBtns = document.querySelectorAll(".modal-open") as NodeListOf<HTMLElement>;

    let modalBtns = document.querySelectorAll(".modal-open");

    modalBtns.forEach((element) => {
      console.log(element)

       fromEvent(document.querySelectorAll('.modal-open'), 'click').subscribe(
         res=>{res.target?.addEventListener("click",()=>{
            
         })}
        ); 


      element.addEventListener("click", () => {
        console.log('hello' + element)
        let modal = element.getAttribute("data-modal");
        let affiche;
        console.log(modal)
        if (modal) {
          console.log('hello' + element)
          affiche = document.getElementById(modal) as HTMLElement;
          affiche.style.display = "block";
        }
      })
    });

    
    let closeBtns = document.querySelectorAll(".modal-close");

    closeBtns.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.closest(".modal")) {
          console.log(element.closest(".modal"));
          let modal = element.closest(".modal") as HTMLElement;
          modal.style.display = 'none';
        }

      })
    });

    //------------------close modal with windows click
    //     window.addEventListener("click",(e)=>{ window.addEventListener("click",()=>{
    window.onclick = (e: any) => {
      if (e.target.className === "modal") {
        e.target.style.display = 'none';
      }
    }
  } */
}

export interface SitesElement {
  idSite: number;
  nomSite: string;
  region: string;
  province: string;
  localite: string;
}

export interface SitesDetail {
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