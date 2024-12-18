import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private http: HttpClient  ) {  }
    // googleSheetApiUrl = "https://api.publicapis.org/entries"
    // googleSheetApiUrl = "https://script.google.com/macros/s/AKfycbwVwUCt7FNddEcYxj_Sdhb5T93-xY5I4YMpuf_QcLOiJCfHiiutyFFce1TDC9HL4WSJjA/exec"




    // public getGoogleSheetData(): Promise<any> {
    //   return new Promise((resolve, reject) => {
    //     this.http.get(this.googleSheetApiUrl).subscribe(
    //       (response) => {
    //         resolve(response);
    //       },
    //       (error) => {
    //         reject(error);
    //       }
    //     );
    //   });
    // }
 
}
