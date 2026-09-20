import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import { ScrollService } from "@services/scroll.service";
import { TranslateService } from "@services/translate.service";

/** Shape of a single stat card in the About section. */
export interface StatCard {
  value: string;
  key: string;
  subKey: string;
  icon: string;
  color: string;
}

/** Shape of a developer quick-fact item. */
export interface QuickFact {
  labelKey: string;
  valueKey: string;
  icon: string;
}

/** Shape of a core discipline pill. */
export interface Pillar {
  title: string;
  icon: string;
  badge: string;
}

/**
 * About section component displaying bio text, key statistics, and engineering focus.
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
    { value: "2+", key: "about.stat_exp", subKey: "about.stat_exp_sub", icon: "fa-briefcase", color: "#6366f1" },
    { value: "7+", key: "about.stat_projects", subKey: "about.stat_projects_sub", icon: "fa-diagram-project", color: "#06b6d4" },
    { value: "4+", key: "about.stat_databases", subKey: "about.stat_databases_sub", icon: "fa-database", color: "#8b5cf6" },
    { value: "5+", key: "about.stat_devops", subKey: "about.stat_devops_sub", icon: "fa-cloud", color: "#10b981" },
  ];

  /** Quick overview metadata facts. */
  public readonly quickFacts: Array<QuickFact> = [
    { labelKey: "about.role_label", valueKey: "about.role_val", icon: "fa-laptop-code" },
    { labelKey: "about.location_label", valueKey: "about.location_val", icon: "fa-location-dot" },
    { labelKey: "about.education_label", valueKey: "about.education_val", icon: "fa-graduation-cap" },
    { labelKey: "about.focus_label", valueKey: "about.focus_val", icon: "fa-compass-drafting" },
  ];

  /** Core technical specialization pillars. */
  public readonly pillars: Array<Pillar> = [
    { title: "Angular & Web", icon: "fa-layer-group", badge: "Architecture" },
    { title: "Flutter Mobile", icon: "fa-mobile-screen", badge: "Cross-Platform" },
    { title: "AWS Cloud", icon: "fa-cloud-arrow-up", badge: "Serverless" },
    { title: "SQL & NoSQL", icon: "fa-database", badge: "Data Engineering" },
  ];

  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);

  /**
   * Smoothly scrolls to the contact section.
   */
  public scrollToContact(): void {
    this.scroll.scrollTo("contact");
  }

  /**
   * Smoothly scrolls to the projects section.
   */
  public scrollToProjects(): void {
    this.scroll.scrollTo("projects");
  }
}
