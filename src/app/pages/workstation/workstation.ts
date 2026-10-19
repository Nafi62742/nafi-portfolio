import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { EN } from '@i18n/en';
import {
  AirflowConditionReport,
  AirflowLayout,
  CaseFanNode,
  ComponentConditionDetail,
  FanSpeedConfig,
  FanSpeedProfile,
  TopFanDirection,
  WorkstationComponentSpec
} from '@models/workstation.models';
import { WorkstationService } from '@services/workstation.service';
import { AppRoutes } from '@utils/constants';

/**
 * Component for workstation architecture showcase and interactive airflow simulation.
 * Features realistic darkFlash Leo casing dimensions, triple-fan GPU upward airflow simulation,
 * individual top fan intake/exhaust configuration, stage-and-apply configuration workflow,
 * interactive component condition inspection, and dynamic thermal/aerodynamic condition reports.
 */
@Component({
  selector: 'app-workstation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workstation.html',
  styleUrl: './workstation.scss'
})
export class WorkstationComponent implements OnInit {
  /** Global Math reference for Angular templates. */
  protected readonly Math: Math = Math;

  /** i18n translation labels for Workstation page. */
  public readonly labels: typeof EN.workstation = EN.workstation;

  /** Full array of workstation component specifications. */
  public readonly workstationSpecs = signal<Array<WorkstationComponentSpec>>([]);

  /** Available chassis airflow simulation layouts. */
  public readonly airflowLayouts = signal<Array<AirflowLayout>>([]);

  /** Available fan speed and thermal presets. */
  public readonly speedProfiles = signal<Array<FanSpeedConfig>>([]);

  /** Currently applied airflow layout ID in the live simulation. */
  public readonly appliedLayoutId = signal<'standard-mesh' | 'dual-chamber'>('standard-mesh');

  /** Staged/pending airflow layout ID selection. */
  public readonly stagedLayoutId = signal<'standard-mesh' | 'dual-chamber'>('standard-mesh');

  /** Currently applied fan speed profile in the live simulation. */
  public readonly appliedSpeedProfile = signal<FanSpeedProfile>('balanced');

  /** Staged/pending fan speed profile selection. */
  public readonly stagedSpeedProfile = signal<FanSpeedProfile>('balanced');

  /** Currently applied direction for darkFlash Leo Top-Rear fan (Slot #1, above CPU & GPU wake). */
  public readonly appliedTopRearFan = signal<TopFanDirection>('off');

  /** Staged/pending direction for darkFlash Leo Top-Rear fan. */
  public readonly stagedTopRearFan = signal<TopFanDirection>('off');

  /** Currently applied direction for darkFlash Leo Top-Front fan (Slot #2, above RAM & AG400 intake). */
  public readonly appliedTopFrontFan = signal<TopFanDirection>('off');

  /** Staged/pending direction for darkFlash Leo Top-Front fan. */
  public readonly stagedTopFrontFan = signal<TopFanDirection>('off');

  /** Computed total count of applied top fans (0, 1, or 2). */
  public readonly appliedTopFansCount = computed<number>(() => {
    let count: number = 0;
    if (this.appliedTopRearFan() !== 'off') {
      count += 1;
    }
    if (this.appliedTopFrontFan() !== 'off') {
      count += 1;
    }
    return count;
  });

  /** Computed total count of staged top fans. */
  public readonly stagedTopFansCount = computed<number>(() => {
    let count: number = 0;
    if (this.stagedTopRearFan() !== 'off') {
      count += 1;
    }
    if (this.stagedTopFrontFan() !== 'off') {
      count += 1;
    }
    return count;
  });

  /** Currently active navigation tab. */
  public readonly activeTab = signal<'airflow' | 'specs' | 'pressure'>('airflow');

  /** Currently inspected fan node, or null if none selected. */
  public readonly selectedFan = signal<CaseFanNode | null>(null);

  /** Currently selected component ID for deep live condition inspection (e.g. 'cpu', 'gpu', 'ram', 'psu', etc.). */
  public readonly selectedComponentId = signal<string>('cpu');

