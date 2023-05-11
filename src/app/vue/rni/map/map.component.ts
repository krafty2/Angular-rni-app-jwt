import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Mesure } from 'src/app/models/mesure';
import { Site } from 'src/app/models/site';
import { SiteMesure } from 'src/app/models/site-mesure';
import { RniService } from 'src/app/service/rni.service';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{

  @ViewChild('searchForm', { read: TemplateRef })
  searchForm!: TemplateRef<any>;

  @ViewChild('popupTemplate', { static: true })
  popupTemplate!: TemplateRef<any>;

  region!: any; province!: any; localite!: any; annee!: any;

  siteMesure: SiteMesure[] = [];
  lieu: Site = new Site;
  mesure: Mesure = new Mesure;

  nomRapport!: string;idMesure: number | undefined;

  map: any; osm: any; mark: any;

  nom!: String;

  villeMarkers = [
    {
      ville: 'Ouagadougou', lgn: 12.38377, lat: -1.5507
    },
    {
      ville: 'Bobo-Dioulasso', lgn: 11.18127408639855, lat: -4.296483094337233
    },
    {
      ville: 'Tenkodogo', lgn: 11.78697, lat: -0.37691
    },
    {
      ville: 'Koudougou', lgn: 12.250859015968205, lat: -2.367154709028241
    },
    {
      ville: 'Ouahigouya', lgn: 13.577246562901484, lat: -2.4160776060562545
    },
    {
      ville: 'Ziniaré', lgn: 12.61867, lat: -1.31335
    }
  ]

  constructor(private rniService: RniService, private router: Router
  ) { }

  ngOnInit(): void {

    this.rniService.dataMap().subscribe(data => {

      this.dataM(data);
    });


  }

  //chargement de tout les elements de la carte
  dataM(data: any) {
    this.idMesure = 1;
    this.siteMesure = data;

    // filtrer un element
    let nbMesureOuaga = this.siteMesure.filter(el => el.ville === 'Ouagadougou').length;
    let nbMesureBobo = this.siteMesure.filter(el => el.ville === 'Bobo-Dioulasso').length;
    let nbMesureTenko = this.siteMesure.filter(el => el.ville === 'Tenkodogo').length;
    let nbMesureKou = this.siteMesure.filter(el => el.ville === 'Koudougou').length;
    let nbMesureOuahi = this.siteMesure.filter(el => el.ville === 'Ouahigouya').length;
    let nbMesureZin = this.siteMesure.filter(el => el.ville === 'Ziniaré').length;
    console.log("nombre de mesure ouga " + nbMesureOuaga);
    //console.table(this.lieuEtMesure);
    if (this.map != undefined || this.map != null) {
      this.map.remove();
    }

    //different couche de la carte
    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    let googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    let street = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    //creation de la carte
    this.map = L.map('map', { layers: [street, osm], zoom: 5 }).setView([12.396745, -1.556532]);

    //permet de supprimer l'attribution leaflet et de mettre une attribution personnalise
    this.map.attributionControl.setPrefix('IRT CONSULTING');

    //regroupe l'ensemble des couches pour pouvoir les inserer a l'interieur de la carte
    let baseMaps = {
      "Satelite": googleHybrid,
      "OpenStreetMap": osm,
      "Street": street
    };

    L.control.layers(baseMaps).addTo(this.map);

    //permet de crayer un nouveau control(methode de leaflet) qui va permettre
    //par la suite de pouvoir inserer notre formulaire dans la carte
    let serchControl = new L.Control({ position: 'topleft' });

    serchControl.onAdd = () => {
      let div = L.DomUtil.create('div', 'leaflet-form');
      L.DomEvent.disableClickPropagation(div);
      let template = this.searchForm.createEmbeddedView(null);
      div.appendChild(template.rootNodes[0]);
      return div;
    }

    serchControl.addTo(this.map);

    //recherche les doublons dans un liste==n'est pas utilise dans le code pour le moment
    let duplicates = this.siteMesure.filter((lieu, index) => {
      return this.siteMesure.some((p, i) => p.longitude === lieu.longitude && p.latitude === lieu.latitude && i !== index);
    });
    console.table(duplicates);

    //a supprimer



    //Ajout des makers des villes
    let shelterVilleMarkers = new L.FeatureGroup();
    for (let m of this.villeMarkers) {
      //let mark = L.marker([m.lgn, m.lat], { icon: myIcon });
      let ville = m.ville;
      switch (ville) {
        case 'Ouagadougou':
          let mark1 = this.markerVille(m.lat, m.lgn, nbMesureOuaga);
          mark1.addTo(this.map);
          shelterVilleMarkers.addLayer(mark1);
          break;
        case 'Bobo-Dioulasso':
          let mark2 = this.markerVille(m.lat, m.lgn, nbMesureBobo);
          mark2.addTo(this.map);
          shelterVilleMarkers.addLayer(mark2);
          break;
        case 'Tenkodogo':
          let mark3 = this.markerVille(m.lat, m.lgn, nbMesureTenko);
          mark3.addTo(this.map);
          shelterVilleMarkers.addLayer(mark3);
          break;
        case 'Koudougou':
          let mark4 = this.markerVille(m.lat, m.lgn, nbMesureKou);
          mark4.addTo(this.map);
          shelterVilleMarkers.addLayer(mark4);
          break;
        case 'Ouahigouya':
          let mark5 = this.markerVille(m.lat, m.lgn, nbMesureOuahi);
          mark5.addTo(this.map);
          shelterVilleMarkers.addLayer(mark5);
          break;
        default:
          let mark6 = this.markerVille(m.lat, m.lgn, nbMesureZin);
          mark6.addTo(this.map);
          shelterVilleMarkers.addLayer(mark6);
      }

      this.map.on('zoomend', () => {
        let zoomLevel = this.map.getZoom();
        if (zoomLevel < 10) {
          if (this.map.hasLayer(shelterVilleMarkers)

          ) {
            console.log("point deja present");
          } else {
            this.map.addLayer(shelterVilleMarkers);
          }
        }

        if (zoomLevel >= 10) {
          if (this.map.hasLayer(shelterVilleMarkers)
          ) {
            this.map.removeLayer(shelterVilleMarkers);

          } else {
            console.log("point non actif");
          }
        }
      });
    }
    //--------------------------------------------------------------------------------
    let iconMesure = L.icon({
      iconUrl: 'assets/img/icons8-tour-de-radio-50.png',
      iconSize: [25, 25],
      popupAnchor: [0, -20],
    });
    //

    //groupe les markers des mesures
    let shelterMarkers = new L.FeatureGroup();
    console.table(this.siteMesure);
    //place les points sur la carte
    for (let lm of this.siteMesure) {

      let div = this.divPopup(lm);

      this.mark = L.marker([lm.latitude, lm.longitude], { icon: iconMesure });

      let popup = this.mark.bindPopup(div);

      shelterMarkers.addLayer(popup);

      //popup.addTo(this.map);
      this.mark.bindTooltip(`${lm.moyenneSpatiale}`, { permanent: false }).openTooltip();
      this.mark.on('click', this.content$.subscribe());
      //permet d'afficher les points en fonction du zoom
      this.map.on('zoomend', () => {
        let currentZoom = this.map.getZoom();
        if (currentZoom < 10) {
          if (this.map.hasLayer(shelterMarkers)) {
            this.map.removeLayer(shelterMarkers);
          }
        }
        if (currentZoom >= 10) {
          if (!this.map.hasLayer(shelterMarkers)) {
            this.map.addLayer(shelterMarkers);
          }
        }
      });
    }

  }

  //methode de soummission de la zone de recherche au niveau de la carte
  onSubmit() {
    let form = document.getElementById('leaflet-form') as HTMLFormElement;
    if (form) {
      let formData = new FormData(form);
      this.region = formData.get('region');
      this.province = formData.get('province');
      this.localite = formData.get('localite');
      this.annee = formData.get('annee');
    }

    console.log('region : ' + this.region + 'province : ' + this.province
      + ' localite : ' + this.localite + ' annee : ' + this.annee
    );

    if (this.region != null && this.province != null && this.localite != null && this.annee != null)
      this.rniService.rechercheAvance1(this.annee, this.region, this.province, this.localite).subscribe((data: any) => {
        this.dataM(data);
      })
  }



  iconPer(nb: number) {
    return `
      <a class="btn-floating btn text pulse">${nb}</a>
    `;
  }

  //creation de marker avec icon personnalise
  markerVille(lat: number, lgn: number, nbMesure: number) {
    let villeIcon = L.divIcon({
      className: 'icon',
      html: this.iconPer(nbMesure),
      iconSize: [20, 20],
    });
    let mark = L.marker([lgn, lat], { icon: villeIcon }).on('click', (e: any) => {
      this.map.setView(e.latlng, 14);
      this.map.removeLayer(mark);
    });
    return mark;
  }

  onClick() {
    this.map.setView([12.38377, -1.5507], 14);

  }

  //creation de la div representant le contenu du popup
  divPopup(lm: SiteMesure) {
    let div = L.DomUtil.create('div', 'card-panel grey lighten-4');
    div.innerHTML = `
      <span class="baliseLeaflet">*${lm.idMesure}*</span>
      <span class="baliseLeaflet">~${lm.nomRapport}~</span>
      <strong class="test">Site : ${lm.nomSite}</strong>
      <p>Region : ${lm.region}</p>
      <p>Province : ${lm.province}</p>
      <p>Localite : ${lm.ville}</p>
      <p>Mesure réalise le : ${formatDate(lm.dateMesure, 'dd/MM/yyyy', 'en-US')}</p>
      <p class="light-blue darken-1 white-text z-depth-2 center" style="padding: 5px;" >Moyenne spatiale recupérée : ${lm.moyenneSpatiale}  EV/m</p>

      <script>
        var test = document.getElementsByClassName('.test');
        test.style.color = 'orange';
      </script>
      `
    let content = this.generatePopupcontent();
    div.appendChild(content);
    return div;
  }

  //genere le popup des markers
  generatePopupcontent() {
    let context = {
      title: 'test',
      description: 'Ma description'
    }

    let content = this.popupTemplate.createEmbeddedView(context);
    return content.rootNodes[0];
  }

  //permet de recuperer le contenu du popup
  contenuPopup(e: any) {

    var popup = e.target.getPopup();
    //recuperation d'un element htmldivelement
    var content = popup.getContent();

    let contentString = content.outerHTML;

    //filter une zone/ cible la zone ou se trouve l'id de la mesure
    let filter = contentString.split("*");
  
    let nb = Number(filter[1]);
    console.log("avant " + this.idMesure)
    this.idMesure = nb;
    //this.mesure.idMesure = nb;

    console.log(this.idMesure);

  }

  test(nb: number) {
    this.idMesure = nb;
  }

  //methode de redirection d'une page vers  la liste des lieux
  onButtonClick() {
    if (this.idMesure)
      this.rniService.telechargerRapport(this.idMesure).subscribe(
        (blob:Blob) => saveAs(blob,this.nomRapport)
      );
  }

  content$ = new Observable(() => {
    this.mark.on('click', (e: { target: { getPopup: () => any; }; }) => {
      var popup = e.target.getPopup();
      //recuperation d'un element htmldivelement
      var content = popup.getContent();

      let contentString = content.outerHTML;

      //filter une zone/ cible la zone ou se trouve l'id de la mesure
      let filterId = contentString.split("*");

      let filterNomRapport = contentString.split("~");
      
     
      let nb = Number(filterId[1]);
      this.nomRapport=filterNomRapport[1];
      console.log(this.nomRapport);
      this.idMesure = nb;

        var test = document.querySelector('.test') as HTMLElement;
        test.style.color = 'orange';
    })
  })
}
