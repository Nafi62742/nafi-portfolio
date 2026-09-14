import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import { ScrollService } from "@services/scroll.service";
import { TranslateService } from "@services/translate.service";

/** Shape of a single stat card in the About section. */
interface StatCard {
  value: string;
  key: string;
  icon: string;
}

/**
 * About section component displaying bio text and key statistics.
 */
@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.html",
  styleUrl: "./about.scss",
})
export class AboutComponent {
  /** Stat cards shown beneath the bio text. */
  public readonly stats: Array<StatCard> = [
    { value: "2+", key: "about.stat_exp", icon: "fa-briefcase" },
    { value: "4+", key: "about.stat_databases", icon: "fa-database" },
    { value: "7", key: "about.stat_projects", icon: "fa-folder-open" },
    { value: "5+", key: "about.stat_devops", icon: "fa-cloud" },
  ];

  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);
}