  /** Real-time, configuration-aware condition report for the currently selected component. */
  public readonly selectedComponentCondition = computed<ComponentConditionDetail>(() =>
    this.workstationService.getComponentCondition(
      this.selectedComponentId(),
      this.appliedTopRearFan(),
      this.appliedTopFrontFan(),
      this.appliedSpeedProfile(),
      this.appliedLayoutId()
    )
  );

  /** Whether the thermal heatmap overlay is visible on the chassis. */
  public readonly showThermalZones = signal<boolean>(true);

  /** Whether dynamic airflow streamline animations are running. */
  public readonly showAirflowStreams = signal<boolean>(true);

  /** Confirmation toast message when a configuration is applied. */
  public readonly recentlyAppliedMessage = signal<string | null>(null);

  /** Backward-compatible computed accessor for top fan count. */
  public readonly topFansCount = computed<number>(() => this.appliedTopFansCount());

  /** Backward-compatible computed accessor for active speed profile. */
  public readonly activeSpeedProfile = computed<FanSpeedProfile>(() => this.appliedSpeedProfile());

  /** Backward-compatible computed accessor for active layout ID. */
  public readonly activeLayoutId = computed<'standard-mesh' | 'dual-chamber'>(() => this.appliedLayoutId());

  /** Whether there is a pending top fan direction modification. */
  public readonly hasPendingTopFansChange = computed<boolean>(
    () => this.stagedTopRearFan() !== this.appliedTopRearFan() || this.stagedTopFrontFan() !== this.appliedTopFrontFan()
  );

  /** Whether there is a pending fan speed profile modification. */
  public readonly hasPendingSpeedChange = computed<boolean>(
    () => this.stagedSpeedProfile() !== this.appliedSpeedProfile()
  );

  /** Whether there is a pending layout modification. */
  public readonly hasPendingLayoutChange = computed<boolean>(
    () => this.stagedLayoutId() !== this.appliedLayoutId()
  );

  /** Whether any unapplied configuration changes exist. */
  public readonly hasAnyPendingChange = computed<boolean>(
    () => this.hasPendingTopFansChange() || this.hasPendingSpeedChange() || this.hasPendingLayoutChange()
  );

  /** Detailed thermal, pressure, and acoustic condition report for the currently applied setup. */
  public readonly currentConditionReport = computed<AirflowConditionReport>(() =>
    this.workstationService.getConditionReport(
      this.appliedTopRearFan(),
      this.appliedTopFrontFan(),
      this.appliedSpeedProfile(),
      this.appliedLayoutId()
    )
  );

  /** Router instance for navigation. */
  private readonly router: Router = inject(Router);

  /** Workstation service for fetching specs and layout data. */
  private readonly workstationService: WorkstationService = inject(WorkstationService);

  /** Timer handle for dismissible applied confirmation notification. */
  private messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Initializes component data from the workstation service.
   *
   * @returns void
   */
  public ngOnInit(): void {
    const specs: Array<WorkstationComponentSpec> = this.workstationService.getWorkstationSpecs();
    const layouts: Array<AirflowLayout> = this.workstationService.getAirflowLayouts();
    const profiles: Array<FanSpeedConfig> = this.workstationService.getSpeedProfiles();

    this.workstationSpecs.set(specs);
    this.airflowLayouts.set(layouts);
    this.speedProfiles.set(profiles);

    // Default select first fan for immediate inspection
    if (layouts.length > 0 && layouts[0].fans.length > 0) {
      this.selectedFan.set(layouts[0].fans[0]);
    }
  }

  /**
   * Navigates back to the portfolio home page.
   *
   * @returns void
   */
  public goBack(): void {
    this.router.navigate([AppRoutes.HOME]);
  }

  /**
   * Stages a target airflow layout style.
   *
   * @param layoutId - The target layout ID ('standard-mesh' or 'dual-chamber')
   * @returns void
   */
  public stageLayout(layoutId: 'standard-mesh' | 'dual-chamber'): void {
    this.stagedLayoutId.set(layoutId);
  }

