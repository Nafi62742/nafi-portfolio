/**
 * Interfaces and types for Workstation Architecture and Airflow Dynamics Simulation.
 */

export interface WorkstationComponentSpec {
  name: string;
  category: 'cpu' | 'cooler' | 'gpu' | 'ram' | 'motherboard' | 'storage' | 'case' | 'psu' | 'fans';
  model: string;
  brand: string;
  icon: string;
  badge?: string;
  accentColor: string;
  details: Array<{ label: string; value: string }>;
  features: string[];
  roleInThermal?: string;
}

export interface CaseFanNode {
  id: string;
  name: string;
  type: 'intake' | 'exhaust';
  position: 'front' | 'rear' | 'top' | 'bottom' | 'side' | 'cpu';
  sizeMm: number;
  rpm: number;
  cfm: number;
  noiseDb: number;
  description: string;
}

export type AirflowLayoutId = 'standard-mesh' | 'matrexx-40' | 'maxcool-mc5' | 'dual-chamber';

export interface AirflowLayout {
  id: AirflowLayoutId;
  name: string;
  subtitle: string;
  caseName: string;
  pressureType: 'Positive' | 'Neutral' | 'Negative';
  description: string;
  intakeTotalCfm: number;
  exhaustTotalCfm: number;
  fans: CaseFanNode[];
  advantages: string[];
}

export type FanSpeedProfile = 'silent' | 'balanced' | 'turbo';

export type TopFanDirection = 'off' | 'exhaust' | 'intake';

export type CpuModelId = 'i5-10400f' | 'i5-12400' | 'i7-10700k' | 'i9-10900k' | 'r5-5600' | 'r5-5600x';

export interface CpuOptionConfig {
  id: CpuModelId;
  name: string;
  shortName: string;
  brand: 'Intel' | 'AMD';
  cores: string;
  baseClock: string;
  turboClock: string;
  tdpWatts: number;
  maxLoadWatts: number;
  socket: string;
  thermalDifficulty: 'Low' | 'Moderate' | 'High' | 'Extreme';
  badge: string;
  description: string;
  advantages?: string[];
  disadvantages?: string[];
}

export type CpuCoolerId = 'ag400' | 'ak400' | 'intel-stock' | 'peerless-assassin' | 'aio-240';

export interface CpuCoolerOptionConfig {
  id: CpuCoolerId;
  name: string;
  shortName: string;
  type: 'single-tower' | 'stock-flower' | 'dual-tower' | 'aio-liquid';
  heatpipes: string;
  fanCount: number;
  fanSizeMm: number;
  minRpm: number;
  maxRpm: number;
  silentRpm: number;
  balancedRpm: number;
  turboRpm: number;
  maxCfm: number;
  maxNoiseDba: number;
  coolingCapacityTdp: number;
  badge: string;
  description: string;
  advantages?: string[];
  disadvantages?: string[];
}

export type GpuModelId = 'rtx-3060' | 'gtx-1650' | 'gtx-1650s' | 'r7-360' | 'rx-6600' | 'rtx-4060' | 'arc-a750';

export interface GpuOptionConfig {
  id: GpuModelId;
  name: string;
  shortName: string;
  architecture: string;
  vram: string;
  vramType: string;
  busWidth: string;
  cudaCores: number;
  tdpWatts: number;
  fanCount: number;
  fanFlowType: 'triple-axial-upward' | 'dual-axial-standard';
  heatPlumeCfm: number;
  powerConnector: string;
  idleWatts: number;
  loadWatts: number;
  rayTracingCores: number;
  tensorCores: number;
  badge: string;
  description: string;
  advantages?: string[];
  disadvantages?: string[];
}

export type FanModelId =
  | 'cl6-argb'
  | 'arctic-p12'
  | 'noctua-a12'
  | 'deepcool-3fs'
  | 'deepcool-fk120'
  | 'deepcool-fc120'
  | 'deepcool-mf120gt'
  | 'deepcool-rf120m'
  | 'maxcool-mc5-fan';

export type RamOptionId = 'corsair-16gb-3200' | 'corsair-32gb-3200' | 'gskill-32gb-3600' | 'corsair-64gb-3200';

export interface RamOptionConfig {
  id: RamOptionId;
  name: string;
  shortName: string;
  capacityGb: number;
  configuration: string;
  speedMhz: number;
  timing: string;
  voltage: number;
  formFactor: string;
  maxBandwidthGbps: number;
  badge: string;
  dockerCapacity: string;
  description: string;
  advantages?: string[];
  disadvantages?: string[];
}

