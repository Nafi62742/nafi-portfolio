import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { WORKSTATION_I18N, WorkstationI18n } from './i18n/workstation.i18n';
import { PcRigPresetId, PcRigProfileConfig } from '@models/workstation.models';
import { WorkstationService } from '@services/workstation.service';

import { WorkstationFooterComponent } from './footer/workstation-footer';
import { WorkstationNavbarComponent } from './navbar/workstation-navbar';

/**
 * Shell component for workstation architecture showcase.
 * Houses the dedicated workstation navbar, page header, tabs routing bar,
 * global staged configuration notifications, the routed subpages, and the workstation footer.
 */
@Component({
  selector: 'app-workstation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WorkstationNavbarComponent,
    WorkstationFooterComponent
  ],
  templateUrl: './workstation.html',
  styleUrl: './workstation.scss'
})
export class WorkstationComponent {
  /** i18n translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Workstation service managing aerodynamic simulation and condition logic. */
  public readonly ws: WorkstationService = inject(WorkstationService);

  /** Router instance for navigation and URL inspection. */
  private readonly router: Router = inject(Router);

  /** Available PC Rig Presets. */
  public readonly rigPresets: Array<PcRigProfileConfig> = this.ws.getRigPresets();

  /** Currently active rig preset ID. */
  public readonly activeRigId = this.ws.activeRigId;

  /** Active rig profile configuration details. */
  public readonly currentRig = this.ws.currentRigProfile;

  /**
   * Switches the active default PC rig preset.
   */
  public selectRig(rigId: PcRigPresetId): void {
    this.ws.selectRigPreset(rigId);
  }

  /**
   * Handles dropdown change event for PC rig preset.
   */
  public onRigSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.selectRig(target.value as PcRigPresetId);
    }
  }

  /** Current active subpage key determined from the router URL. */
  public readonly activeSubpage = computed<'simulation' | 'specs' | 'pressure' | 'benchmarks'>(() => {
    const url: string = this.router.url;
    if (url.includes('/specs')) {
      return 'specs';
    }
    if (url.includes('/pressure')) {
      return 'pressure';
    }
    if (url.includes('/benchmarks')) {
      return 'benchmarks';
    }
    return 'simulation';
  });

  /** Human-readable label for the current breadcrumb trail. */
  public readonly breadcrumbSubpageLabel = computed<string>(() => {
    switch (this.activeSubpage()) {
      case 'specs':
        return 'Hardware Specs Matrix';
      case 'pressure':
        return 'Fluid Dynamics & Pressure';
      case 'benchmarks':
        return 'Benchmarks & Stress Lab';
      case 'simulation':
      default:
        return 'Aerodynamics & Thermals Studio';
    }
  });

  constructor() {
    // Listen to router events to trigger change detection on navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Reactive signal tracks router.url
      });
  }

  /**
   * Applies all pending configuration changes globally.
   */
  public applyAllPendingChanges(): void {
    this.ws.applyAllPendingChanges();
  }

  /**
   * Discards all pending configuration changes.
   */
  public discardPendingChanges(): void {
    this.ws.discardPendingChanges();
  }
}
