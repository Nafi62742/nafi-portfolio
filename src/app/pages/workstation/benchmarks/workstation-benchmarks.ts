import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import {
  PowerDistributionItem,
  ThermalStressPoint,
  WorkstationBenchmarkItem
} from '@models/workstation.models';
import { WorkstationService } from '@services/workstation.service';

/**
 * Performance benchmarks and thermal stress laboratory component.
 * Displays developer build speeds, local AI inference rates, thermal curves,
 * and electrical load distribution across workstation rails.
 */
@Component({
  selector: 'app-workstation-benchmarks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-benchmarks.html',
  styleUrl: './workstation-benchmarks.scss'
})
export class WorkstationBenchmarksComponent implements OnInit {
  /** Translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Full array of benchmarks. */
  public readonly benchmarks = signal<Array<WorkstationBenchmarkItem>>([]);

  /** Thermal stress testing workload points. */
  public readonly stressPoints = signal<Array<ThermalStressPoint>>([]);

  /** Power supply distribution breakdown. */
  public readonly powerDistribution = signal<Array<PowerDistributionItem>>([]);

  /** Active benchmark category filter. */
  public readonly activeCategory = signal<'all' | 'development' | 'ai-inference' | 'synthetic' | 'rendering'>('all');

  /** Workstation service. */
  public readonly ws: WorkstationService = inject(WorkstationService);

  /**
   * Initializes benchmark data.
   */
  public ngOnInit(): void {
    this.benchmarks.set(this.ws.getWorkstationBenchmarks());
    this.stressPoints.set(this.ws.getThermalStressPoints());
    this.powerDistribution.set(this.ws.getPowerDistribution());
  }

  /**
   * Sets category filter.
   *
   * @param cat - Selected category.
   */
  public setCategory(cat: 'all' | 'development' | 'ai-inference' | 'synthetic' | 'rendering'): void {
    this.activeCategory.set(cat);
  }

  /**
   * Filtered benchmarks array.
   */
  public get filteredBenchmarks(): Array<WorkstationBenchmarkItem> {
    const cat = this.activeCategory();
    const items = this.benchmarks();
    if (cat === 'all') {
      return items;
    }
    return items.filter((b) => b.category === cat);
  }

  /**
   * Total system load watts across rails.
   */
  public get totalLoadWatts(): number {
    return this.powerDistribution().reduce((sum, item) => sum + item.loadWatts, 0);
  }

  /**
   * Total system idle watts across rails.
   */
  public get totalIdleWatts(): number {
    return this.powerDistribution().reduce((sum, item) => sum + item.idleWatts, 0);
  }
}
