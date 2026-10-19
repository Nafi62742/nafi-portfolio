import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import { WorkstationService } from '@services/workstation.service';

/**
 * Dedicated footer component for the Workstation module.
 * Provides active desktop node summary, navigation link back to main portfolio,
 * and engineering laboratory telemetry copyright.
 */
@Component({
  selector: 'app-workstation-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-footer.html',
  styleUrl: './workstation-footer.scss'
})
export class WorkstationFooterComponent {
  /** Current calendar year for copyright notice. */
  public readonly year: number = new Date().getFullYear();

  /** Workstation telemetry service. */
  public readonly ws = inject(WorkstationService);

  /** Active rig profile configuration. */
  public readonly currentRig = this.ws.currentRigProfile;

  /** Translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;
}
