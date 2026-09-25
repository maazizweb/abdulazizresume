import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: '',
})
export class LoginComponent {
  constructor() {
    window.location.href = 'https://azzydevpb.nurexia.co/_/#/login';
  }
}
