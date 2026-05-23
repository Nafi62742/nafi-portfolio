import { Routes } from '@angular/router';
import { MainPortfolioComponent } from './features/main-portfolio/main-portfolio.component';
import { ProjectDetailsComponent } from './features/project-details/project-details.component';
import { PublicationDetailsComponent } from './features/publication-details/publication-details.component';

export const routes: Routes = [
  { path: '', component: MainPortfolioComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: 'publication/:id', component: PublicationDetailsComponent },
  { path: '**', redirectTo: '' }
];
