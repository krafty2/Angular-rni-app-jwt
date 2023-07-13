import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { LinearScale } from 'chart.js/dist';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Observable, debounceTime, forkJoin, map } from 'rxjs';
import { RniService } from 'src/app/_service/rni.service';
Chart.register(...registerables);

declare var M: any;
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements AfterViewInit {
 

  myDataArray: any;
  displayedColumns: string[] = ['nomSite', 'region', 'province', 'localite', 'dateMesure', 'moyenneSpatiale'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  annees = [];
  anneeRecente!: number;

  fichier!: File;
  nomFichier!: string;

  ajoutRapport:boolean=false;

  excelImportForm = new FormGroup({
    fileRni: new FormControl('', [Validators.required, Validators.pattern(/\.xlsx$/)])
  });

  fichierRni: any;

  test:any;

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private rniService: RniService,
    private router: Router,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {

  }


  ngAfterViewInit(): void {
    
    //this.myDataArray.paginator = this.paginator;
    this.chartExemple()
    forkJoin([this.rniService.req_annees(), this.rniService.req_regions()]).subscribe(
      (([data1, data2]) => {
        this.annees = data1;
        this.anneeRecente = this.annees[0];
      })
    );
    this.modal();

   

  }

  openSnackBar(message: string, action: string) {
    let snackBarRef = this._snackBar.open(message, action,{verticalPosition:this.verticalPosition});
    snackBarRef.onAction().subscribe(
      ()=>{
        console.log('mon snackbar a reussi');
      }
    )
  }

  addItem(newItem: number) {
    this.test=newItem;
    console.log(this.test)
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
        location.reload();
        //this.router.navigateByUrl("/map");
      } else {
        console.log("le fichier n'est pas autorise");
      }
    console.log(this.excelImportForm.value);

  }

  get file() { return this.excelImportForm.get('file'); }

  onFileSelected(event: any) {
    this.fichier = <File>event.target.files[0];
    this.fichier ? this.nomFichier = this.fichier.name : this.nomFichier = '';
    const date = new Date(this.fichier.lastModified);
    console.log(date);
  }

  modal() {

    this.rniService.req_fichiers_rni().subscribe(
      (data) => {
        this.fichierRni = data;
      }
    )

    //------------------open modal
    let modalBtns = document.querySelectorAll(".modal-open")
    modalBtns.forEach((element) => {
      console.log(element);
      element.addEventListener("click", () => {
        console.log('hello' + element)
        let modal = element.getAttribute("data-modal");
        let affiche;
        if (modal) {
          affiche = document.getElementById(modal) as HTMLElement;
          affiche.style.display = "block";
        }
      })
    });

    //------------------------close modal
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
  }

  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  supprimerFichier(id: number) {
    console.log(id)
    this.rniService.req_supp_fichiers_rni(id).subscribe(
      (data) => {
        console.log(data);
        location.reload();
      }
    )
  }

 

  chartExemple() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Ziniare', 'Tenkodogo'],
          datasets: [{
            label: '# nombre de mesure',
            data: [93, 42, 24, 13, 14, 12],
            backgroundColor: [
              "#039be5 ", "#546e7a", "#43a047", "#d81b60", "#8e24aa", "#00acc1"
            ],
            hoverOffset: 5,
            borderWidth: 2
          }]
        },
        options: {

          scales: {

            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

  }
}

