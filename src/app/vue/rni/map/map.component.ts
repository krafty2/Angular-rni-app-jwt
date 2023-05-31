import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Mesure } from 'src/app/models/mesure';
import { Site } from 'src/app/models/site';
import { SiteMesure } from 'src/app/models/site-mesure';
import { RniService } from 'src/app/service/rni.service';
import { saveAs } from 'file-saver';
import { Observable, forkJoin, merge, mergeAll } from 'rxjs';
import { Ville } from 'src/app/models/ville';
import { Target } from '@angular/compiler';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('searchForm', { read: TemplateRef })
  searchForm!: TemplateRef<any>;

  @ViewChild('popupTemplate', { static: true })
  popupTemplate!: TemplateRef<any>;

  region!: any;
  province!: any;
  localite!: any;
  annee!: any;

  siteMesure: SiteMesure[] = [];
  lieu: Site = new Site;
  mesure: Mesure = new Mesure;
  nomRapport!: string;
  idMesure!: number;

  map: any;
  osm: any;
  mark: any;
  nom!: String;
  role: boolean = false;
  villes: any;

  constructor(private rniService: RniService, private router: Router) { }

  ngOnInit(): void {

    this.rniService.lesVilles().subscribe((results) => {
      this.villes = results;
      this.rniService.dataMap().subscribe(data => {
        this.mapM(data);
      });
    });
  }


  /**
   * 
   * @param {data} resultat de la requete sur les sites et les mesures
   * charge tout les elements de la carte
   */
  mapM(data: any) {

    this.siteMesure = data;


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

    //affiche les villes sur la carte
    this.villes.forEach((_ville: Ville) => {
      let nbMesure = this.siteMesure.filter(el => el.ville === _ville.ville).length;
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

    this.siteMesure.forEach((_results) => {
      let div = this.divPopup(_results);
      this.mark = L.marker([_results.latitude, _results.longitude], { icon: iconMesure });
      let popup = this.mark.bindPopup(div);
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
      <a class="btn-floating btn text pulse">${nb}</a>
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
  divPopup(result: SiteMesure) {
    let div = L.DomUtil.create('div', 'card-panel grey lighten-4');
    div.innerHTML = `
      <span class="baliseLeaflet">*${result.idMesure}*</span>
      <span class="baliseLeaflet">~${result.nomRapport}~</span>
      <strong class="test">Site : ${result.nomSite}</strong>
      <p>Region : ${result.region}</p>
      <p>Province : ${result.province}</p>
      <p>Localite : ${result.ville}</p>
      <p>Mesure réalise le : ${formatDate(result.dateMesure, 'dd/MM/yyyy', 'en-US')}</p>
      <p class="light-blue darken-1 white-text z-depth-2 center" style="padding: 5px;" >Moyenne spatiale recupérée : ${result.moyenneSpatiale}  EV/m</p>

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

      var test = document.querySelector('.test') as HTMLElement;
      test.style.color = 'orange';
    })
  });
}
