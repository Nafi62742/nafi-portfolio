import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { WORKSTATION_I18N, WorkstationI18n } from '../i18n/workstation.i18n';
import {
  AirflowLayout,
  AirflowLayoutId,
  CaseFanNode,
  CpuCoolerId,
  CpuModelId,
  FanModelId,
  FanSpeedProfile,
  GpuModelId,
  RamOptionId,
  TopFanDirection
} from '@models/workstation.models';
import { WorkstationService } from '@services/workstation.service';

/**
 * Interactive airflow simulation and aerodynamic analysis studio.
 * Features realistic darkFlash Leo casing dimensions, triple-fan GPU upward airflow simulation,
 * individual top fan intake/exhaust configuration, stage-and-apply workflow,
 * interactive component condition inspection, and dynamic thermal/aerodynamic condition reports.
 */
@Component({
  selector: 'app-workstation-simulation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workstation-simulation.html',
  styleUrl: './workstation-simulation.scss'
})
export class WorkstationSimulationComponent {
  /** Global Math reference for Angular templates. */
  protected readonly Math: Math = Math;

  /** i18n translation labels. */
  public readonly labels: WorkstationI18n = WORKSTATION_I18N;

  /** Workstation service managing aerodynamic simulation and condition logic. */
  public readonly ws: WorkstationService = inject(WorkstationService);

  /** Router instance for navigation. */
  private readonly router: Router = inject(Router);

  // Delegated reactive state signals from WorkstationService
  public readonly stagedLayoutId = this.ws.stagedLayoutId;
  public readonly appliedLayoutId = this.ws.appliedLayoutId;
  public readonly hasPendingLayoutChange = this.ws.hasPendingLayoutChange;
  public readonly stagedSpeedProfile = this.ws.stagedSpeedProfile;
  public readonly appliedSpeedProfile = this.ws.appliedSpeedProfile;
  public readonly hasPendingSpeedChange = this.ws.hasPendingSpeedChange;
  public readonly stagedTopRearFan = this.ws.stagedTopRearFan;
  public readonly appliedTopRearFan = this.ws.appliedTopRearFan;
  public readonly stagedTopFrontFan = this.ws.stagedTopFrontFan;
  public readonly appliedTopFrontFan = this.ws.appliedTopFrontFan;
  public readonly hasPendingTopFansChange = this.ws.hasPendingTopFansChange;
  public readonly showThermalZones = this.ws.showThermalZones;
  public readonly showAirflowStreams = this.ws.showAirflowStreams;
  public readonly appliedTopFansCount = this.ws.appliedTopFansCount;
  public readonly currentConditionReport = this.ws.currentConditionReport;
  public readonly selectedComponentId = this.ws.selectedComponentId;
  public readonly selectedComponentCondition = this.ws.selectedComponentCondition;
  public readonly selectedFan = this.ws.selectedFan;
  public readonly speedProfiles = computed(() => this.ws.getSpeedProfiles());
  public readonly airflowLayouts = computed(() => this.ws.getAirflowLayouts());

  // Hardware model options
  public readonly cpus = computed(() => this.ws.getCpuOptions());
  public readonly coolers = computed(() => this.ws.getCoolerOptions());
  public readonly gpus = computed(() => this.ws.getGpuOptions());
  public readonly fanModels = computed(() => {
    const rig = this.ws.activeRigId();
    return this.ws.getFanModelOptions().filter(f => !f.rigPreset || f.rigPreset === rig || f.rigPreset === 'both');
  });
  public readonly rams = computed(() => this.ws.getRamOptions());

  public readonly selectedCpuId = this.ws.selectedCpuId;
  public readonly selectedCoolerId = this.ws.selectedCoolerId;
  public readonly selectedGpuId = this.ws.selectedGpuId;
  public readonly selectedFanModelId = this.ws.selectedFanModelId;
  public readonly selectedRamId = this.ws.selectedRamId;

  public readonly currentCpuConfig = this.ws.currentCpuConfig;
  public readonly currentCoolerConfig = this.ws.currentCoolerConfig;
  public readonly currentGpuConfig = this.ws.currentGpuConfig;
  public readonly currentFanModelConfig = this.ws.currentFanModelConfig;
  public readonly currentRamConfig = this.ws.currentRamConfig;
  public readonly dynamicCpuFanRpm = this.ws.dynamicCpuFanRpm;
  public readonly dynamicCaseFanRpm = this.ws.dynamicCaseFanRpm;
  public readonly activeCustomizationAnalysis = this.ws.activeCustomizationAnalysis;

  /**
   * Getter for currently active layout.
   *
   * @returns Active AirflowLayout or undefined.
   */
  public get currentLayout(): AirflowLayout | undefined {
    return this.ws.getAirflowLayouts().find(
      (l: AirflowLayout) => l.id === this.ws.appliedLayoutId()
    );
  }

  /**
   * Getter for dynamic intake CFM.
   */
  public get dynamicIntakeCfm(): number {
    return this.ws.dynamicIntakeCfm();
  }

  /**
   * Getter for dynamic exhaust CFM.
   */
  public get dynamicExhaustCfm(): number {
    return this.ws.dynamicExhaustCfm();
  }

  /**
   * Getter for net chamber pressure CFM.
   */
  public get netPressureCfm(): number {
    return this.ws.netPressureCfm();
  }

