/**
 * Dedicated i18n localization dictionary and type contract for the Workstation module.
 * Centralizes all user-facing strings, CAD telemetry descriptors, section labels,
 * hardware customizer UI text, and fluid dynamic aerodynamic annotations.
 */

export interface WorkstationI18n {
  /** Top module and console identity */
  module_brand: string;
  section_label: string;
  title: string;
  subtitle: string;
  breadcrumb_root: string;
  breadcrumb_current: string;
  active_build_label: string;
  active_profile_tag: string;

  /** Dedicated Navigation Tabs */
  airflow_tab: string;
  specs_tab: string;
  pressure_tab: string;
  benchmarks_tab: string;

  /** Top CAD Simulation Filter Controls */
  chassis_architecture_label: string;
  fan_speed_label: string;
  toggle_view_label: string;
  streamlines_label: string;
  heatmap_label: string;
  cool_intake_legend: string;
  gpu_flow_legend: string;
  exhaust_legend: string;

  /** Staged Actions */
  apply_layout_btn: string;
  apply_profile_btn: string;
  apply_fans_btn: string;
  apply_mods_btn: string;
  staged_tag: string;

  /** Hardware Customizer Deck */
  hardware_customizer_title: string;
  hardware_customizer_subtitle: string;
  gpu_select_label: string;
  cpu_select_label: string;
  cooler_select_label: string;
  fan_model_select_label: string;
  top_fans_mounts_label: string;
  slot1_label: string;
  slot2_label: string;

  /** Telemetry Metrics */
  intake_label: string;
  exhaust_label: string;
  net_label: string;
  positive_badge: string;
  cpu_load_label: string;
  gpu_load_label: string;
  acoustics_label: string;
  power_tdp_label: string;

  /** Subpage Deep Dives */
  pressure_title: string;
  pressure_subtitle: string;
  benchmarks_title: string;
  benchmarks_subtitle: string;
  specs_title: string;
  specs_subtitle: string;

  /** Footer & Navigation Return */
  return_to_portfolio: string;
  footer_tagline: string;
  footer_status: string;
}

export const WORKSTATION_I18N: WorkstationI18n = {
  module_brand:               'SYS::WORKSTATION',
  section_label:              'Hardware & Workstation Engineering',
  title:                      'Workstation Architecture & Thermals',
  subtitle:                   'Personal workstation hardware specifications, thermal zone mapping, and real-time positive pressure airflow simulation.',
  breadcrumb_root:            'Portfolio',
  breadcrumb_current:         'Workstation Architecture & Thermals',
  active_build_label:         'Active Build:',
  active_profile_tag:         'Active Profile',

  airflow_tab:                'Airflow & Thermal Simulation',
  specs_tab:                  'Hardware Specs',
  pressure_tab:               'Pressure Dynamics',
  benchmarks_tab:             'Benchmarks & Lab',

  chassis_architecture_label: 'Chassis Architecture',
  fan_speed_label:            'Fan & Thermal Profile',
  toggle_view_label:          'Chassis Airflow Architecture',
  streamlines_label:          'Streamlines',
  heatmap_label:              'Heatmap',
  cool_intake_legend:         'Cool Intake Air',
  gpu_flow_legend:            'GPU Upward Flow',
  exhaust_legend:             'Hot Exhaust',

  apply_layout_btn:           'Apply Layout',
  apply_profile_btn:          'Apply Profile',
  apply_fans_btn:             'Apply Fan Setup',
  apply_mods_btn:             'APPLY MODS',
  staged_tag:                 'Staged',

  hardware_customizer_title:   'Hardware Component Customizer',
  hardware_customizer_subtitle: 'Real-time dynamic impact on airflow CFM, thermals & acoustics',
  gpu_select_label:           'Graphics Card (GPU)',
  cpu_select_label:           'Processor (CPU)',
  cooler_select_label:        'CPU Cooler',
  fan_model_select_label:     'Chassis Fan Model',
  top_fans_mounts_label:      'Top Fan Direction Mounts:',
  slot1_label:                'Slot 1: Top-Rear (Above CPU)',
  slot2_label:                'Slot 2: Top-Front (Above RAM)',

  intake_label:               'Total Intake Volume',
  exhaust_label:              'Total Exhaust Volume',
  net_label:                  'Net Airflow Differential',
  positive_badge:             'Optimized Positive Pressure (Dust-Repelling)',
  cpu_load_label:             'CPU Load Temp',
  gpu_load_label:             'GPU Load Temp',
  acoustics_label:            'Acoustic Profile',
  power_tdp_label:            'Total System TDP',

  pressure_title:             'Chassis Pressure & Volumetric Flow Dynamics',
  pressure_subtitle:          'Engineering analysis of positive static pressure, dust immunity, and laminar airflow corridors.',
  benchmarks_title:           'Workstation Performance & Thermal Stress Lab',
  benchmarks_subtitle:        'Real-world developer build benchmarks, local AI inference throughput, and 100% sustained thermal torture testing.',
  specs_title:                'Personal Rig Specifications & Component Blueprint',
  specs_subtitle:             'Detailed component inventory, architectural rationale, and acoustic profiles for active desktop hardware.',

  return_to_portfolio:        'Return to Main Portfolio (Nafi.dev)',
  footer_tagline:             'SYS::WORKSTATION Hardware & Aerodynamics Lab',
  footer_status:              'All subsystems nominal'
};

/** Alias for compatibility */
export const WORKSTATION_EN: WorkstationI18n = WORKSTATION_I18N;