  /**
   * Applies the staged layout to the live simulation.
   *
   * @returns void
   */
  public applyLayoutChange(): void {
    const targetLayout: 'standard-mesh' | 'dual-chamber' = this.stagedLayoutId();
    this.appliedLayoutId.set(targetLayout);

    const current: AirflowLayout | undefined = this.currentLayout;
    if (current && current.fans.length > 0) {
      this.selectedFan.set(current.fans[0]);
    }

    const name: string = targetLayout === 'standard-mesh' ? 'darkFlash Leo ATX' : 'Dual-Chamber Panoramic';
    this.flashNotification(`Chassis Layout Applied: ${name}`);
  }

  /**
   * Stages a target fan speed profile.
   *
   * @param profile - The target speed profile ('silent', 'balanced', 'turbo')
   * @returns void
   */
  public stageSpeedProfile(profile: FanSpeedProfile): void {
    this.stagedSpeedProfile.set(profile);
  }

  /**
   * Applies the staged fan speed profile to the live simulation.
   *
   * @returns void
   */
  public applySpeedProfileChange(): void {
    const targetProfile: FanSpeedProfile = this.stagedSpeedProfile();
    this.appliedSpeedProfile.set(targetProfile);

    const label: string =
      targetProfile === 'silent' ? 'Silent Mode (800 RPM)' : targetProfile === 'turbo' ? 'Turbo Cooling (1800 RPM)' : 'Balanced Mode (1250 RPM)';
    this.flashNotification(`Fan Speed Profile Applied: ${label}`);
  }

  /**
   * Stages the direction for a specific top fan mount ('rearTop' or 'frontTop').
   *
   * @param slot - Which top slot to configure ('rearTop' or 'frontTop').
   * @param direction - Direction mode ('off', 'exhaust', or 'intake').
   * @returns void
   */
  public stageTopFan(slot: 'rearTop' | 'frontTop', direction: TopFanDirection): void {
    if (slot === 'rearTop') {
      this.stagedTopRearFan.set(direction);
    } else {
      this.stagedTopFrontFan.set(direction);
    }
  }

  /**
   * Stages a preconfigured aerodynamic top fan setup preset.
   *
   * @param preset - Preset key identifier.
   * @returns void
   */
  public stageTopPreset(preset: 'stock' | 'rear-exhaust' | 'hybrid' | 'dual-exhaust' | 'dual-intake'): void {
    switch (preset) {
      case 'stock':
        this.stagedTopRearFan.set('off');
        this.stagedTopFrontFan.set('off');
        break;
      case 'rear-exhaust':
        this.stagedTopRearFan.set('exhaust');
        this.stagedTopFrontFan.set('off');
        break;
      case 'hybrid':
        this.stagedTopRearFan.set('exhaust');
        this.stagedTopFrontFan.set('intake');
        break;
      case 'dual-exhaust':
        this.stagedTopRearFan.set('exhaust');
        this.stagedTopFrontFan.set('exhaust');
        break;
      case 'dual-intake':
        this.stagedTopRearFan.set('intake');
        this.stagedTopFrontFan.set('intake');
        break;
    }
  }

  /**
   * Applies the staged top fans intake/exhaust configuration to the live simulation.
   *
   * @returns void
   */
  public applyTopFansChange(): void {
    const rear: TopFanDirection = this.stagedTopRearFan();
    const front: TopFanDirection = this.stagedTopFrontFan();

    this.appliedTopRearFan.set(rear);
    this.appliedTopFrontFan.set(front);

    let label: string = 'Stock (0 Top Fans • Passive Mesh)';
    if (rear === 'exhaust' && front === 'intake') {
      label = 'Hybrid Push-Pull (Front Intake ↓ / Rear Exhaust ↑)';
    } else if (rear === 'exhaust' && front === 'exhaust') {
      label = 'Dual Top Exhaust ↑↑ (Full 6-Fan Chimney Flow)';
    } else if (rear === 'exhaust' && front === 'off') {
      label = 'Rear-Top Exhaust Only ↑ (Direct Plume Evacuation)';
    } else if (rear === 'intake' && front === 'intake') {
      label = 'Dual Top Intake ↓↓ (Ultra Positive Pressure Downdraft)';
    } else if (rear === 'off' && front === 'intake') {
      label = 'Front-Top Intake Only ↓ (Direct CPU Cooler Feed)';
    } else if (rear !== 'off' || front !== 'off') {
      label = `Custom Top Array (Rear: ${rear.toUpperCase()}, Front: ${front.toUpperCase()})`;
    }

    this.flashNotification(`Top Fan Setup Applied: ${label}`);
  }

