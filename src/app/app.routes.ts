import { Routes } from '@angular/router';
import { MainPortfolioComponent } from './features/main-portfolio/main-portfolio.component';
import { ProjectDetailsComponent } from './features/project-details/project-details.component';

export const routes: Routes = [
  { path: '', component: MainPortfolioComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: '**', redirectTo: '' }
];
