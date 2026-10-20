import { Injectable, computed, signal } from '@angular/core';

import {
  AirflowConditionReport,
  AirflowLayout,
  AirflowLayoutId,
  CaseFanNode,
  ComponentConditionDetail,
  CpuCoolerId,
  CpuCoolerOptionConfig,
  CpuModelId,
  CpuOptionConfig,
  CustomizationTradeoffAnalysis,
  FanModelConfig,
  FanModelId,
  FanSpeedConfig,
  FanSpeedProfile,
  GpuModelId,
  GpuOptionConfig,
  PcRigPresetId,
  RamOptionConfig,
  RamOptionId,
  PcRigProfileConfig,
  PowerDistributionItem,
  SystemVitalsSummary,
  ThermalStressPoint,
  TopFanDirection,
  WorkstationBenchmarkItem,
  WorkstationComponentSpec
} from '@models/workstation.models';

/**
 * Service providing workstation hardware specifications and airflow simulation configurations.
 */
@Injectable({ providedIn: 'root' })
export class WorkstationService {
  /** Currently active PC rig preset profile. */
  public readonly activeRigId = signal<PcRigPresetId>('darkflash-leo');

  /** Currently applied airflow layout ID in the live simulation. */
  public readonly appliedLayoutId = signal<AirflowLayoutId>('standard-mesh');

  /** Staged/pending airflow layout ID selection. */
  public readonly stagedLayoutId = signal<AirflowLayoutId>('standard-mesh');

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

  /** Currently active fan node being inspected, or null if none. */
  public readonly selectedFan = signal<CaseFanNode | null>(null);

  /** Currently selected component ID for deep live condition inspection. */
  public readonly selectedComponentId = signal<string>('cpu');

  /** Currently selected CPU model. */
  public readonly selectedCpuId = signal<CpuModelId>('i5-10400f');

  /** Currently selected CPU Cooler model. */
  public readonly selectedCoolerId = signal<CpuCoolerId>('ag400');

  /** Currently selected GPU model (RTX 3060 vs GTX 1650). */
  public readonly selectedGpuId = signal<GpuModelId>('rtx-3060');

  /** Currently selected Case Fan model. */
  public readonly selectedFanModelId = signal<FanModelId>('cl6-argb');

  /** Currently selected RAM module option. */
  public readonly selectedRamId = signal<RamOptionId>('corsair-16gb-3200');

  /** Active PC Rig Preset configuration details. */
  public readonly currentRigProfile = computed<PcRigProfileConfig>(() => {
    const found = this.getRigPresets().find((r) => r.id === this.activeRigId());
    return found ?? this.getRigPresets()[0];
  });

  /** Currently selected CPU configuration details. */
  public readonly currentCpuConfig = computed<CpuOptionConfig>(() => {
    const found = this.getCpuOptions().find((c) => c.id === this.selectedCpuId());
    return found ?? this.getCpuOptions()[0];
  });

  /** Currently selected CPU Cooler configuration details. */
  public readonly currentCoolerConfig = computed<CpuCoolerOptionConfig>(() => {
    const found = this.getCoolerOptions().find((c) => c.id === this.selectedCoolerId());
    return found ?? this.getCoolerOptions()[0];
  });

  /** Currently selected GPU configuration details. */
  public readonly currentGpuConfig = computed<GpuOptionConfig>(() => {
    const found = this.getGpuOptions().find((g) => g.id === this.selectedGpuId());
    return found ?? this.getGpuOptions()[0];
  });

  /** Currently selected Case Fan model configuration. */
  public readonly currentFanModelConfig = computed<FanModelConfig>(() => {
    const found = this.getFanModelOptions().find((f) => f.id === this.selectedFanModelId());
    return found ?? this.getFanModelOptions()[0];
  });

  /** Currently selected RAM module configuration. */
  public readonly currentRamConfig = computed<RamOptionConfig>(() => {
    const found = this.getRamOptions().find((r) => r.id === this.selectedRamId());
    return found ?? this.getRamOptions()[0];
  });

  /** Dynamic CPU fan RPM determined by the active cooler model and active speed profile. */
  public readonly dynamicCpuFanRpm = computed<number>(() => {
    const cooler = this.currentCoolerConfig();
    const profile = this.appliedSpeedProfile();
    switch (profile) {
      case 'silent':
        return cooler.silentRpm;
      case 'turbo':
        return cooler.turboRpm;
      case 'balanced':
      default:
        return cooler.balancedRpm;
    }
  });

  /** Dynamic Case fan RPM determined by the active fan model and active speed profile. */
  /**
   * Real-time dynamic aerodynamic, thermal, and electrical analysis of the customized hardware.
   * Synthesizes advantages, disadvantages, pressure delta, temperature estimates, and acoustic levels.
   */
  public readonly activeCustomizationAnalysis = computed<CustomizationTradeoffAnalysis>(() => {
    const cpu = this.currentCpuConfig();
    const cooler = this.currentCoolerConfig();
    const gpu = this.currentGpuConfig();
    const fan = this.currentFanModelConfig();
    const ram = this.currentRamConfig();
    const rig = this.currentRigProfile();
    const speedProfile = this.appliedSpeedProfile();
    const rearTop = this.appliedTopRearFan();
    const frontTop = this.appliedTopFrontFan();

    const intakeCfm = this.dynamicIntakeCfm();
    const exhaustCfm = this.dynamicExhaustCfm();
    const netPressure = intakeCfm - exhaustCfm;

    let pressureState = 'Neutral Air Pressure';
    let pressureVerdict: 'optimal' | 'acceptable' | 'warning' = 'acceptable';
    if (netPressure >= 30) {
      pressureState = `Strong Positive (+${netPressure} CFM)`;
      pressureVerdict = 'optimal';
    } else if (netPressure > 0) {
      pressureState = `Balanced Positive (+${netPressure} CFM)`;
      pressureVerdict = 'optimal';
    } else if (netPressure < 0) {
      pressureState = `Negative Pressure (${netPressure} CFM)`;
      pressureVerdict = 'warning';
    }

    const psuCapacityWatts = rig.id === 'deepcool-matrexx40' ? 650 : 750;
    const totalTdp = cpu.maxLoadWatts + gpu.loadWatts + (ram.capacityGb >= 32 ? 25 : 15) + 35;
    const psuMargin = Math.max(0, psuCapacityWatts - totalTdp);
    const psuUtilization = Math.round((totalTdp / psuCapacityWatts) * 100);
    const psuStatus: 'safe' | 'optimal' | 'warning' = psuUtilization > 85 ? 'warning' : psuUtilization > 65 ? 'optimal' : 'safe';

    const cpuRatio = cpu.maxLoadWatts / Math.max(50, cooler.coolingCapacityTdp);
    let cpuTemp = 48 + (cpuRatio * 30);
    if (cooler.id === 'intel-stock' && cpu.maxLoadWatts > 70) cpuTemp += 11;
    if (gpu.tdpWatts >= 170) cpuTemp += 3.5;
    if (frontTop === 'intake') cpuTemp -= 3.0;
    if (frontTop === 'exhaust') cpuTemp += 3.5;
    if (fan.staticPressureMmH2o >= 2.0) cpuTemp -= 2.0;
    if (speedProfile === 'silent') cpuTemp += 4.5;
    if (speedProfile === 'turbo') cpuTemp -= 4.0;
    const cpuTempFormatted = `${Math.round(cpuTemp)}°C`;

    let gpuTemp = 42 + (gpu.tdpWatts * 0.16);
    if (gpu.fanCount >= 3) gpuTemp -= 4.5;
    if (gpu.fanCount === 1) gpuTemp += 5.0;
    if (intakeCfm > 120) gpuTemp -= 3.0;
    if (speedProfile === 'silent') gpuTemp += 5.0;
    if (speedProfile === 'turbo') gpuTemp -= 4.0;
    const gpuTempFormatted = `${Math.round(gpuTemp)}°C`;

    let dba = 21.0 + (cooler.maxNoiseDba * 0.25) + (fan.maxNoiseDba * 0.35);
    if (speedProfile === 'silent') dba = Math.max(18.5, dba - 7.5);
    if (speedProfile === 'turbo') dba = dba + 8.5;
    const acousticRating = Math.round(dba * 10) / 10;
    let acousticCategory = 'Studio Quiet';
    if (acousticRating <= 22) acousticCategory = 'Whisper Silent';
    else if (acousticRating <= 30) acousticCategory = 'Studio Quiet';
    else if (acousticRating <= 37) acousticCategory = 'Moderate Flow';
    else acousticCategory = 'Audible High Flow';

    const keyAdvantages: string[] = [];
    const keyDisadvantages: string[] = [];

    if (cpu.advantages?.length) keyAdvantages.push(cpu.advantages[0]);
    if (cooler.advantages?.length) keyAdvantages.push(cooler.advantages[0]);
    if (gpu.advantages?.length) keyAdvantages.push(gpu.advantages[0]);
    if (fan.advantages?.length) keyAdvantages.push(fan.advantages[0]);
    if (ram.advantages?.length) keyAdvantages.push(ram.advantages[0]);

    if (netPressure > 0) {
      keyAdvantages.push(`Positive Pressure (+${netPressure} CFM net) repels dust ingress through chassis joints`);
    }
    if (frontTop === 'intake') {
      keyAdvantages.push(`Top-Front intake directs fresh ambient airflow straight to the ${cooler.shortName}`);
    }
    if (rearTop === 'exhaust') {
      keyAdvantages.push(`Top-Rear exhaust actively evacuates GPU thermal wake and CPU heatsink dissipation`);
    }

    if (cpu.disadvantages?.length) keyDisadvantages.push(cpu.disadvantages[0]);
    if (cooler.disadvantages?.length) keyDisadvantages.push(cooler.disadvantages[0]);
    if (gpu.disadvantages?.length) keyDisadvantages.push(gpu.disadvantages[0]);
    if (fan.disadvantages?.length) keyDisadvantages.push(fan.disadvantages[0]);
    if (ram.disadvantages?.length) keyDisadvantages.push(ram.disadvantages[0]);

    if (netPressure < 0) {
      keyDisadvantages.push(`Negative pressure (${netPressure} CFM) ingresses fine dust particles via rear PCIe brackets`);
    }
    if (frontTop === 'exhaust') {
      keyDisadvantages.push(`Top-Front fan set to Exhaust short-circuits front intake air before reaching CPU cooler`);
    }
    if (rearTop === 'intake') {
      keyDisadvantages.push(`Top-Rear intake injects downward air into rear exhaust stream, creating localized shear turbulence`);
    }
    if (cooler.id === 'intel-stock' && cpu.tdpWatts > 65) {
      keyDisadvantages.push(`Stock cooler is under-dimensioned for ${cpu.shortName} (${cpu.maxLoadWatts}W Turbo), thermal throttling risk under load`);
    }

    let tip = `Configuration offers balanced thermal headroom and low acoustic resonance for development workflows.`;
    if (frontTop === 'exhaust') {
      tip = `Recommended: Set Top-Front fan to Intake or Off so it does not exhaust cool air meant for the CPU heatsink.`;
    } else if (netPressure < 0) {
      tip = `Increase front intake fan curve or decrease top exhaust speeds to maintain positive chassis static pressure.`;
    } else if (gpu.tdpWatts >= 170 && cooler.id === 'ag400') {
      tip = `High upward GPU heat plume detected. Setting Top-Rear fan to Exhaust will evacuate thermal wake efficiently.`;
    }

    return {
      netPressureCfm: netPressure,
      pressureState,
      pressureVerdict,
      estimatedCpuLoadTemp: cpuTempFormatted,
      estimatedGpuLoadTemp: gpuTempFormatted,
      totalSystemTdpWatts: totalTdp,
      psuSafetyMarginWatts: psuMargin,
      psuUtilizationPercent: psuUtilization,
      psuSafetyStatus: psuStatus,
      acousticRatingDba: acousticRating,
      acousticCategory,
      keyAdvantages,
      keyDisadvantages,
      thermalTip: tip
    };
  });

  public readonly dynamicCaseFanRpm = computed<number>(() => {
    const fan = this.currentFanModelConfig();
    const profile = this.appliedSpeedProfile();
    switch (profile) {
      case 'silent':
        return fan.silentRpm;
      case 'turbo':
        return fan.turboRpm;
      case 'balanced':
      default:
        return fan.balancedRpm;
    }
  });

  /** Whether the thermal heatmap overlay is visible on the chassis schematic. */
  public readonly showThermalZones = signal<boolean>(true);

  /** Whether dynamic airflow streamline animations are running. */
  public readonly showAirflowStreams = signal<boolean>(true);

  /** Confirmation toast message when a configuration is applied. */
  public readonly recentlyAppliedMessage = signal<string | null>(null);

