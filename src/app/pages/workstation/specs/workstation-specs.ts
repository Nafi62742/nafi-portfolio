import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import {
  CpuCoolerOptionConfig,
  CpuOptionConfig,
  FanModelConfig,
  GpuOptionConfig,
  PcRigPresetId,
  RamOptionConfig,
  SystemVitalsSummary,
  WorkstationComponentSpec
} from '@models/workstation.models';
import { WorkstationService } from '@services/workstation.service';

/**
 * Hardware specifications matrix and component deep-dive explorer.
 * Features category filtering, system vitals summary, detailed technical cards,
 * workload suitability tags, and an interactive component inspection modal.
 */
@Component({
  selector: 'app-workstation-specs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-specs.html',
  styleUrl: './workstation-specs.scss'
})
export class WorkstationSpecsComponent {
  /** Translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Workstation service. */
  public readonly ws: WorkstationService = inject(WorkstationService);

  /** Router instance. */
  private readonly router: Router = inject(Router);

  /** Full array of component specs from WorkstationService (dynamically reactive to active rig). */
  public readonly allSpecs = computed<Array<WorkstationComponentSpec>>(() => {
    this.ws.activeRigId();
    return this.ws.getWorkstationSpecs();
  });

  /** System vitals summary metrics (dynamically reactive to active rig). */
  public readonly vitals = computed<SystemVitalsSummary | null>(() => {
    this.ws.activeRigId();
    return this.ws.getSystemVitals();
  });

  /** Available PC Rig Presets. */
  public readonly rigPresets = this.ws.getRigPresets();

  /** Currently active rig preset ID. */
  public readonly activeRigId = this.ws.activeRigId;

  /** Switches the active PC rig preset. */
  public selectRig(rigId: PcRigPresetId): void {
    this.ws.selectRigPreset(rigId);
  }

  /** Currently selected filter category. */
  public readonly activeFilter = signal<'all' | 'compute' | 'gpu' | 'cooling' | 'power' | 'storage'>('all');

  /** Currently open modal component for deep inspection, or null when closed. */
  public readonly modalComponent = signal<WorkstationComponentSpec | null>(null);

  /** Gets GPU options for side-by-side comparison. */
  public get gpuOptions(): Array<GpuOptionConfig> {
    return this.ws.getGpuOptions();
  }

  /** Gets CPU Cooler options for aerodynamic & RPM comparison. */
  public get coolerOptions(): Array<CpuCoolerOptionConfig> {
    return this.ws.getCoolerOptions();
  }

  /** Gets CPU options for compute comparison. */
  public get cpuOptions(): Array<CpuOptionConfig> {
    return this.ws.getCpuOptions();
  }

  /** Gets Fan model options for RPM & static pressure comparison. */
  public get fanModelOptions(): Array<FanModelConfig> {
    return this.ws.getFanModelOptions();
  }

  /** Gets RAM options for memory upgrade comparison. */
  public get ramOptions(): Array<RamOptionConfig> {
    return this.ws.getRamOptions();
  }

  /**
   * Global keyboard listener to close modal on Escape key.
   *
   * @param event - Keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.modalComponent() !== null) {
      this.closeModal();
    }
  }

  /**
   * Sets category filter.
   *
   * @param filter - Target filter string.
   */
  public setFilter(filter: 'all' | 'compute' | 'gpu' | 'cooling' | 'power' | 'storage'): void {
    this.activeFilter.set(filter);
  }

  /**
   * Gets filtered component specifications.
   *
   * @returns Filtered array of WorkstationComponentSpec.
   */
  public get filteredSpecs(): Array<WorkstationComponentSpec> {
    const filter = this.activeFilter();
    const specs = this.allSpecs();

    if (filter === 'all') {
      return specs;
    }
    if (filter === 'compute') {
      return specs.filter((s) => s.category === 'cpu' || s.category === 'motherboard');
    }
    if (filter === 'gpu') {
      return specs.filter((s) => s.category === 'gpu');
    }
    if (filter === 'cooling') {
      return specs.filter((s) => s.category === 'cooler' || s.category === 'fans');
    }
    if (filter === 'power') {
      return specs.filter((s) => s.category === 'psu' || s.category === 'case');
    }
    if (filter === 'storage') {
      return specs.filter((s) => s.category === 'storage' || s.category === 'ram');
    }
    return specs;
  }

  /**
   * Opens component deep-dive modal.
   *
   * @param comp - Target component spec.
   */
  public openModal(comp: WorkstationComponentSpec): void {
    this.modalComponent.set(comp);
  }

  /**
   * Closes deep-dive modal.
   */
  public closeModal(): void {
    this.modalComponent.set(null);
  }

  /**
   * Closes the component deep-dive modal when clicking the backdrop overlay.
   *
   * @param event - Mouse event from the backdrop
   */
  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  /**
   * Selects component and navigates to the live aerodynamic simulation.
   *
   * @param comp - Target component spec.
   */
  public inspectInSimulation(comp: WorkstationComponentSpec): void {
    this.ws.selectComponent(comp.category);
    this.closeModal();
    this.router.navigate(['/workstation/simulation']);
  }

  /**
   * Converts hex color string to RGB.
   *
   * @param hex - Hex color.
   * @returns Comma-separated RGB string.
   */
  public hexToRgb(hex: string): string {
    const cleanHex: string = hex.replace('#', '');
    if (cleanHex.length === 3) {
      const r: number = parseInt(cleanHex.charAt(0) + cleanHex.charAt(0), 16);
      const g: number = parseInt(cleanHex.charAt(1) + cleanHex.charAt(1), 16);
      const b: number = parseInt(cleanHex.charAt(2) + cleanHex.charAt(2), 16);
      return `${r}, ${g}, ${b}`;
    }
    if (cleanHex.length === 6) {
      const r: number = parseInt(cleanHex.substring(0, 2), 16);
      const g: number = parseInt(cleanHex.substring(2, 4), 16);
      const b: number = parseInt(cleanHex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '99, 102, 241';
  }
}
