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

export interface AirflowLayout {
  id: 'standard-mesh' | 'dual-chamber';
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

