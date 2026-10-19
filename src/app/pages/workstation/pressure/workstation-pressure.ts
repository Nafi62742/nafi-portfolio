import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import { WorkstationService } from '@services/workstation.service';

/**
 * Fluid dynamics and chassis pressure engineering deep dive component.
 * Features an interactive pressure simulator, volumetric CFM delta calculator,
 * and comprehensive fluid dynamics physics explanations.
 */
@Component({
  selector: 'app-workstation-pressure',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-pressure.html',
  styleUrl: './workstation-pressure.scss'
})
export class WorkstationPressureComponent {
  /** Global Math reference. */
  protected readonly Math: Math = Math;

  /** Translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Workstation service. */
  public readonly ws: WorkstationService = inject(WorkstationService);

  /** User-adjustable simulator intake CFM. */
  public readonly simIntakeCfm = signal<number>(145);

  /** User-adjustable simulator exhaust CFM. */
  public readonly simExhaustCfm = signal<number>(55);

  /** Net pressure differential in simulator. */
  public readonly simNetPressure = computed<number>(() => this.simIntakeCfm() - this.simExhaustCfm());

  /** Descriptive status badge for the simulator. */
  public readonly simStatusBadge = computed<{ label: string; type: 'positive' | 'neutral' | 'negative'; description: string }>(() => {
    const net = this.simNetPressure();
    if (net >= 40) {
      return {
        label: 'Strong Positive Pressure (+ Dust-Repelling)',
        type: 'positive',
        description: 'Internal chamber pressure exceeds atmospheric room pressure. Clean air is forced outwards through every seam and PCIe bracket.'
      };
    }
    if (net > 0) {
      return {
        label: 'Mild Positive Flow (+ Balanced)',
        type: 'positive',
        description: 'Slight positive gradient. Air exhausts mostly through rear and filtered vents, keeping fine particulate ingress low.'
      };
    }
    if (net === 0) {
      return {
        label: 'Neutral Pressure (Equal Inflow / Outflow)',
        type: 'neutral',
        description: 'Equal intake and exhaust volume. Highly sensitive to external draft currents; edge seams neither draw nor repel dust.'
      };
    }
    return {
      label: 'Negative Pressure (Dust Hazard)',
      type: 'negative',
      description: 'More air is pulled out than pushed in. Chassis creates vacuum, pulling unfiltered ambient dust through screw holes, cracks, and PCIe vents.'
    };
  });

  /**
   * Resets simulator values to currently applied live setup values.
   */
  public resetToLiveSetup(): void {
    this.simIntakeCfm.set(this.ws.dynamicIntakeCfm());
    this.simExhaustCfm.set(this.ws.dynamicExhaustCfm());
  }

  /**
   * Adjusts simulator intake value.
   *
   * @param delta - Change in CFM.
   */
  public adjustIntake(delta: number): void {
    this.simIntakeCfm.update((v) => Math.max(0, Math.min(300, v + delta)));
  }

  /**
   * Adjusts simulator exhaust value.
   *
   * @param delta - Change in CFM.
   */
  public adjustExhaust(delta: number): void {
    this.simExhaustCfm.update((v) => Math.max(0, Math.min(300, v + delta)));
  }
}
