import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { ScrollService } from './core/services/scroll.service';
import { initRevealObserver } from './core/utils/viewport.util';
import { NavbarComponent } from './features/navbar/navbar.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { SkillsComponent } from './features/skills/skills.component';
import { ExperienceComponent } from './features/experience/experience.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { PublicationsComponent } from './features/publications/publications.component';
import { EducationComponent } from './features/education/education.component';
import { ContactComponent } from './features/contact/contact.component';
import { FooterComponent } from './features/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    PublicationsComponent,
    EducationComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.themeService.init();
    this.scrollService.init();
    // Initialize scroll reveal after a brief delay to allow DOM to render
    setTimeout(() => initRevealObserver(), 200);
  }
}
