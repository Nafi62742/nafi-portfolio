import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AboutComponent } from '@features/about/about.component';
import { ContactComponent } from '@features/contact/contact.component';
import { EducationComponent } from '@features/education/education.component';
import { ExperienceComponent } from '@features/experience/experience.component';
import { HeroComponent } from '@features/hero/hero.component';
import { ProjectsComponent } from '@features/projects/projects.component';
import { PublicationsComponent } from '@features/publications/publications.component';
import { SkillsComponent } from '@features/skills/skills.component';
import { initRevealObserver } from '@utils/viewport.util';

/**
 * Root shell component that hosts all portfolio sections on the main page.
 */
@Component({
  selector: 'app-main-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    PublicationsComponent,
    EducationComponent,
    ContactComponent
  ],
  templateUrl: './main-portfolio.component.html'
})
export class MainPortfolioComponent implements OnInit {
  /**
   * Angular lifecycle hook — initialises scroll-reveal animations after the DOM settles.
   */
  public ngOnInit(): void {
    setTimeout(() => initRevealObserver(), 200);
  }
}
