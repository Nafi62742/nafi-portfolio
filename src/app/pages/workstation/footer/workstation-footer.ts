import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { WorkstationService } from '@services/workstation.service';

/**
 * Dedicated footer component for the Workstation module.
 * Provides active desktop node summary and engineering laboratory telemetry copyright.
 */
@Component({
  selector: 'app-workstation-footer',
  standalone: true,
  imports: [CommonModule],
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
}
