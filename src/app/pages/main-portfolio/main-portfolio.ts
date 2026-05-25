import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AboutComponent } from '@pages/about/about';
import { ContactComponent } from '@pages/contact/contact';
import { EducationComponent } from '@pages/education/education';
import { ExperienceComponent } from '@pages/experience/experience';
import { HeroComponent } from '@pages/hero/hero';
import { ProjectsComponent } from '@pages/projects/projects';
import { PublicationsComponent } from '@pages/publications/publications';
import { SkillsComponent } from '@pages/skills/skills';
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
  templateUrl: './main-portfolio.html'
})
export class MainPortfolioComponent implements OnInit {
  /**
   * Angular lifecycle hook — initialises scroll-reveal animations after the DOM settles.
   */
  public ngOnInit(): void {
    setTimeout(() => initRevealObserver(), 200);
  }
}
