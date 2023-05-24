import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Mesure } from 'src/app/models/mesure';
import { Site } from 'src/app/models/site';
import { SiteMesure } from 'src/app/models/site-mesure';
import { RniService } from 'src/app/service/rni.service';

declare var M: any
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent {

  sites: Site[] = [];
  p: number = 1;

  siteMesure: SiteMesure[] = [];

  site: Site = new Site();
  mesures: Mesure[] = [];
  mesure:Mesure=new Mesure();

  elems: any;

  //Formgroup
  excelImportForm = new FormGroup({
    fileRni: new FormControl('', [Validators.required, Validators.pattern(/\.xlsx$/)])
  });

  rapportForm = new FormGroup({
    rapport:new FormControl('',[Validators.required,Validators.pattern(/\.pdf$/)])
  });

  fichier!: File;

  constructor(
    private rniService: RniService,
    private router: Router,
    private crf: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.lesLieux();
    this.modal();
  }
 /*  ngAfterViewInit(): void {
    //this.rniService.modal();
    //appel de la methode qui affiche tout les lieux
    this.lesLieux();
    this.modal();
  } */

  lesLieux() {
    this.rniService.tousLesLieux().subscribe(data => {
      this.siteMesure = data; 
    });
  }

  /* test(){
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.modal');
      let options = {
        
      };
      var instance = M.Modal.init(elems, options);
      
    }); 
    
    this.crf.detectChanges();
  }*/

  detailPourModal(trouveSite: SiteMesure) {
    this.site = new Site();
    this.mesures = [];
    let site;
    const idSite = trouveSite.idSite
    if (idSite) {
      this.rniService.trouverLieu(idSite).subscribe((data: SiteMesure[]) => {
        site = data;
        
        for (let lm of site) {
          let mesure = new Mesure();
          //recuperation du lieu en question
          this.site.idSite =  lm.idSite;
          this.site.nomSite = lm.nomSite;
          
          //recuperation des mesures d'un lieu
          mesure.idMesure = lm.idMesure;
          mesure.longitude = lm.longitude;
          mesure.latitude = lm.latitude;
          // mesure.prioritaire = m.prioritaire;
          mesure.dateMesure = lm.dateMesure;
          mesure.moyenneSpatiale = lm.moyenneSpatiale;
          this.mesures.push(mesure);
        }
        
      });

    }
    this.crf.detectChanges();
  }

  allerADetailDuLieu(site: Site) {
    this.router.navigate(['/details-lieu', site.idSite])
  }

  //permet d'importer les donnees du fichier excel vers la base de donnees
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
        this.router.navigateByUrl("/map");
      } else {
        console.log("le fichier n'est pas autorise");
      }
    console.log(this.excelImportForm.value);
  }

  get file() { return this.excelImportForm.get('file'); }

  //transfert le rapport
  onSubmit2(mesureR:Mesure){
    console.log("idMesure" + mesureR.idMesure)
    let extension = ["pdf"];
    let fileExtension = this.rapportForm.value.rapport?.split(".").pop();
    if (fileExtension){
      if(extension.includes(fileExtension)){
        console.log("Feliciation! Le format du fichier est correcte");
        console.log(this.fichier);
        const id = mesureR.idMesure;
        let fd = new FormData();
        fd.append('file', this.fichier, this.fichier.name);
        fd.append('id',id.toString());
        this.rniService.transfertRapport(fd).subscribe();
      } else{
        console.log("Ce type de fichier n'est pas accepte")
      }
    }
  }

  //recuperer le fichier selectionner dans le input
  onFileSelected(event: any) {
    this.fichier = <File>event.target.files[0];
    const date = new Date(this.fichier.lastModified);
    console.log(date);
  }

  //Envoie de mesure pour mise a jour
  joindreRapport(site:Site,mesure:Mesure){
      this.site=site;
      this.mesure=mesure;
  }

  //redirection vers la page de chargement de rapport
  fermerModal() {
    var elems = document.querySelectorAll('.modal');
    var instance = M.Modal.getInstance(elems);
    instance.close();
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
