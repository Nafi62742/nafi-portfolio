import { Routes } from '@angular/router';

import { MainPortfolioComponent } from '@pages/main-portfolio/main-portfolio';
import { ProjectDetailsComponent } from '@pages/projects/project-details/project-details';
import { PublicationDetailsComponent } from '@pages/publications/publication-details/publication-details';
import { WorkstationComponent } from '@pages/workstation/workstation';
import { WorkstationBenchmarksComponent } from '@pages/workstation/benchmarks/workstation-benchmarks';
import { WorkstationPressureComponent } from '@pages/workstation/pressure/workstation-pressure';
import { WorkstationSimulationComponent } from '@pages/workstation/simulation/workstation-simulation';
import { WorkstationSpecsComponent } from '@pages/workstation/specs/workstation-specs';
import { AppRoutes } from '@utils/constants';

export const routes: Routes = [
  { path: AppRoutes.HOME, component: MainPortfolioComponent },
  { path: AppRoutes.PROJECT_DETAILS, component: ProjectDetailsComponent },
  { path: AppRoutes.PUBLICATION_DETAILS, component: PublicationDetailsComponent },
  {
    path: AppRoutes.WORKSTATION,
    component: WorkstationComponent,
    children: [
      { path: '', redirectTo: 'simulation', pathMatch: 'full' },
      { path: 'simulation', component: WorkstationSimulationComponent },
      { path: 'specs', component: WorkstationSpecsComponent },
      { path: 'pressure', component: WorkstationPressureComponent },
      { path: 'benchmarks', component: WorkstationBenchmarksComponent }
    ]
  },
  { path: 'pc_config', redirectTo: AppRoutes.WORKSTATION },
  { path: '**', redirectTo: AppRoutes.HOME }
];

