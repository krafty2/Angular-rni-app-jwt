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
  test:string= 'hello';
  test2:string='test';

  myDataArray: any;
  displayedColumns: string[] = ['nomSite', 'region', 'province', 'localite', 'dateMesure', 'moyenneSpatiale'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  selected = 'option2';
  localites: any;
  villes: any;
  annee = [2023, 2021, 2019];
  detailsMesure!: PeriodicElement[];

  fichier!: File;
  nomFichier!: string;


  testSelect = new FormControl()
  lesProvinces$: Observable<string> = this.testSelect.valueChanges;

  excelImportForm = new FormGroup({
    fileRni: new FormControl('', [Validators.required, Validators.pattern(/\.xlsx$/)])
  });

  searchTerm = new FormGroup({
    annee: new FormControl(),
    region: new FormControl(),
    province: new FormControl(),
    localite: new FormControl()
  })
  
  regions: any;
  provinces: any;
  lesregions$!: Observable<string>;

  fichierRni: any;


  constructor(
    private rniService: RniService,
    private router: Router,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngAfterViewInit(): void {
    //this.myDataArray.paginator = this.paginator;
    this.chartExemple()
    forkJoin([this.rniService.req_annees(), this.rniService.req_regions()]).subscribe(
      (([data1, data2]) => {
        this.annee = data1;
        this.rniService.detailsMesures(this.annee[0]).subscribe((data) => {
          this.detailsMesure = data
          this.myDataArray = new MatTableDataSource(this.detailsMesure);
          this.myDataArray.sort = this.sort;
          this.myDataArray.paginator = this.paginator;

        })
        this.regions = data2
        console.log(this.regions)
      })
    );
    this.modal();

    this.toutLesRegions$.subscribe(x => console.log(x))

    //this.provinces$.pipe(debounceTime(5000)).subscribe(x=>console.log(x))
    //this.lesregions$.subscribe(x=>console.log(x))
  }

  toutLesRegions$ = new Observable(
    (observer) => {
      return this.searchTerm.value.region
    }
  )



  selectAnnee(e: any) {
    console.log(e.target.value);
    this.rniService.detailsMesures(e.target.value).subscribe((data) => {
      this.detailsMesure = data;
      this.myDataArray = new MatTableDataSource(this.detailsMesure);
      this.myDataArray.sort = this.sort;
      this.myDataArray.paginator = this.paginator;
    })
  }

  selectRegion(e: any) {
    this.localites = null;
    console.log(e)
    //this.toutLesRegions$.subscribe(x=>console.log(x))
    //console.log(this.searchTerm.value.region)
    //this.provinces$.pipe(debounceTime(5000)).subscribe(x=>console.log(x))
    this.rniService.req_provinces(e).subscribe(x => {

      this.provinces = x;
    });
  }

  selectProvince(e: any) {
    console.log(e)
    // this.rniService.lesLocalites(e.target.value).subscribe((data)=>{
    //   this.localites=data;
    //   console.log(this.localites)
    // })

    this.rniService.req_localites(e).subscribe((data) => {
      this.localites = data;
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
      (data)=>{
        this.fichierRni=data;
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
