import { Routes } from "@angular/router";

import { AboutComponent } from "@pages/about/about";
import { ContactComponent } from "@pages/contact/contact";
import { EducationComponent } from "@pages/education/education";
import { ExperienceComponent } from "@pages/experience/experience";
import { HeroComponent } from "@pages/hero/hero";
import { ProjectDetailsComponent } from "@pages/project-details/project-details";
import { ProjectsComponent } from "@pages/projects/projects";
import { PublicationDetailsComponent } from "@pages/publication-details/publication-details";
import { PublicationsComponent } from "@pages/publications/publications";
import { SkillsComponent } from "@pages/skills/skills";
import { AppRoutes } from "@utils/constants";

export const routes: Routes = [
  { path: AppRoutes.HOME, component: HeroComponent },
  { path: AppRoutes.HERO, redirectTo: AppRoutes.HOME, pathMatch: 'full' },
  { path: AppRoutes.ABOUT, component: AboutComponent },
  { path: AppRoutes.SKILLS, component: SkillsComponent },
  { path: AppRoutes.EXPERIENCE, component: ExperienceComponent },
  { path: AppRoutes.PROJECTS, component: ProjectsComponent },
  { path: AppRoutes.PROJECT_DETAILS, component: ProjectDetailsComponent },
  { path: AppRoutes.PUBLICATIONS, component: PublicationsComponent },
  {
    path: AppRoutes.PUBLICATION_DETAILS,
    component: PublicationDetailsComponent,
  },
  { path: AppRoutes.EDUCATION, component: EducationComponent },
  { path: AppRoutes.CONTACT, component: ContactComponent },
  { path: "**", redirectTo: AppRoutes.HOME },
];
