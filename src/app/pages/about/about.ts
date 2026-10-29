import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";

import { EngineHotspot, InteractiveSceneService } from "@services/interactive-scene.service";
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
 * About section component displaying bio text, key statistics, and an interactive
 * R-007 Under-the-Hood Engine Bay Inspector driven by assets/data/interactive-scenes.json.
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
    { value: "4+", key: "about.stat_exp", subKey: "about.stat_exp_sub", icon: "fa-briefcase", color: "#2563eb" },
    { value: "7+", key: "about.stat_projects", subKey: "about.stat_projects_sub", icon: "fa-diagram-project", color: "#38bdf8" },
    { value: "4+", key: "about.stat_databases", subKey: "about.stat_databases_sub", icon: "fa-database", color: "#60a5fa" },
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
  public readonly sceneService = inject(InteractiveSceneService);

  /** Whether the R-007 hood in the About pedestal stage is popped open. */
  public readonly stageHoodOpen = signal<boolean>(true);

  /** Currently selected engine hotspot ID from interactive-scenes.json. */
  public readonly activeHotspotId = signal<string>("v8-core");

  /** List of JSON-defined engine hotspots. */
  public readonly hotspots = computed<Array<EngineHotspot>>(() =>
    this.sceneService.config().scenes.engineHotspots
  );

  /** Currently active hotspot object. */
  public readonly activeHotspot = computed<EngineHotspot>(() => {
    const list: Array<EngineHotspot> = this.hotspots();
    return list.find((h: EngineHotspot) => h.id === this.activeHotspotId()) ?? list[0];
  });

  /**
   * Toggles the R 007 car hood on the Under-the-Hood pedestal stage.
   */
  public toggleStageHood(): void {
    this.stageHoodOpen.update((v: boolean) => !v);
  }

  /**
   * Selects a specific engine hotspot in the R-007 engine bay.
   */
  public selectHotspot(id: string): void {
    this.stageHoodOpen.set(true);
    this.activeHotspotId.set(id);
  }

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