  /** Timer handle for dismissible notification. */
  private messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Computed total count of applied top fans (0, 1, or 2). */
  public readonly appliedTopFansCount = computed<number>(() => {
    let count = 0;
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
    let count = 0;
    if (this.stagedTopRearFan() !== 'off') {
      count += 1;
    }
    if (this.stagedTopFrontFan() !== 'off') {
      count += 1;
    }
    return count;
  });

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
    this.getConditionReport(
      this.appliedTopRearFan(),
      this.appliedTopFrontFan(),
      this.appliedSpeedProfile(),
      this.appliedLayoutId(),
      this.selectedCpuId(),
      this.selectedCoolerId(),
      this.selectedGpuId(),
      this.selectedFanModelId()
    )
  );

  /** Real-time, configuration-aware condition report for the currently selected component. */
  public readonly selectedComponentCondition = computed<ComponentConditionDetail>(() =>
    this.getComponentCondition(
      this.selectedComponentId(),
      this.appliedTopRearFan(),
      this.appliedTopFrontFan(),
      this.appliedSpeedProfile(),
      this.appliedLayoutId()
    )
  );

  /** Computes the scaled intake CFM based on current speed multiplier and active intake top fans. */
  public readonly dynamicIntakeCfm = computed<number>(() => {
    const layout = this.getAirflowLayouts().find((l) => l.id === this.appliedLayoutId());
    const profile = this.getSpeedProfiles().find((p) => p.profile === this.appliedSpeedProfile());
    const fan = this.currentFanModelConfig();
    if (!layout || !profile) {
      return 145;
    }
    // Scale intake flow proportionally with the selected fan model's max CFM (baseline 55 CFM)
    const fanMultiplier = fan ? (fan.maxCfm / 55.0) : 1.0;
    const isMatrexx = this.appliedLayoutId() === 'matrexx-40';
    const isMaxcool = this.appliedLayoutId() === 'maxcool-mc5';
    const baseCfm = isMatrexx || isMaxcool ? 104 : 145;
    const topSlotCfm = isMatrexx ? 52 : 40;

    const rearTopIntake: number = this.appliedTopRearFan() === 'intake' ? Math.round(topSlotCfm * fanMultiplier) : 0;
    const frontTopIntake: number = this.appliedTopFrontFan() === 'intake' ? Math.round(topSlotCfm * fanMultiplier) : 0;
    const baseIntake: number = Math.round(baseCfm * fanMultiplier) + rearTopIntake + frontTopIntake;
    return Math.round(baseIntake * profile.multiplier);
  });

  /** Computes the scaled exhaust CFM based on current speed multiplier and active exhaust top fans. */
  public readonly dynamicExhaustCfm = computed<number>(() => {
    const layout = this.getAirflowLayouts().find((l) => l.id === this.appliedLayoutId());
    const profile = this.getSpeedProfiles().find((p) => p.profile === this.appliedSpeedProfile());
    const fan = this.currentFanModelConfig();
    if (!layout || !profile) {
      return 55;
    }
    // Scale exhaust flow proportionally with the selected fan model's max CFM (baseline 55 CFM)
    const fanMultiplier = fan ? (fan.maxCfm / 55.0) : 1.0;
    const isMatrexx = this.appliedLayoutId() === 'matrexx-40';
    const isMaxcool = this.appliedLayoutId() === 'maxcool-mc5';
    const baseCfm = isMatrexx || isMaxcool ? 52 : 55;
    const topSlotCfm = isMatrexx ? 52 : 40;

    const rearTopExhaust: number = this.appliedTopRearFan() === 'exhaust' ? Math.round(topSlotCfm * fanMultiplier) : 0;
    const frontTopExhaust: number = this.appliedTopFrontFan() === 'exhaust' ? Math.round(topSlotCfm * fanMultiplier) : 0;
    const baseExhaust: number = Math.round(baseCfm * fanMultiplier) + rearTopExhaust + frontTopExhaust;
    return Math.round(baseExhaust * profile.multiplier);
  });

  /** Computes net pressure differential (Intake - Exhaust). */
  public readonly netPressureCfm = computed<number>(() => this.dynamicIntakeCfm() - this.dynamicExhaustCfm());

  /** Descriptive badge label for the current pressure state. */
  public readonly pressureStatusText = computed<string>(() => {
    const net: number = this.netPressureCfm();
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
  });

  /** Computes fan speed animation duration in seconds for CSS spin animation based on actual RPM. */
  public readonly fanAnimationDuration = computed<string>(() => {
    const rpm = this.dynamicCaseFanRpm();
    const dur = Math.max(0.25, Math.min(1.8, 850 / rpm));
    return `${dur.toFixed(2)}s`;
  });

  /** Computes airflow particle streamline animation duration in seconds based on actual RPM & airflow velocity. */
  public readonly streamlineAnimationDuration = computed<string>(() => {
    const rpm = this.dynamicCaseFanRpm();
    const dur = Math.max(0.8, Math.min(3.5, 2400 / rpm));
    return `${dur.toFixed(2)}s`;
  });

  /**
   * Stages a target airflow layout style.
   *
   * @param layoutId - The target layout ID ('standard-mesh' or 'dual-chamber')
   */
  public stageLayout(layoutId: AirflowLayoutId): void {
    this.stagedLayoutId.set(layoutId);
  }

  /**
   * Applies the staged layout to the live simulation.
   */
  public applyLayoutChange(): void {
    const targetLayout: AirflowLayoutId = this.stagedLayoutId();
    this.appliedLayoutId.set(targetLayout);

    const layout = this.getAirflowLayouts().find((l) => l.id === targetLayout);
    if (layout && layout.fans.length > 0) {
      this.selectedFan.set(layout.fans[0]);
    }

    const name: string =
      targetLayout === 'standard-mesh'
        ? 'darkFlash Leo ATX'
        : targetLayout === 'matrexx-40'
          ? 'DeepCool MATREXX 40 3FS'
          : targetLayout === 'maxcool-mc5'
            ? 'Maxcool Inferno MC5 (5-Fan)'
            : 'Dual-Chamber Panoramic';
    this.flashNotification(`Chassis Layout Applied: ${name}`);
  }

  /**
   * Retrieves all available PC rig preset profiles.
   */
  public getRigPresets(): Array<PcRigProfileConfig> {
    return [
      {
        id: 'darkflash-leo',
        name: 'darkFlash Leo Studio Rig',
        badge: 'ATX Mid-Tower • RTX 3060 12GB • 750W Gold',
        tagline: 'High-Airflow Linear Wind Tunnel Studio Workstation',
        caseName: 'darkFlash Leo (Leo TG) ATX Mid-Tower',
        caseDimensions: '349 x 190 x 430 mm',
        cpuName: 'Intel Core i5-10400F (6C/12T • 4.30 GHz)',
        cpuId: 'i5-10400f',
        gpuName: 'NVIDIA GeForce RTX 3060 12GB (Triple-Fan Edition)',
        gpuId: 'rtx-3060',
        coolerId: 'ag400',
        fanModelId: 'cl6-argb',
        layoutId: 'standard-mesh',
        psuName: '750W 80 PLUS Gold Certified',
        ramName: '32GB Dual-Channel DDR4 3200MHz',
        storagePrimary: '1TB High-Speed NVMe M.2 SSD',
        storageSecondary: '750GB High-Performance SATA SSD',
        motherboard: 'Intel B460 / B560 Chipset Board',
        monitor: 'Gigabyte 25" Full HD 200Hz IPS Gaming Monitor',
        description:
          'Studio development workstation in the darkFlash Leo ATX mid-tower chassis featuring a 6-fan array, DeepCool AG400 220W cooler, and NVIDIA GeForce RTX 3060 with 12GB GDDR6 VRAM for local AI and full-stack compilation.'
      },
      {
        id: 'deepcool-matrexx40',
        name: 'DeepCool MATREXX 40 3FS Dev Station',
        badge: 'Micro-ATX • i5-12400 • R7 360 2GB • Samsung 980 PRO',
        tagline: 'High-Density Micro-ATX Alder Lake High-Airflow Rig',
        caseName: 'DeepCool MATREXX 40 3FS Mid-Tower',
        caseDimensions: '400 x 215 x 431 mm',
        cpuName: 'Intel Core i5-12400 (6 Golden Cove P-Cores / 12T • 4.40 GHz)',
        cpuId: 'i5-12400',
        gpuName: 'AMD Radeon R7 360 2GB GDDR5 (100W 6-Pin PCIe)',
        gpuId: 'r7-360',
        coolerId: 'ag400',
        fanModelId: 'deepcool-3fs',
        layoutId: 'matrexx-40',
        psuName: 'Corsair CV650 (650W 80+ Bronze Certified)',
        ramName: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16',
        storagePrimary: 'Samsung 980 PRO 250GB PCIe 4.0 NVMe M.2 SSD (6,400 MB/s)',
        storageSecondary: '2TB High-Capacity 7200 RPM Hard Drive',
        motherboard: 'Gigabyte B660M DS3H DDR4 (Micro-ATX • 2.5GbE)',
        monitor: 'ASUS VA249HG 23.8" Full HD 120Hz IPS Eye Care',
        keyboard: 'Dareu A87 Alpha Tenkeyless (TKL) Mechanical Keyboard',
        description:
          'Dedicated engineering workstation inside the DeepCool MATREXX 40 3FS high-airflow mesh chassis. Powered by 12th Gen Intel Core i5-12400 on Gigabyte B660M DS3H with Samsung 980 PRO PCIe 4.0 NVMe, Corsair Vengeance LPX RAM, AMD Radeon R7 360 2GB, Corsair CV650 PSU, and 3 pre-installed 120mm Tri-Color LED fans.'
      },
      {
        id: 'maxcool-mc5',
        name: 'Maxcool Inferno MC5 Rig',
        badge: 'Mid-Tower • Ryzen 5 5600 • GTX 1650 Super • 450W Bronze',
        tagline: 'High-Airflow 5-Fan Array & AMD Zen 3 Precision Dev Rig',
        caseName: 'Maxcool Inferno MC5 High-Airflow Chassis',
        caseDimensions: '380 x 200 x 450 mm',
        cpuName: 'AMD Ryzen 5 5600 (6C/12T • 4.40 GHz Max Boost)',
        cpuId: 'r5-5600',
        gpuName: 'NVIDIA GeForce GTX 1650 Super 4GB GDDR6',
        gpuId: 'gtx-1650s',
        coolerId: 'ak400',
        fanModelId: 'maxcool-mc5-fan',
        layoutId: 'maxcool-mc5',
        psuName: '450W 80 PLUS Bronze Certified',
        ramName: '16GB (2x8GB) Dual-Channel DDR4 3200MHz',
        storagePrimary: '512GB PCIe 4.0 NVMe M.2 SSD',
        storageSecondary: '1TB High-Performance SATA SSD',
        motherboard: 'Gigabyte B550M DS3H AC WiFi (Micro-ATX • PCIe 4.0 • Wi-Fi + BT)',
        monitor: 'Gigabyte 25" Full HD 200Hz IPS Gaming Monitor',
        description:
          'Balanced engineering and high-efficiency workstation built inside the Maxcool Inferno MC5 chassis. Equipped with AMD Ryzen 5 5600 on Gigabyte B550M DS3H AC WiFi, cooled by DeepCool AK400, 16GB Dual-Channel DDR4 3200MHz, NVIDIA GeForce GTX 1650 Super 4GB GDDR6, 450W Bronze PSU, and a 5-fan chimney array (2 intake, 3 exhaust).'
      }
    ];
  }

  /**
   * Activates a specific PC Rig Preset and applies all associated component configs.
   */
  public selectRigPreset(rigId: PcRigPresetId): void {
    this.activeRigId.set(rigId);
    if (rigId === 'maxcool-mc5') {
      this.appliedLayoutId.set('maxcool-mc5');
      this.stagedLayoutId.set('maxcool-mc5');
      this.selectedCpuId.set('r5-5600');
      this.selectedGpuId.set('gtx-1650s');
      this.selectedCoolerId.set('ak400');
      this.selectedFanModelId.set('maxcool-mc5-fan');
      this.selectedRamId.set('corsair-16gb-3200');
      this.appliedTopRearFan.set('exhaust');
      this.appliedTopFrontFan.set('exhaust');
      this.stagedTopRearFan.set('exhaust');
      this.stagedTopFrontFan.set('exhaust');
      this.flashNotification('Active Rig: Maxcool Inferno MC5 (Ryzen 5 5600 • GTX 1650 Super • B550M WiFi • AK400 • 5 Fans)');
    } else if (rigId === 'deepcool-matrexx40') {
      this.appliedLayoutId.set('matrexx-40');
      this.stagedLayoutId.set('matrexx-40');
      this.selectedCpuId.set('i5-12400');
      this.selectedGpuId.set('r7-360');
      this.selectedCoolerId.set('ag400');
      this.selectedFanModelId.set('deepcool-3fs');
      this.selectedRamId.set('corsair-16gb-3200');
      this.flashNotification('Active Rig: DeepCool MATREXX 40 3FS (i5-12400 • R7 360 • B660M • Samsung 980 PRO)');
    } else {
      this.appliedLayoutId.set('standard-mesh');
      this.stagedLayoutId.set('standard-mesh');
      this.selectedCpuId.set('i5-10400f');
      this.selectedGpuId.set('rtx-3060');
      this.selectedCoolerId.set('ag400');
      this.selectedFanModelId.set('cl6-argb');
      this.selectedRamId.set('corsair-32gb-3200');
      this.flashNotification('Active Rig: darkFlash Leo Studio (i5-10400F • RTX 3060 12GB • 750W Gold)');
    }
  }

  /**
   * Stages a target fan speed profile.
   *
   * @param profile - The target speed profile ('silent', 'balanced', 'turbo')
   */
  public stageSpeedProfile(profile: FanSpeedProfile): void {
    this.stagedSpeedProfile.set(profile);
  }

  /**
   * Applies the staged fan speed profile to the live simulation.
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
   * @param slot - Which top slot to configure.
   * @param direction - Direction mode.
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
   */
  public discardPendingChanges(): void {
    this.stagedTopRearFan.set(this.appliedTopRearFan());
    this.stagedTopFrontFan.set(this.appliedTopFrontFan());
    this.stagedSpeedProfile.set(this.appliedSpeedProfile());
    this.stagedLayoutId.set(this.appliedLayoutId());
    this.flashNotification('Pending configuration changes discarded.');
  }

  /**
   * Sets the currently inspected fan node and updates the active component condition inspection.
   *
   * @param fan - CaseFanNode to inspect or null to deselect.
   */
  public inspectFan(fan: CaseFanNode | null): void {
    this.selectedFan.set(fan);
    if (fan) {
      this.selectedComponentId.set(fan.id);
    }
  }

  /**
   * Selects a specific workstation hardware component.
   *
   * @param componentId - The target component identifier.
   */
  /**
   * Sets the active CPU model and flashes notification.
   *
   * @param id - Target CpuModelId.
   */
  public selectCpu(id: CpuModelId): void {
    this.selectedCpuId.set(id);
    const cpu = this.getCpuOptions().find((c) => c.id === id);
    if (cpu) {
      this.flashNotification(`CPU Selected: ${cpu.name} (${cpu.cores} • ${cpu.tdpWatts}W TDP)`);
    }
  }

  /**
   * Sets the active CPU cooler model and flashes notification.
   *
   * @param id - Target CpuCoolerId.
   */
  public selectCooler(id: CpuCoolerId): void {
    this.selectedCoolerId.set(id);
    const cooler = this.getCoolerOptions().find((c) => c.id === id);
    if (cooler) {
      this.flashNotification(`CPU Cooler Selected: ${cooler.name} (${cooler.coolingCapacityTdp}W Cap)`);
    }
  }

  /**
   * Sets the active GPU model (RTX 3060 vs GTX 1650) and flashes notification.
   *
   * @param id - Target GpuModelId.
   */
  public selectGpu(id: GpuModelId): void {
    this.selectedGpuId.set(id);
    const gpu = this.getGpuOptions().find((g) => g.id === id);
    if (gpu) {
      this.flashNotification(`GPU Selected: ${gpu.name} (${gpu.vram} • ${gpu.tdpWatts}W TDP)`);
    }
  }

  /**
   * Sets the active chassis fan model and flashes notification.
   *
   * @param id - Target FanModelId.
   */
  public selectFanModel(id: FanModelId): void {
    this.selectedFanModelId.set(id);
    const fan = this.getFanModelOptions().find((f) => f.id === id);
    if (fan) {
      this.flashNotification(`Chassis Fans Selected: ${fan.name}`);
    }
  }

  /**
   * Selects active RAM module configuration.
   *
   * @param id - RamOptionId identifier.
   */
  public selectRam(id: RamOptionId): void {
    this.selectedRamId.set(id);
    const ram = this.getRamOptions().find((r) => r.id === id);
    if (ram) {
      this.flashNotification(`System Memory Configured: ${ram.name}`);
    }
  }

  public selectComponent(componentId: string): void {
    this.selectedComponentId.set(componentId);
    const layout = this.getAirflowLayouts().find((l) => l.id === this.appliedLayoutId());
    if (layout) {
      const matchedFan = layout.fans.find((f: CaseFanNode) => f.id === componentId);
      this.selectedFan.set(matchedFan ?? null);
    }
  }

  /**
   * Toggles the visibility of thermal zones on the chassis diagram.
   */
  public toggleThermalZones(): void {
    this.showThermalZones.update((current: boolean) => !current);
  }

  /**
   * Toggles the visibility of animated airflow streamlines.
   */
  public toggleAirflowStreams(): void {
    this.showAirflowStreams.update((current: boolean) => !current);
  }

  /**
   * Displays a flash confirmation notification for 4.5 seconds.
   *
   * @param message - Notification text to show.
   */
  public flashNotification(message: string): void {
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
   * Retrieves the detailed hardware specifications for the user's build.
   *
   * @returns Array of WorkstationComponentSpec representing all build components.
   */
  public getWorkstationSpecs(): Array<WorkstationComponentSpec> {
    if (this.activeRigId() === 'maxcool-mc5') {
      return [
        {
          name: 'Processor (CPU)',
          category: 'cpu',
          model: 'AMD Ryzen 5 5600',
          brand: 'AMD',
          icon: 'fa-microchip',
          badge: '6C / 12T • 4.40 GHz Boost',
          accentColor: '#f97316',
          details: [
            { label: 'Architecture', value: 'Zen 3 (Vermeer 7nm TSMC)' },
            { label: 'Cores / Threads', value: '6 Cores / 12 Threads' },
            { label: 'Base Clock', value: '3.50 GHz' },
            { label: 'Max Boost Clock', value: '4.40 GHz' },
            { label: 'L3 Cache', value: '32 MB Unified L3 Cache' },
            { label: 'TDP / Socket Power', value: '65W Base / 76W Max Package Power' },
            { label: 'Socket', value: 'Socket AM4' },
            { label: 'PCIe Support', value: 'PCIe 4.0 (24 Lanes Total)' }
          ],
          features: [
            'Zen 3 single-CCD architecture with unified 32MB L3 cache eliminating cross-core latency',
            'Simultaneous Multi-Threading (SMT) for 12 parallel execution threads',
            'Precision Boost 2 dynamically scales clock speeds based on AK400 thermal headroom',
            'Ultra-low 65W TDP package ensures cool operating thermals (<62°C) under sustained compilation'
          ],
          roleInThermal: 'High-efficiency 65W thermal load directly aligned with DeepCool AK400 and rear exhaust fan corridor.'
        },
        {
          name: 'Motherboard',
          category: 'motherboard',
          model: 'B550M DS3H AC WiFi',
          brand: 'Gigabyte',
          icon: 'fa-chess-board',
          badge: 'Micro-ATX • PCIe 4.0 • Wi-Fi + BT',
          accentColor: '#ec4899',
          details: [
            { label: 'Form Factor', value: 'Micro-ATX (244 x 244 mm)' },
            { label: 'CPU Socket', value: 'AMD AM4 (Ryzen 5000 / 4000 / 3000 Series)' },
            { label: 'Power Delivery', value: '5+3 Phases Pure Digital VRM with Low RDS(on) MOSFETs' },
            { label: 'Primary PCIe Slot', value: '1x PCIe 4.0 x16 Ultra Durable Steel Slot' },
            { label: 'Storage Interface', value: 'Dual NVMe M.2 (1x PCIe 4.0 x4 + 1x PCIe 3.0 x2) + 4x SATA 6Gb/s' },
            { label: 'Wireless Connectivity', value: 'Intel Dual Band 802.11ac Wi-Fi + Bluetooth 4.2' },
            { label: 'Networking', value: 'Realtek GbE Gaming LAN with Bandwidth Management' }
          ],
          features: [
            'PCIe 4.0 x16 slot unlocks full bandwidth for high-speed GPUs and accelerators',
            'Dual NVMe M.2 slots for ultrafast Gen4 OS boot and secondary storage',
            'Onboard Intel Dual-Band 802.11ac Wi-Fi and Bluetooth 4.2 for versatile wireless setups',
            'Q-Flash Plus allows BIOS updating without installing CPU, memory, or GPU',
            'Smart Fan 5 with multi-zone temperature sensors and hybrid fan headers'
          ],
          roleInThermal: 'Low RDS(on) MOSFETs cooled by continuous downward and horizontal air wash from front intake and top exhaust.'
        },
        {
          name: 'CPU Cooler',
          category: 'cooler',
          model: 'AK400 Performance Air Cooler',
          brand: 'DeepCool',
          icon: 'fa-snowflake',
          badge: '4 Heatpipes • FDB Fan • 220W TDP',
          accentColor: '#06b6d4',
          details: [
            { label: 'Cooler Type', value: 'Single-Tower Heatsink with Matrix Fin Stack' },
            { label: 'Heatpipes', value: '4x Ø6mm Direct-Touch Copper Heatpipes' },
            { label: 'Cooling Capacity', value: 'Up to 220W TDP Heat Dissipation' },
            { label: 'Included Fan', value: '1x 120mm Fluid Dynamic Bearing (FDB) PWM Fan' },
            { label: 'Fan Speed', value: '500 ~ 1,850 RPM ±10%' },
            { label: 'Airflow Output', value: 'Up to 66.47 CFM' },
            { label: 'Noise Ceiling', value: '≤ 29.0 dBA (Ultra-Quiet FDB Bearing)' },
            { label: 'RAM Clearance', value: '100% Unobstructed RAM Slot Access' }
          ],
          features: [
            'Distinctive matrix fin array accelerates laminar airflow through the fin stack',
            'Premium checkerboard decorative top cover gives a clean modern aesthetic',
            'Fluid Dynamic Bearing (FDB) fan maximizes longevity and minimizes motor hum',
            'Asymmetrical heatpipe layout guarantees zero overhang over motherboard RAM slots'
          ],
          roleInThermal: 'Direct-touch copper heatpipes swiftly pull heat from Ryzen 5 5600, pushing it straight toward the rear exhaust.'
        },
        {
          name: 'Dedicated Graphics (GPU)',
          category: 'gpu',
          model: 'GeForce GTX 1650 Super 4GB GDDR6',
          brand: 'NVIDIA',
          icon: 'fa-gamepad',
          badge: '4GB GDDR6 • 1280 Cores • 100W',
          accentColor: '#10b981',
          details: [
            { label: 'Architecture', value: 'NVIDIA Turing (TU116 Die, 12nm TSMC)' },
            { label: 'CUDA Cores', value: '1,280 CUDA Cores (+43% over GTX 1650 non-super)' },
            { label: 'VRAM Capacity', value: '4 GB GDDR6' },
            { label: 'Memory Bus & Speed', value: '128-bit Bus Width • 12 Gbps (192 GB/s Bandwidth)' },
            { label: 'Base / Boost Clock', value: '1,530 MHz / 1,725 MHz Boost' },
            { label: 'Power Consumption', value: '100W TDP' },
            { label: 'Power Connector', value: '1x 6-Pin PCIe Power Cable' },
            { label: 'Cooling Design', value: 'Dual Axial Fans with Direct Copper Heatpipes' }
          ],
          features: [
            'Turing NVENC hardware video encoder delivering broadcast-quality streaming and encoding',
            'Upgraded GDDR6 memory providing 192 GB/s memory bandwidth (+50% vs GTX 1650 GDDR5)',
            'Efficient 100W power draw leaves massive +240W headroom on the 450W Bronze PSU',
            'Compact dual-slot footprint promotes unobstructed front-to-back chassis circulation'
          ],
          roleInThermal: 'Dual axial fans draw fresh air from lower front intake and discharge warm plume into top and rear exhaust flow.'
        },
        {
          name: 'System Memory (RAM)',
          category: 'ram',
          model: '16GB (2x 8GB) DDR4 3200MHz CL16',
          brand: 'High-Performance Kit',
          icon: 'fa-memory',
          badge: '16GB (2x8GB) • 3200MHz CL16',
          accentColor: '#818cf8',
          details: [
            { label: 'Capacity', value: '16 GB (2x 8GB Dual-Channel Kit)' },
            { label: 'Speed / Frequency', value: 'DDR4 3200 MHz (PC4-25600)' },
            { label: 'Tested Latency', value: 'CL16 (16-18-18-36)' },
            { label: 'Operating Voltage', value: '1.35V' },
            { label: 'Infinity Fabric Match', value: '1:1 Ratio with AMD FCLK at 1,600 MHz' },
            { label: 'Form Factor', value: 'Low-Profile Anodized Aluminum Heatsink' }
          ],
          features: [
            'Dual-channel configuration delivers 51.2 GB/s memory bandwidth to the Ryzen 5 5600',
            '1:1 coupled mode with AMD Infinity Fabric minimizes memory controller latency',
            'Anodized aluminum heat spreaders ensure reliable heat dissipation under prolonged tasks',
            'Full physical clearance under the DeepCool AK400 heatsink'
          ],
          roleInThermal: 'Heatsinks radiate memory heat directly into the front intake air stream before rising to the top exhaust fans.'
        },
        {
          name: 'Primary Storage (SSD)',
          category: 'storage',
          model: '512GB PCIe 4.0 NVMe M.2 SSD',
          brand: 'High-Speed Gen4 NVMe',
          icon: 'fa-bolt',
          badge: 'PCIe 4.0 NVMe • Up to 5,000 MB/s',
          accentColor: '#14b8a6',
          details: [
            { label: 'Form Factor', value: 'M.2 2280 NVMe' },
            { label: 'Interface', value: 'PCIe Gen 4.0 x4, NVMe 1.4' },
            { label: 'Sequential Read', value: 'Up to 5,000 MB/s' },
            { label: 'Sequential Write', value: 'Up to 3,600 MB/s' },
            { label: 'NAND Flash', value: '3D TLC NAND Flash' },
            { label: 'Primary Use', value: 'OS Boot, Development IDEs, Docker Images & Node Modules' }
          ],
          features: [
            'High-bandwidth PCIe 4.0 interface directly wired to Ryzen 5 5600 CPU lanes',
            'Sub-second boot times, instant application launches, and fast Git repository indexing',
            'Advanced thermal throttling protection and active wear leveling algorithms'
          ],
          roleInThermal: 'Directly cooled by the intake air stream from the front upper 120mm ARGB fan.'
        },
        {
          name: 'Secondary Storage (SSD)',
          category: 'storage',
          model: '1TB High-Performance SATA SSD',
          brand: 'High-End Solid State Drive',
          icon: 'fa-hard-drive',
          badge: '1 TB • SATA III 6Gb/s • Silent',
          accentColor: '#0ea5e9',
          details: [
            { label: 'Storage Capacity', value: '1,000 GB (1 TB)' },
            { label: 'Interface', value: 'SATA III 6.0 Gb/s' },
            { label: 'Sequential Read', value: 'Up to 550 MB/s' },
            { label: 'Sequential Write', value: 'Up to 520 MB/s' },
            { label: 'Acoustics', value: '0.0 dBA (Completely Silent Solid-State Operation)' },
            { label: 'Primary Use', value: 'Project Archives, Virtual Machine Volumes & Media Assets' }
          ],
          features: [
            'Massive 1TB secondary storage pool with zero rotational motor noise or vibration',
            'Instant random 4K read/write access for fast database reads and build caching',
            'Sturdy 2.5-inch metal enclosure mounted neatly in the chassis storage bay'
          ],
          roleInThermal: 'Consumes less than 2.5W, generating near-zero thermal load inside the lower chassis.'
        },
        {
          name: 'Power Supply (PSU)',
          category: 'psu',
          model: '450W 80 PLUS Bronze Certified',
          brand: 'High-Efficiency PSU',
          icon: 'fa-bolt',
          badge: '450W • 80 PLUS Bronze',
          accentColor: '#eab308',
          details: [
            { label: 'Continuous Output', value: '450 Watts Continuous Power Delivery' },
            { label: 'Efficiency Rating', value: '80 PLUS Bronze Certified (Up to 85% Efficiency)' },
            { label: 'Cooling Solution', value: '120mm Ultra-Quiet Temperature-Controlled Hydraulic Fan' },
            { label: 'Dedicated PCIe Power', value: '1x 6+2 Pin PCIe Connector (Powers GTX 1650 Super)' },
            { label: 'CPU EPS Delivery', value: '1x 8-Pin (4+4) EPS 12V Solid Pin Delivery' },
            { label: 'System Peak Draw', value: '~200W Peak Load (~250W PSU Safety Margin)' },
            { label: 'Protection Suite', value: 'OVP, UVP, OPP, SCP, OCP' }
          ],
          features: [
            'Exceptional efficiency curve: operating at 45-50% load sweet spot for maximum electrical efficiency',
            'Over 240W of power headroom ensures cool, quiet fan curves even under full CPU + GPU load',
            'Full circuit protection suite safeguards all connected components against power surges',
            'Dedicated lower chamber mounting prevents PSU heat from entering the upper motherboard zone'
          ],
          roleInThermal: 'Draws independent cool air from the chassis bottom dust filter and exhausts out the rear.'
        },
        {
          name: 'PC Chassis (Case)',
          category: 'case',
          model: 'Maxcool Inferno MC5 High-Airflow',
          brand: 'Maxcool',
          icon: 'fa-box',
          badge: '5 Fans • Mesh Front • Chimney Exhaust',
          accentColor: '#f43f5e',
          details: [
            { label: 'Chassis Dimensions', value: '380 x 200 x 450 mm (Mid-Tower)' },
            { label: 'Materials', value: 'SPCC Steel Chassis + High-Permeability Front Mesh + Tempered Glass' },
            { label: 'Fan Configuration', value: '5 Fans Total (2 Front Intake + 1 Rear Exhaust + 2 Top Exhaust)' },
            { label: 'Front Fan Mounts', value: '2x 120mm ARGB Fans (Pre-installed Intake)' },
            { label: 'Rear Fan Mount', value: '1x 120mm ARGB Fan (Pre-installed Exhaust)' },
            { label: 'Top Fan Mounts', value: '2x 120mm ARGB Fans (Pre-installed Chimney Exhaust)' },
            { label: 'Dust Filtration', value: 'Top Magnetic Dust Filter + Bottom PSU Removable Filter' },
            { label: 'Clearances', value: 'GPU: Up to 320mm • CPU Cooler: Up to 165mm • PSU: Up to 160mm' }
          ],
          features: [
            'Full 5-fan layout provides rapid chimney air extraction, pulling rising hot air straight up and out',
            'High-permeability front mesh panel maximizes fresh cold air intake for CPU and GPU',
            'Edge-to-edge tempered glass side panel provides complete view of the interior and components',
            'Top magnetic dust filter allows high exhaust airflow while protecting internals when powered down'
          ],
          roleInThermal: 'Dual front intake fans supply cold air, while triple exhaust fans (1 rear + 2 top) create swift vertical chimney extraction.'
        },
        {
          name: 'Chassis Fans & Aerodynamics',
          category: 'fans',
          model: 'Maxcool Inferno 120mm ARGB 5-Fan Array',
          brand: 'Maxcool',
          icon: 'fa-fan',
          badge: '5x 120mm ARGB • 2 In / 3 Out',
          accentColor: '#06b6d4',
          details: [
            { label: 'Fan Count & Size', value: '5x 120mm Hydraulic Bearing ARGB Fans' },
            { label: 'Arrangement', value: '2 Front Intake • 1 Rear Exhaust • 2 Top Chimney Exhaust' },
            { label: 'Intake CFM', value: '104 CFM (2x 52 CFM Front Fans)' },
            { label: 'Exhaust CFM', value: '132 CFM (52 CFM Rear + 2x 40 CFM Top)' },
            { label: 'CFM Differential', value: '-28 CFM (High Heat Extraction Chimney Flow)' },
            { label: 'Fan Speed', value: '600 ~ 1,500 RPM ±10%' },
            { label: 'Acoustics', value: '21.0 ~ 24.5 dBA (Quiet Studio Acoustic Profile)' }
          ],
          features: [
            'Synchronized ARGB lighting rings with dynamic motherboard header illumination',
            'Curved aerodynamic fan blades optimized for steady static pressure through chassis mesh',
            'Chimney flow architecture prevents GPU hot air pockets from forming above the PCIe slot',
            'Quiet operation at balanced speeds maintaining optimal developer focus'
          ],
          roleInThermal: 'Rapidly exhausts thermal energy rising off the DeepCool AK400 and GTX 1650 Super.'
        },
        {
          name: 'Display & Workspace',
          category: 'gpu',
          model: 'Gigabyte 25" 200Hz IPS Gaming Display',
          brand: 'Gigabyte',
          icon: 'fa-tv',
          badge: '25" 200Hz • 1ms MPRT • SuperSpeed IPS',
          accentColor: '#38bdf8',
          details: [
            { label: 'Panel Size / Type', value: '25-Inch SuperSpeed (SS) IPS Panel' },
            { label: 'Resolution', value: 'Full HD 1920 x 1080 Pixels' },
            { label: 'Refresh Rate', value: '200 Hz Ultra-High Refresh Rate (0.5ms GTG / 1ms MPRT)' },
            { label: 'Color Gamut', value: '125% sRGB / 90% DCI-P3 Wide Color Spectrum' },
            { label: 'Sync Technology', value: 'AMD FreeSync Premium & NVIDIA G-Sync Compatible' },
            { label: 'Ergonomics', value: 'Tilt Adjustment with Eye Safe Low Blue Light & Flicker-Free' }
          ],
          features: [
            '200Hz ultra-fluid refresh rate ensures buttery-smooth cursor tracking and IDE scrolling',
            'SuperSpeed IPS technology delivers vibrant, accurate colors for front-end design and UI work',
            'Full HD resolution is the native sweet-spot match for the NVIDIA GTX 1650 Super',
            'Flicker-free and low blue light certification reduces fatigue during prolonged dev sessions'
          ],
          roleInThermal: 'External display: operates on independent DC power outside the chassis thermal perimeter.'
        }
      ];
    }
    if (this.activeRigId() === 'deepcool-matrexx40') {
      return [
        {
          name: 'Processor (CPU)',
          category: 'cpu',
          model: 'Core i5-12400 12th Gen',
          brand: 'Intel',
          icon: 'fa-microchip',
          badge: '6 P-Cores / 12 Threads • 4.40 GHz',
          accentColor: '#0284c7',
          details: [
            { label: 'Architecture', value: 'Alder Lake (Intel 7 Process)' },
            { label: 'Cores / Threads', value: '6 Golden Cove P-Cores / 12 Threads' },
            { label: 'Base Clock', value: '2.50 GHz' },
            { label: 'Max Turbo Frequency', value: '4.40 GHz' },
            { label: 'Smart Cache', value: '18 MB Intel Smart Cache' },
            { label: 'TDP / Power', value: '65W Base / 117W Max Turbo' },
            { label: 'Socket', value: 'LGA 1700' },
            { label: 'PCIe Support', value: 'PCIe 5.0 & PCIe 4.0 lanes' }
          ],
          features: [
            '6 Golden Cove performance microarchitecture cores with high single-thread IPC',
            'Hyper-Threading enabled for 12 parallel threads ideal for multi-tasking and compilation',
            '18MB large Intel Smart Cache reducing memory access latency',
            'Low 65W base power footprint ensuring cool, whisper-quiet system operation'
          ],
          roleInThermal: 'High-IPC 65W base operating envelope; thermal dissipation routes directly out through rear exhaust fan.'
        },
        {
          name: 'Motherboard',
          category: 'motherboard',
          model: 'B660M DS3H DDR4',
          brand: 'Gigabyte',
          icon: 'fa-chess-board',
          badge: 'Micro-ATX • PCIe 4.0 • 2.5GbE',
          accentColor: '#ec4899',
          details: [
            { label: 'Form Factor', value: 'Micro-ATX (244 x 244 mm)' },
            { label: 'CPU Socket', value: 'LGA 1700 (12th / 13th / 14th Gen Intel)' },
            { label: 'Power Phases', value: '6+2+1 Phases Hybrid Digital VRM with Heatsink' },
            { label: 'Primary PCIe Slot', value: '1x PCIe 4.0 x16 Steel Armor Slot' },
            { label: 'Storage Interface', value: 'Dual PCIe 4.0 x4 M.2 Slots (Thermal Guard) + 4x SATA 6Gb/s' },
            { label: 'Networking', value: 'Fast 2.5 GbE Gaming LAN (Realtek)' },
            { label: 'Connectivity', value: 'USB 3.2 Gen 2 Type-C (10Gbps), DisplayPort, HDMI' }
          ],
          features: [
            'PCIe 4.0 x16 slot unlocks full graphics card and PCIe device throughput',
            'Dual ultra-fast PCIe 4.0 M.2 slots for high-speed NVMe storage',
            'Smart Fan 6 with hybrid fan headers and multi-point temperature sensors',
            'High-end audio capacitors with dedicated audio noise guard'
          ],
          roleInThermal: 'Extended aluminum heatsinks over the 6+2+1 VRM phases cooled by direct airflow from the front middle fan.'
        },
        {
          name: 'System Memory (RAM)',
          category: 'ram',
          model: 'Vengeance LPX 16GB (2x 8GB) DDR4',
          brand: 'Corsair',
          icon: 'fa-memory',
          badge: '16GB (2x8GB) • 3200MHz CL16',
          accentColor: '#818cf8',
          details: [
            { label: 'Capacity', value: '16 GB (2x 8GB Dual-Channel Kit)' },
            { label: 'Speed / Frequency', value: 'DDR4 3200 MHz (PC4-25600)' },
            { label: 'Tested Latency', value: 'CL16 (16-20-20-38)' },
            { label: 'Tested Voltage', value: '1.35V' },
            { label: 'Form Factor', value: 'Low-Profile (34mm height, 100% cooler clearance)' },
            { label: 'XMP Support', value: 'Intel XMP 2.0 Automatic Overclocking' }
          ],
          features: [
            'Pure aluminum low-profile heat spreaders for rapid thermal dissipation',
            'Custom high-performance PCB for exceptional signal integrity and stability',
            'Dual-channel configuration delivering 51.2 GB/s peak memory throughput',
            'Compact 34mm height fits comfortably under any air cooler or front fan'
          ],
          roleInThermal: 'Anodized aluminum heat spreaders radiate heat into the direct intake stream from Front Middle Fan.'
        },
        {
          name: 'Primary Storage (SSD)',
          category: 'storage',
          model: '980 PRO 250GB PCIe 4.0 NVMe M.2 SSD',
          brand: 'Samsung',
          icon: 'fa-bolt',
          badge: 'PCIe 4.0 NVMe • Up to 6,400 MB/s',
          accentColor: '#14b8a6',
          details: [
            { label: 'Form Factor', value: 'M.2 2280 NVMe' },
            { label: 'Interface', value: 'PCIe Gen 4.0 x4, NVMe 1.3c' },
            { label: 'Sequential Read', value: 'Up to 6,400 MB/s' },
            { label: 'Sequential Write', value: 'Up to 2,700 MB/s' },
            { label: 'SSD Controller', value: 'Samsung In-House Elpis (8nm Controller)' },
            { label: 'Thermal Shielding', value: 'Nickel-Coated Controller + Heat Spreader Label' },
            { label: 'NAND Flash', value: 'Samsung V-NAND 3-bit MLC' },
            { label: 'Endurance Rating', value: '150 TBW' }
          ],
          features: [
            'Next-generation PCIe 4.0 throughput doubling standard PCIe 3.0 transfer rates',
            'Custom Samsung Elpis controller with nickel coating for enhanced heat dissipation',
            'Dynamic Thermal Guard technology maintains optimal operating temperatures',
            'Lightning-fast OS boot times, sub-second IDE launches, and instant project loading'
          ],
          roleInThermal: 'Nickel-coated controller transfers heat directly into the front intake air stream, preventing thermal throttling.'
        },
        {
          name: 'Secondary Storage (HDD)',
          category: 'storage',
          model: '2TB High-Capacity Hard Drive',
          brand: 'High-Reliability Mechanical Drive',
          icon: 'fa-hard-drive',
          badge: '2 TB • 7200 RPM • SATA 6Gb/s',
          accentColor: '#0ea5e9',
          details: [
            { label: 'Storage Capacity', value: '2,000 GB (2 TB)' },
            { label: 'Interface', value: 'SATA III 6.0 Gb/s' },
            { label: 'Rotational Speed', value: '7200 RPM' },
            { label: 'Cache Buffer', value: '256 MB High-Speed Multi-Tiered Cache' },
            { label: 'Drive Form Factor', value: '3.5-inch Internal Hard Drive' },
            { label: 'Primary Use', value: 'Bulk Data Archiving, Virtual Machines & Datasets' }
          ],
          features: [
            'Massive 2TB secondary volume for large database dumps, project archives, and backups',
            'Direct high-speed SATA 6Gb/s interface to the Gigabyte B660M motherboard',
            'Anti-vibration mount inside the lower MATREXX 40 drive cage'
          ],
          roleInThermal: 'Located in the lower PSU shroud compartment, directly cooled by the Front Bottom intake fan.'
        },
        {
          name: 'Graphics Card (GPU)',
          category: 'gpu',
          model: 'Radeon R7 360 2GB GDDR5',
          brand: 'AMD',
          icon: 'fa-gamepad',
          badge: '2GB GDDR5 • 100W • 1x 6-Pin PCIe',
          accentColor: '#f43f5e',
          details: [
            { label: 'Architecture', value: 'AMD Graphics Core Next (GCN 2.0 / Tobago XT)' },
            { label: 'Stream Processors', value: '768 Stream Processors (12 Compute Units)' },
            { label: 'VRAM Capacity', value: '2 GB GDDR5' },
            { label: 'Memory Interface', value: '128-bit Bus Width (104 GB/s Bandwidth)' },
            { label: 'Engine Clock', value: '1,050 MHz' },
            { label: 'Power Consumption', value: '100W TDP' },
            { label: 'Auxiliary Power', value: '1x 6-Pin PCIe Power Connector' },
            { label: 'Display Outputs', value: 'DisplayPort 1.2, HDMI 1.4a, Dual-Link DVI-I' }
          ],
          features: [
            'Hardware video acceleration (VCE) for hardware-accelerated video decoding',
            'DirectX 12, Vulkan, and OpenGL 4.5 API support',
            'Full support for AMD FreeSync on the ASUS VA249HG 120Hz IPS display',
            'Compact dual-slot design leaving massive open volume for unrestricted front-to-back chassis airflow'
          ],
          roleInThermal: 'Single axial fan draws fresh air from the lower chamber and discharges ~100W heat plume toward the rear exhaust.'
        },
        {
          name: 'Power Supply (PSU)',
          category: 'psu',
          model: 'Corsair CV650 (650 Watts)',
          brand: 'Corsair',
          icon: 'fa-bolt',
          badge: '650W • 80 PLUS Bronze',
          accentColor: '#eab308',
          details: [
            { label: 'Continuous Output', value: '650 Watts Continuous Power' },
            { label: 'Efficiency Rating', value: '80 PLUS Bronze Certified (Up to 88% Efficiency)' },
            { label: 'Cooling Solution', value: '120mm Low-Noise Thermally Controlled Fan' },
            { label: 'Enclosure Length', value: 'Compact 125mm length for easy cable routing' },
            { label: 'Single +12V Rail', value: 'Up to 52A (624W Dedicated Power)' },
            { label: 'Protection Suite', value: 'OVP, UVP, SCP, OPP, OTP' }
          ],
          features: [
            'Guaranteed continuous power delivery for rock-solid system stability',
            '120mm thermally controlled fan remains quiet under low-to-moderate productivity loads',
            'Black sleeved cables and black powder-coated casing match modern chassis aesthetics',
            'Compact 125mm casing fits comfortably inside the MATREXX 40 shroud with ample room for HDD cables'
          ],
          roleInThermal: 'Draws fresh air from the bottom dust-filtered case vent and exhausts out the rear, operating in a separate thermal zone.'
        },
        {
          name: 'PC Chassis (Case)',
          category: 'case',
          model: 'DeepCool MATREXX 40 3FS Mid-Tower',
          brand: 'DeepCool',
          icon: 'fa-box',
          badge: '3FS Tri-Color • Mesh Airflow',
          accentColor: '#06b6d4',
          details: [
            { label: 'Chassis Dimensions', value: '400 x 215 x 431 mm (Micro-ATX / Mini-ITX)' },
            { label: 'Materials', value: 'SPCC Steel + ABS Plastic + Tempered Glass (Side Panel)' },
            { label: 'Pre-installed Fans', value: '3x 120mm Tri-Color LED Fans (2 Front + 1 Rear)' },
            { label: 'Total Fan Capacity', value: 'Up to 6x 120mm / 4x 140mm Fans' },
            { label: 'Front Fan Mounts', value: '3x 120mm / 2x 140mm (Pre-installed with 2x 120mm 3FS Fans)' },
            { label: 'Top Fan Mounts', value: '2x 120mm / 2x 140mm (Magnetic Dust Filter)' },
            { label: 'Rear Fan Mount', value: '1x 120mm (Pre-installed with 1x 120mm 3FS Fan)' },
            { label: 'Clearances', value: 'GPU Length: 320mm • CPU Cooler Height: 165mm • PSU: 160mm' },
            { label: 'Dust Filtration', value: 'Top Magnetic Mesh + Bottom PSU Dust Filter' }
          ],
          features: [
            'High-permeability front mesh panel with dual-side ventilation slits for massive intake airflow',
            'Factory pre-installed with 3x 120mm Tri-Color LED fans producing vibrant lighting with zero RGB controller needed',
            'Edge-to-edge tempered glass side panel showcasing the internal components',
            'Optimized Micro-ATX chassis volume ensuring dense, rapid front-to-back laminar air displacement'
          ],
          roleInThermal: 'Encloses the Micro-ATX thermal chamber; geometric front mesh provides cold intake while the PSU shroud routes lower air to the HDD and PSU.'
        },
        {
          name: 'Cooling & Case Fans',
          category: 'fans',
          model: 'DeepCool 3FS Tri-Color Array (2 Front + 1 Rear + 2 Top Slots)',
          brand: 'DeepCool 3FS Series',
          icon: 'fa-wind',
          badge: '3x 120mm Pre-installed (Expandable to 6)',
          accentColor: '#10b981',
          details: [
            { label: 'Front Middle Intake', value: '1x 120mm Tri-Color LED Fan (Feeds CPU & GPU)' },
            { label: 'Front Bottom Intake', value: '1x 120mm Tri-Color LED Fan (Feeds GPU & HDD/PSU)' },
            { label: 'Rear Exhaust', value: '1x 120mm Tri-Color LED Fan (Active Evacuation)' },
            { label: 'Top Rear Mount', value: '1x 120mm Optional Fan Slot (Magnetic Mesh)' },
            { label: 'Top Front Mount', value: '1x 120mm Optional Fan Slot (Magnetic Mesh)' },
            { label: 'Current Intake CFM', value: '~104 CFM (2x 120mm @ 1200 RPM)' },
            { label: 'Current Exhaust CFM', value: '~52 CFM (1x 120mm @ 1200 RPM)' },
            { label: 'Net Chamber Pressure', value: '+52 CFM (Strong Positive Pressure)' }
          ],
          features: [
            '2 Front intake fans deliver focused, pressurized cold air directly through the front mesh',
            'Generates natural positive pressure preventing dust infiltration through unfiltered rear expansion slots',
            'Tri-Color LED illumination provides dynamic aesthetic glow without requiring software bloatware',
            'Expandable top panel supports 2 supplementary 120mm/140mm exhaust fans or 240mm liquid AIO'
          ],
          roleInThermal: 'Drives linear front-to-back convection, sweeping cool ambient air across the B660M VRMs, 980 PRO NVMe, i5-12400, and R7 360.'
        },
        {
          name: 'Display & Input Peripherals',
          category: 'fans',
          model: 'ASUS VA249HG 120Hz IPS & Dareu A87 Alpha TKL',
          brand: 'ASUS & Dareu',
          icon: 'fa-desktop',
          badge: '120Hz IPS Eye Care • TKL Mechanical',
          accentColor: '#a855f7',
          details: [
            { label: 'Monitor Screen', value: '23.8-inch Full HD (1920 x 1080) IPS Wide-View Panel' },
            { label: 'Refresh Rate', value: '120Hz Smooth Display (2x standard 60Hz)' },
            { label: 'Response Time', value: '1ms MPRT (Moving Picture Response Time)' },
            { label: 'Eye Care Technology', value: 'TÜV Rheinland-certified Flicker-Free & Low Blue Light' },
            { label: 'Sync Technology', value: 'Adaptive-Sync / FreeSync (Perfect pairing with Radeon R7 360)' },
            { label: 'Mechanical Keyboard', value: 'Dareu A87 Alpha Tenkeyless (TKL) Mechanical Keyboard' },
            { label: 'Keycaps / Switches', value: 'Durable Mechanical Switches with PBT Double-Shot Keycaps' },
            { label: 'Form Factor', value: 'Compact 87-Key Tenkeyless Form Factor maximizing mouse desk space' }
          ],
          features: [
            'Ultra-smooth 120Hz refresh rate creates fluid cursor tracking, code scrolling, and animation testing',
            'IPS panel ensures 178° wide viewing angles and accurate color reproduction for design work',
            'Eye Care filter prevents eye strain during marathon coding and engineering sessions',
            'Dareu A87 mechanical keyboard provides tactile feedback, zero ghosting, and compact desk footprint'
          ],
          roleInThermal: 'Desktop ergonomics: external peripherals draw zero thermal dissipation from the internal PC chassis.'
        }
      ];
    }
    return [
      {
        name: 'Processor (CPU)',
        category: 'cpu',
        model: 'Core i5-10400F 10th Gen',
        brand: 'Intel',
        icon: 'fa-microchip',
        badge: '6C / 12T • 4.30 GHz',
        accentColor: '#0284c7',
        details: [
          { label: 'Architecture', value: 'Comet Lake (14nm)' },
          { label: 'Cores / Threads', value: '6 Cores / 12 Threads' },
          { label: 'Base Clock', value: '2.90 GHz' },
          { label: 'Max Turbo Frequency', value: '4.30 GHz' },
          { label: 'Smart Cache', value: '12 MB Intel Smart Cache' },
          { label: 'TDP / Power', value: '65W (Low thermal load)' }
        ],
        features: [
          'Intel Turbo Boost Technology 2.0',
          'Hyper-Threading enabled for multi-threaded compilation',
          'Excellent thermal efficiency under sustained load',
          'Direct PCIe 3.0 lanes to GPU & NVMe'
        ],
        roleInThermal: 'Generates up to ~65W of heat under full load; dissipates directly into the AG400 copper heatpipes.'
      },
      {
        name: 'CPU Tower Cooler',
        category: 'cooler',
        model: 'AG400 Single-Tower Air Cooler',
        brand: 'DeepCool',
        icon: 'fa-fan',
        badge: '220W TDP • Direct-Touch',
        accentColor: '#38bdf8',
        details: [
          { label: 'Heatpipes', value: '4x Ø6mm Direct-Touch Copper' },
          { label: 'Fan Size', value: '120mm PWM (Hydro Bearing)' },
          { label: 'Fan Speed', value: '500 – 2000 RPM ±10%' },
          { label: 'Max Airflow', value: '75.89 CFM' },
          { label: 'Air Pressure', value: '2.53 mmAq static pressure' },
          { label: 'Noise Level', value: '≤ 31.6 dB(A) at max speed' }
        ],
        features: [
          'Dense matrix fin design for maximum thermal dissipation area',
          'Hydro bearing fan for long lifespan and silent acoustic profile',
          'Inline push airflow directs heat straight to the rear exhaust fan',
          'Offset heatpipe layout ensuring 100% RAM clearance'
        ],
        roleInThermal: 'Pulls incoming cool air from front intake fans, pushes it through aluminum fins, and directs warm air directly to the rear exhaust fan.'
      },
      {
        name: 'Graphics Card (GPU)',
        category: 'gpu',
        model: 'GeForce RTX 3060 12GB (Triple-Fan Edition)',
        brand: 'NVIDIA',
        icon: 'fa-gamepad',
        badge: '12GB GDDR6 • Triple-Fan',
        accentColor: '#10b981',
        details: [
          { label: 'CUDA Cores', value: '3,584 Cores' },
          { label: 'VRAM', value: '12 GB GDDR6 (192-bit)' },
          { label: 'Memory Speed', value: '15 Gbps (360 GB/s bandwidth)' },
          { label: 'Base / Boost Clock', value: '1,320 MHz / 1,777 MHz' },
          { label: 'Thermal Design Power', value: '170W TDP' },
          { label: 'Cooling Solution', value: 'Triple Axial Fans with Flow-Through Upward Airflow' }
        ],
        features: [
          '2nd Gen Ray Tracing Cores & 3rd Gen Tensor Cores',
          'NVIDIA DLSS AI upscaling and acceleration',
          'Generous 12GB VRAM buffer ideal for AI inference and graphic workflows',
          'Triple axial fans draw fresh air from below and push airflow directly upward through heatsink fins',
          'Vented screen backplate directs heated air up toward the rear and top exhaust stream'
        ],
        roleInThermal: 'Triple axial fans pull cool air from the lower chamber and project airflow upward through the heatsink toward top and rear exhaust.'
      },
      {
        name: 'System Memory (RAM)',
        category: 'ram',
        model: '32 GB Dual-Channel DDR4',
        brand: 'High-Performance Kit',
        icon: 'fa-memory',
        badge: '32GB • 3200 MHz',
        accentColor: '#818cf8',
        details: [
          { label: 'Capacity', value: '32 GB (2x 16GB Dual-Channel)' },
          { label: 'Memory Type', value: 'DDR4 SDRAM' },
          { label: 'Tested Frequency', value: '3200 MHz' },
          { label: 'Tested Latency', value: 'CL16 (16-18-18-36)' },
          { label: 'Voltage', value: '1.35V' },
          { label: 'Profile Support', value: 'Intel XMP 2.0 Ready' }
        ],
        features: [
          'Dual-channel configuration doubling effective bandwidth',
          'Ample 32GB headroom for heavy IDEs, Docker, and multi-tasking',
          'Low-profile anodized aluminum heat spreaders for passive cooling',
          'Optimal positioning directly in the front fan intake stream'
        ],
        roleInThermal: 'Receives uninterrupted cool airflow from the top front intake fan for passive heat dissipation.'
      },
      {
        name: 'PC Chassis (Case)',
        category: 'case',
        model: 'darkFlash Leo (Leo TG) ATX Mid-Tower',
        brand: 'darkFlash',
        icon: 'fa-box',
        badge: 'Carbon Armor Iron-Mesh',
        accentColor: '#f59e0b',
        details: [
          { label: 'Chassis Dimensions', value: '349 x 190 x 430 mm (0.5mm SPCC Steel)' },
          { label: 'Front Panel', value: 'Faceted "Carbon Armor" Geometric Iron-Mesh' },
          { label: 'Side Panel', value: '4mm Edge-to-Edge Tempered Glass' },
          { label: 'Total Fan Capacity', value: 'Up to 6x 120mm Fans (3 Front, 2 Top, 1 Rear)' },
          { label: 'Radiator Support', value: 'Front: Up to 240mm Water-Cooling' },
          { label: 'Clearance Limits', value: 'GPU: Max 280mm • CPU Cooler: Max 165mm' },
          { label: 'Drive Bays', value: '2x 3.5" HDD & 2x 2.5" SSD (Under Shroud)' },
          { label: 'Dust Filtration', value: 'Top Magnetic Mesh + Bottom PSU Slide Filter' }
        ],
        features: [
          'Faceted iron-mesh front panel provides high static intake with low acoustic turbulence',
          'Full-length PSU shroud with front pass-through channel cooling the drive cage and PSU',
          'Accommodates up to 2x 120mm top exhaust fans under the top magnetic filter',
          'Wide 165mm CPU cooler clearance comfortably fits the 150mm DeepCool AG400 tower'
        ],
        roleInThermal: 'Encloses the thermal chamber; geometric front mesh provides cold intake pathways while the full shroud routes lower intake directly into the PSU and HDD bays.'
      },
      {
        name: 'Cooling & Case Fans',
        category: 'fans',
        model: 'darkFlash Leo 6-Slot Fan Array (3 Front, 2 Top, 1 Rear)',
        brand: 'High-Static PWM Series',
        icon: 'fa-wind',
        badge: 'Configurable (Up to 6 Fans)',
        accentColor: '#06b6d4',
        details: [
          { label: 'Front Intake Mounts', value: '3x 120mm PWM (Active in Build)' },
          { label: 'Rear Exhaust Mount', value: '1x 120mm PWM (Active in Build)' },
          { label: 'Top Exhaust Mounts', value: '2x 120mm Fan Mounts (Expandable)' },
          { label: 'PSU Ingestion Flow', value: 'Front fan #3 directs cool air into lower PSU shroud' },
          { label: 'Current Intake', value: '~145 CFM (Front 3x 120mm at load)' },
          { label: 'Current Exhaust', value: '~55 CFM (Rear 1x 120mm + Top Convection)' },
          { label: 'Expandable Headroom', value: 'Adding 2x top fans delivers up to ~135 CFM exhaust' }
        ],
        features: [
          'Front Fan #1 feeds cold air into DeepCool AG400 and DDR4 RAM',
          'Front Fan #2 delivers fresh room-temperature air directly to RTX 3060 triple fans',
          'Front Fan #3 delivers high-volume cold air directly into the PSU shroud and HDD bay',
          'Top panel features magnetic dust filter supporting 1 or 2 supplementary 120mm exhaust fans'
        ],
        roleInThermal: 'Front trio delivers 145 CFM of pressurized cold air, dividing between the main CPU/GPU chamber and the lower isolated PSU chamber.'
      },
      {
        name: 'Motherboard',
        category: 'motherboard',
        model: 'Intel B460 / B560 Chipset Board',
        brand: 'Gaming Series',
        icon: 'fa-chess-board',
        badge: 'LGA 1200 • PCIe 3.0/4.0',
        accentColor: '#ec4899',
        details: [
          { label: 'Socket', value: 'LGA 1200' },
          { label: 'Form Factor', value: 'ATX / Micro-ATX' },
          { label: 'PCIe Slots', value: '1x PCIe x16 (Steel Armor), 2x PCIe x1' },
          { label: 'Storage Interface', value: 'Dual M.2 NVMe Slots + 6x SATA III' },
          { label: 'Audio / Network', value: 'Gigabit LAN, 7.1 HD Audio' },
          { label: 'VRM Heatsinks', value: 'Extended Aluminum Heatsinks' }
        ],
        features: [
          'Solid power delivery ensuring stable 65W+ CPU boost states',
          'Heatsink-cooled VRM phases benefiting from AG400 downdraft airflow',
          'Reinforced PCIe slot supporting heavy modern GPUs without sag'
        ],
        roleInThermal: 'VRM circuitry and M.2 shields are cooled by secondary airflow from the top front intake and cooler wake.'
      },
      {
        name: 'Power Supply (PSU)',
        category: 'psu',
        model: '750W 80 Plus Certified',
        brand: 'High-Efficiency Gold/Bronze',
        icon: 'fa-bolt',
        badge: '750W 80+ • Isolated Tunnel',
        accentColor: '#eab308',
        details: [
          { label: 'Wattage', value: '750 Watts Continuous' },
          { label: 'Efficiency Rating', value: '80 PLUS Efficiency (>85% efficiency)' },
          { label: 'Cooling Fan', value: '120mm Low-Noise Fan (Bottom Intake)' },
          { label: 'Thermal Isolation', value: 'Dedicated PSU Shroud with Bottom Filter' },
          { label: 'Safety Protections', value: 'OVP, UVP, OPP, SCP, OCP' }
        ],
        features: [
          'High 750W continuous output providing heavy thermal and electrical stability headroom',
          'Draws cool air from underneath the case and exhausts out the rear',
          'Completely isolated inside the darkFlash Leo lower tunnel from the main CPU/GPU chamber',
          'Benefits from Front Fan #3 direct lower airway airflow'
        ],
        roleInThermal: 'Operates in its own independent thermal loop, not dumping heat into the GPU or CPU zone.'
      },
      {
        name: 'Solid State Drive (Storage)',
        category: 'storage',
        model: '1TB High-Speed NVMe M.2 SSD',
        brand: 'PCIe Gen3 x4',
        icon: 'fa-hard-drive',
        badge: 'NVMe M.2 • Up to 3,500 MB/s',
        accentColor: '#14b8a6',
        details: [
          { label: 'Form Factor', value: 'M.2 2280' },
          { label: 'Interface', value: 'PCIe 3.0 x4, NVMe 1.4' },
          { label: 'Read / Write Speed', value: 'Up to 3,500 MB/s Read / 3,000 MB/s Write' },
          { label: 'Capacity', value: '1,000 GB (1 TB)' },
          { label: 'Endurance', value: '600 TBW' }
        ],
        features: [
          'Near-instant OS boot times and rapid project loading',
          'Direct motherboard slot installation, zero cable clutter in airflow path'
        ],
        roleInThermal: 'Maintains cool operating temperatures via motherboard M.2 shield and direct airflow from front fan #2.'
      },
      {
        name: 'Display & Monitor',
        category: 'case',
        model: 'Gigabyte 25" 200Hz IPS Gaming Monitor',
        brand: 'Gigabyte',
        icon: 'fa-tv',
        badge: '25-Inch • 200Hz Ultra-Fast IPS',
        accentColor: '#38bdf8',
        details: [
          { label: 'Screen Size', value: '25-inch (diagonal) Active Display Area' },
          { label: 'Refresh Rate', value: '200Hz Ultra-High Refresh Rate (3.33x vs standard 60Hz)' },
          { label: 'Resolution', value: 'Full HD (1920 x 1080) 16:9 Aspect Ratio' },
          { label: 'Response Time', value: '1ms Fast Response Time (MPRT)' },
          { label: 'Panel Type', value: 'SuperSpeed IPS (SS IPS) Wide Color Panel' },
          { label: 'Color Gamut', value: '90% DCI-P3 / 120% sRGB Wide Color Spectrum' },
          { label: 'Sync Technology', value: 'AMD FreeSync Premium & G-Sync Compatible (Pairs with RTX 3060)' },
          { label: 'Connectivity', value: 'DisplayPort 1.4 & Dual HDMI 2.0 Inputs' }
        ],
        features: [
          'Ultra-smooth 200Hz refresh rate delivers fluid motion for programming, code navigation, and high-FPS workflows',
          'Fast IPS panel delivers rich 178° viewing angles and wide color fidelity for web & UI development',
          '1ms response time eliminates motion blur and ghosting',
          'G-Sync compatible variable refresh rate matched seamlessly to the RTX 3060 12GB graphics pipeline'
        ],
        roleInThermal: 'External high-refresh display powered via DisplayPort 1.4 directly from the RTX 3060 12GB.'
      }
    ];
  }

  /**
   * Retrieves the available airflow layout models for interactive comparison.
   *
   * @returns Array of AirflowLayout objects.
   */
  public getAirflowLayouts(): Array<AirflowLayout> {
    return [
      {
        id: 'standard-mesh',
        name: 'DarkFlash Leo Setup (Your Build)',
        subtitle: 'Front Mesh Straight-Through High Airflow',
        caseName: 'DarkFlash Leo ATX Mid-Tower',
        pressureType: 'Positive',
        description:
          'Features 3 front 120mm intake fans pulling fresh air through the hexagonal front mesh, direct front-to-back transfer through the DeepCool AG400 tower cooler, and 1 rear 120mm exhaust fan. Generates strong positive air pressure which actively prevents dust from entering through unfiltered gaps.',
        intakeTotalCfm: 145,
        exhaustTotalCfm: 55,
        fans: [
          {
            id: 'front-fan-1',
            name: 'Front Fan 1 (Top)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1250,
            cfm: 48,
            noiseDb: 22,
            description: 'Feeds fresh ambient air directly into the DeepCool AG400 CPU cooler and RAM modules.'
          },
          {
            id: 'front-fan-2',
            name: 'Front Fan 2 (Middle)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1250,
            cfm: 48,
            noiseDb: 22,
            description: 'Provides direct cool air stream to the RTX 3060 triple fans and motherboard chipset.'
          },
          {
            id: 'front-fan-3',
            name: 'Front Fan 3 (Bottom & PSU)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1250,
            cfm: 48,
            noiseDb: 22,
            description: 'Dual-zone intake: supplies cold air to the lower motherboard/PCIe area and feeds directly into the PSU shroud cutout, cooling the 3.5" HDD cage and 750W PSU intake fan.'
          },
          {
            id: 'cpu-cooler-fan',
            name: 'DeepCool AG400 PWM Fan',
            type: 'intake',
            position: 'cpu',
            sizeMm: 120,
            rpm: 1350,
            cfm: 58,
            noiseDb: 24,
            description: 'Forces high static pressure air directly through the 4-heatpipe matrix fin tower toward the rear.'
          },
          {
            id: 'rear-fan-1',
            name: 'Rear Exhaust Fan',
            type: 'exhaust',
            position: 'rear',
            sizeMm: 120,
            rpm: 1300,
            cfm: 55,
            noiseDb: 23,
            description: 'Evacuates heated air exiting the AG400 tower cooler and upper GPU exhaust plume.'
          },
          {
            id: 'leo-top-fan-1',
            name: 'Top Exhaust Fan 1 (Rear-Top)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Installed in top slot #1 under the magnetic filter. Directly exhausts hot rising convection air behind the CPU cooler.'
          },
          {
            id: 'leo-top-fan-2',
            name: 'Top Exhaust Fan 2 (Front-Top)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Installed in top slot #2 under the magnetic filter. Completes the full 6-fan array for accelerated high-load heat evacuation.'
          }
        ],
        advantages: [
          'High positive pressure (+90 CFM margin) keeps dust out through non-filtered case seams',
          'Linear front-to-back laminar flow with zero turbulence or recirculating hot pockets',
          'Front bottom fan actively feeds fresh intake air into the lower PSU shroud and drive bay',
          'Expandable top magnetic mount supports up to 2x 120mm fans for custom thermal tuning',
          'DeepCool AG400 fan perfectly aligned with the rear exhaust fan for immediate heat evacuation'
        ]
      },
      {
        id: 'matrexx-40',
        name: 'DeepCool MATREXX 40 3FS (Your Build)',
        subtitle: 'Micro-ATX Mesh High-Airflow Aerodynamics',
        caseName: 'DeepCool MATREXX 40 3FS Mid-Tower',
        pressureType: 'Positive',
        description:
          'Features 3 pre-installed 120mm Tri-Color LED fans: 2 front intake fans (Front Bottom + Front Middle) pulling fresh cool air through the high-permeability geometric mesh front panel, direct horizontal flow across the Gigabyte B660M DS3H and Intel Core i5-12400, feeding the AMD Radeon R7 360, and 1 rear 120mm exhaust fan. Features 2 optional top 120mm fan positions (Top Rear & Top Front) under a magnetic dust filter.',
        intakeTotalCfm: 104,
        exhaustTotalCfm: 52,
        fans: [
          {
            id: 'matrexx-front-mid',
            name: 'Front Middle Intake Fan (Pre-installed 120mm LED)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Upper front intake: channels fresh cool ambient air directly across the Intel Core i5-12400 CPU heatsink, Corsair Vengeance LPX RAM, and Samsung 980 PRO PCIe 4.0 NVMe SSD.'
          },
          {
            id: 'matrexx-front-bot',
            name: 'Front Bottom Intake Fan (Pre-installed 120mm LED)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Lower front intake: feeds directly into the AMD Radeon R7 360 2GB graphics card intake fan and supplies airflow toward the lower 2TB HDD drive cage and Corsair CV650 PSU compartment.'
          },
          {
            id: 'cpu-cooler-fan',
            name: 'CPU Cooler Fan (Intel Laminar RM1 / AG400)',
            type: 'intake',
            position: 'cpu',
            sizeMm: 120,
            rpm: 1350,
            cfm: 54,
            noiseDb: 23,
            description: 'Direct cooling for the 65W/117W Intel Core i5-12400 6-Core processor, exhausting heat rearward.'
          },
          {
            id: 'matrexx-rear',
            name: 'Rear Exhaust Fan (Pre-installed 120mm LED)',
            type: 'exhaust',
            position: 'rear',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Directly evacuates hot air exiting the CPU socket area and upper GPU backplate plume out of the chassis.'
          },
          {
            id: 'leo-top-fan-1',
            name: 'Top Rear Optional Fan (Slot #1, 120mm)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Top-Rear 120mm optional exhaust mount under the magnetic mesh. Extracts natural convection heat rising off the VRMs and CPU.'
          },
          {
            id: 'leo-top-fan-2',
            name: 'Top Front Optional Fan (Slot #2, 120mm)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Top-Front 120mm optional mount. Can be configured for auxiliary exhaust or downward intake directly over the Corsair Vengeance LPX memory slots.'
          }
        ],
        advantages: [
          'Pre-installed 3x 120mm Tri-Color LED fans provide immediate out-of-the-box positive pressure (+52 CFM net)',
          'Optimized Micro-ATX chassis volume (400 × 215 × 431 mm) ensures dense, efficient front-to-back laminar air movement',
          'Front middle fan delivers direct uninhibited airflow to the Samsung 980 PRO PCIe 4.0 M.2 SSD and B660M VRMs',
          'Dedicated lower intake path prevents the 100W AMD Radeon R7 360 and 2TB HDD from creating heat recirculations',
          'Top magnetic dust filter supports up to 2x 120mm/140mm fans or 240mm liquid cooling radiator'
        ]
      },
      {
        id: 'maxcool-mc5',
        name: 'Maxcool Inferno MC5 (5-Fan Setup)',
        subtitle: 'Dual Front Intake & Triple Chimney Exhaust',
        caseName: 'Maxcool Inferno MC5 High-Airflow Mid-Tower',
        pressureType: 'Negative',
        description:
          'Equipped with 5x 120mm ARGB fans: 2 front intake fans drawing fresh cool air across the AMD Ryzen 5 5600 and GTX 1650 Super, 1 rear exhaust fan, and 2 top exhaust fans creating accelerated vertical chimney heat extraction. Rapidly evacuates rising thermal plumes from the DeepCool AK400 and GPU.',
        intakeTotalCfm: 104,
        exhaustTotalCfm: 132,
        fans: [
          {
            id: 'mc5-front-top',
            name: 'Front Upper Intake Fan (120mm ARGB)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Upper intake fan: channels fresh ambient air directly across the DeepCool AK400 CPU cooler, 16GB DDR4 RAM, and Gigabyte B550M VRMs.'
          },
          {
            id: 'mc5-front-bot',
            name: 'Front Lower Intake Fan (120mm ARGB)',
            type: 'intake',
            position: 'front',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Lower intake fan: delivers cool airflow to the GTX 1650 Super dual axial intake fans and lower 450W PSU shroud.'
          },
          {
            id: 'cpu-cooler-fan',
            name: 'DeepCool AK400 FDB PWM Fan',
            type: 'intake',
            position: 'cpu',
            sizeMm: 120,
            rpm: 1350,
            cfm: 66,
            noiseDb: 24,
            description: 'Fluid Dynamic Bearing (FDB) 120mm fan driving airflow through the 4-heatpipe matrix fin tower toward the rear exhaust.'
          },
          {
            id: 'mc5-rear',
            name: 'Rear Exhaust Fan (120mm ARGB)',
            type: 'exhaust',
            position: 'rear',
            sizeMm: 120,
            rpm: 1200,
            cfm: 52,
            noiseDb: 22,
            description: 'Rapidly exhausts heated air exiting the DeepCool AK400 tower cooler out the back of the chassis.'
          },
          {
            id: 'leo-top-fan-1',
            name: 'Top Rear Exhaust Fan (Slot #1, 120mm ARGB)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Primary chimney exhaust: extracts natural convection heat rising directly above the CPU and motherboard VRM.'
          },
          {
            id: 'leo-top-fan-2',
            name: 'Top Front Exhaust Fan (Slot #2, 120mm ARGB)',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Secondary chimney exhaust: pulls rising warm air above the RAM and upper front intake corridor, accelerating total chamber air exchange.'
          }
        ],
        advantages: [
          'Full 5-fan chimney array accelerates continuous air exchange, dropping VRM and GPU hotspot temps by up to 6°C',
          'DeepCool AK400 matrix fin cooler perfectly aligned with the rear exhaust fan for zero thermal turbulence',
          'Dual front 120mm intake fans deliver dedicated laminar streams to CPU and GPU zones',
          'Dual top exhaust fans prevent rising GPU warm air from lingering inside the upper chassis ceiling',
          'Low total system power draw (~200W peak) allows quiet operation at balanced 1,100-1,200 RPM fan speeds'
        ]
      },
      {
        id: 'dual-chamber',
        name: 'Dual-Chamber / Panoramic (Comparison Mode)',
        subtitle: 'Bottom-to-Top Chimney & Side Intake Flow',
        caseName: 'Panoramic Dual-Chamber Chassis',
        pressureType: 'Positive',
        description:
          'Utilizes bottom intake fans to leverage natural thermal convection (hot air rises), paired with side intake fans and top 360mm exhaust radiator. High visual showcase aesthetic with vertical chimney airflow path.',
        intakeTotalCfm: 180,
        exhaustTotalCfm: 130,
        fans: [
          {
            id: 'side-fan-1',
            name: 'Side Fan 1 (Top)',
            type: 'intake',
            position: 'side',
            sizeMm: 120,
            rpm: 1200,
            cfm: 45,
            noiseDb: 21,
            description: 'Draws cool air from the side panel directly across motherboard and RAM.'
          },
          {
            id: 'side-fan-2',
            name: 'Side Fan 2 (Bottom)',
            type: 'intake',
            position: 'side',
            sizeMm: 120,
            rpm: 1200,
            cfm: 45,
            noiseDb: 21,
            description: 'Feeds fresh air toward CPU cooler and upper GPU backplate.'
          },
          {
            id: 'bottom-fan-1',
            name: 'Bottom Fan 1',
            type: 'intake',
            position: 'bottom',
            sizeMm: 120,
            rpm: 1100,
            cfm: 45,
            noiseDb: 20,
            description: 'Forces cool floor-level air straight up into the graphics card fans.'
          },
          {
            id: 'bottom-fan-2',
            name: 'Bottom Fan 2',
            type: 'intake',
            position: 'bottom',
            sizeMm: 120,
            rpm: 1100,
            cfm: 45,
            noiseDb: 20,
            description: 'Feeds vertical chimney airflow assisting natural heat rise.'
          },
          {
            id: 'top-fan-1',
            name: 'Top Exhaust Fan 1',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 45,
            noiseDb: 21,
            description: 'Expels hot rising air through top ventilation grille.'
          },
          {
            id: 'top-fan-2',
            name: 'Top Exhaust Fan 2',
            type: 'exhaust',
            position: 'top',
            sizeMm: 120,
            rpm: 1200,
            cfm: 45,
            noiseDb: 21,
            description: 'Expels thermal exhaust from CPU zone out through the ceiling.'
          },
          {
            id: 'rear-fan-dc',
            name: 'Rear Exhaust Fan',
            type: 'exhaust',
            position: 'rear',
            sizeMm: 120,
            rpm: 1200,
            cfm: 40,
            noiseDb: 21,
            description: 'Assists horizontal air evacuation behind the CPU socket.'
          }
        ],
        advantages: [
          'Vertical chimney effect works naturally with thermal physics',
          'Direct perpendicular airflow into GPU cooling intake',
          'Glass front and side panels offer 180° visual presentation'
        ]
      }
    ];
  }

  /**
   * Retrieves fan speed presets (silent, balanced, turbo) with simulated acoustic and thermal stats.
   *
   * @returns Array of FanSpeedConfig objects.
   */
  public getSpeedProfiles(): Array<FanSpeedConfig> {
    return [
      {
        profile: 'silent',
        label: 'Silent / Idle',
        icon: 'fa-feather',
        multiplier: 0.65,
        intakeRpm: 800,
        exhaustRpm: 850,
        cpuRpm: 900,
        noiseLevel: '18.4 dB(A) • Whisper Quiet',
        ambientTempC: 25,
        cpuTempC: 38,
        gpuTempC: 41
      },
      {
        profile: 'balanced',
        label: 'Balanced / Workload',
        icon: 'fa-sliders',
        multiplier: 1.0,
        intakeRpm: 1250,
        exhaustRpm: 1300,
        cpuRpm: 1350,
        noiseLevel: '24.2 dB(A) • Gentle Breeze',
        ambientTempC: 25,
        cpuTempC: 56,
        gpuTempC: 62
      },
      {
        profile: 'turbo',
        label: 'Turbo / High Gaming',
        icon: 'fa-bolt-lightning',
        multiplier: 1.45,
        intakeRpm: 1800,
        exhaustRpm: 1850,
        cpuRpm: 1950,
        noiseLevel: '31.5 dB(A) • Maximum Airflow',
        ambientTempC: 25,
        cpuTempC: 66,
        gpuTempC: 69
      }
    ];
  }

  /**
   * Generates a comprehensive thermal, acoustic, and aerodynamic condition report
   * based on the active top fan configuration (intake, exhaust, or off), fan speed profile, and chassis layout.
   *
   * @param rearTop - Top-Rear fan direction ('off', 'exhaust', or 'intake').
   * @param frontTop - Top-Front fan direction ('off', 'exhaust', or 'intake').
   * @param speedProfile - Selected fan speed profile ('silent', 'balanced', or 'turbo').
   * @param layoutId - Chassis layout ID ('standard-mesh' or 'dual-chamber').
   * @returns Detailed AirflowConditionReport with advantages, disadvantages, and thermal metrics.
   */
    public getConditionReport(
    rearTop: TopFanDirection = 'off',
    frontTop: TopFanDirection = 'off',
    speedProfile: FanSpeedProfile = 'balanced',
    layoutId: AirflowLayoutId = 'standard-mesh',
    cpuId: CpuModelId = 'i5-10400f',
    coolerId: CpuCoolerId = 'ag400',
    gpuId: GpuModelId = 'rtx-3060',
    fanModelId: FanModelId = 'cl6-argb'
  ): AirflowConditionReport {
    // Multipliers for speed profiles
    let speedMultiplier: number = 1.0;
    let speedLabel: string = 'Balanced (1,250 RPM)';
    let baseDba: number = 24.2;

    if (speedProfile === 'silent') {
      speedMultiplier = 0.65;
      speedLabel = 'Silent Mode (800 RPM)';
      baseDba = 18.4;
    } else if (speedProfile === 'turbo') {
      speedMultiplier = 1.45;
      speedLabel = 'Turbo Cooling (1,800 RPM)';
      baseDba = 31.5;
    }

    // Dynamic CPU and Cooler Calculations
    let cpuLoadTemp = 63;
    if (speedProfile === 'silent') {
      cpuLoadTemp = 68;
    } else if (speedProfile === 'turbo') {
      cpuLoadTemp = 57;
    }

    // CPU model delta
    if (cpuId === 'i5-12400') {
      cpuLoadTemp -= 2;
    } else if (cpuId === 'i7-10700k') {
      cpuLoadTemp += 11;
    } else if (cpuId === 'i9-10900k') {
      cpuLoadTemp += 19;
    } else if (cpuId === 'r5-5600x') {
      cpuLoadTemp += 1;
    }

    // Cooler model delta
    let coolerNoiseDelta = 0;
    if (coolerId === 'intel-stock') {
      cpuLoadTemp += 15;
      coolerNoiseDelta += 7.5;
    } else if (coolerId === 'peerless-assassin') {
      cpuLoadTemp -= 7;
      coolerNoiseDelta -= 2.2;
    } else if (coolerId === 'aio-240') {
      cpuLoadTemp -= 9;
      coolerNoiseDelta -= 1.0;
    }

    // Case Fan model noise delta
    if (fanModelId === 'noctua-a12') {
      coolerNoiseDelta -= 2.5;
    } else if (fanModelId === 'arctic-p12') {
      coolerNoiseDelta -= 1.0;
    } else if (fanModelId === 'deepcool-fk120') {
      coolerNoiseDelta += 0.5;
    } else if (fanModelId === 'deepcool-mf120gt') {
      coolerNoiseDelta += 1.2;
    } else if (fanModelId === 'deepcool-rf120m') {
      coolerNoiseDelta -= 0.5;
    }

    // GPU heat plume impact on CPU:
    if (gpuId === 'r7-360') {
      cpuLoadTemp -= 2.0;
    } else if (gpuId === 'gtx-1650') {
      cpuLoadTemp -= 3.5;
    }

    // Top fan front-intake benefit:
    if (frontTop === 'intake') {
      cpuLoadTemp -= 3.5;
    }

    const cpuLoadFormatted = `${Math.round(cpuLoadTemp)}°C${cpuLoadTemp >= 88 ? ' (Throttle Warning)' : ''}`;

    // GPU Load Calculations:
    let gpuLoadFormatted = '';
    let gpuBehavior = '';
    let gpuAdvantage = '';
    let gpuTradeoff = '';

    if (gpuId === 'r7-360') {
      const r7T = speedProfile === 'silent' ? 66 : speedProfile === 'turbo' ? 56 : 61;
      gpuLoadFormatted = `${r7T}°C (Radeon R7 360 • 100W)`;
      gpuBehavior = 'Compact 100W Dual-Slot Thermal Dispersion: AMD Tobago architecture draws 100W via 6-pin PCIe plug. Direct rear evacuation with low upper-chamber turbulence.';
      gpuAdvantage = '100W Low Heat Footprint: Compact PCIe footprint leaves maximum volume for linear front-to-back chassis airflow';
      gpuTradeoff = '2GB GDDR5 VRAM: Tailored for display productivity, 1080p esports, and Linux UI, but cannot run large local LLM weights (requires 8GB+)';
    } else if (gpuId === 'rx-6600') {
      const rxT = speedProfile === 'silent' ? 68 : speedProfile === 'turbo' ? 57 : 63;
      gpuLoadFormatted = `${rxT}°C (Radeon RX 6600 • 132W)`;
      gpuBehavior = 'High-Efficiency RDNA 2 Flow: 132W TDP dual-fan axial cooling directly exhausts into the rear airflow tunnel with minimal upper-chassis spill.';
      gpuAdvantage = '8GB GDDR6 & 4.5x Compute Leap: Native PCIe 4.0 x8 on B660M DS3H, effortlessly driving 120Hz Full HD and local machine learning models';
      gpuTradeoff = '132W Moderate Power: Requires 1x 8-pin PCIe power lead from Corsair CV650 (650W has ample +400W headroom)';
    } else if (gpuId === 'rtx-4060') {
      const adaT = speedProfile === 'silent' ? 65 : speedProfile === 'turbo' ? 54 : 60;
      gpuLoadFormatted = `${adaT}°C (RTX 4060 • 115W Ultra-Cool)`;
      gpuBehavior = 'Ada Lovelace 115W Ultra-Efficiency: Draws only 115W under full load. Dual axial fans operate whisper-quiet, generating minimal convection heat into the MATREXX 40 chamber.';
      gpuAdvantage = '4th-Gen Tensor Cores & DLSS 3: 8GB VRAM with 24MB L2 cache, AV1 dual encoding, and hardware AI acceleration for developer inference';
      gpuTradeoff = 'PCIe 4.0 x8 Interface: Reaches peak potential on Gen4 B660M motherboards (100% matched to Gigabyte B660M DS3H)';
    } else if (gpuId === 'arc-a750') {
      const arcT = speedProfile === 'silent' ? 73 : speedProfile === 'turbo' ? 62 : 68;
      gpuLoadFormatted = `${arcT}°C (Intel Arc A750 • 225W)`;
      gpuBehavior = 'Xe-HPG 225W High-Density Thermal Plume: 256-bit memory bus with dual axial fans; benefits strongly from MATREXX 40 front mesh +52 CFM positive pressure.';
      gpuAdvantage = '512 GB/s Bandwidth & Intel Deep Link: Synergizes with Intel Core i5-12400 via hardware Deep Link and Resizable BAR for AV1 video compute';
      gpuTradeoff = '225W Higher Power Draw: Draws 225W load, fully supported by Corsair CV650W Bronze PSU but increases chamber ambient temp by +2.5°C';
    } else if (gpuId === 'gtx-1650') {
      const gtxT = speedProfile === 'silent' ? 62 : speedProfile === 'turbo' ? 53 : 58;
      gpuLoadFormatted = `${gtxT}°C (GTX 1650 • 75W Dual-Fan)`;
      gpuBehavior = '75W Low-Thermal Ingestion: The GTX 1650 draws minimal power directly from the PCIe slot with zero heat soak. Minimal warm air rises into the upper chamber, reducing CPU ambient air temperature by ~3.5°C.';
      gpuAdvantage = '75W Ultra-Low Power Draw: Generates minimal rising heat, keeping CPU cooler and upper chamber colder';
      gpuTradeoff = '4GB VRAM & No Tensor/RT Cores: Cannot load local LLMs (Llama 3 8B) or run hardware-accelerated OptiX rendering';
    } else {
      const rtxT = speedProfile === 'silent' ? 71 : speedProfile === 'turbo' ? 59 : 67;
      gpuLoadFormatted = `${rtxT}°C (RTX 3060 • 170W Triple-Fan)`;
      gpuBehavior = 'Triple-Fan Upward Airflow Dynamic: 3 axial fans draw fresh air from lower chamber and exhaust ~170W of heat upward through backplate cutouts into the top/rear exhaust stream.';
      gpuAdvantage = '12GB High-Speed GDDR6 VRAM: Ample memory buffer to load local AI models (Llama 3 8B, SDXL) with zero system RAM fallback';
      gpuTradeoff = '170W Thermal Wake: Generates noticeable rising thermal plume that benefits heavily from top/rear exhaust';
    }

    const cpuCoolerSummary = `${this.getCpuOptions().find(c => c.id === cpuId)?.shortName || 'i5-10400F'} + ${this.getCoolerOptions().find(c => c.id === coolerId)?.shortName || 'AG400'}`;
    const gpuSummary = gpuId === 'r7-360' ? 'Radeon R7 360 2GB' : gpuId === 'rx-6600' ? 'Radeon RX 6600 8GB' : gpuId === 'rtx-4060' ? 'RTX 4060 8GB' : gpuId === 'arc-a750' ? 'Intel Arc A750 8GB' : gpuId === 'gtx-1650' ? 'GTX 1650 4GB' : 'RTX 3060 12GB';

    if (layoutId === 'dual-chamber') {
      const intakeCfm: number = Math.round(105 * speedMultiplier);
      const exhaustCfm: number = Math.round(145 * speedMultiplier);
      const netCfm: number = intakeCfm - exhaustCfm;
      return {
        id: 'dual-chamber-report',
        title: `Dual-Chamber Layout (${gpuSummary} • ${cpuCoolerSummary})`,
        tagline: 'Side 2x 120mm Intake • Top 360mm Radiator Exhaust • Bottom Chimney Assist',
        conditionDescription:
          `Dual-chamber aesthetic showcase with ${gpuSummary} and ${cpuCoolerSummary}. Features separate rear power supply compartment and uninhibited glass viewing angle with negative-pressure bias.`,
        fanSetupLabel: `2x Side Intake • 3x Top Exhaust • 1x Rear Exhaust (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType: 'Negative Airflow',
        netPressureCfm: netCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: Number((baseDba + coolerNoiseDelta + 2.4).toFixed(1)),
        acousticCategory: speedProfile === 'silent' ? 'Studio Quiet' : 'Moderate Flow',
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '48°C',
          psuChamber: '32°C (Dual-Chamber rear isolated)'
        },
        advantages: [
          'Panoramic unobstructed tempered glass viewing from front and side',
          gpuAdvantage,
          'Huge 360mm top radiator support suitable for high-wattage liquid AIO loops',
          'Complete isolation of power supply cables in the second rear chamber'
        ],
        disadvantages: [
          'Negative pressure gradient pulls unfiltered dust in through rear panel cutouts',
          gpuTradeoff,
          'Significantly wider desk footprint (285mm wide vs 190mm on darkFlash Leo)',
          'Requires 6 to 9 total fans for optimal acoustic and thermal balance'
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'High-end custom aesthetic workstations',
          'Liquid-cooled high-TDP processor systems',
          'Desk showcase builds with continuous dust cleaning'
        ],
        thermalTip:
          'Add bottom intake fans in dual-chamber chassis to convert the chamber from negative to positive pressure, preventing dust accumulation.'
      };
    }

    // DeepCool MATREXX 40 3FS Layout Calculations
    if (layoutId === 'matrexx-40') {
      const rearTopIntake: number = rearTop === 'intake' ? 38 : 0;
      const rearTopExhaust: number = rearTop === 'exhaust' ? 38 : 0;
      const frontTopIntake: number = frontTop === 'intake' ? 38 : 0;
      const frontTopExhaust: number = frontTop === 'exhaust' ? 38 : 0;

      const baseIntake: number = 104 + rearTopIntake + frontTopIntake;
      const baseExhaust: number = 52 + rearTopExhaust + frontTopExhaust;
      const intakeCfm: number = Math.round(baseIntake * speedMultiplier);
      const exhaustCfm: number = Math.round(baseExhaust * speedMultiplier);
      const netPressureCfm: number = intakeCfm - exhaustCfm;

      const activeTopFansCount: number = (rearTop !== 'off' ? 1 : 0) + (frontTop !== 'off' ? 1 : 0);
      const addedDba: number = activeTopFansCount === 0 ? 0 : activeTopFansCount === 1 ? 1.5 : 2.8;
      const finalDba: number = Math.max(16, Number((baseDba + coolerNoiseDelta + addedDba).toFixed(1)));

      return {
        id: 'matrexx-40-report',
        title: `DeepCool MATREXX 40 3FS Setup (${gpuSummary} • ${cpuCoolerSummary})`,
        tagline: 'Dual Front 120mm LED Intake • Rear 120mm LED Exhaust • Micro-ATX High Airflow',
        conditionDescription:
          `Factory 3FS setup featuring 2 front 120mm Tri-Color LED fans (Front Bottom + Front Middle) pulling pressurized air through the slotted geometric front mesh panel, directly cooling the ${cpuCoolerSummary} and ${gpuSummary}, with a rear 120mm exhaust fan. Generates +${netPressureCfm} CFM positive pressure for superior dust resistance.`,
        fanSetupLabel: `2x Front In • 1x Rear Exh • ${activeTopFansCount}x Top Fan(s) (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType: netPressureCfm >= 30 ? 'Strong Positive' : 'Balanced Positive',
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory: finalDba <= 23 ? 'Whisper Silent' : finalDba <= 28 ? 'Studio Quiet' : 'Moderate Flow',
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '44°C',
          psuChamber: '31°C (MATREXX 40 isolated shroud)'
        },
        advantages: [
          'Pre-installed 3x 120mm Tri-Color LED fans provide instant out-of-the-box positive pressure',
          gpuAdvantage,
          'Front middle fan delivers direct uninhibited airflow to the Samsung 980 PRO PCIe 4.0 M.2 SSD and Gigabyte B660M VRMs',
          'Front bottom fan feeds directly into the lower 2TB HDD cage and Corsair CV650 power supply',
          'Compact Micro-ATX chassis footprint (400 x 215 x 431 mm) maximizes desk space'
        ],
        disadvantages: [
          gpuTradeoff,
          'Micro-ATX form factor limits expansion cards to 4 PCIe slots compared to full ATX',
          'Factory Tri-Color LED lighting operates at fixed multi-color spectrum (hardware static)'
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'Full-stack web and mobile development (Angular, Flutter, Node.js)',
          'High-speed compilation workflows leveraging Alder Lake 6-core IPC and PCIe 4.0 NVMe',
          'Clean, low-maintenance office and bedroom setups needing strong dust rejection'
        ],
        thermalTip:
          'In the DeepCool MATREXX 40 3FS, the dual front fans provide ample positive airflow. Keep top fan slots passive or add a single rear-top exhaust for GPU heavy loads.'
      };
    }

    // darkFlash Leo ATX Layout Calculations
    const rearTopIntake: number = rearTop === 'intake' ? 40 : 0;
    const rearTopExhaust: number = rearTop === 'exhaust' ? 40 : 0;
    const frontTopIntake: number = frontTop === 'intake' ? 40 : 0;
    const frontTopExhaust: number = frontTop === 'exhaust' ? 40 : 0;

    const baseIntake: number = 145 + rearTopIntake + frontTopIntake;
    const baseExhaust: number = 55 + rearTopExhaust + frontTopExhaust;
    const intakeCfm: number = Math.round(baseIntake * speedMultiplier);
    const exhaustCfm: number = Math.round(baseExhaust * speedMultiplier);
    const netPressureCfm: number = intakeCfm - exhaustCfm;

    const activeTopFansCount: number = (rearTop !== 'off' ? 1 : 0) + (frontTop !== 'off' ? 1 : 0);
    const addedDba: number = activeTopFansCount === 0 ? 0 : activeTopFansCount === 1 ? 1.6 : 3.1;
    const finalDba: number = Math.max(16, Number((baseDba + coolerNoiseDelta + addedDba).toFixed(1)));

    let acousticCategory: 'Whisper Silent' | 'Studio Quiet' | 'Moderate Flow' | 'High Performance Audible' = 'Studio Quiet';
    if (finalDba < 21) {
      acousticCategory = 'Whisper Silent';
    } else if (finalDba <= 27) {
      acousticCategory = 'Studio Quiet';
    } else if (finalDba <= 33) {
      acousticCategory = 'Moderate Flow';
    } else {
      acousticCategory = 'High Performance Audible';
    }

    let pressureType: 'Strong Positive' | 'Balanced Positive' | 'Neutral Airflow' | 'Negative Airflow' = 'Balanced Positive';
    if (netPressureCfm >= 40) {
      pressureType = 'Strong Positive';
    } else if (netPressureCfm > 0) {
      pressureType = 'Balanced Positive';
    } else if (netPressureCfm === 0) {
      pressureType = 'Neutral Airflow';
    } else {
      pressureType = 'Negative Airflow';
    }

    // HYBRID SETUP: Top-Front Intake + Top-Rear Exhaust
    if (frontTop === 'intake' && rearTop === 'exhaust') {
      return {
        id: 'leo-hybrid-top-fans',
        title: `Hybrid Push-Pull: Top-Front In & Top-Rear Out (${gpuSummary})`,
        tagline: `Active Cold Air Funnel to ${cpuCoolerSummary} • High-Velocity Rear Plume Evacuation`,
        conditionDescription:
          `Highly optimized aerodynamic balance with ${gpuSummary} and ${cpuCoolerSummary}. Top-Front intake feeds cool ambient air directly into the CPU heatsink, while Top-Rear exhaust extracts heat rising from the graphics card.`,
        fanSetupLabel: `3x Front In • 1x Top-Front In • 1x Top-Rear Exh • 1x Rear Exh (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '43°C (Active downdraft cooling)',
          psuChamber: '31°C (Lower shroud intake isolated)'
        },
        advantages: [
          `Direct ambient cold air injection dropping CPU temps by ~3°C to 4°C into ${cpuCoolerSummary}`,
          gpuAdvantage,
          'Top-Rear exhaust instantly captures rising graphics card heat wake before it touches CPU',
          'Vigorously maintains positive pressure (+90 CFM), completely preventing dust accumulation'
        ],
        disadvantages: [
          'Top-Front intake relies on the top magnetic mesh filter which requires regular cleaning',
          gpuTradeoff,
          'Slightly higher acoustic profile due to 2 additional top spinning fans'
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'Heavy multi-threaded code compilation (Rust, Angular, Node)',
          'Local AI & LLM model training and continuous inference',
          'High thermal environments / hot climate summer days'
        ],
        thermalTip:
          'Hybrid push-pull is the highest-performing thermal setup for the darkFlash Leo. Ensure the front-top fan is oriented facing DOWN (intake) and rear-top facing UP (exhaust).'
      };
    }

    // DUAL TOP EXHAUST
    if (frontTop === 'exhaust' && rearTop === 'exhaust') {
      return {
        id: 'leo-dual-top-exhaust',
        title: `Dual Top Exhaust: Maximum Chimney Evacuation (${gpuSummary})`,
        tagline: `High-Velocity Thermal Purge • Enhanced Exhaust for ${gpuSummary}`,
        conditionDescription:
          `Maximum volumetric air extraction with ${gpuSummary} and ${cpuCoolerSummary}. Both top fans spin as exhaust, creating an aggressive upward convective chimney draft.`,
        fanSetupLabel: `3x Front Intake • 2x Top Exhaust • 1x Rear Exhaust (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '47°C',
          psuChamber: '32°C'
        },
        advantages: [
          'Massive exhaust capacity rapidly clears heavy GPU heat plumes from the chassis',
          gpuAdvantage,
          'Prevents heat buildup in the upper motherboard VRM heatsinks',
          'Balanced positive pressure remains dust-free (+10 CFM net)'
        ],
        disadvantages: [
          'Top-Front exhaust fan slightly robs cool intake air from the front fan before reaching CPU',
          gpuTradeoff,
          'Highest acoustic signature with 6 total fans spinning at full RPM'
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'Sustained 100% GPU rendering (Blender Cycles, Premiere, DaVinci)',
          'Heavy 4K gaming with maximum power dissipation',
          'Stress-test stability benchmarking'
        ],
        thermalTip:
          'If CPU temperatures are higher than desired, switch the Top-Front fan to Intake or Off to let front intake flow directly into the tower cooler.'
      };
    }

    // REAR-TOP EXHAUST ONLY
    if (rearTop === 'exhaust' && frontTop === 'off') {
      return {
        id: 'leo-rear-top-exhaust',
        title: `Rear-Top Exhaust Only: Plume Evacuation (${gpuSummary})`,
        tagline: `Targeted Exhaust Above ${cpuCoolerSummary} • Passive Front-Top Mesh`,
        conditionDescription:
          `Targeted thermal evacuation setup with ${gpuSummary} and ${cpuCoolerSummary}. Adds a single top fan in the rear slot above the CPU cooler and GPU exhaust zone, preserving strong positive pressure.`,
        fanSetupLabel: `3x Front Intake • 1x Top-Rear Exhaust • 1x Rear Exhaust (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '46°C',
          psuChamber: '32°C'
        },
        advantages: [
          'Directly exhausts heat rising from GPU without disrupting front-to-back wind tunnel',
          gpuAdvantage,
          'Preserves strong positive pressure (+50 CFM net), repelling dust completely',
          'Very quiet acoustic profile with only 5 fans running'
        ],
        disadvantages: [
          'Top-Front slot remains passive; some heat can linger near RAM under extreme loads',
          gpuTradeoff
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'Balanced daily software engineering & compiling',
          'Full-stack development with Docker containers',
          'Silent office environments'
        ],
        thermalTip:
          'Rear-top exhaust is the most cost-effective and whisper-quiet upgrade for the darkFlash Leo. It extracts GPU heat without robbing CPU intake airflow.'
      };
    }

    // DUAL TOP INTAKE
    if (frontTop === 'intake' && rearTop === 'intake') {
      return {
        id: 'leo-dual-top-intake',
        title: `Dual Top Intake: Ultra Positive Pressure Downdraft (${gpuSummary})`,
        tagline: `Maximum Dust Repulsion • Cold Downdraft into ${cpuCoolerSummary}`,
        conditionDescription:
          `Maximum positive pressure configuration with ${gpuSummary} and ${cpuCoolerSummary}. Both top fans push cold ambient air down into the motherboard, forcing air out every rear and side gap.`,
        fanSetupLabel: `3x Front Intake • 2x Top Intake • 1x Rear Exhaust (${gpuSummary})`,
        speedProfileLabel: speedLabel,
        pressureType: 'Strong Positive',
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: cpuLoadFormatted,
          gpuLoad: gpuLoadFormatted,
          vrmTemp: '41°C (Direct cool downdraft)',
          psuChamber: '30°C'
        },
        advantages: [
          'Ultra-strong positive pressure (+170 CFM net) completely locks out dust ingress',
          gpuAdvantage,
          'Keeps motherboard VRM power phases exceptionally cold',
          'Cold downdraft directly feeds CPU heatsink from above'
        ],
        disadvantages: [
          'Fights natural thermal convection (hot air naturally rises, top fans push it back down)',
          gpuTradeoff,
          'Forces single 120mm rear exhaust fan to evacuate all heated air'
        ],
        gpuUpwardFlowBehavior: gpuBehavior,
        recommendedUseCases: [
          'Extremely dusty rooms / environments with pets',
          'Motherboard VRM overclocking stress testing',
          'Low-exhaust acoustic setups'
        ],
        thermalTip:
          'Dual top intake is great for dust immunity, but for lowest overall GPU temperatures, hybrid push-pull is superior.'
      };
    }

    // DEFAULT STOCK SETUP: 0 Top Fans (Passive Mesh)
    return {
      id: 'leo-stock-report',
      title: `Stock Build: 3x Front Intake + 1x Rear Exhaust (${gpuSummary})`,
      tagline: `Linear Wind Tunnel • Passive Top Magnetic Mesh • ${cpuCoolerSummary}`,
      conditionDescription:
        `Baseline darkFlash Leo configuration with ${gpuSummary} and ${cpuCoolerSummary}. Straight horizontal wind tunnel pulls cold air from front hex mesh through the CPU heatsink directly out the rear exhaust fan. Top magnetic mesh acts as a passive natural convection vent.`,
      fanSetupLabel: `3x Front In • 0x Top Fans • 1x Rear Exh (${gpuSummary})`,
      speedProfileLabel: speedLabel,
      pressureType,
      netPressureCfm,
      intakeCfm,
      exhaustCfm,
      acousticDba: finalDba,
      acousticCategory,
      temperatures: {
        cpuLoad: cpuLoadFormatted,
        gpuLoad: gpuLoadFormatted,
        vrmTemp: '49°C',
        psuChamber: '33°C'
      },
      advantages: [
        'Linear wind tunnel provides clean horizontal flow directly through CPU heatsink',
        gpuAdvantage,
        'Strong positive pressure (+90 CFM net) ensures dust immunity through front filter',
        'Simplest cable management and lowest acoustic noise floor (only 4 fans total)',
        'Zero top fan motor resonance'
      ],
      disadvantages: [
        'Heat rising from GPU relies purely on passive convection to escape top mesh',
        gpuTradeoff,
        'Under sustained multi-hour rendering, heat can warm the upper chassis slightly'
      ],
      gpuUpwardFlowBehavior: gpuBehavior,
      recommendedUseCases: [
        'Daily software development, web browsing, and code editing',
        'Full-stack development with Node.js and Docker',
        'Quiet bedroom or studio workstation operation'
      ],
      thermalTip:
        'This stock 3-in / 1-out configuration is already exceptionally well-engineered for the darkFlash Leo. Adding a single rear-top exhaust fan is the ideal next step if GPU load increases.'
    };
  }


  public getComponentCondition(
    componentId: string,
    rearTop: TopFanDirection = 'off',
    frontTop: TopFanDirection = 'off',
    speedProfile: FanSpeedProfile = 'balanced',
    layoutId: AirflowLayoutId = 'standard-mesh'
  ): ComponentConditionDetail {
    const report: AirflowConditionReport = this.getConditionReport(rearTop, frontTop, speedProfile, layoutId);

    let speedMultiplier: number = 1.0;
    if (speedProfile === 'silent') {
      speedMultiplier = 0.65;
    } else if (speedProfile === 'turbo') {
      speedMultiplier = 1.45;
    }

    switch (componentId) {
      case 'gpu':
        return {
          id: 'gpu',
          name: 'NVIDIA GeForce RTX 3060 12GB (Triple Axial Fans)',
          category: 'Graphics Processing Unit (Triple-Fan Upward Airflow)',
          icon: 'fa-gamepad',
          statusBadge: rearTop === 'exhaust' ? 'Vertical Plume Interception' : 'Active Upward Thermal Flow',
          statusType: 'optimal',
          temperature: report.temperatures.gpuLoad,
          conditionSummary:
            'The 3 axial cooling fans draw cool pressurized air from the lower chamber and propel heated exhaust vertically upward through the open fin stack and backplate cutout.',
          thermalRole:
            'Triple fans ingest air across the full length of the card, projecting rising thermal discharge into the upper chamber.',
          airflowInteraction:
            `Supplied with 48 CFM cold intake directly from Front Fan #2. Heated air exhausts upward toward the chassis roof. ${rearTop === 'exhaust' ? 'The Top-Rear exhaust fan captures the rising plume immediately, expelling it through the ceiling.' : 'Upward plume escapes through the top magnetic mesh via thermal buoyancy and rear fan draw.'}`,
          currentImpact:
            `Operating at ${report.temperatures.gpuLoad} under full load. ${rearTop === 'exhaust' ? 'Top-Rear exhaust reduces heat recirculation in the upper chamber by >65%.' : 'Passive top mesh allows gradual upward convective escape.'}`,
          metrics: [
            { label: 'Core Load Temp', value: report.temperatures.gpuLoad, hint: 'Sustained gaming/render' },
            { label: 'Fan Configuration', value: '3x Axial Fans (Upward Flow)', hint: 'Direct heatsink pass-through' },
            { label: 'Intake Supply', value: `${Math.round(48 * speedMultiplier)} CFM`, hint: 'Direct from Front Fan #2' },
            { label: 'VRAM Buffer', value: '12 GB GDDR6', hint: '100% active cooling' }
          ]
        };

      case 'ram': {
        const isRamDowndraft: boolean = frontTop === 'intake';
        const ramTemp: string = isRamDowndraft ? '32°C (Downdraft Cooled)' : '37°C';
        return {
          id: 'ram',
          name: '32GB (2x 16GB) Dual-Channel DDR4-3200',
          category: 'System Memory (Dual-Channel Kit)',
          icon: 'fa-memory',
          statusBadge: isRamDowndraft ? 'Supercharged Downdraft Cooled' : 'Direct Inflow Path',
          statusType: 'optimal',
          temperature: ramTemp,
          conditionSummary:
            'Mounted in high-priority slots A2/B2, positioned directly in the high-velocity intake channel between Front Fan #1 and the AG400 tower cooler.',
          thermalRole:
            'Memory heatspreaders transfer heat to incoming cold front intake air, ensuring zero thermal drift during intensive memory tasks.',
          airflowInteraction:
            `Receives direct laminar airflow from Front Fan #1. ${isRamDowndraft ? 'Top-Front fan set to Intake washes both sticks in a continuous vertical downdraft of cool ambient air.' : 'Horizontal intake stream flows across modules toward the CPU cooler push fan.'}`,
          currentImpact:
            isRamDowndraft
              ? 'Top-Front intake downdraft drops RAM operating temperatures by ~5°C, ensuring rock-solid stability during heavy memory caching.'
              : 'Standard linear front airflow keeps memory running comfortably at ~37°C.',
          metrics: [
            { label: 'Operating Temp', value: ramTemp, hint: 'High-speed load' },
            { label: 'Configuration', value: '32GB Dual-Channel (3200 MHz)', hint: '2x 16GB Modules' },
            { label: 'Cooling Dynamic', value: isRamDowndraft ? 'Dual Vector (Top + Front Inflow)' : 'Front Linear Stream', hint: 'Thermal protection' },
            { label: 'Stability Index', value: '100% Stable (Zero Drift)', hint: 'Continuous active wash' }
          ]
        };
      }

      case 'vrm':
        return {
          id: 'vrm',
          name: 'Extended Aluminum VRM Heatsinks & Motherboard',
          category: 'Motherboard Power Delivery',
          icon: 'fa-chess-board',
          statusBadge: 'Phase Power Protected',
          statusType: 'optimal',
          temperature: report.temperatures.vrmTemp,
          conditionSummary:
            'Heavy-gauge aluminum heatsinks dissipate heat from the MOSFET power stages and chokes feeding the LGA 1200 CPU socket.',
          thermalRole:
            'Absorbs power conversion heat and transfers it to the CPU cooler wake and upper chassis exhaust currents.',
          airflowInteraction:
            'Cooled by the secondary turbulent draft from the AG400 push fan and proximity to the rear 120mm exhaust fan.',
          currentImpact:
            `Operating at ${report.temperatures.vrmTemp}. High positive pressure maintains continuous air exchange over all motherboard surface traces.`,
          metrics: [
            { label: 'VRM Temp', value: report.temperatures.vrmTemp, hint: 'Power delivery load' },
            { label: 'Heatsink Material', value: 'Extended Aluminum', hint: 'High surface area' },
            { label: 'Boost Headroom', value: '65W+ Sustained', hint: 'Zero power throttling' },
            { label: 'Socket Support', value: 'Intel LGA 1200', hint: 'B460/B560 Chipset' }
          ]
        };

      case 'psu':
        return {
          id: 'psu',
          name: '750W 80 Plus High-Efficiency Power Supply',
          category: 'Power Supply & Dedicated Lower Tunnel',
          icon: 'fa-bolt',
          statusBadge: 'Thermally Isolated Tunnel',
          statusType: 'optimal',
          temperature: report.temperatures.psuChamber,
          conditionSummary:
            'Enclosed inside the darkFlash Leo full-length bottom steel shroud, operating in an independent isolated thermal chamber.',
          thermalRole:
            'Keeps power conversion heat completely separated from the CPU and GPU chamber, maintaining thermal stability.',
          airflowInteraction:
            'Dual intake pathways: draws cool floor air through the bottom removable dust filter, while Front Fan #3 forces fresh ambient air directly into the shroud through the forward cutout opening.',
          currentImpact:
            `Operating at ${report.temperatures.psuChamber}. 750W headroom ensures the unit operates within its peak 50% efficiency curve with near-silent fan operation.`,
          metrics: [
            { label: 'Chamber Temp', value: report.temperatures.psuChamber, hint: 'Isolated tunnel' },
            { label: 'Continuous Power', value: '750 Watts 80+', hint: 'Continuous delivery' },
            { label: 'Intake Channels', value: 'Front Fan #3 + Underside', hint: 'Dual cold stream' },
            { label: 'Thermal Isolation', value: 'Full Steel Shroud', hint: 'Zero heat leak to GPU' }
          ]
        };

      case 'nvme':
        return {
          id: 'nvme',
          name: '1TB High-Speed NVMe M.2 SSD',
          category: 'High-Performance PCIe Storage',
          icon: 'fa-hard-drive',
          statusBadge: 'Fast PCIe Gen3 Speeds',
          statusType: 'optimal',
          temperature: '37°C',
          conditionSummary:
            'Installed in the primary M.2 slot between the CPU socket and primary PCIe x16 slot, shielded by motherboard aluminum heatsink armor.',
          thermalRole:
            'Transfers PCIe flash controller heat to the incoming intake stream from Front Fan #2.',
          airflowInteraction:
            'Directly in line with the laminar cold inflow from Front Fan #2, preventing NAND and controller thermal throttling.',
          currentImpact:
            'Maintains 37°C operating temperature; allows sustained sequential read speeds up to 3,500 MB/s during large project compiling.',
          metrics: [
            { label: 'Operating Temp', value: '37°C', hint: 'Frosty NVMe' },
            { label: 'Read Speed', value: 'Up to 3,500 MB/s', hint: 'PCIe Gen3 x4' },
            { label: 'Throttling Margin', value: '100% Thermal Headroom', hint: 'No throttle under load' },
            { label: 'Thermal Armor', value: 'Aluminum M.2 Shield', hint: 'Direct motherboard cooling' }
          ]
        };

      case 'hdd-bay':
        return {
          id: 'hdd-bay',
          name: '3.5" HDD & 2.5" SSD Modular Drive Cage',
          category: 'Internal Storage Bay (Lower Shroud)',
          icon: 'fa-database',
          statusBadge: 'Direct Inflow Cooled',
          statusType: 'optimal',
          temperature: '29°C',
          conditionSummary:
            'Steel drive caddy located inside the lower shroud forward of the power supply.',
          thermalRole:
            'Protects mechanical hard drives and SATA SSDs from mechanical shock and heat accumulation.',
          airflowInteraction:
            'Front Fan #3 blows directly through the open shroud cutout across the drive cages before air reaches the PSU intake.',
          currentImpact:
            'Operating at a cool 29°C, extending spindle motor and flash memory longevity.',
          metrics: [
            { label: 'Drive Bay Temp', value: '29°C', hint: 'Ambient shroud temp' },
            { label: 'Direct Feed', value: 'Front Fan #3 Cutout', hint: 'High-volume airflow' },
            { label: 'Drive Capacity', value: '2x 3.5" / 2.5" Drives', hint: 'Toolless trays' },
            { label: 'Location', value: 'Lower Shroud Chamber', hint: 'Isolated from GPU heat' }
          ]
        };

      case 'front-fan-1':
        return {
          id: 'front-fan-1',
          name: 'Front Fan 1 (Top 120mm PWM Intake)',
          category: 'Chassis Intake Array',
          icon: 'fa-fan',
          statusBadge: 'High-Volume Cold Intake',
          statusType: 'active',
          temperature: '25°C (Ambient Room Air)',
          conditionSummary:
            'Draws fresh ambient air through the top section of the darkFlash Leo faceted iron-mesh front panel.',
          thermalRole:
            'Supplies fresh unheated air directly to the DeepCool AG400 CPU cooler push fan and DDR4 memory modules.',
          airflowInteraction:
            `Delivers ${Math.round(48 * speedMultiplier)} CFM. ${frontTop === 'intake' ? 'Synergizes with the Top-Front intake fan to flood the CPU socket area with cool air.' : frontTop === 'exhaust' ? 'A small portion of air is captured by the Top-Front exhaust fan.' : '100% of air flows horizontally into the AG400 tower cooler.'}`,
          currentImpact:
            `Spinning at ${Math.round(1250 * speedMultiplier)} RPM delivering ${Math.round(48 * speedMultiplier)} CFM with low 22 dB(A) acoustic output.`,
          metrics: [
            { label: 'Air Volume', value: `${Math.round(48 * speedMultiplier)} CFM`, hint: 'Direct intake' },
            { label: 'Rotational Speed', value: `${Math.round(1250 * speedMultiplier)} RPM`, hint: 'PWM controlled' },
            { label: 'Noise Rating', value: '22.0 dB(A)', hint: 'Low acoustic turbulence' },
            { label: 'Primary Target', value: 'DeepCool AG400 & RAM', hint: 'Direct straight feed' }
          ]
        };

      case 'front-fan-2':
        return {
          id: 'front-fan-2',
          name: 'Front Fan 2 (Middle 120mm PWM Intake)',
          category: 'Chassis Intake Array',
          icon: 'fa-fan',
          statusBadge: 'GPU Direct Cold Intake',
          statusType: 'active',
          temperature: '25°C (Ambient Room Air)',
          conditionSummary:
            'Center intake fan aligned perfectly with the PCIe graphics card slot and motherboard chipset.',
          thermalRole:
            'Provides a continuous high-pressure cold air cushion for the 3 axial fans on the RTX 3060 graphics card.',
          airflowInteraction:
            `Forces ${Math.round(48 * speedMultiplier)} CFM across the graphics card shroud, feeding fresh air into the GPU heatsink.`,
          currentImpact:
            'Prevents GPU fans from ingesting pre-warmed recirculating internal air.',
          metrics: [
            { label: 'Air Volume', value: `${Math.round(48 * speedMultiplier)} CFM`, hint: 'Direct GPU stream' },
            { label: 'Rotational Speed', value: `${Math.round(1250 * speedMultiplier)} RPM`, hint: 'PWM dynamic curve' },
            { label: 'Noise Rating', value: '22.0 dB(A)', hint: 'Quiet operation' },
            { label: 'Primary Target', value: 'RTX 3060 Triple Fans', hint: 'Full card length feed' }
          ]
        };

      case 'front-fan-3':
        return {
          id: 'front-fan-3',
          name: 'Front Fan 3 (Bottom 120mm Dual-Zone Intake)',
          category: 'Chassis Dual-Zone Intake Array',
          icon: 'fa-fan',
          statusBadge: 'Dual-Zone Airway Split',
          statusType: 'active',
          temperature: '25°C (Ambient Room Air)',
          conditionSummary:
            'Lower 120mm intake fan positioned across the bottom of the iron mesh, spanning both the PCIe zone and the PSU shroud cutout.',
          thermalRole:
            'Dual thermal duty: 50% of airflow cools the lower motherboard and GPU underside; 50% injects pressurized air into the PSU and HDD chamber.',
          airflowInteraction:
            `Splits ${Math.round(48 * speedMultiplier)} CFM between the PCIe compartment and the lower shroud tunnel cutout.`,
          currentImpact:
            'Unique darkFlash Leo shroud opening allows active cooling of drives and power supply without stealing air from the GPU.',
          metrics: [
            { label: 'Air Volume', value: `${Math.round(48 * speedMultiplier)} CFM`, hint: 'Total lower intake' },
            { label: 'Airflow Split', value: '50% PCIe / 50% PSU Shroud', hint: 'Dual-zone cooling' },
            { label: 'Rotational Speed', value: `${Math.round(1250 * speedMultiplier)} RPM`, hint: 'PWM controlled' },
            { label: 'Primary Target', value: 'PSU Shroud & GPU Underside', hint: 'Tunnel injection' }
          ]
        };

      case 'rear-fan-1':
        return {
          id: 'rear-fan-1',
          name: 'Rear 120mm PWM Exhaust Fan',
          category: 'Chassis Exhaust Array',
          icon: 'fa-fan',
          statusBadge: 'Primary Horizontal Exhaust',
          statusType: 'active',
          temperature: '39°C – 44°C (Exhaust Wake)',
          conditionSummary:
            '120mm PWM exhaust fan installed on the rear honeycomb grille directly behind the DeepCool AG400 CPU cooler.',
          thermalRole:
            'Evacuates heated air exiting the CPU cooler tower fins and upper GPU thermal wake out the back of the case.',
          airflowInteraction:
            `Evacuates ${Math.round(55 * speedMultiplier)} CFM. Horizontally aligned with the AG400 tower fan to minimize turbulence.`,
          currentImpact:
            'Forms the primary exit path for CPU heat dissipation, preventing warm air accumulation inside the chassis.',
          metrics: [
            { label: 'Exhaust Volume', value: `${Math.round(55 * speedMultiplier)} CFM`, hint: 'High static flow' },
            { label: 'Rotational Speed', value: `${Math.round(1300 * speedMultiplier)} RPM`, hint: 'Synchronized PWM' },
            { label: 'Noise Rating', value: '23.0 dB(A)', hint: 'Low acoustic drone' },
            { label: 'Alignment', value: 'Direct In-Line with AG400', hint: 'Zero boundary stall' }
          ]
        };

      case 'leo-top-fan-1': {
        const isExhaust: boolean = rearTop === 'exhaust';
        const isIntake: boolean = rearTop === 'intake';
        return {
          id: 'leo-top-fan-1',
          name: 'Top Fan Slot 1 (Rear-Top 120mm Mount)',
          category: 'Chassis Ceiling Mount (Above CPU Wake & GPU Plume)',
          icon: 'fa-fan',
          statusBadge: isExhaust ? 'Active Plume Evacuation ↑' : isIntake ? 'Active Downdraft Inflow ↓' : 'Passive Magnetic Mesh',
          statusType: isExhaust || isIntake ? 'active' : 'good',
          temperature: isExhaust ? '42°C (GPU Exhaust Plume)' : isIntake ? '25°C (Cool Inflow)' : '35°C (Convective Rise)',
          conditionSummary:
            'Positioned in the chassis ceiling directly above the CPU cooler and the RTX 3060 rear heat dissipation zone.',
          thermalRole:
            isExhaust
              ? 'Intercepts and expels the hot upward thermal plume from the GPU and CPU cooler wake.'
              : isIntake
                ? 'Injects cold ambient air downward behind the CPU cooler.'
                : 'Acts as a passive exhaust path via natural thermal convection under positive pressure.',
          airflowInteraction:
            isExhaust
              ? `Draws ${Math.round(40 * speedMultiplier)} CFM upward through the magnetic dust filter, preventing upper chamber heat recirculation.`
              : isIntake
                ? `Injects ${Math.round(40 * speedMultiplier)} CFM of downward intake into the rear motherboard area.`
                : 'Passive honeycomb mesh allows hot air to slowly rise out.',
          currentImpact:
            isExhaust
              ? 'Lowers CPU delta-T by ~4°C by directly evacuating the upward rising GPU exhaust plume.'
              : isIntake
                ? 'Increases chamber positive pressure to +170 CFM; forces high air dispersion.'
                : 'Stock passive state: zero fan noise, gentle convective outflow.',
          metrics: [
            { label: 'Configured State', value: rearTop.toUpperCase(), hint: 'Active direction' },
            { label: 'Air Volume', value: rearTop !== 'off' ? `${Math.round(40 * speedMultiplier)} CFM` : 'Passive Convection', hint: 'Slot 1 airflow' },
            { label: 'Position', value: 'Above CPU & GPU Wake', hint: 'Top-Rear chassis mount' },
            { label: 'Dust Protection', value: 'Top Magnetic Filter', hint: 'Removable washable mesh' }
          ]
        };
      }

      case 'leo-top-fan-2': {
        const isExhaust: boolean = frontTop === 'exhaust';
        const isIntake: boolean = frontTop === 'intake';
        return {
          id: 'leo-top-fan-2',
          name: 'Top Fan Slot 2 (Front-Top 120mm Mount)',
          category: 'Chassis Ceiling Mount (Above RAM & AG400 Intake)',
          icon: 'fa-fan',
          statusBadge: isIntake ? 'Direct AG400 Cold Feed ↓' : isExhaust ? 'Chimney Exhaust ↑' : 'Passive Magnetic Mesh',
          statusType: isExhaust || isIntake ? 'active' : 'good',
          temperature: isIntake ? '25°C (Cool Inflow)' : isExhaust ? '38°C (Heated Exhaust)' : '31°C (Passive Rise)',
          conditionSummary:
            'Positioned in the chassis ceiling directly forward of the CPU cooler, above the 32GB DDR4 RAM and DeepCool AG400 intake fan.',
          thermalRole:
            isIntake
              ? 'Acts as a supplementary cold air funnel feeding room-temperature air directly into the CPU cooler push fan.'
              : isExhaust
                ? 'Expels upper air upward in a dual-chimney configuration.'
                : 'Passive mesh allowing horizontal front intake air to flow unhindered.',
          airflowInteraction:
            isIntake
              ? `Injects ${Math.round(40 * speedMultiplier)} CFM of fresh air downward over the RAM and into the AG400 push fan.`
              : isExhaust
                ? `Exhausts ${Math.round(40 * speedMultiplier)} CFM upward; requires tuning to avoid stealing front intake air.`
                : 'Passive slot: Front Fan #1 intake is 100% preserved for the CPU cooler.',
          currentImpact:
            isIntake
              ? 'Enthusiast Hybrid setup: drops CPU load temperature by 3°C–4°C and cools RAM modules by 5°C.'
              : isExhaust
                ? 'Maximizes total chassis exhaust CFM (6-fan array).'
                : 'Prevents intake scavenging from Front Fan #1.',
          metrics: [
            { label: 'Configured State', value: frontTop.toUpperCase(), hint: 'Active direction' },
            { label: 'Air Volume', value: frontTop !== 'off' ? `${Math.round(40 * speedMultiplier)} CFM` : 'Passive Mesh', hint: 'Slot 2 airflow' },
            { label: 'Position', value: 'Above RAM & AG400 Push Fan', hint: 'Top-Front chassis mount' },
            { label: 'Dust Protection', value: 'Top Magnetic Filter', hint: 'Removable washable mesh' }
          ]
        };
      }

      case 'case':
        return {
          id: 'case',
          name: 'darkFlash Leo ATX Mid-Tower Chassis',
          category: 'Chassis & Filtration Architecture',
          icon: 'fa-cube',
          statusBadge: report.pressureType,
          statusType: 'optimal',
          conditionSummary:
            'Mid-tower enclosure (349 x 190 x 430 mm) engineered with faceted Carbon Armor iron-mesh front, edge-to-edge tempered glass side, and full-length PSU shroud.',
          thermalRole:
            'Defines the aerodynamic boundaries, isolating power supply heat while channeling 145+ CFM of intake through the motherboard chamber.',
          airflowInteraction:
            `Generates ${report.netPressureCfm > 0 ? '+' : ''}${report.netPressureCfm} CFM net pressure gradient. Total Intake: ${report.intakeCfm} CFM, Total Exhaust: ${report.exhaustCfm} CFM.`,
          currentImpact:
            `Strong positive pressure (+${report.netPressureCfm} CFM) ensures dust is actively pushed outward through non-filtered gaps.`,
          metrics: [
            { label: 'Chassis Dimensions', value: '349 x 190 x 430 mm', hint: 'Proportion 1 : 1.232' },
            { label: 'Chamber Pressure', value: `${report.netPressureCfm > 0 ? '+' : ''}${report.netPressureCfm} CFM`, hint: report.pressureType },
            { label: 'Acoustics', value: `${report.acousticDba} dB(A)`, hint: report.acousticCategory },
            { label: 'Filter Armor', value: 'Top Magnetic + Front Mesh', hint: 'Full coverage' }
          ]
        };

      default:
        return {
          id: 'cpu',
          name: 'DeepCool AG400 Single-Tower CPU Cooler & Intel i5-10400F',
          category: 'CPU Cooling Assembly & LGA 1200 Socket',
          icon: 'fa-microchip',
          statusBadge: frontTop === 'intake' ? 'Supercharged Direct Inflow' : rearTop === 'exhaust' ? 'Optimal Plume Evacuation' : 'Balanced Linear Flow',
          statusType: 'optimal',
          temperature: report.temperatures.cpuLoad,
          conditionSummary:
            'Direct front-to-back laminar heat dissipation through 4 copper direct-touch heatpipes and dense matrix aluminum fin stack.',
          thermalRole:
            'Disperses heat from the 65W+ Intel Core i5-10400F processor directly into the rear exhaust path.',
          airflowInteraction:
            `Receives ${Math.round(48 * speedMultiplier)} CFM from Front Fan #1. ${frontTop === 'intake' ? 'Top-Front intake dumps an additional +40 CFM of cold ambient air directly into the tower push fan.' : 'Fin wake is drawn directly out the rear 120mm exhaust fan.'}`,
          currentImpact:
            `Running at ${report.temperatures.cpuLoad} under sustained all-core load. ${frontTop === 'intake' ? 'Top-Front intake drops load temperature by ~3°C to 4°C with zero thermal throttling.' : 'Positive pressure provides clean dust-free operation.'}`,
          metrics: [
            { label: 'Core Load Temp', value: report.temperatures.cpuLoad, hint: 'Compile / Render load' },
            { label: 'Cooler Airflow', value: frontTop === 'intake' ? `${Math.round(88 * speedMultiplier)} CFM (Front + Top)` : `${Math.round(48 * speedMultiplier)} CFM`, hint: 'High static pressure' },
            { label: 'Heatpipe Matrix', value: '4x Direct-Touch Copper', hint: 'Balanced heat distribution' },
            { label: 'Acoustic Signature', value: speedProfile === 'silent' ? '18 dB(A) • Whisper' : speedProfile === 'turbo' ? '31 dB(A)' : '24 dB(A)', hint: 'Quiet PWM curve' }
          ]
        };
    }
  }

  /**
   * Retrieves high-level hardware summary vitals for the workstation.
   *
   * @returns SystemVitalsSummary containing core specs.
   */
  public getSystemVitals(): SystemVitalsSummary {
    if (this.activeRigId() === 'maxcool-mc5') {
      return {
        cores: '6 Cores / 12 Threads (Ryzen 5 5600 • 4.40 GHz)',
        vram: '4 GB GDDR6 (GTX 1650 Super • 192 GB/s)',
        ram: '16 GB Dual-Channel DDR4-3200 (2x8GB)',
        storage: '1.5 TB (512GB PCIe 4.0 NVMe + 1TB SATA SSD)',
        coolingCapacity: '220W TDP (DeepCool AK400 4-Heatpipe)',
        powerSupply: '450W 80+ Bronze (~200W Peak Load)',
        chassisVolume: '34.2 Liters (380 x 200 x 450 mm)'
      };
    }
    if (this.activeRigId() === 'deepcool-matrexx40') {
      return {
        cores: '6 P-Cores / 12 Threads (i5-12400 • 4.40 GHz)',
        vram: '2 GB GDDR5 (AMD Radeon R7 360)',
        ram: '16 GB Corsair LPX DDR4-3200 (2x8GB)',
        storage: '2.25 TB (Samsung 980 PRO NVMe + 2TB HDD)',
        coolingCapacity: '65W-220W (Tri-Color 3FS Flow)',
        powerSupply: '650W Corsair CV650 (80+ Bronze)',
        chassisVolume: '37.1 Liters (400 x 215 x 431 mm)'
      };
    }
    return {
      cores: '6 Cores / 12 Threads (4.30 GHz Turbo)',
      vram: '12 GB GDDR6 (192-bit Dedicated VRAM)',
      ram: '32 GB Dual-Channel DDR4-3200',
      storage: '1.75 TB Combined (PCIe 4.0 NVMe + SATA)',
      coolingCapacity: '220W TDP (DeepCool AG400 Direct-Touch)',
      powerSupply: '750W 80+ Gold Certified (High Headroom)',
      chassisVolume: '28.5 Liters (349 x 190 x 430 mm)'
    };
  }

  /**
   * Retrieves verified developer, AI inference, and synthetic benchmarks for the workstation.
   *
   * @returns Array of WorkstationBenchmarkItem.
   */
  public getWorkstationBenchmarks(): Array<WorkstationBenchmarkItem> {
    return [
      {
        id: 'bench-angular-build',
        category: 'development',
        categoryLabel: 'Development & Build',
        title: 'Angular 17 Production Bundle Build',
        metric: '14.2s',
        label: 'Production Build Time',
        baselineComparison: '2.8x faster than mobile i7 quad-core',
        hardwareUsed: 'Intel i5-10400F (12 Threads) • 32GB RAM • NVMe SSD',
        description: 'Complete Ahead-of-Time (AOT) compilation, tree shaking, ESBuild bundling, and SCSS minification for large enterprise frontend suites.',
        percentage: 88,
        icon: 'fa-cubes',
        status: 'exceptional',
        specsPill: 'Multi-Threaded Node.js'
      },
      {
        id: 'bench-rust-cargo',
        category: 'development',
        categoryLabel: 'Development & Build',
        title: 'Rust Monorepo Cargo Clean & Build',
        metric: '28.4s',
        label: 'Clean Compile Duration',
        baselineComparison: '3.1x faster than typical 4-core laptop',
        hardwareUsed: '12 Logical Cores • Samsung 980 Pro NVMe PCIe 4.0',
        description: 'Compiling 65+ crates concurrently with rustc using 12 threads with continuous high RAM buffer cache in 32GB dual-channel memory.',
        percentage: 84,
        icon: 'fa-gears',
        status: 'great',
        specsPill: 'High Disk I/O & Memory Bandwidth'
      },
      {
        id: 'bench-nextjs-ssr',
        category: 'development',
        categoryLabel: 'Development & Build',
        title: 'Next.js 14 App Router Full Compile',
        metric: '11.8s',
        label: 'SSR Static Generation Time',
        baselineComparison: '2.6x faster than standard ultrabook',
        hardwareUsed: 'i5-10400F @ 4.3 GHz Turbo • 32GB DDR4',
        description: 'Static prerendering and React Server Component compilation across 40+ dynamic routes with SWC native compilation.',
        percentage: 90,
        icon: 'fa-bolt',
        status: 'exceptional',
        specsPill: 'SWC Native Multi-core'
      },
      {
        id: 'bench-llama3',
        category: 'ai-inference',
        categoryLabel: 'Local AI & Inference',
        title: 'Llama 3 8B (Q4_K_M) Local Inference',
        metric: '18.4 tok/s',
        label: 'Generation Speed (Ollama / vLLM)',
        baselineComparison: 'Completely offloaded into 12GB VRAM',
        hardwareUsed: 'RTX 3060 12GB GDDR6 (3,584 CUDA Cores)',
        description: 'Full model weights fit in the dedicated 12 GB high-speed GDDR6 frame buffer with zero system RAM fallback latency.',
        percentage: 92,
        icon: 'fa-brain',
        status: 'exceptional',
        specsPill: '12GB VRAM Zero Offload'
      },
      {
        id: 'bench-sdxl',
        category: 'ai-inference',
        categoryLabel: 'Local AI & Inference',
        title: 'Stable Diffusion XL (1024x1024, 30 Steps)',
        metric: '2.4s / step',
        label: 'DPM++ 2M Karras Latency',
        baselineComparison: 'CUDA Tensor Core Acceleration',
        hardwareUsed: 'RTX 3060 12GB • TensorRT Optimization',
        description: 'High-resolution generative image synthesis utilizing FP16 mixed-precision and xFormers attention slicing.',
        percentage: 82,
        icon: 'fa-wand-magic-sparkles',
        status: 'great',
        specsPill: 'FP16 Tensor Cores'
      },
      {
        id: 'bench-cinebench',
        category: 'synthetic',
        categoryLabel: 'Synthetic Compute',
        title: 'Cinebench R23 Multi-Core Benchmark',
        metric: '8,020 pts',
        label: 'Sustained Multi-Core Score',
        baselineComparison: 'Max Temp 63°C with DeepCool AG400 Cooler',
        hardwareUsed: '6 Cores / 12 Threads @ 4.0 GHz All-Core',
        description: '10-minute continuous thermal saturation test; zero thermal throttling with darkFlash Leo straight-line airflow tunnel.',
        percentage: 85,
        icon: 'fa-microchip',
        status: 'optimal',
        specsPill: 'Zero Throttling @ 63°C'
      },
      {
        id: 'bench-cinebench-single',
        category: 'synthetic',
        categoryLabel: 'Synthetic Compute',
        title: 'Cinebench R23 Single-Core Benchmark',
        metric: '1,150 pts',
        label: 'Peak Single-Core Score',
        baselineComparison: '4.30 GHz Max Turbo Clock sustained',
        hardwareUsed: 'Single Core Boost • 14nm Comet Lake',
        description: 'Measures responsive single-threaded JavaScript execution, IDE syntax indexing, and UI thread responsiveness.',
        percentage: 80,
        icon: 'fa-gauge-high',
        status: 'great',
        specsPill: '4.30 GHz Turbo'
      },
      {
        id: 'bench-blender',
        category: 'rendering',
        categoryLabel: '3D Rendering & GPU Compute',
        title: 'Blender 4.0 Classroom Scene Render',
        metric: '58 seconds',
        label: 'OptiX Ray Tracing Render Time',
        baselineComparison: '5.4x faster than CPU-only render',
        hardwareUsed: 'RTX 3060 2nd Gen RT Cores + OptiX Denoiser',
        description: 'Hardware-accelerated BVH ray traversal with hardware ray tracing cores and AI-accelerated spatial denoising.',
        percentage: 87,
        icon: 'fa-cube',
        status: 'exceptional',
        specsPill: 'OptiX RT Cores'
      },
      {
        id: 'bench-timespy',
        category: 'rendering',
        categoryLabel: '3D Rendering & GPU Compute',
        title: '3DMark Time Spy DirectX 12 Graphics',
        metric: '8,650 pts',
        label: 'DirectX 12 Graphics Score',
        baselineComparison: 'GPU Temp stable @ 68°C under 180W load',
        hardwareUsed: 'RTX 3060 Triple-Fan Upward Discharge',
        description: 'Heavy DirectX 12 asynchronous compute pipeline test with 180W peak board power dissipation.',
        percentage: 83,
        icon: 'fa-gamepad',
        status: 'great',
        specsPill: 'Triple-Fan Airflow Discharge'
      }
    ];
  }

  /**
   * Retrieves thermal stress testing points across operating workloads.
   *
   * @returns Array of ThermalStressPoint.
   */
  public getThermalStressPoints(): Array<ThermalStressPoint> {
    return [
      {
        workload: 'Cold Boot / Idle Desktop',
        state: 'idle',
        cpuTemp: 34,
        gpuTemp: 37,
        vrmTemp: 38,
        fanRpm: 800,
        noiseDb: 22,
        powerDrawWatts: 55,
        behaviorNote: '0dB GPU fan stop engaged. 3 front fans provide quiet ambient positive pressure cooling.'
      },
      {
        workload: 'Full-Stack Development (VS Code + Docker + Browser)',
        state: 'coding',
        cpuTemp: 44,
        gpuTemp: 41,
        vrmTemp: 46,
        fanRpm: 1050,
        noiseDb: 25,
        powerDrawWatts: 95,
        behaviorNote: 'Quiet whisper operation. AG400 fan runs at low 900 RPM while CPU stays well below 50°C.'
      },
      {
        workload: 'Sustained Multi-Core Code Compilation / Rendering',
        state: 'compiling',
        cpuTemp: 63,
        gpuTemp: 52,
        vrmTemp: 55,
        fanRpm: 1350,
        noiseDb: 31,
        powerDrawWatts: 165,
        behaviorNote: 'Linear wind tunnel pulls cold air from front hex mesh through AG400 fin stack directly out rear.'
      },
      {
        workload: '100% Combined Torture Load (Prime95 + FurMark)',
        state: 'torture',
        cpuTemp: 68,
        gpuTemp: 69,
        vrmTemp: 64,
        fanRpm: 1650,
        noiseDb: 38,
        powerDrawWatts: 285,
        behaviorNote: 'Maximum thermal saturation. Triple-fan GPU pumps heat upward, exhausted cleanly through rear and top.'
      }
    ];
  }

  /**
   * Retrieves power supply load distribution breakdown across hardware rails.
   *
   * @returns Array of PowerDistributionItem.
   */
  public getPowerDistribution(): Array<PowerDistributionItem> {
    return [
      {
        rail: '+12V Rail 1',
        component: 'NVIDIA RTX 3060 12GB (Triple-Fan)',
        idleWatts: 14,
        loadWatts: 175,
        maxWatts: 185,
        efficiencyRating: 'Direct 8-pin PCIe dedicated cable'
      },
      {
        rail: '+12V Rail 2',
        component: 'Intel Core i5-10400F CPU (LGA 1200)',
        idleWatts: 15,
        loadWatts: 65,
        maxWatts: 85,
        efficiencyRating: '8-pin EPS 12V Solid Pin Delivery'
      },
      {
        rail: '+12V & +5V',
        component: 'Motherboard VRM, Chipset & 32GB RAM',
        idleWatts: 12,
        loadWatts: 28,
        maxWatts: 35,
        efficiencyRating: '24-pin ATX & Solid Polymer Capacitors'
      },
      {
        rail: '+3.3V & +5V',
        component: 'Samsung NVMe SSD + SATA SSD + HDD',
        idleWatts: 6,
        loadWatts: 16,
        maxWatts: 22,
        efficiencyRating: 'Isolated power rails with surge protection'
      },
      {
        rail: '+12V Fan Headers',
        component: '4x darkFlash CL6 ARGB + AG400 PWM Fan',
        idleWatts: 8,
        loadWatts: 18,
        maxWatts: 24,
        efficiencyRating: 'PWM speed regulated for minimal phantom draw'
      }
    ];
  }

  /**
   * Retrieves available CPU processor models for the workstation architecture.
   *
   * @returns Array of CpuOptionConfig.
   */
    public getCpuOptions(): Array<CpuOptionConfig> {
    return [
      {
        id: 'i5-10400f',
        name: 'Intel Core i5-10400F (Studio Rig)',
        shortName: 'i5-10400F',
        brand: 'Intel',
        cores: '6C / 12T • 4.30 GHz',
        baseClock: '2.90 GHz',
        turboClock: '4.30 GHz Turbo',
        tdpWatts: 65,
        maxLoadWatts: 75,
        socket: 'LGA 1200',
        thermalDifficulty: 'Low',
        badge: '6C/12T • 65W TDP',
        description: 'Ideal power-efficient developer CPU. Low 65W thermal load allows whisper-quiet operation under sustained builds.',
        advantages: [
          'Ultra-low 65W base / 75W max power envelope generates minimal heat inside the chassis',
          'Sustains full 4.0 GHz all-core Turbo under DeepCool AG400 at <58°C with near-silent acoustics',
          'Excellent efficiency for dual-monitor Angular/TypeScript development and Docker microservices'
        ],
        disadvantages: [
          'Limited to PCIe 3.0 throughput on LGA 1200 motherboards',
          'Lacks integrated graphics (demands dedicated discrete GPU for display output)'
        ]
      },
      {
        id: 'i5-12400',
        name: 'Intel Core i5-12400 (Dev Station Build)',
        shortName: 'i5-12400',
        brand: 'Intel',
        cores: '6C / 12T • 4.40 GHz',
        baseClock: '2.50 GHz',
        turboClock: '4.40 GHz Turbo',
        tdpWatts: 65,
        maxLoadWatts: 117,
        socket: 'LGA 1700',
        thermalDifficulty: 'Low',
        badge: '6 Golden Cove P-Cores • 18MB Cache',
        description: '12th Gen Alder Lake architecture with 6 Golden Cove high-IPC performance cores, 18MB Intel Smart Cache, and PCIe 5.0/4.0 support on LGA1700. Delivers blazing single-thread compilation speeds while consuming only 65W base / 117W Turbo.',
        advantages: [
          'High-IPC Golden Cove architecture cuts AST compilation & Vite hot-module reload times by 38%',
          'Supports PCIe 4.0 / 5.0 bus bandwidth, unleashing full 7,000 MB/s on Samsung 980 PRO NVMe',
          'Features Intel UHD Graphics 730 as an emergency hardware failover and QuickSync video encoder'
        ],
        disadvantages: [
          'PL2 Turbo spike draws up to 117W under heavy multithreaded loads (higher thermal burst than 10th Gen)',
          'Demands LGA 1700 socket motherboard with proper VRM cooling'
        ]
      },
      {
        id: 'i7-10700k',
        name: 'Intel Core i7-10700K (High Performance)',
        shortName: 'i7-10700K',
        brand: 'Intel',
        cores: '8C / 16T • 5.10 GHz',
        baseClock: '3.80 GHz',
        turboClock: '5.10 GHz Turbo',
        tdpWatts: 125,
        maxLoadWatts: 190,
        socket: 'LGA 1200',
        thermalDifficulty: 'High',
        badge: '8C/16T • 125W TDP',
        description: 'High-frequency 8-core CPU generating up to 190W under all-core load. Demands high static pressure tower cooling to avoid exceeding 75°C.',
        advantages: [
          '8 high-frequency cores / 16 threads crunch parallel Docker build pipelines and heavy test suites with ease',
          'Reaches 5.10 GHz single-core boost for snappy IDE indexing and code analysis'
        ],
        disadvantages: [
          '125W base / 190W load power output significantly warms internal chassis air cavity',
          'Requires premium dual-tower heatsink or 240mm AIO to avoid fan ramping above 30 dBA'
        ]
      },
      {
        id: 'i9-10900k',
        name: 'Intel Core i9-10900K (Enthusiast Flagship)',
        shortName: 'i9-10900K',
        brand: 'Intel',
        cores: '10C / 20T • 5.30 GHz',
        baseClock: '3.70 GHz',
        turboClock: '5.30 GHz TVB',
        tdpWatts: 125,
        maxLoadWatts: 250,
        socket: 'LGA 1200',
        thermalDifficulty: 'Extreme',
        badge: '10C/20T • 250W PL2',
        description: '10-core flagship with up to 250W PL2 peak power spike. Requires dual-tower air cooler or 240mm AIO liquid loop to sustain maximum boost.',
        advantages: [
          '10 physical cores / 20 threads provide immense throughput for heavy virtualization and video encoding',
          '5.3 GHz Thermal Velocity Boost offers maximum single-thread responsiveness'
        ],
        disadvantages: [
          'Extreme 250W PL2 thermal spike saturates standard air coolers quickly',
          'High heat dissipation warms nearby RAM modules and motherboard VRM inductors'
        ]
      },
      {
        id: 'r5-5600',
        name: 'AMD Ryzen 5 5600 (Maxcool MC5 Rig)',
        shortName: 'Ryzen 5 5600',
        brand: 'AMD',
        cores: '6C / 12T • 4.40 GHz',
        baseClock: '3.50 GHz',
        turboClock: '4.40 GHz Boost',
        tdpWatts: 65,
        maxLoadWatts: 76,
        socket: 'AM4',
        thermalDifficulty: 'Low',
        badge: '6C/12T • 32MB L3 Cache • 65W',
        description: 'Zen 3 Vermeer architecture featuring 6 cores, 12 threads, unified 32MB L3 cache, and PCIe 4.0 on AM4. Consumes only 65W TDP while delivering outstanding single-thread responsiveness for modern web tooling and compilation.',
        advantages: [
          'Zen 3 unified 32MB L3 cache completely eliminates cross-CCX latency for swift compilation and coding',
          'Low 65W TDP package runs cool (<62°C) under DeepCool AK400 even during sustained builds',
          'PCIe 4.0 support enables full bandwidth for Gen4 NVMe SSDs and graphics'
        ],
        disadvantages: [
          'AM4 socket platform (DDR4 memory generation)',
          'Lacks integrated GPU (requires discrete GPU like GTX 1650 Super for display output)'
        ]
      },
      {
        id: 'r5-5600x',
        name: 'AMD Ryzen 5 5600X (Zen 3 Alternative)',
        shortName: 'Ryzen 5 5600X',
        brand: 'AMD',
        cores: '6C / 12T • 4.60 GHz',
        baseClock: '3.70 GHz',
        turboClock: '4.60 GHz Boost',
        tdpWatts: 65,
        maxLoadWatts: 76,
        socket: 'AM4',
        thermalDifficulty: 'Low',
        badge: '6C/12T • 65W TDP',
        description: 'High-IPC 7nm architecture with dense single-CCD package. Highly responsive with minimal 65W thermal dissipation.',
        advantages: [
          'Zen 3 unified 32MB L3 cache delivers class-leading esports gaming and compiler latency',
          'Consumes only 76W max socket power, remaining ice-cold on budget air coolers'
        ],
        disadvantages: [
          'Small 7nm silicon die concentrates thermal density in one corner of the heatspreader',
          'Requires AM4 socket motherboard platform'
        ]
      }
    ];
  }

  /**
   * Retrieves available CPU Cooler options and their RPM acoustic profiles.
   *
   * @returns Array of CpuCoolerOptionConfig.
   */
    public getCoolerOptions(): Array<CpuCoolerOptionConfig> {
    return [
      {
        id: 'ak400',
        name: 'DeepCool AK400 Performance Cooler (Maxcool Build)',
        shortName: 'DeepCool AK400',
        type: 'single-tower',
        heatpipes: '4x Ø6mm Direct-Touch Copper Heatpipes',
        fanCount: 1,
        fanSizeMm: 120,
        minRpm: 500,
        maxRpm: 1850,
        silentRpm: 850,
        balancedRpm: 1250,
        turboRpm: 1850,
        maxCfm: 66.47,
        maxNoiseDba: 29.0,
        coolingCapacityTdp: 220,
        badge: 'Matrix Fin • FDB Fan • 220W TDP',
        description: 'Signature matrix fin design with decorative checkerboard top cover. High-performance FDB 120mm PWM fan delivers whisper-quiet operation and superior heat transfer.',
        advantages: [
          'Fluid Dynamic Bearing (FDB) 120mm PWM fan ensures silent long-life operation under 29 dBA',
          'Unique matrix fin array improves airflow penetration and accelerates heat dissipation',
          'Compact asymmetric footprint provides 100% RAM slot clearance on Gigabyte B550M DS3H'
        ],
        disadvantages: [
          'Single-fan design; does not support dual-fan push-pull out of the box',
          'Direct-touch base requires even thermal paste application across all 4 heatpipes'
        ]
      },
      {
        id: 'ag400',
        name: 'DeepCool AG400 Single-Tower (Current Build)',
        shortName: 'DeepCool AG400',
        type: 'single-tower',
        heatpipes: '4x Ø6mm Direct-Touch Copper',
        fanCount: 1,
        fanSizeMm: 120,
        minRpm: 500,
        maxRpm: 2000,
        silentRpm: 900,
        balancedRpm: 1350,
        turboRpm: 1950,
        maxCfm: 75.89,
        maxNoiseDba: 31.6,
        coolingCapacityTdp: 220,
        badge: '4 Heatpipes • 220W TDP',
        description: 'Dense matrix fin stack and offset heatpipe geometry. High static pressure fan perfectly in-line with darkFlash Leo linear wind tunnel.',
        advantages: [
          'High static pressure 75.89 CFM fan aligns horizontally with chassis intake and exhaust for ideal laminar flow',
          'Offset heatpipe engineering provides 100% RAM slot clearance for tall RGB heatsinks',
          'Easily cools up to 220W TDP CPUs, keeping 65W chips under 60°C in balanced acoustic mode'
        ],
        disadvantages: [
          'Single-fan design must spin up toward 1,800 RPM during 180W+ heavy torture loads',
          'Slightly overlaps VRM heatsink area requiring careful motherboard header wiring'
        ]
      },
      {
        id: 'intel-stock',
        name: 'Intel Stock Box Cooler (Laminar Flower)',
        shortName: 'Intel Stock Cooler',
        type: 'stock-flower',
        heatpipes: '0 Heatpipes (Solid Aluminum Extrusion)',
        fanCount: 1,
        fanSizeMm: 80,
        minRpm: 1200,
        maxRpm: 3100,
        silentRpm: 1450,
        balancedRpm: 2300,
        turboRpm: 3100,
        maxCfm: 32.5,
        maxNoiseDba: 39.8,
        coolingCapacityTdp: 65,
        badge: 'Flower Extrusion • 65W Max',
        description: 'Basic bundled aluminum heatsink. High RPM fan (up to 3,100 RPM) creates noticeable motor whine and allows CPU temps to exceed 78°C-84°C under sustained load.',
        advantages: [
          'Downward airflow blows radial exhaust across motherboard VRM and M.2 SSD',
          'Zero height clearance issues in ultra-compact slim chassis'
        ],
        disadvantages: [
          'Zero heatpipes and small aluminum mass allow temperatures to spike to 84°C+ under load',
          'High 3,100 RPM fan creates noticeable 39.8 dBA high-pitch motor noise under load',
          'Thermal throttling occurs if paired with CPUs drawing >70W'
        ]
      },
      {
        id: 'peerless-assassin',
        name: 'Thermalright Peerless Assassin 120 SE',
        shortName: 'Dual-Tower PA120',
        type: 'dual-tower',
        heatpipes: '6x Ø6mm AGHP Heatpipes',
        fanCount: 2,
        fanSizeMm: 120,
        minRpm: 500,
        maxRpm: 1550,
        silentRpm: 750,
        balancedRpm: 1100,
        turboRpm: 1550,
        maxCfm: 66.17,
        maxNoiseDba: 25.6,
        coolingCapacityTdp: 260,
        badge: '6 Heatpipes • Dual Fans • 260W',
        description: 'Dual radiator towers with dual 120mm PWM fans in push-pull. Disperses heavy heat loads at much lower, whisper-quiet RPM.',
        advantages: [
          'Massive dual-tower fin surface with 6 AGHP heatpipes cools up to 260W silently',
          'Dual fans spin at low 1,100 RPM, maintaining whisper-quiet <26 dBA operation under all-core load'
        ],
        disadvantages: [
          'Front 120mm fan overhangs RAM slots, requiring low-profile RAM or raising front fan height',
          'Heavy 1.1kg heatsink requires sturdy backplate mount'
        ]
      },
      {
        id: 'aio-240',
        name: '240mm AIO Liquid Cooler (Dual Radiator)',
        shortName: '240mm Liquid AIO',
        type: 'aio-liquid',
        heatpipes: 'Micro-Channel Copper Cold Plate + Dual 120mm Radiator',
        fanCount: 2,
        fanSizeMm: 120,
        minRpm: 500,
        maxRpm: 2250,
        silentRpm: 850,
        balancedRpm: 1400,
        turboRpm: 2200,
        maxCfm: 85.8,
        maxNoiseDba: 32.9,
        coolingCapacityTdp: 280,
        badge: 'Dual 120mm Rad • 3100 RPM Pump',
        description: 'Liquid coolant loop transfers heat directly to top exhaust radiator, preventing CPU heat from remaining inside the chassis.',
        advantages: [
          'Exhausts CPU heat directly out the top of the chassis, leaving motherboard cavity 5°C-7°C cooler for the GPU',
          'High thermal capacity handles prolonged multi-hour compiling and rendering runs without temperature saturation',
          'Clean aesthetic around CPU socket with zero RAM clearance restriction'
        ],
        disadvantages: [
          'Continuous pump hum at 3,100 RPM adds baseline acoustic footprint',
          'Long-term liquid permeation and mechanical pump failure risk over 4-6 year lifespan'
        ]
      }
    ];
  }

  /**
   * Retrieves available GPU options comparing RTX 3060 vs GTX 1650.
   *
   * @returns Array of GpuOptionConfig.
   */
    public getGpuOptions(): Array<GpuOptionConfig> {
    return [
      {
        id: 'rtx-3060',
        name: 'NVIDIA GeForce RTX 3060 12GB (Current Build)',
        shortName: 'RTX 3060 12GB',
        architecture: 'Ampere (8nm GA106)',
        vram: '12 GB GDDR6',
        vramType: 'GDDR6 (15 Gbps)',
        busWidth: '192-bit',
        cudaCores: 3584,
        tdpWatts: 170,
        fanCount: 3,
        fanFlowType: 'triple-axial-upward',
        heatPlumeCfm: 72,
        powerConnector: '1x 8-pin PCIe',
        idleWatts: 14,
        loadWatts: 175,
        rayTracingCores: 28,
        tensorCores: 112,
        badge: '12GB VRAM • Triple-Fan Upward',
        description: 'Features 12GB high-capacity VRAM allowing local AI models (Llama 3 8B, SDXL) to run completely in memory. Triple-fan cooling exhausts 170W upward.',
        advantages: [
          'Massive 12GB VRAM buffer allows local LLM inference (Llama 3 8B 4-bit) and Stable Diffusion completely in memory',
          '3,584 CUDA cores + 112 Tensor cores accelerate PyTorch, TensorFlow, and Blender CUDA render passes',
          'Triple axial fans keep GPU core under 68°C even under sustained 100% load'
        ],
        disadvantages: [
          '170W upward heat plume discharges directly into the CPU air path, raising CPU intake by ~3°C-4°C',
          'Long 320mm triple-fan card restricts front AIO radiator thickness and requires sturdy anti-sag support'
        ]
      },
      {
        id: 'gtx-1650',
        name: 'NVIDIA GeForce GTX 1650 4GB (Low-Power Comparison)',
        shortName: 'GTX 1650 4GB',
        architecture: 'Turing (12nm TU117)',
        vram: '4 GB GDDR6',
        vramType: 'GDDR6 (12 Gbps)',
        busWidth: '128-bit',
        cudaCores: 896,
        tdpWatts: 75,
        fanCount: 2,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 35,
        powerConnector: 'PCIe Slot Power (75W) / 6-pin',
        idleWatts: 9,
        loadWatts: 75,
        rayTracingCores: 0,
        tensorCores: 0,
        badge: '4GB VRAM • 75W Ultra-Cool',
        description: 'Runs off mere 75W power with dual axial fans. Produces minimal heat, keeping the CPU cooler 3-4°C colder and total system power below 160W, but limited to 4GB VRAM (no local LLMs).',
        advantages: [
          'Only 75W power draw keeps chassis internal temperature 5°C lower than high-TDP cards',
          'Short 215mm PCB leaves maximum unobstructed airflow clearance from front intake fans',
          'Total system power remains under 170W, putting zero electrical stress on the power supply'
        ],
        disadvantages: [
          '4GB VRAM is insufficient for running modern local AI LLMs or complex 4K texture viewports',
          'Lacks Tensor cores and RT cores for hardware ray tracing or AI acceleration'
        ]
      },
      {
        id: 'gtx-1650s',
        name: 'NVIDIA GeForce GTX 1650 Super 4GB (Maxcool Build)',
        shortName: 'GTX 1650 Super 4GB',
        architecture: 'Turing (12nm TU116)',
        vram: '4 GB GDDR6',
        vramType: 'GDDR6 (12 Gbps)',
        busWidth: '128-bit (192 GB/s Bandwidth)',
        cudaCores: 1280,
        tdpWatts: 100,
        fanCount: 2,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 45,
        powerConnector: '1x 6-pin PCIe',
        idleWatts: 9,
        loadWatts: 100,
        rayTracingCores: 0,
        tensorCores: 0,
        badge: '4GB GDDR6 • 1280 Cores • 100W',
        description: 'Turing TU116 die upgrade with 1,280 CUDA cores and 4GB high-speed GDDR6 memory at 192 GB/s (+50% faster memory throughput vs non-super). Efficient 100W power draw leaves over 240W headroom on 450W PSU.',
        advantages: [
          '1,280 CUDA cores deliver ~40% faster compute and rendering performance than regular GTX 1650',
          'Upgraded GDDR6 memory at 192 GB/s prevents memory bandwidth bottlenecks in 1080p creative work',
          'Low 100W TDP operates with very low heat output, cooled efficiently by the 5-fan chimney chassis'
        ],
        disadvantages: [
          '4GB VRAM limits loading 7B+ local LLM model weights entirely in GPU memory',
          'Requires 1x 6-pin auxiliary PCIe power connector'
        ]
      },
      {
        id: 'r7-360',
        name: 'AMD Radeon R7 360 2GB (MATREXX 40 Default)',
        shortName: 'Radeon R7 360 2GB',
        architecture: 'GCN 2.0 (28nm Tobago XT)',
        vram: '2 GB GDDR5',
        vramType: 'GDDR5 (6.5 Gbps)',
        busWidth: '128-bit',
        cudaCores: 768,
        tdpWatts: 100,
        fanCount: 1,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 42,
        powerConnector: '1x 6-pin PCIe',
        idleWatts: 11,
        loadWatts: 100,
        rayTracingCores: 0,
        tensorCores: 0,
        badge: '2GB GDDR5 • 100W 6-Pin PCIe',
        description: 'Compact dual-slot AMD graphics card powered by 768 Stream Processors and 100W TDP with 1x 6-pin PCIe power connector. Efficient for dual-display productivity, Linux acceleration, and 1080p esports with low acoustic footprint.',
        advantages: [
          'Compact dual-slot card fits effortlessly in compact M-ATX cases like DeepCool MATREXX 40',
          'Native AMD Mesa open-source Linux kernel driver support with flawless Wayland desktop fluidity',
          'Low 100W power draw leaves over 520W of safety margin on the Corsair CV650 PSU'
        ],
        disadvantages: [
          '2GB GDDR5 memory cannot load modern machine learning models or high-resolution 3D assets',
          'Single 90mm fan must spin faster under load, generating moderate acoustic wind noise'
        ]
      },
      {
        id: 'rx-6600',
        name: 'AMD Radeon RX 6600 8GB (Top MATREXX 40 Upgrade)',
        shortName: 'Radeon RX 6600 8GB',
        architecture: 'RDNA 2 (7nm Navi 23)',
        vram: '8 GB GDDR6',
        vramType: 'GDDR6 (14 Gbps) + 32MB Infinity Cache',
        busWidth: '128-bit (PCIe 4.0 x8)',
        cudaCores: 1792,
        tdpWatts: 132,
        fanCount: 2,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 55,
        powerConnector: '1x 8-pin PCIe',
        idleWatts: 8,
        loadWatts: 135,
        rayTracingCores: 28,
        tensorCores: 0,
        badge: '8GB GDDR6 • 132W • 4.5x R7 360',
        description: 'The premier value upgrade for the MATREXX 40 build. Delivers over 4.5x the compute speed of the R7 360, pairs natively with PCIe 4.0 on Gigabyte B660M DS3H, and leaves +500W PSU headroom on the Corsair CV650.',
        advantages: [
          'Delivers 4.5x compute performance of R7 360 while drawing only 132W TDP (500W PSU headroom)',
          '8GB GDDR6 with 32MB Infinity Cache handles 1080p high refresh esports on ASUS 120Hz display effortlessly',
          'ROCm 6.0 compatible for AMD-accelerated ML workloads with superb Linux kernel stability'
        ],
        disadvantages: [
          'PCIe 4.0 x8 interface incurs small performance penalty if plugged into older PCIe 3.0 motherboards',
          'Lacks dedicated Tensor hardware for NVIDIA-exclusive proprietary AI toolchains'
        ]
      },
      {
        id: 'rtx-4060',
        name: 'NVIDIA GeForce RTX 4060 8GB (AI & DLSS 3 Upgrade)',
        shortName: 'RTX 4060 8GB',
        architecture: 'Ada Lovelace (5nm AD107)',
        vram: '8 GB GDDR6',
        vramType: 'GDDR6 (17 Gbps) + 24MB L2 Cache',
        busWidth: '128-bit (PCIe 4.0 x8)',
        cudaCores: 3072,
        tdpWatts: 115,
        fanCount: 2,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 48,
        powerConnector: '1x 8-pin PCIe',
        idleWatts: 7,
        loadWatts: 115,
        rayTracingCores: 24,
        tensorCores: 96,
        badge: '8GB GDDR6 • 115W Ultra-Cool • DLSS 3',
        description: 'Next-gen Ada Lovelace efficiency drawing only 115W. Equipped with 4th-Gen Tensor Cores for PyTorch ML, AV1 hardware encoding, and DLSS 3 frame generation to maximize the ASUS VA249HG 120Hz display.',
        advantages: [
          'Ultra-efficient 5nm Ada Lovelace architecture draws only 115W, staying ice-cold in M-ATX cases (<60°C)',
          '4th-Gen Tensor Cores with FP8 support supercharge PyTorch and CUDA developer pipelines',
          'Dual AV1 hardware video encoders enable broadcast-quality screen capture with zero CPU penalty'
        ],
        disadvantages: [
          '8GB VRAM buffer is smaller than RTX 3060 12GB for large LLM model parameters',
          '128-bit memory bus relies heavily on 24MB L2 cache to sustain bandwidth'
        ]
      },
      {
        id: 'arc-a750',
        name: 'Intel Arc A750 8GB (Intel Deep Link Upgrade)',
        shortName: 'Intel Arc A750 8GB',
        architecture: 'Alchemist Xe-HPG (6nm ACM-G10)',
        vram: '8 GB GDDR6',
        vramType: 'GDDR6 (16 Gbps, 512 GB/s Bandwidth)',
        busWidth: '256-bit (PCIe 4.0 x16)',
        cudaCores: 3584,
        tdpWatts: 225,
        fanCount: 2,
        fanFlowType: 'dual-axial-standard',
        heatPlumeCfm: 82,
        powerConnector: '1x 8-pin + 1x 6-pin PCIe',
        idleWatts: 35,
        loadWatts: 225,
        rayTracingCores: 28,
        tensorCores: 448,
        badge: '8GB 256-bit • 512 GB/s • Deep Link',
        description: 'Enables Intel Deep Link with the Core i5-12400. Features a massive 256-bit bus delivering 512 GB/s memory bandwidth, dual hardware AV1 encoders, and 448 XMX AI engines with ample Corsair CV650W power headroom.',
        advantages: [
          'Huge 256-bit bus delivers massive 512 GB/s memory bandwidth, crushing memory-bound tasks',
          'Enables Intel Deep Link with Core i5-12400 for collaborative CPU+GPU hardware video transcoding',
          '448 XMX AI engines provide formidable OpenVINO machine learning acceleration'
        ],
        disadvantages: [
          'Higher 225W TDP heat plume warms chassis air cavity and increases fan speed under load',
          'Requires Resizable BAR (ReBAR) support on motherboard to prevent significant driver performance loss'
        ]
      }
    ];
  }

  /**
   * Retrieves case fan models with acoustic and CFM ratings.
   *
   * @returns Array of FanModelConfig.
   */
    public getFanModelOptions(): Array<FanModelConfig> {
    return [
      {
        id: 'cl6-argb',
        name: 'darkFlash CL6 Pro ARGB (Stock)',
        brand: 'darkFlash',
        minRpm: 800,
        maxRpm: 1800,
        silentRpm: 800,
        balancedRpm: 1250,
        turboRpm: 1800,
        maxCfm: 55,
        staticPressureMmH2o: 1.42,
        maxNoiseDba: 28.5,
        bearing: 'Hydro Bearing',
        badge: 'ARGB • 1.42 mm-H₂O',
        description: 'Aesthetic balanced airflow fans with curved impeller blades.',
        advantages: [
          'Vibrant ARGB lighting rings synchronized with workstation aesthetic',
          'Balanced 55 CFM airflow provides reliable general chassis air exchange'
        ],
        disadvantages: [
          'Moderate 1.42 mm-H₂O static pressure loses ~20% throughput when pushing through fine dust filters',
          'Hydro bearing acoustic pitch becomes audible above 1,400 RPM'
        ],
        rigPreset: 'darkflash-leo'
      },
      {
        id: 'arctic-p12',
        name: 'Arctic P12 PWM PST (Universal Upgrade)',
        brand: 'Arctic',
        minRpm: 200,
        maxRpm: 1800,
        silentRpm: 700,
        balancedRpm: 1200,
        turboRpm: 1800,
        maxCfm: 56.3,
        staticPressureMmH2o: 2.20,
        maxNoiseDba: 22.5,
        bearing: 'Fluid Dynamic Bearing',
        badge: 'Pressure-Optimized • 2.20 mm-H₂O',
        description: 'High static pressure blades specifically designed to push air through dense front mesh.',
        advantages: [
          'Outstanding 2.20 mm-H₂O static pressure forces laminar airflow through dense iron mesh and filters',
          'Ultra-low 22.5 dBA noise floor with PST daisy-chain PWM cable sharing',
          'Zero-RPM passive mode support when system is idling under 40°C'
        ],
        disadvantages: [
          'No RGB lighting (clean stealth black appearance only)',
          'Slight resonance motor hum around 1,000-1,050 RPM speed range'
        ],
        rigPreset: 'both'
      },
      {
        id: 'noctua-a12',
        name: 'Noctua NF-A12x25 PWM (Flagship Benchmark)',
        brand: 'Noctua',
        minRpm: 450,
        maxRpm: 2000,
        silentRpm: 650,
        balancedRpm: 1150,
        turboRpm: 2000,
        maxCfm: 60.1,
        staticPressureMmH2o: 2.34,
        maxNoiseDba: 22.6,
        bearing: 'SSO2 Magnetic Bearing',
        badge: 'Sterrox LCP • 2.34 mm-H₂O',
        description: 'Benchmark-setting engineering with Sterrox liquid-crystal polymer and ultra-tight 0.5mm tip clearance.',
        advantages: [
          'Class-leading 2.34 mm-H₂O static pressure with 0.5mm ultra-tight impeller tip clearance',
          'Sterrox liquid-crystal polymer blades eliminate acoustic resonance and blade flex',
          'SSO2 magnetic levitation bearing with 150,000+ hour MTTF industrial reliability'
        ],
        disadvantages: [
          'Premium cost per fan unit ($32.95/ea)',
          'Classic brown/beige color scheme or chromax black only'
        ],
        rigPreset: 'both'
      },
      {
        id: 'deepcool-3fs',
        name: 'DeepCool 3FS 120mm LED (MATREXX 40 Stock)',
        brand: 'DeepCool',
        minRpm: 600,
        maxRpm: 1200,
        silentRpm: 600,
        balancedRpm: 900,
        turboRpm: 1200,
        maxCfm: 42.1,
        staticPressureMmH2o: 1.25,
        maxNoiseDba: 21.0,
        bearing: 'Hydro Bearing',
        badge: 'Pre-Installed 3FS • Low Noise',
        description: 'Three pre-installed 120mm LED fans (2 front intake + 1 rear exhaust). Tuned for quiet, reliable daily operation at 1,200 RPM max.',
        advantages: [
          'Pre-installed 3-fan layout provides out-of-the-box positive pressure in MATREXX 40',
          'Low 1,200 RPM max ceiling ensures whisper-quiet acoustic footprint under 21 dBA',
          '3-color LED ring provides subtle visual confirmation of fan rotation'
        ],
        disadvantages: [
          'Fixed 1,200 RPM top speed limits emergency airflow during extreme dual CPU+GPU synthetic torture',
          'Modest 1.25 mm-H₂O static pressure reduces CFM when front filter collects dust'
        ],
        rigPreset: 'deepcool-matrexx40'
      },
      {
        id: 'deepcool-fk120',
        name: 'DeepCool FK120 High-Pressure PWM',
        brand: 'DeepCool',
        minRpm: 500,
        maxRpm: 1850,
        silentRpm: 750,
        balancedRpm: 1250,
        turboRpm: 1850,
        maxCfm: 68.99,
        staticPressureMmH2o: 2.19,
        maxNoiseDba: 28.0,
        bearing: 'Fluid Dynamic Bearing (FDB)',
        badge: 'High-Static • 2.19 mm-H₂O • FDB',
        description: 'Industrial-grade PBT frame and blades engineered to push high CFM through radiators and dense mesh front panels.',
        advantages: [
          'Formidable 2.19 mm-H₂O static pressure delivering 68.99 CFM through dense mesh panels',
          'FDB fluid bearing provides silent operation at balanced speeds with 50,000h lifespan',
          'Vibration-dampening rubber pads eliminate chassis harmonic vibration transmission'
        ],
        disadvantages: [
          'Stealth black aesthetic without RGB illumination',
          'Noise rises to 28 dBA at maximum 1,850 RPM Turbo burst'
        ],
        rigPreset: 'deepcool-matrexx40'
      },
      {
        id: 'deepcool-fc120',
        name: 'DeepCool FC120 Daisy-Chain ARGB',
        brand: 'DeepCool',
        minRpm: 500,
        maxRpm: 1800,
        silentRpm: 700,
        balancedRpm: 1200,
        turboRpm: 1800,
        maxCfm: 61.91,
        staticPressureMmH2o: 1.83,
        maxNoiseDba: 28.0,
        bearing: 'Hydro Bearing',
        badge: 'Daisy-Chain • 1.83 mm-H₂O • ARGB',
        description: 'Modular daisy-chain cable interconnect simplifies chassis cable management while providing 61.91 CFM and addressable RGB.',
        advantages: [
          'Daisy-chain interconnect transmits both PWM and ARGB through a single cable, eliminating chassis clutter',
          'Healthy 1.83 mm-H₂O pressure and 61.91 CFM output maintains positive MATREXX 40 chamber pressure',
          'Vivid addressable RGB lighting with motherboard software sync'
        ],
        disadvantages: [
          'Proprietary 6-pin interconnect requires DeepCool adapter for standard 4-pin headers',
          'Slightly lower static pressure than pure industrial FK120'
        ],
        rigPreset: 'deepcool-matrexx40'
      },
      {
        id: 'deepcool-mf120gt',
        name: 'DeepCool MF120 GT X-Frame ARGB',
        brand: 'DeepCool',
        minRpm: 500,
        maxRpm: 1800,
        silentRpm: 750,
        balancedRpm: 1200,
        turboRpm: 1800,
        maxCfm: 60.6,
        staticPressureMmH2o: 1.73,
        maxNoiseDba: 30.0,
        bearing: 'Hydro Bearing',
        badge: 'X-Frame • Dual-Blade • ARGB',
        description: 'Inverted X-frame chassis fan with dual-layer aerodynamic blades producing focused linear air columns through the MATREXX 40.',
        advantages: [
          'Inverted X-frame design minimizes dead-zone air recirculation behind the central hub',
          'Dual-layer reverse blades generate a focused linear air column across CPU heatsink and GPU backplate',
          '20 addressable RGB LEDs integrated into frame with motherboard software synchronization'
        ],
        disadvantages: [
          'Slightly higher 30 dBA acoustic signature at full 1,800 RPM speed',
          'X-frame structure requires specific screw orientation in tight chassis corner mounts'
        ],
        rigPreset: 'deepcool-matrexx40'
      },
      {
        id: 'deepcool-rf120m',
        name: 'DeepCool RF120M 5-Pack RGB (Full 5-Fan Array)',
        brand: 'DeepCool',
        minRpm: 500,
        maxRpm: 1500,
        silentRpm: 650,
        balancedRpm: 1050,
        turboRpm: 1500,
        maxCfm: 56.5,
        staticPressureMmH2o: 1.66,
        maxNoiseDba: 27.0,
        bearing: 'Hydro Bearing',
        badge: '5-in-1 Kit • Full 5-Fan Chimney Array',
        description: 'Complete 5-fan replacement kit tailored for MATREXX 40 (2 front intake, 1 rear exhaust, 2 top exhaust). Delivers balanced high-throughput chimney convection.',
        advantages: [
          'Fills every available fan mount in DeepCool MATREXX 40 (2 front + 1 rear + 2 top) for total thermal evacuation',
          'Synchronized 4-pin RGB lighting daisy-chains across all 5 fans with zero extra controller needed',
          '1,500 RPM sweet-spot ceiling prevents acoustic resonance while moving ~220 combined CFM'
        ],
        disadvantages: [
          'Requires routing 5 sets of fan + RGB cables inside compact M-ATX chassis',
          'Moderate 1.66 mm-H₂O pressure is slightly below dedicated industrial FK120'
        ],
        rigPreset: 'deepcool-matrexx40'
      },
      {
        id: 'maxcool-mc5-fan',
        name: 'Maxcool Inferno 120mm ARGB Fans (5-Fan Array)',
        brand: 'Maxcool',
        minRpm: 600,
        maxRpm: 1500,
        silentRpm: 700,
        balancedRpm: 1100,
        turboRpm: 1500,
        maxCfm: 52.0,
        staticPressureMmH2o: 1.55,
        maxNoiseDba: 24.5,
        bearing: 'Hydro Bearing',
        badge: '5-Fan Array • 2 Intake / 3 Exhaust',
        description: 'Array of 5 matched 120mm fans configured for chimney extraction: 2 front intake, 1 rear exhaust, and 2 top exhaust fans.',
        advantages: [
          'Full 5-fan distribution eliminates hot air dead-zones throughout the entire chassis',
          'High exhaust throughput (3 exhaust fans) swiftly draws hot air out through rear and top',
          'Quiet 24.5 dBA noise level at balanced speed profiles'
        ],
        disadvantages: [
          'Slight negative pressure bias requires periodic cleaning of top/front magnetic mesh',
          'Requires fan splitter or hub for 5 fan headers on Micro-ATX motherboards'
        ],
        rigPreset: 'maxcool-mc5'
      }
    ];
  }
  /**
   * Retrieves RAM memory upgrade options for the workstation builds.
   *
   * @returns Array of RamOptionConfig.
   */
    public getRamOptions(): Array<RamOptionConfig> {
    return [
      {
        id: 'corsair-16gb-3200',
        name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz',
        shortName: '16GB DDR4 3200MHz (Current Build)',
        capacityGb: 16,
        configuration: '2x 8GB Dual-Channel Kit',
        speedMhz: 3200,
        timing: 'CL16-20-20-38',
        voltage: 1.35,
        formFactor: 'Low-Profile Anodized Aluminum',
        maxBandwidthGbps: 25.6,
        badge: '16GB (2x8GB) • CL16 • Low Profile',
        dockerCapacity: 'Ideal for 4-6 concurrent Docker containers',
        description: 'Pure aluminum heatspreader for rapid heat dissipation. Low 34mm profile guarantees 100% clearance beneath the DeepCool AG400 tower cooler.',
        advantages: [
          '34mm ultra-low-profile height guarantees zero physical interference with DeepCool AG400 cooler fan',
          'Pure aluminum heatspreader dissipates heat directly into front intake airflow tunnel',
          'CL16-20-20-38 low-latency XMP 2.0 profile provides snappy memory responsiveness'
        ],
        disadvantages: [
          '16GB total capacity restricts running simultaneous heavy Docker containers alongside IDE and local LLMs',
          'All 2 RAM slots populated if on a 2-DIMM motherboard, requiring kit replacement to upgrade'
        ]
      },
      {
        id: 'corsair-32gb-3200',
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz',
        shortName: '32GB DDR4 3200MHz (Developer Sweet Spot)',
        capacityGb: 32,
        configuration: '2x 16GB Dual-Channel Kit',
        speedMhz: 3200,
        timing: 'CL16-20-20-38',
        voltage: 1.35,
        formFactor: 'Low-Profile Anodized Aluminum',
        maxBandwidthGbps: 25.6,
        badge: '32GB (2x16GB) • CL16 • Dev Sweet Spot',
        dockerCapacity: 'Ideal for 12-16 concurrent Docker microservices + IDE',
        description: 'Doubles memory capacity to 32GB while maintaining the exact same 34mm low-profile heatsink clearance and dual-channel 25.6 GB/s bandwidth.',
        advantages: [
          '32GB capacity comfortably runs 15+ Docker microservices, multiple IDE instances, and browser tabs without memory swapping',
          'Maintains low-profile 34mm height for complete heatsink clearance',
          'Dual-rank module organization delivers up to 5% higher memory interleaving performance'
        ],
        disadvantages: [
          'Slightly higher power draw (~3W additional over 16GB kit)',
          'Requires verifying XMP compatibility on budget motherboards'
        ]
      },
      {
        id: 'gskill-32gb-3600',
        name: 'G.Skill Ripjaws V 32GB (2x16GB) DDR4 3600MHz',
        shortName: '32GB DDR4 3600MHz (Low Latency CL16)',
        capacityGb: 32,
        configuration: '2x 16GB Dual-Channel Kit',
        speedMhz: 3600,
        timing: 'CL16-19-19-39',
        voltage: 1.35,
        formFactor: 'Standard Fin Aluminum Heatspreader',
        maxBandwidthGbps: 28.8,
        badge: '32GB (2x16GB) • CL16 3600MHz • +12% Bandwidth',
        dockerCapacity: 'Ideal for high-throughput in-memory caching & compiling',
        description: 'Higher 3600MHz frequency provides 28.8 GB/s peak bandwidth, delivering a 12% boost in memory-bound compilation tasks.',
        advantages: [
          '3600MHz high frequency delivers 28.8 GB/s bandwidth (+12.5% faster data transfer)',
          'Tight CL16 timings maximize AMD Zen 3 Infinity Fabric (1:1 at 1800MHz FCLK) or Intel gear 1',
          'Accelerates in-memory compilation and local database query caching'
        ],
        disadvantages: [
          'Taller 42mm fin height requires checking clearance if using dual-tower air coolers with low front fans',
          'Requires motherboards with robust memory trace routing for stable 3600MHz XMP'
        ]
      },
      {
        id: 'corsair-64gb-3200',
        name: 'Corsair Vengeance LPX 64GB (2x32GB) DDR4 3200MHz',
        shortName: '64GB DDR4 3200MHz (Virtualization Heavyweight)',
        capacityGb: 64,
        configuration: '2x 32GB Dual-Channel Kit',
        speedMhz: 3200,
        timing: 'CL16-20-20-38',
        voltage: 1.35,
        formFactor: 'Low-Profile Anodized Aluminum',
        maxBandwidthGbps: 25.6,
        badge: '64GB (2x32GB) • Massive Capacity',
        dockerCapacity: 'Ideal for 30+ containers, multi-VM clusters & AI datasets',
        description: 'Maximum memory density in a 2-DIMM dual-channel footprint. Eliminates any possibility of RAM exhaustion during large-scale local AI and Kubernetes cluster testing.',
        advantages: [
          'Colossal 64GB memory capacity enables running local Kubernetes clusters, VM labs, and massive datasets in memory',
          'Eliminates SSD swap thrashing completely, extending NVMe SSD endurance',
          'Low 34mm height fits seamlessly beneath all air cooler designs'
        ],
        disadvantages: [
          'Higher financial investment',
          'High memory density puts greater load on CPU integrated memory controller'
        ]
      }
    ];
  }
}
