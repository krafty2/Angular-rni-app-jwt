import { Injectable } from '@angular/core';
import { SiteMesure } from '../_models/site-mesure';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, debounceTime, forkJoin, map, merge, of } from 'rxjs';

import { Router } from '@angular/router';
import { Ville } from '../_models/ville';

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

  private rni="http://localhost:8080/rni";

  private detailVilles = this.rni+"/requestVille";
  private detailsMesureAn =this.rni+"/details-mesure";
  private lesAnneesMesures =this.rni+ "/annees-mesure";
  private regions =this.rni+ "/regions";
  private provinces =this.rni + "/provinces";
  private localites =this.rni + "/localites";
  private detailSite=this.rni + "/sites";
  private fichiersRni=this.rni + "/fichiers-rni";
  private supprimerFichierRni=this.rni + "/delete-file"

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
  trouverLieu(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.detailSiteUrl}/${id}`);
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
  lesVilles(): Observable<Object> {
    return this.httpClient.get<Object>(`${this.villes}`);
  }

  //========================================travaux admin partie
  detailsVilles():Observable<any>{
    return this.httpClient.get<any>(`${this.detailVilles}`);
  }

  detailsMesures(annee:number):Observable<any>{  
    return this.httpClient.get<any>(this.detailsMesureAn+"?annee="+annee);
  }

  req_annees():Observable<any>{
    return this.httpClient.get<any>(`${this.lesAnneesMesures}`);
  }

  req_regions():Observable<any>{
    return this.httpClient.get<any>(this.regions);
  }

  req_provinces(region:string):Observable<any>{
    return this.httpClient.get<any>(this.provinces+"?region="+region);
  }

  req_localites(province:string):Observable<any>{
    return this.httpClient.get<any>(this.localites+"?province="+province)
  }

  req_sites():Observable<any>{
    return this.httpClient.get<any>(this.detailSite);
  }

  req_fichiers_rni():Observable<any>{
    return this.httpClient.get<any>(this.fichiersRni);
  }

  req_supp_fichiers_rni(id:number):Observable<any>{
    return this.httpClient.delete<any>(this.supprimerFichierRni+"?idFile="+id)
  }
}
