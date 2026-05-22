import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initRevealObserver } from '../../core/utils/viewport.util';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { PublicationsComponent } from '../publications/publications.component';
import { EducationComponent } from '../education/education.component';
import { ContactComponent } from '../contact/contact.component';

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
  ngOnInit(): void {
    // Initialize scroll reveal animations for main page components
    setTimeout(() => initRevealObserver(), 200);
  }
}