  /**
   * Getter for pressure status badge text.
   */
  public get pressureStatusText(): string {
    return this.ws.pressureStatusText();
  }

  /**
   * Getter for fan spin animation duration in seconds.
   */
  public get fanAnimationDuration(): string {
    return this.ws.fanAnimationDuration();
  }

  /**
   * Getter for airflow streamlines animation duration.
   */
  public get streamlineAnimationDuration(): string {
    return this.ws.streamlineAnimationDuration();
  }

  /**
   * Stages layout ID.
   *
   * @param id - Target layout ID.
   */
  public stageLayout(id: AirflowLayoutId): void {
    this.ws.stageLayout(id);
  }

  /**
   * Applies the staged layout.
   */
  public applyLayoutChange(): void {
    this.ws.applyLayoutChange();
  }

  /**
   * Stages speed profile.
   *
   * @param profile - Speed profile.
   */
  public stageSpeedProfile(profile: FanSpeedProfile): void {
    this.ws.stageSpeedProfile(profile);
  }

  /**
   * Applies the staged speed profile.
   */
  public applySpeedProfileChange(): void {
    this.ws.applySpeedProfileChange();
  }

  /**
   * Stages top fan direction.
   *
   * @param slot - Slot.
   * @param direction - Direction.
   */
  public stageTopFan(slot: 'rearTop' | 'frontTop', direction: TopFanDirection): void {
    this.ws.stageTopFan(slot, direction);
  }

  /**
   * Stages a top fan preset.
   *
   * @param preset - Preset key.
   */
  public stageTopPreset(preset: 'stock' | 'rear-exhaust' | 'hybrid' | 'dual-exhaust' | 'dual-intake'): void {
    this.ws.stageTopPreset(preset);
  }

  /**
   * Applies top fan direction modifications.
   */
  public applyTopFansChange(): void {
    this.ws.applyTopFansChange();
  }

  /**
   * Toggles thermal zones overlay.
   */
  public toggleThermalZones(): void {
    this.ws.toggleThermalZones();
  }

  /**
   * Toggles streamlines overlay.
   */
  public toggleAirflowStreams(): void {
    this.ws.toggleAirflowStreams();
  }

  /**
   * Inspects a specific fan node.
   *
   * @param fan - CaseFanNode or null.
   */
  public inspectFan(fan: CaseFanNode | null): void {
    this.ws.inspectFan(fan);
  }

  /**
   * Selects a component for detailed condition inspection.
   *
   * @param componentId - Component ID.
   */
  public selectComponent(componentId: string): void {
    this.ws.selectComponent(componentId);
  }

  /**
   * Selects active CPU processor model.
   *
   * @param id - Target CpuModelId.
   */
  public selectCpu(id: CpuModelId): void {
    this.ws.selectCpu(id);
  }

  /**
   * Selects active CPU cooler model.
   *
   * @param id - Target CpuCoolerId.
   */
  public selectCooler(id: CpuCoolerId): void {
    this.ws.selectCooler(id);
  }

  /**
   * Selects active GPU model (RTX 3060 vs GTX 1650).
   *
   * @param id - Target GpuModelId.
   */
  public selectGpu(id: GpuModelId): void {
    this.ws.selectGpu(id);
  }

  /**
   * Selects active chassis fan model.
   *
   * @param id - Target FanModelId.
   */
  public selectFanModel(id: FanModelId): void {
    this.ws.selectFanModel(id);
  }

  /**
   * Selects active RAM memory module configuration.
   *
   * @param id - Target RamOptionId.
   */
  public selectRam(id: RamOptionId): void {
    this.ws.selectRam(id);
  }

  /**
   * Dropdown change handler for GPU model.
   */
  public onGpuSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as GpuModelId;
    if (val) {
      this.selectGpu(val);
    }
  }

  /**
   * Dropdown change handler for CPU processor.
   */
  public onCpuSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as CpuModelId;
    if (val) {
      this.selectCpu(val);
    }
  }

  /**
   * Dropdown change handler for CPU cooler.
   */
  public onCoolerSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as CpuCoolerId;
    if (val) {
      this.selectCooler(val);
    }
  }

  /**
   * Dropdown change handler for chassis fan model.
   */
  public onFanModelSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as FanModelId;
    if (val) {
      this.selectFanModel(val);
    }
  }

  /**
   * Dropdown change handler for system memory (RAM).
   */
  public onRamSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as RamOptionId;
    if (val) {
      this.selectRam(val);
    }
  }

  /**
   * Dropdown change handler for Top-Rear fan direction.
   */
  public onTopRearFanSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as TopFanDirection;
    if (val) {
      this.stageTopFan('rearTop', val);
    }
  }

  /**
   * Dropdown change handler for Top-Front fan direction.
   */
  public onTopFrontFanSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as TopFanDirection;
    if (val) {
      this.stageTopFan('frontTop', val);
    }
  }

  /**
   * Dropdown change handler for quick fan preset.
   */
  public onPresetSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as
      | 'stock'
      | 'rear-exhaust'
      | 'hybrid'
      | 'dual-exhaust'
      | 'dual-intake';
    if (val) {
      this.stageTopPreset(val);
    }
  }

  /**
   * Navigates to hardware specifications page.
   */
  public goToSpecs(): void {
    this.router.navigate(['/workstation/specs']);
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