  /**
   * Applies all currently pending configuration modifications simultaneously.
   *
   * @returns void
   */
  public applyAllPendingChanges(): void {
    this.appliedTopRearFan.set(this.stagedTopRearFan());
    this.appliedTopFrontFan.set(this.stagedTopFrontFan());
    this.appliedSpeedProfile.set(this.stagedSpeedProfile());
    this.appliedLayoutId.set(this.stagedLayoutId());
    this.flashNotification('All Staged Configuration Changes Applied Successfully!');
  }

  /**
   * Discards all pending staged changes, resetting controls to the currently active simulation state.
   *
   * @returns void
   */
  public discardPendingChanges(): void {
    this.stagedTopRearFan.set(this.appliedTopRearFan());
    this.stagedTopFrontFan.set(this.appliedTopFrontFan());
    this.stagedSpeedProfile.set(this.appliedSpeedProfile());
    this.stagedLayoutId.set(this.appliedLayoutId());
    this.flashNotification('Pending configuration changes discarded.');
  }

  /**
   * Sets the active tab view.
   *
   * @param tab - The tab to display ('airflow', 'specs', 'pressure')
   * @returns void
   */
  public setActiveTab(tab: 'airflow' | 'specs' | 'pressure'): void {
    this.activeTab.set(tab);
  }

  /**
   * Sets the currently inspected fan node and updates the active component condition inspection.
   *
   * @param fan - CaseFanNode to inspect or null to deselect.
   * @returns void
   */
  public inspectFan(fan: CaseFanNode | null): void {
    this.selectedFan.set(fan);
    if (fan) {
      this.selectedComponentId.set(fan.id);
    }
  }

  /**
   * Selects a specific workstation hardware component (CPU, GPU, RAM, VRM, PSU, NVMe, HDD Cage, or Fans)
   * to display its detailed real-time condition report, thermal status, and airflow interaction.
   *
   * @param componentId - The target component identifier (e.g. 'cpu', 'gpu', 'ram', 'vrm', 'psu', 'nvme', 'hdd-bay', 'front-fan-1', etc.).
   * @returns void
   */
  public selectComponent(componentId: string): void {
    this.selectedComponentId.set(componentId);

    const layout: AirflowLayout | undefined = this.currentLayout;
    if (layout) {
      const matchedFan: CaseFanNode | undefined = layout.fans.find(
        (f: CaseFanNode) => f.id === componentId
      );
      this.selectedFan.set(matchedFan ?? null);
    }
  }

  /**
   * Toggles the visibility of thermal zones on the chassis diagram.
   *
   * @returns void
   */
  public toggleThermalZones(): void {
    this.showThermalZones.update((current: boolean) => !current);
  }

  /**
   * Toggles the visibility of animated airflow streamlines.
   *
   * @returns void
   */
  public toggleAirflowStreams(): void {
    this.showAirflowStreams.update((current: boolean) => !current);
  }

  /**
   * Helper to display a flash confirmation notification for 4.5 seconds.
   *
   * @param message - Notification text to show.
   * @returns void
   */
  private flashNotification(message: string): void {
    if (this.messageTimeoutId !== null) {
      clearTimeout(this.messageTimeoutId);
    }
    this.recentlyAppliedMessage.set(message);
    this.messageTimeoutId = setTimeout(() => {
      this.recentlyAppliedMessage.set(null);
      this.messageTimeoutId = null;
    }, 4500);
  }

  /**
   * Getter for the currently active airflow layout.
   *
   * @returns The active AirflowLayout or undefined.
   */
  public get currentLayout(): AirflowLayout | undefined {
    return this.airflowLayouts().find(
      (layout: AirflowLayout) => layout.id === this.appliedLayoutId()
    );
  }

