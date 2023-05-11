import { Injectable } from '@angular/core';
import { SiteMesure } from '../models/site-mesure';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RniService {

  private lieuxURL = "http://localhost:8080/rni/lieux";
  private lieuxEtMesures = "http://localhost:8080/pub/mapRni";
  private detailLieu = "http://localhost:8080/rni/detail-lieu";
  private chercheDetailLieu = "http://localhost:8080/rni/searchByRPLA";
  private importer = "http://localhost:8080/fichier/import/excel";
  private transfertPdf = "http://localhost:8080/fichier/transfertPdf";
  private telechargementPdf = "http://localhost:8080/fichier/telechargeRapport"

  constructor(private httpClient: HttpClient,private router:Router) { }

  //affiche tout les lieux de mesures
  tousLesLieux(): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.lieuxURL}`).pipe(catchError((error)=>this.handleError(error,{})));
  }

  handleError (error: Error,errorValue:any) {
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
    return this.httpClient.get<SiteMesure[]>(`${this.lieuxEtMesures}`);
  }

  //affiche les details d'un lieu
  trouverLieu(id: number): Observable<SiteMesure[]> {
    return this.httpClient.get<SiteMesure[]>(`${this.detailLieu}/${id}`);
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
  transfertRapport(formData:FormData):Observable<Object>{
    return this.httpClient.post<Object>(`${this.transfertPdf}`,formData)
  }

  //permet de telecharger le rapport
  // telechargerRapport(idMesure:number):Observable<HttpEvent<Blob>>{
    
  //   return this.httpClient.get(`${this.telechargementPdf}/${idMesure}`,{reportProgress:true,observe:'events',responseType:'blob'})
  // }

  telechargerRapport(idMesure:number):Observable<Blob>{
    
    return this.httpClient.get(`${this.telechargementPdf}/${idMesure}`,{responseType:'blob'})
  }
}
