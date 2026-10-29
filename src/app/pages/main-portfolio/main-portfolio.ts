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
import { ScrollService } from '@services/scroll.service';
import { MinimapElevatorComponent } from '@shared-components/minimap-elevator/minimap-elevator.component';
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
    ExperienceComponent,
    ProjectsComponent,
    RunmateComponent,
    PublicationsComponent,
    EducationComponent,
    ContactComponent,
    MinimapElevatorComponent
  ],
  templateUrl: './main-portfolio.html'
})
export class MainPortfolioComponent implements OnInit {
  public readonly scrollService: ScrollService = inject(ScrollService);

  /** Ordered chapters displayed on the right-hand architectural rail (RunMate folded under Projects). */
  public readonly chapters: Array<ChapterRailItem> = [
    { id: 'hero',         index: '01', label: 'Overview' },
    { id: 'about',        index: '02', label: 'Architecture' },
    { id: 'experience',   index: '03', label: 'Experience' },
    { id: 'projects',     index: '04', label: 'Projects' },
    { id: 'publications', index: '05', label: 'Research' },
    { id: 'education',    index: '06', label: 'Credentials' },
    { id: 'contact',      index: '07', label: 'Contact' }
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
