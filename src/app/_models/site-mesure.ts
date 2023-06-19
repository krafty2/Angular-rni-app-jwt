export class SiteMesure {
    //sera propose par la suite la notion de map(cle,valeur)
    //site
    idSite!: number;
    nomSite!: string;

    //ville
    idVille!: number;
    region!: string;
    province!: string;
    ville!: string;

    //mesure

    idMesure!: number;
    longitude!: number;
    latitude!: number;
    prioritaire!: string;
    dateMesure!: Date;
    moyenneSpatiale!: number;
    largeBande!: string;
    bandeEtroite!: string;
    commentaire!: string;
    nomRapport!: string;
}
