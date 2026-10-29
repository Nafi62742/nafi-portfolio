import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { SkillCategory } from '@models/portfolio.models';
import { EngineHotspot, InteractiveSceneService } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

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
 * Merged About Me & Tech Loadout section component displaying:
 * 1. Developer Dossier & Bio Copy with high-contrast keyword highlighting
 * 2. Interactive R-007 System Core Architecture Schematic & Telemetry
 * 3. Complete Technical Loadout & 6-Domain Capability Matrix with animated fade-in design
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {
  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);
  public readonly sceneService = inject(InteractiveSceneService);

  /** Stat cards shown beneath the bio text. */
  public readonly stats: Array<StatCard> = [
    { value: '4+', key: 'about.stat_exp', subKey: 'about.stat_exp_sub', icon: 'fa-briefcase', color: '#2563eb' },
    { value: '7+', key: 'about.stat_projects', subKey: 'about.stat_projects_sub', icon: 'fa-diagram-project', color: '#38bdf8' },
    { value: '4+', key: 'about.stat_databases', subKey: 'about.stat_databases_sub', icon: 'fa-database', color: '#60a5fa' },
    { value: '5+', key: 'about.stat_devops', subKey: 'about.stat_devops_sub', icon: 'fa-cloud', color: '#10b981' }
  ];

  /** Quick overview metadata facts. */
  public readonly quickFacts: Array<QuickFact> = [
    { labelKey: 'about.role_label', valueKey: 'about.role_val', icon: 'fa-laptop-code' },
    { labelKey: 'about.location_label', valueKey: 'about.location_val', icon: 'fa-location-dot' },
    { labelKey: 'about.education_label', valueKey: 'about.education_val', icon: 'fa-graduation-cap' },
    { labelKey: 'about.focus_label', valueKey: 'about.focus_val', icon: 'fa-compass-drafting' }
  ];

  /** Complete 6-domain skills categories loaded from portfolio data service. */
  public readonly categories: Array<SkillCategory> = this.portfolio.getSkillCategories();

  /** Currently selected skill domain index. */
  public readonly activeCategory = signal<number>(0);

  /** Whether live data telemetry stream is actively pulsing in the schematic. */
  public readonly liveDiagnostics = signal<boolean>(true);

  /** Currently selected architecture node ID from interactive-scenes.json. */
  public readonly activeHotspotId = signal<string>('v8-core');

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
   * Toggles the live diagnostic pulse in the system core schematic.
   */
  public toggleDiagnostics(): void {
    this.liveDiagnostics.update((v: boolean) => !v);
  }

  /**
   * Selects a specific architectural subsystem node to inspect in the telemetry panel.
   */
  public selectHotspot(id: string): void {
    this.activeHotspotId.set(id);
  }

  /**
   * Selects an active technical domain category in the loadout section.
   */
  public selectCategory(index: number): void {
    this.activeCategory.set(index);
  }

  /**
   * Smoothly scrolls to the contact section.
   */
  public scrollToContact(): void {
    this.scroll.scrollTo('contact');
  }

  /**
   * Smoothly scrolls to the projects section.
   */
  public scrollToProjects(): void {
    this.scroll.scrollTo('projects');
  }
}
