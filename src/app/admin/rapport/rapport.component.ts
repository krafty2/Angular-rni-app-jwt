import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit{

   //injection
   private route=inject(ActivatedRoute)


   annee!: number;
   
  ngOnInit(): void {
    const valeur:string|null=this.route.snapshot.paramMap.get('annee');
    console.log(valeur);
    valeur? this.annee=+valeur:this.annee=0;
  }

  recupererAnnee($event:any){
   /*  this.annee=annee;
    console.log('hello') */
    console.log($event)
  }

  /* transfererRapport() {
  
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
  }*/
}
