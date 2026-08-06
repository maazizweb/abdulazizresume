import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProudlyWorkedWithComponent } from './proudly-worked-with/proudly-worked-with.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'proudly-worked-with', component: ProudlyWorkedWithComponent },
  { path: '**', redirectTo: '' },
];
