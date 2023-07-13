import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Mesure } from 'src/app/_models/mesure';
import { Site } from 'src/app/_models/site';
import { SiteMesure } from 'src/app/_models/site-mesure';
import { RniService } from 'src/app/_service/rni.service';
import * as L from 'leaflet';
import { Ville } from 'src/app/_models/ville';
import { formatDate } from '@angular/common';
import * as saveAs from 'file-saver';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {
  @ViewChild('searchForm', { read: TemplateRef })
  searchForm!: TemplateRef<any>;

  @ViewChild('popupTemplate', { static: true })
  popupTemplate!: TemplateRef<any>;

  region!: any;
  province!: any;
  localite!: any;
  annee!: any;

  siteMesure!: any;
  lieu!: any;
  mesure!: any;
  nomRapport!: string;
  idMesure!: number;

  map: any;
  osm: any;
  mark: any;
  nom!: String;
  role: boolean = false;
  villes: any;

  annees: any;
  regions: any;
  provinces: any;
  localites: any;

  constructor(private rniService: RniService, private router: Router) { }

  ngOnInit() {

    this.verify$.subscribe();

    forkJoin([this.rniService.lesVilles(),
    this.rniService.dataMap(),
    this.rniService.req_annees(),
    this.rniService.req_regions()
    ]).subscribe(([data1, data2, data3,data4]) => {
      this.villes = data1;
      this.mapM(data2);
      this.annees = data3;
      this.regions=data4;
    });

    let count = new BehaviorSubject(2);
    console.log(count.value)
  }


  /**
   * 
   * @param {data} resultat de la requete sur les sites et les mesures
   * charge tout les elements de la carte
   */
  mapM(data: any) {
    console.log(data)
    data.length!==0? this.siteMesure = data:this.siteMesure=undefined;

    /**
     * regroupe les groupes entre eux
     */
    let shelterVilleMarkers = new L.FeatureGroup();

    //supprime la carte si elle est deja charge
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
    this.map = L.map('map', { layers: [street, osm], zoom: 7 }).setView([12.396745, -1.556532]);

    //permet de supprimer l'attribution leaflet et de mettre une attribution personnalise
    this.map.attributionControl.setPrefix('IRT CONSULTING');
    //this.map.attributionControl.setPrefix(`<div class="black-text">IRT</div>`);

    //regroupe l'ensemble des couches pour pouvoir les inserer a l'interieur de la carte
    let baseMaps = {
      "Satelite": googleHybrid,
      "OpenStreetMap": osm,
      "Street": street
    };

    L.control.layers(baseMaps).addTo(this.map);

    console.log(this.siteMesure)
    //affiche les villes sur la carte
    this.villes.forEach((_ville: any) => {
      let nbMesure = this.siteMesure.filter(
        (el: any) => el.localite === _ville.localite).length;
      if (nbMesure != 0) {
        let mark = this.markerVille(_ville.latitudeV, _ville.longitudeV, nbMesure);
        shelterVilleMarkers.addLayer(mark);
      }
    });

    this.map.addLayer(shelterVilleMarkers);

    //----> permet d'afficher le marker des villes en fonction du zoom
    this.map.on('zoomend', () => {
      let zoomLevel = this.map.getZoom();
      if (zoomLevel < 10) {
        if (!this.map.hasLayer(shelterVilleMarkers))
          this.map.addLayer(shelterVilleMarkers);
      }

      if (zoomLevel >= 10) {
        if (this.map.hasLayer(shelterVilleMarkers))
          this.map.removeLayer(shelterVilleMarkers);

      }
    });

    let iconMesure = L.icon({
      iconUrl: 'assets/img/telephone-mobile.png',
      iconSize: [25, 25],
      popupAnchor: [0, -20],
    });

    //groupe les markers des mesures//
    let shelterMarkers = new L.FeatureGroup();

    //place les points sur la carte

    this.siteMesure.forEach((_results: any) => {
      let div = this.divPopup(_results);
      this.mark = L.marker([_results.latitude, _results.longitude], { icon: iconMesure });
      let popup = this.mark.bindPopup(div,{maxWidth: 500,minWidth:400});
      shelterMarkers.addLayer(popup);
      //popup.addTo(this.map);
      this.mark.bindTooltip(`${_results.moyenneSpatiale}`, { permanent: false }).openTooltip();
      //recupere le contenu du marker lorsque l'on click dessus
      this.mark.on('click', this.content$.subscribe());
    })

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

  //

  /**
   * Effectue la recherche au niveau de la carte
   * 
   */
  zoneDeRecherche() {
    let form = document.getElementById('leaflet-form') as HTMLFormElement;
    if (form) {
      let formData = new FormData(form);
      this.region = formData.get('region');
      this.province = formData.get('province');
      this.localite = formData.get('localite');
      this.annee = formData.get('annee');
    }
    if (this.region && this.province && this.localite && this.annee)
      this.rniService.rechercheAvance1(this.annee, this.region, this.province, this.localite).subscribe((data: any) => {
        this.mapM(data);
      })
  }

  /**
   * 
   * @param nb 
   * @returns du html qui sera utilise pour generer l'icone des markers de ville
   */
  htmlIconeVille(nb: number) {
    return `
    <div class="mat-elevation-z2 ville-marker-style">
    <a style="text-decoration: none;color: white;">${nb}</a>
    </div>
    `;
  }

  /**
   * 
   * @param {lat} latitude de la ville
   * @param {lgn} longitude de la ville
   * @param {nbMesure} nombre de mesure en fonction de la ville 
   * @returns {mark} marker de la ville generer
   */
  markerVille(lat: number, lgn: number, nbMesure: number) {
    let villeIcon = L.divIcon({
      className: 'icon',
      html: this.htmlIconeVille(nbMesure),
      iconSize: [20, 20],
    });
    //---> effectue un zoom lors du click
    let mark = L.marker([lat, lgn], { icon: villeIcon }).on('click', (e: any) => {
      this.map.setView(e.latlng, 11);
      this.map.removeLayer(mark);
    });
    return mark;
  }

  /**
   * 
   * @param {result} un des resultats provenant de la requete recuperant toute les information concernant une mesure
   * @returns {div} creer pour generer le popup d'un marker de mesure
   */
  divPopup(result: any) {
    let div = L.DomUtil.create('div', 'card-panel ');
    div.innerHTML = `
      
      <span class="baliseLeaflet">*${result.idMesure}*</span> 
      <span class="baliseLeaflet">~${result.nomRapport}~</span>
      <h3 class="rni-titre ">Visualiser les données de la zone de mesure</h3>
      <div class="rni-info ">
      <p> <strong>Site - </strong> ${result.nomSite}</p>
      <p> <strong>Region - </strong> ${result.region}</p>
      <p> <strong>Province - </strong> ${result.province}</p>
      <p> <strong>Localite - </strong> ${result.localite}</p>
      <p> <strong>Mesure réalise le - </strong> ${formatDate(result.dateMesure, 'dd/MM/yyyy', 'en-US')}</p>
      <p> <strong>Moyenne spatiale recupérée - </strong> ${result.moyenneSpatiale}  EV/m</p>
      </div>
    
      <script>
        var test = document.getElementsByClassName('.test');
        test.style.color = 'orange';
      </script>
      `
    let content = this.generatePopupcontent();
    //this.role='INVITE'
    if (this.role)
      div.appendChild(content);
    return div;
  }

  verify$ = new Observable(()=>{
    let role = "INVITE";
    let storage = localStorage.getItem('userProfile');
    let userP;
    if(storage){
      userP = JSON.parse(storage);
    }
     if(userP.scope.includes(role)){
      this.role = true
     }
  })


  /**
   * 
   * @returns un composants qui sera dynamiquement ajouter a la suite du popup de la map
   */
  generatePopupcontent() {
    let context = {
      title: 'test',
      description: 'Ma description'
    }

    let content = this.popupTemplate.createEmbeddedView(context);
    return content.rootNodes[0];
  }

  /**
   * methode de redirection d'une page vers  la liste des lieux
   */
  telechargeRapport() {
    if (this.idMesure)
      this.rniService.telechargerRapport(this.idMesure).subscribe(
        (blob: Blob) => saveAs(blob, this.nomRapport)
      );
  }

  /**
   * recupere le contenu d'un popup
   */
  content$ = new Observable(() => {
    this.mark.on('click', (e: { target: { getPopup: () => any; }; }) => {
      let popup = e.target.getPopup();
      //recuperation d'un element htmldivelement
      let content = popup.getContent();

      let contentString = content.outerHTML;

      //filter une zone cible la zone ou se trouve l'id de la mesure
      let filterId = contentString.split("*");

      let filterNomRapport = contentString.split("~");


      let nb = Number(filterId[1]);
      this.nomRapport = filterNomRapport[1];
      console.log(this.nomRapport);
      this.idMesure = nb;

      /* var test = document.querySelector('.test') as HTMLElement;
      test.style.color = 'orange'; */
    })
  });

  selectAnnee(e: any) {
    console.log(e);
    this.annee=e;
  }

  selectRegion(e: any) {
    this.localites = null;
   
    this.region=e;
    //this.toutLesRegions$.subscribe(x=>console.log(x))
    //console.log(this.searchTerm.value.region)
    //this.provinces$.pipe(debounceTime(5000)).subscribe(x=>console.log(x))
    this.rniService.req_provinces(e).subscribe(x => {

      this.provinces = x;
    });
  }

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

  selectLocalite(e:any){
    this.localite=e;
  }

  searchTerm(){
    console.log(this.annee + " " + this.region + " " + this.province + " " + this.localite);
    if (this.region && this.province && this.localite && this.annee)
      this.rniService.rechercheAvance1(this.annee, this.region, this.province, this.localite).subscribe((data: any) => {
        console.log(data)
        this.mapM(data);
      })
  }
}
