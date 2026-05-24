import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/** Shape of a single stat card in the About section. */
interface StatCard {
  value: string;
  key:   string;
  icon:  string;
}

/**
 * About section component displaying bio text and key statistics.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  /** Stat cards shown beneath the bio text. */
  public readonly stats: Array<StatCard> = [
    { value: '2+', key: 'about.stat_exp',       icon: 'fa-briefcase'   },
    { value: '7',  key: 'about.stat_projects',  icon: 'fa-folder-open' },
    { value: '4+', key: 'about.stat_databases', icon: 'fa-database'    },
    { value: '5+', key: 'about.stat_devops',    icon: 'fa-cloud'       }
  ];

  /**
   * @param t - Translation service for i18n labels
   * @param scroll - Scroll service for in-page navigation
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(ScrollService) public readonly scroll: ScrollService
  ) {}
}
