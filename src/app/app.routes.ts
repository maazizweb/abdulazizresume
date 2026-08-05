import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WorkedWithPageComponent } from './worked-with-page/worked-with-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'worked-with', component: WorkedWithPageComponent },
  { path: '**', redirectTo: '' },
];
