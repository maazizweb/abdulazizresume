import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ApiServicesService } from '../services/api-services.service';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Mohammed Abdul Aziz - Portfolios';
   
  constructor(private apiServ: ApiServicesService) {

  }

  ngOnInit() {

 this.apiServ.getGoogleSheetData().then((res)=> {
  console.log(res);
  

 })



}


}
