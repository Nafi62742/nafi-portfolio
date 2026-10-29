import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AboutComponent } from '@pages/about/about';
import { ContactComponent } from '@pages/contact/contact';
import { EducationComponent } from '@pages/education/education';
import { ExperienceComponent } from '@pages/experience/experience';
import { HeroComponent } from '@pages/hero/hero';
import { ProjectsComponent } from '@pages/projects/projects';
import { PublicationsComponent } from '@pages/publications/publications';
import { RunmateComponent } from '@pages/runmate/runmate';
import { SkillsComponent } from '@pages/skills/skills';
import { ScrollService } from '@services/scroll.service';
import { initRevealObserver } from '@utils/viewport.util';

/** Interface representing a chapter item in the right-hand vertical rail. */
interface ChapterRailItem {
  id: string;
  index: string;
  label: string;
}

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
    RunmateComponent,
    PublicationsComponent,
    EducationComponent,
    ContactComponent
  ],
  templateUrl: './main-portfolio.html'
})
export class MainPortfolioComponent implements OnInit {
  public readonly scrollService: ScrollService = inject(ScrollService);

  /** Ordered chapters displayed on the right-hand architectural rail. */
  public readonly chapters: Array<ChapterRailItem> = [
    { id: 'hero',         index: '01', label: 'Two Sides' },
    { id: 'about',        index: '02', label: 'Player 1' },
    { id: 'skills',       index: '03', label: 'Loadout' },
    { id: 'experience',   index: '04', label: 'Factory' },
    { id: 'projects',     index: '05', label: 'The Street' },
    { id: 'runmate',      index: '06', label: 'RunMate' },
    { id: 'publications', index: '07', label: 'Research' },
    { id: 'education',    index: '08', label: 'Credentials' },
    { id: 'contact',      index: '09', label: 'Console' }
  ];

  /**
   * Angular lifecycle hook — initialises scroll-reveal animations after the DOM settles.
   */
  public ngOnInit(): void {
    setTimeout(() => initRevealObserver(), 200);
  }

  /**
   * Smoothly scrolls to a chapter section.
   *
   * @param id - Target section DOM ID
   */
  public goToChapter(id: string): void {
    this.scrollService.scrollTo(id);
  }
}
