import { Injectable } from '@angular/core';
import { SiteMesure } from '../models/site-mesure';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, merge, of } from 'rxjs';

import { Router } from '@angular/router';
import { Ville } from '../models/ville';

@Injectable({
  providedIn: 'root'
})
export class RniService {

  private lieuxURL = "http://localhost:8080/rni/lieux"; 
  private detailSiteUrl = "http://localhost:8080/rni/detail-lieu";
  private chercheDetailLieu = "http://localhost:8080/rni/searchByRPLA";
  private importer = "http://localhost:8080/fichier/import/excel";
  private transfertPdf = "http://localhost:8080/fichier/transfertPdf";
  private telechargementPdf = "http://localhost:8080/fichier/telechargeRapport";

  private mapRequestUrl = "http://localhost:8080/public/mapRni";
  private villes = "http://localhost:8080/public/villes";

  private detailVilles = "http://localhost:8080/public/requestVille";
  private detailsMesureAn = "http://localhost:8080/public/details-mesure";
  private lesAnneesMesures = "http://localhost:8080/public/annees-mesure";
  private regions = "http://localhost:8080/public/regions";
  private provinces = "http://localhost:8080/public/provinces";
  private localites = "http://localhost:8080/public/localites";

  constructor(private httpClient: HttpClient, private router: Router) { }

  //affiche tout les lieux de mesures
  tousLesLieux(): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.lieuxURL}`).pipe(catchError((error) => this.handleError(error, {})));
  }

  handleError(error: Error, errorValue: any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    this.router.navigate(['/login']);
    return of(errorValue);
  }

  //affiche tout les lieux et les mesures concerne
  //modifier pour afficher les mises a jour
  dataMap(): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.mapRequestUrl}`);
  }

  //affiche les details d'un lieu
  trouverLieu(id: number): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.detailSiteUrl}/${id}`);
  }

  //affiche les details d'un lieu en fonction de la recherche effectue
  //agit au niveau du composant de la carte
  rechercheAvance1(
    annee: any, region: string,
    province: string, localite: string): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.chercheDetailLieu}/${annee}/${region}/${province}/${localite}`)
  }

  //recuperation fichier excel
  importerFichierExcel(formdata: FormData): Observable<Object> {
    return this.httpClient.post<Object>(`${this.importer}`, formdata);
  }

  //transfert du rapport
  transfertRapport(formData: FormData): Observable<Object> {
    return this.httpClient.post<Object>(`${this.transfertPdf}`, formData)
  }

  //permet de telecharger le rapport
  // telechargerRapport(idMesure:number):Observable<HttpEvent<Blob>>{

  //   return this.httpClient.get(`${this.telechargementPdf}/${idMesure}`,{reportProgress:true,observe:'events',responseType:'blob'})
  // }

  telechargerRapport(idMesure: number): Observable<Blob> {

    return this.httpClient.get(`${this.telechargementPdf}/${idMesure}`, { responseType: 'blob' })
  }

  /**
   * 
   * @returns {Ville} retourne toute les ville
   */
  lesVilles(): Observable<Ville> {
    return this.httpClient.get<Ville>(`${this.villes}`);
  }

  //========================================travaux admin partie
  detailsVilles():Observable<any>{
    return this.httpClient.get<any>(`${this.detailVilles}`);
  }

  detailsMesures(annee:number):Observable<any>{  
    return this.httpClient.get<any>(this.detailsMesureAn+"?annee="+annee);
  }

  annees():Observable<any>{
    return this.httpClient.get<any>(`${this.lesAnneesMesures}`);
  }

  lesRegions():Observable<any>{
    return this.httpClient.get<any>(this.regions);
  }

  lesProvinces(region:string):Observable<any>{
    return this.httpClient.get<any>(this.provinces+"?region="+region);
  }

  lesLocalites(province:string):Observable<any>{
    return this.httpClient.get<any>(this.localites+"?province="+province)
  }
}