export type PcRigPresetId = 'darkflash-leo' | 'deepcool-matrexx40' | 'maxcool-mc5';

export interface PcRigProfileConfig {
  id: PcRigPresetId;
  name: string;
  badge: string;
  tagline: string;
  caseName: string;
  caseDimensions: string;
  cpuName: string;
  cpuId: CpuModelId;
  gpuName: string;
  gpuId: GpuModelId;
  coolerId: CpuCoolerId;
  fanModelId: FanModelId;
  layoutId: AirflowLayoutId;
  psuName: string;
  ramName: string;
  storagePrimary: string;
  storageSecondary?: string;
  motherboard: string;
  monitor?: string;
  keyboard?: string;
  description: string;
}

export interface FanModelConfig {
  id: FanModelId;
  name: string;
  brand: string;
  minRpm: number;
  maxRpm: number;
  silentRpm: number;
  balancedRpm: number;
  turboRpm: number;
  maxCfm: number;
  staticPressureMmH2o: number;
  maxNoiseDba: number;
  bearing: string;
  badge: string;
  description: string;
  advantages?: string[];
  disadvantages?: string[];
  rigPreset?: PcRigPresetId | 'both';
}

export interface CustomizationTradeoffAnalysis {
  netPressureCfm: number;
  pressureState: string;
  pressureVerdict: 'optimal' | 'acceptable' | 'warning';
  estimatedCpuLoadTemp: string;
  estimatedGpuLoadTemp: string;
  totalSystemTdpWatts: number;
  psuSafetyMarginWatts: number;
  psuUtilizationPercent: number;
  psuSafetyStatus: 'safe' | 'optimal' | 'warning';
  acousticRatingDba: number;
  acousticCategory: string;
  keyAdvantages: string[];
  keyDisadvantages: string[];
  thermalTip: string;
}

export interface FanSpeedConfig {
  profile: FanSpeedProfile;
  label: string;
  icon: string;
  multiplier: number;
  intakeRpm: number;
  exhaustRpm: number;
  cpuRpm: number;
  noiseLevel: string;
  ambientTempC: number;
  cpuTempC: number;
  gpuTempC: number;
}

export interface AirflowConditionReport {
  id: string;
  title: string;
  tagline: string;
  conditionDescription: string;
  fanSetupLabel: string;
  speedProfileLabel: string;
  pressureType: 'Strong Positive' | 'Balanced Positive' | 'Neutral Airflow' | 'Negative Airflow';
  netPressureCfm: number;
  intakeCfm: number;
  exhaustCfm: number;
  acousticDba: number;
  acousticCategory: 'Whisper Silent' | 'Studio Quiet' | 'Moderate Flow' | 'High Performance Audible';
  temperatures: {
    cpuLoad: string;
    gpuLoad: string;
    vrmTemp: string;
    psuChamber: string;
  };
  advantages: string[];
  disadvantages: string[];
  gpuUpwardFlowBehavior: string;
  recommendedUseCases: string[];
  thermalTip: string;
}

export interface ComponentConditionDetail {
  id: string;
  name: string;
  category: string;
  icon: string;
  statusBadge: string;
  statusType: 'optimal' | 'good' | 'warning' | 'active';
  temperature?: string;
  conditionSummary: string;
  thermalRole: string;
  airflowInteraction: string;
  currentImpact: string;
  metrics: Array<{ label: string; value: string; hint?: string }>;
}

export interface WorkstationBenchmarkItem {
  id: string;
  category: 'development' | 'ai-inference' | 'synthetic' | 'rendering';
  categoryLabel: string;
  title: string;
  metric: string;
  label: string;
  baselineComparison: string;
  hardwareUsed: string;
  description: string;
  percentage: number;
  icon: string;
  status: 'exceptional' | 'great' | 'optimal';
  specsPill?: string;
}

export interface ThermalStressPoint {
  workload: string;
  state: 'idle' | 'coding' | 'compiling' | 'torture';
  cpuTemp: number;
  gpuTemp: number;
  vrmTemp: number;
  fanRpm: number;
  noiseDb: number;
  powerDrawWatts: number;
  behaviorNote: string;
}

export interface PowerDistributionItem {
  rail: string;
  component: string;
  idleWatts: number;
  loadWatts: number;
  maxWatts: number;
  efficiencyRating: string;
}

export interface SystemVitalsSummary {
  cores: string;
  vram: string;
  ram: string;
  storage: string;
  coolingCapacity: string;
  powerSupply: string;
  chassisVolume: string;
}