  /**
   * Getter for the currently active speed profile config.
   *
   * @returns The active FanSpeedConfig or undefined.
   */
  public get currentSpeedProfile(): FanSpeedConfig | undefined {
    return this.speedProfiles().find(
      (profile: FanSpeedConfig) => profile.profile === this.appliedSpeedProfile()
    );
  }

  /**
   * Computes the scaled intake CFM based on current speed multiplier and active intake top fans.
   *
   * @returns Scaled intake CFM as a rounded integer.
   */
  public get dynamicIntakeCfm(): number {
    const layout: AirflowLayout | undefined = this.currentLayout;
    const profile: FanSpeedConfig | undefined = this.currentSpeedProfile;
    if (!layout || !profile) {
      return 145;
    }
    if (this.appliedLayoutId() === 'standard-mesh') {
      const rearTopIntake: number = this.appliedTopRearFan() === 'intake' ? 40 : 0;
      const frontTopIntake: number = this.appliedTopFrontFan() === 'intake' ? 40 : 0;
      const baseIntake: number = 145 + rearTopIntake + frontTopIntake;
      return Math.round(baseIntake * profile.multiplier);
    }
    return Math.round(layout.intakeTotalCfm * profile.multiplier);
  }

  /**
   * Computes the scaled exhaust CFM based on current speed multiplier and active exhaust top fans.
   *
   * @returns Scaled exhaust CFM as a rounded integer.
   */
  public get dynamicExhaustCfm(): number {
    const layout: AirflowLayout | undefined = this.currentLayout;
    const profile: FanSpeedConfig | undefined = this.currentSpeedProfile;
    if (!layout || !profile) {
      return 55;
    }
    if (this.appliedLayoutId() === 'standard-mesh') {
      const rearTopExhaust: number = this.appliedTopRearFan() === 'exhaust' ? 40 : 0;
      const frontTopExhaust: number = this.appliedTopFrontFan() === 'exhaust' ? 40 : 0;
      const baseExhaust: number = 55 + rearTopExhaust + frontTopExhaust;
      return Math.round(baseExhaust * profile.multiplier);
    }
    return Math.round(layout.exhaustTotalCfm * profile.multiplier);
  }

  /**
   * Computes net pressure differential (Intake - Exhaust).
   *
   * @returns Net CFM value. Positive indicates positive pressure.
   */
  public get netPressureCfm(): number {
    return this.dynamicIntakeCfm - this.dynamicExhaustCfm;
  }

  /**
   * Gets a descriptive badge label for the current pressure state.
   *
   * @returns Pressure status text.
   */
  public get pressureStatusText(): string {
    const net: number = this.netPressureCfm;
    if (net >= 40) {
      return 'Strong Positive (Dust-Repelling)';
    }
    if (net > 0) {
      return 'Balanced Positive Flow';
    }
    if (net === 0) {
      return 'Neutral Air Pressure';
    }
    return 'Negative Airflow Pressure';
  }

  /**
   * Computes fan speed animation duration in seconds for CSS spin animation.
   *
   * @returns Duration string e.g. '0.8s', '0.5s', '0.3s'
   */
  public get fanAnimationDuration(): string {
    switch (this.appliedSpeedProfile()) {
      case 'silent':
        return '1.4s';
      case 'turbo':
        return '0.35s';
      case 'balanced':
      default:
        return '0.7s';
    }
  }

  /**
   * Computes airflow particle streamline animation duration in seconds.
   *
   * @returns Duration string e.g. '2.8s', '1.8s', '1.0s'
   */
  public get streamlineAnimationDuration(): string {
    switch (this.appliedSpeedProfile()) {
      case 'silent':
        return '3.2s';
      case 'turbo':
        return '1.1s';
      case 'balanced':
      default:
        return '2.0s';
    }
  }

  /**
   * Converts a hex color string to an RGB value string.
   *
   * @param hex - A hex color string (e.g. '#1a2b3c')
   * @returns A comma-separated RGB string (e.g. '26, 43, 60')
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
