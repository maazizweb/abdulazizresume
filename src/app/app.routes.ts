import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProudlyWorkedWithComponent } from './proudly-worked-with/proudly-worked-with.component';
import { NinetyDayPlanComponent } from './ninety-day-plan/ninety-day-plan.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'proudly-worked-with', component: ProudlyWorkedWithComponent },
  { path: 'milestones', component: NinetyDayPlanComponent },
  { path: '**', redirectTo: '' },
];
