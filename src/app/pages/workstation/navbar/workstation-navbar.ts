import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import { PcRigPresetId } from '@models/workstation.models';
import { ThemeService } from '@services/theme.service';
import { WorkstationService } from '@services/workstation.service';

/**
 * Dedicated navigation bar for the Workstation module.
 * Features technical CAD branding, route-linked tabs, rig profile switcher dropdown,
 * staged modifications quick-apply, and theme toggle.
 */
@Component({
  selector: 'app-workstation-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-navbar.html',
  styleUrl: './workstation-navbar.scss'
})
export class WorkstationNavbarComponent {
  /** Signal tracking whether mobile drawer is open. */
  public readonly menuOpen = signal<boolean>(false);

  /** Workstation telemetry and state service. */
  public readonly ws = inject(WorkstationService);

  /** Theme service for light/dark mode toggling. */
  public readonly theme = inject(ThemeService);

  /** Translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Workstation subpage tab definitions. */
  public readonly tabs = [
    { id: 'simulation', route: '/workstation/simulation', label: WORKSTATION_I18N.airflow_tab, icon: 'fa-wind', color: 'text-cyan-400' },
    { id: 'specs', route: '/workstation/specs', label: WORKSTATION_I18N.specs_tab, icon: 'fa-microchip', color: 'text-indigo-400' },
    { id: 'pressure', route: '/workstation/pressure', label: WORKSTATION_I18N.pressure_tab, icon: 'fa-gauge-high', color: 'text-emerald-400' },
    { id: 'benchmarks', route: '/workstation/benchmarks', label: WORKSTATION_I18N.benchmarks_tab, icon: 'fa-chart-line', color: 'text-amber-400' }
  ];

  /**
   * Switches the active PC rig preset.
   */
  public selectRig(presetId: PcRigPresetId): void {
    this.ws.selectRigPreset(presetId);
  }

  /**
   * Handles dropdown change event for active PC rig preset.
   */
  public onRigSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.selectRig(target.value as PcRigPresetId);
    }
  }

  /**
   * Applies all staged hardware and fan modifications.
   */
  public applyMods(): void {
    this.ws.applyAllPendingChanges();
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  public toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
  }
}
