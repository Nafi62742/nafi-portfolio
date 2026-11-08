import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import { SkillCategory } from "@models/portfolio.models";
import { PortfolioService } from "@services/portfolio.service";
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

/**
 * About section component displaying bio text, key statistics, and categorized technical skills.
 */
@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.html",
  styleUrl: "./about.scss",
})
export class AboutComponent {
  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);

  /** Categorized technical skills merged into the About section. */
  public readonly skillCategories: Array<SkillCategory> = this.portfolio.getSkillCategories();

  /** Compact stat items shown inside the story card. */
  public readonly stats: Array<StatCard> = [
    { value: "4+", key: "about.stat_exp", subKey: "about.stat_exp_sub", icon: "fa-briefcase", color: "#6366f1" },
    { value: "15+", key: "about.stat_projects", subKey: "about.stat_projects_sub", icon: "fa-diagram-project", color: "#06b6d4" },
    { value: "3", key: "about.stat_databases", subKey: "about.stat_databases_sub", icon: "fa-flask-vial", color: "#8b5cf6" },
    { value: "5+", key: "about.stat_devops", subKey: "about.stat_devops_sub", icon: "fa-cloud", color: "#10b981" },
  ];

  /** Quick overview metadata facts. */
  public readonly quickFacts: Array<QuickFact> = [
    { labelKey: "about.role_label", valueKey: "about.role_val", icon: "fa-laptop-code" },
    { labelKey: "about.location_label", valueKey: "about.location_val", icon: "fa-location-dot" },
    { labelKey: "about.education_label", valueKey: "about.education_val", icon: "fa-graduation-cap" },
    { labelKey: "about.focus_label", valueKey: "about.focus_val", icon: "fa-compass-drafting" },
  ];
}
