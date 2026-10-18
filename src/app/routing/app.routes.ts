import { Routes } from '@angular/router';

import { MainPortfolioComponent } from '@pages/main-portfolio/main-portfolio';
import { ProjectDetailsComponent } from '@pages/projects/project-details/project-details';
import { PublicationDetailsComponent } from '@pages/publications/publication-details/publication-details';
import { WorkstationComponent } from '@pages/workstation/workstation';
import { AppRoutes } from '@utils/constants';

export const routes: Routes = [
  { path: AppRoutes.HOME, component: MainPortfolioComponent },
  { path: AppRoutes.PROJECT_DETAILS, component: ProjectDetailsComponent },
  { path: AppRoutes.PUBLICATION_DETAILS, component: PublicationDetailsComponent },
  { path: AppRoutes.WORKSTATION, component: WorkstationComponent },
  { path: 'pc_config', redirectTo: AppRoutes.WORKSTATION },
  { path: '**', redirectTo: AppRoutes.HOME }
];
