import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProudlyWorkedWithComponent } from './proudly-worked-with/proudly-worked-with.component';
import { NinetyDayPlanComponent } from './ninety-day-plan/ninety-day-plan.component';
import { MilestoneAdminComponent } from './milestone-admin/milestone-admin.component';
import { ProjectsDomainsComponent } from './projects-domains/projects-domains.component';
import { JobRequirementsComponent } from './job-requirements/job-requirements.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'proudly-worked-with', component: ProudlyWorkedWithComponent },
  { path: 'milestones', component: NinetyDayPlanComponent },
  { path: 'milestone-admin', component: MilestoneAdminComponent },
  { path: 'projects-domains', component: ProjectsDomainsComponent },
  { path: 'job-requirements', component: JobRequirementsComponent },
  { path: '**', redirectTo: '' },
];
