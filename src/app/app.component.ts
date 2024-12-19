import { AfterViewInit, Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ApiServicesService } from '../services/api-services.service';
import emailjs from 'emailjs-com';
import { FormControl, FormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  standalone: true,  // Standalone Component
  imports: [
    CommonModule,    // Required for common directives like NgIf, NgFor
    RouterOutlet,
    RouterModule,
    FormsModule,
    ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent implements OnInit {
  title = 'Mohammed Abdul Aziz - Portfolio';

  formData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(private apiServ: ApiServicesService) { }

  ngOnInit() {
    // Not In USE 
    // this.apiServ.getGoogleSheetData().then((res)=> {
    //   console.log(res);
    // })
  }


  sendEmail(form: any) {
    const serviceID = 'service_clfo30o';
    const templateID = 'template_wyg4bop';
    const publicKey = 'GC651imGW-EZCLx62';
    emailjs
      .send(serviceID, templateID, this.formData, publicKey)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          alert('Message sent successfully!');
          this.formData = { name: '', email: '', message: '' }; // Reset form
        },
        (error) => {
          console.log('FAILED...', error);
          alert('Failed to send the message. Please try again.');
        }
      );
    }
  
  }

