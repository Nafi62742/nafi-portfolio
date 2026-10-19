import { Injectable } from '@angular/core';

import {
  AirflowConditionReport,
  AirflowLayout,
  ComponentConditionDetail,
  FanSpeedConfig,
  FanSpeedProfile,
  TopFanDirection,
  WorkstationComponentSpec
} from '@models/workstation.models';

/**
 * Service providing workstation hardware specifications and airflow simulation configurations.
 */
@Injectable({ providedIn: 'root' })
export class WorkstationService {

  /**
   * Retrieves the detailed hardware specifications for the user's build.
   *
   * @returns Array of WorkstationComponentSpec representing all build components.
   */
  public getWorkstationSpecs(): Array<WorkstationComponentSpec> {
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
    layoutId: 'standard-mesh' | 'dual-chamber' = 'standard-mesh'
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

    if (layoutId === 'dual-chamber') {
      const intakeCfm: number = Math.round(105 * speedMultiplier);
      const exhaustCfm: number = Math.round(145 * speedMultiplier);
      const netCfm: number = intakeCfm - exhaustCfm;
      return {
        id: 'dual-chamber-report',
        title: 'Dual-Chamber Panoramic Layout (Comparison Model)',
        tagline: 'Side 2x 120mm Intake • Top 360mm Radiator Exhaust • Bottom Chimney Assist',
        conditionDescription:
          'Dual-chamber aesthetic showcase utilizing high-volume top 360mm exhaust with negative-pressure bias. Features separate rear power supply compartment and uninhibited glass viewing angle.',
        fanSetupLabel: '2x Side Intake • 3x Top Exhaust • 1x Rear Exhaust',
        speedProfileLabel: speedLabel,
        pressureType: 'Negative Airflow',
        netPressureCfm: netCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: Number((baseDba + 2.4).toFixed(1)),
        acousticCategory: speedProfile === 'silent' ? 'Studio Quiet' : 'Moderate Flow',
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '68°C' : speedProfile === 'turbo' ? '54°C' : '61°C',
          gpuLoad: speedProfile === 'silent' ? '69°C' : speedProfile === 'turbo' ? '56°C' : '63°C',
          vrmTemp: '48°C',
          psuChamber: '32°C (Dual-Chamber rear isolated)'
        },
        advantages: [
          'Panoramic unobstructed tempered glass viewing from front and side',
          'Huge 360mm top radiator support suitable for high-wattage liquid AIO loops',
          'Complete isolation of power supply cables in the second rear chamber',
          'Vertical chimney draft expedites natural thermal heat dissipation'
        ],
        disadvantages: [
          'Negative pressure gradient pulls unfiltered dust in through rear panel cutouts',
          'Significantly wider desk footprint (285mm wide vs 190mm on darkFlash Leo)',
          'Side intake air must turn 90 degrees to wash across the motherboard, reducing static pressure velocity',
          'Requires 6 to 9 total fans for optimal acoustic and thermal balance'
        ],
        gpuUpwardFlowBehavior:
          'GPU sits over bottom intake cutouts and exhausts upward toward the top 360mm radiator, slightly elevating radiator coolant temperature under combined GPU load.',
        recommendedUseCases: [
          'High-end custom aesthetic workstations',
          'Liquid-cooled high-TDP processor systems (150W+ TDP)',
          'Desk showcase builds with continuous dust cleaning'
        ],
        thermalTip:
          'Add bottom intake fans in dual-chamber chassis to convert the chamber from negative to positive pressure, preventing dust accumulation.'
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
    const finalDba: number = Number((baseDba + addedDba).toFixed(1));

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

    // HYBRID SETUP: Top-Front Intake + Top-Rear Exhaust (Enthusiast Setup)
    if (frontTop === 'intake' && rearTop === 'exhaust') {
      return {
        id: 'leo-hybrid-top-fans',
        title: 'Hybrid Push-Pull: Top-Front Intake & Top-Rear Exhaust',
        tagline: 'Active Cold Air Funnel to AG400 CPU & RAM • High-Velocity Rear Plume Evacuation',
        conditionDescription:
          'An advanced enthusiast aerodynamic layout. Flipping the Top-Front fan into an intake forces fresh ambient air directly downward through the top magnetic filter over the 32GB DDR4 RAM and straight into the DeepCool AG400 push fan intake. Simultaneously, the Top-Rear exhaust fan and rear fan create an immediate evacuation vortex for the CPU wake and the RTX 3060 triple-fan upward thermal plume. Eliminates intake air scavenging and maintains high positive pressure (+90 CFM).',
        fanSetupLabel: '3x Front Intake • 1x Top-Front Intake ↓ • 1x Top-Rear Exhaust ↑ • 1x Rear Exhaust ↑',
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '59°C' : speedProfile === 'turbo' ? '49°C' : '54°C',
          gpuLoad: speedProfile === 'silent' ? '63°C' : speedProfile === 'turbo' ? '53°C' : '59°C',
          vrmTemp: speedProfile === 'silent' ? '40°C' : '36°C',
          psuChamber: '31°C (Independent lower tunnel isolation)'
        },
        advantages: [
          'Direct CPU & RAM cold funnel: Dumps fresh unheated room air right in front of the DeepCool AG400 cooler, lowering CPU load temps by 3°C to 4°C',
          'Eliminates intake air scavenging: Front Fan #1 air is fully utilized rather than being prematurely sucked out by a top-front exhaust fan',
          'Active RAM & VRM downdraft cooling: Memory sticks and motherboard power delivery heatsinks operate ~4°C to 5°C cooler',
          'Strong positive dust-repelling pressure: 4 intake fans (+90 CFM net) force air outward through unsealed chassis gaps'
        ],
        disadvantages: [
          'Settling dust intake: Ambient room dust settling on the top panel when powered off can be pulled inside (requires regular wiping of the top magnetic filter)',
          '90-degree boundary layer turbulence: Downward top-front airflow collides with the horizontal stream from Front Fan #1 (solved by running top-front fan at lower RPM)',
          'Aesthetic orientation: Back motor frame/struts of standard top-front fan face downward toward the tempered glass window'
        ],
        gpuUpwardFlowBehavior:
          'The downward airflow from the Top-Front intake acts as an aerodynamic air-curtain, preventing the RTX 3060 upward thermal discharge from curling into the front of the case. The rising GPU plume is funneled directly into the Top-Rear and rear exhaust fans, preventing thermal recirculation.',
        recommendedUseCases: [
          'Prolonged CPU-heavy compilation (Rust, C++, TypeScript monorepos)',
          'Intensive multi-hour 3D rendering and physics simulation',
          'High-ambient room temperature environments where CPU cooling is paramount'
        ],
        thermalTip:
          'Run the Top-Front intake fan at a gentle 700–900 RPM curve to smoothly funnel air to the AG400 without creating acoustic wind turbulence against Front Fan #1.'
      };
    }

    // DUAL TOP EXHAUST: Top-Front Exhaust + Top-Rear Exhaust
    if (frontTop === 'exhaust' && rearTop === 'exhaust') {
      return {
        id: 'leo-2-top-fans',
        title: '6-Fan Full Array: Maximum Dual-Chimney Flow (Dual Top Exhaust)',
        tagline: '3x Front Mesh Intake • 2x Top 120mm Exhaust ↑ • 1x Rear Exhaust ↑ (100% Slot Saturation)',
        conditionDescription:
          'Maximum exhaust capacity utilizing all 6 available 120mm fan slots in the darkFlash Leo chassis. Two 120mm exhaust fans installed beneath the magnetic filter draw massive vertical air currents, establishing a true chimney-style push-pull dynamic. Intake (145 CFM) and exhaust (135 CFM) operate in near-perfect equilibrium.',
        fanSetupLabel: '3x Front Intake • 2x Top Exhaust ↑ • 1x Rear Exhaust ↑ (6/6 Fans Fully Populated)',
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '60°C' : speedProfile === 'turbo' ? '50°C' : '55°C',
          gpuLoad: speedProfile === 'silent' ? '62°C' : speedProfile === 'turbo' ? '52°C' : '58°C',
          vrmTemp: speedProfile === 'silent' ? '42°C' : '37°C',
          psuChamber: '31°C (Dedicated lower tunnel isolation)'
        },
        advantages: [
          'Lowest overall chamber temperatures: Delivers peak thermal evacuation for high-load gaming and 3D graphics',
          'Complete upward alignment: The 3 upward-blowing fans on the RTX 3060 have their thermal discharge evacuated vertically in real time',
          'VRM and motherboard surface cooling: Rapid air turnover keeps motherboard VRM heatsinks and PCIe Gen3/Gen4 M.2 SSDs running frosty',
          'Symmetrical premium look: Fully populated fan array looks stunning through the edge-to-edge tempered glass side panel'
        ],
        disadvantages: [
          'Lower positive pressure buffer: Net positive pressure is narrowed to +10 CFM, requiring periodic cleaning of the rear honeycomb mesh',
          'Intake scavenging risk: If the front-top fan runs at high RPM, it can prematurely exhaust fresh air entering from Front Fan #1 before it reaches the CPU cooler',
          'Higher acoustic footprint: 6 rotating fans generate slightly more decibels (+3.1 dBA over stock 4-fan layout)'
        ],
        gpuUpwardFlowBehavior:
          'Ideal aerodynamic synergy: The triple axial fans on the RTX 3060 blow upward directly into the dual top exhaust fans above. There is virtually zero thermal recirculation; the heated exhaust is expelled through the chassis roof in under 0.25 seconds.',
        recommendedUseCases: [
          'Machine learning / AI model training and sustained Tensor Core inference',
          'Extended 4K video rendering and high-load graphics workflows',
          'Overclocked / high-ambient room environments (summer room temps > 30°C)'
        ],
        thermalTip:
          'Tune the front-top exhaust fan curve to spin ~200 RPM slower than the rear-top fan to prevent it from pulling fresh intake air out prematurely.'
      };
    }

    // TARGETED REAR-TOP EXHAUST ONLY: rearTop === 'exhaust', frontTop === 'off'
    if (rearTop === 'exhaust' && frontTop === 'off') {
      return {
        id: 'leo-1-top-fan',
        title: '5-Fan Array: Targeted Rear-Top Plume Evacuation (Optimal Balance)',
        tagline: '3x Front Mesh Intake • 1x Rear-Top Exhaust ↑ • 1x Rear Exhaust ↑ (Direct Plume Capture)',
        conditionDescription:
          'The sweet-spot upgrade for the darkFlash Leo. A single 120mm exhaust fan is installed in the rear-top chassis mount directly above the DeepCool AG400 CPU cooler and the RTX 3060 rear heat vents. This establishes an active 90-degree dual-exhaust vortex that instantly evacuates the upward thermal plume while leaving the front-top area passive to prevent stealing cold intake air.',
        fanSetupLabel: '3x Front Intake • 1x Rear-Top Exhaust ↑ • 1x Rear Exhaust ↑ (5 Fans Active)',
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '63°C' : speedProfile === 'turbo' ? '53°C' : '58°C',
          gpuLoad: speedProfile === 'silent' ? '65°C' : speedProfile === 'turbo' ? '55°C' : '61°C',
          vrmTemp: speedProfile === 'silent' ? '45°C' : '40°C',
          psuChamber: '31°C (Independent lower shroud isolation)'
        },
        advantages: [
          'Immediate thermal plume interception: Directly captures the hot air rising from the RTX 3060 backplate and DeepCool AG400 exhaust wake',
          'No intake scavenging: Leaving the forward top slot passive guarantees 100% of Front Fan #1 cool intake enters the CPU tower cooler and RAM',
          'Maintains positive static pressure: Generates +50 CFM net positive pressure, maintaining full dust resistance across all seams',
          'Excellent thermal-to-noise ratio: Drops CPU temperature by ~4°C and GPU by ~3°C with only a negligible +1.6 dBA sound increase'
        ],
        disadvantages: [
          'Asymmetric top aesthetic: One top fan installed while the front-top slot remains empty under the magnetic filter',
          'Requires 1 additional 4-pin PWM fan header or a PWM Y-splitter off the rear fan channel',
          'Forward GPU heat still relies partly on ambient internal airflow momentum'
        ],
        gpuUpwardFlowBehavior:
          'The upward thermal discharge from the RTX 3060 triple fans is split: the rear and center fan plumes are pulled directly upward into the rear-top exhaust fan, while the rear bracket fan exhausts out the back. Thermal recirculation inside the upper chamber is reduced by over 65%.',
        recommendedUseCases: [
          'Heavy compilation jobs (Rust/C++/TypeScript monorepos), Docker containerized microservices',
          'Blender 3D GPU rendering and Unreal Engine development',
          'Long gaming marathons demanding low fan noise and stable boost clocks'
        ],
        thermalTip:
          'Connect the rear-top exhaust fan and the rear exhaust fan to the same motherboard fan header via a PWM splitter so they ramp up in harmony.'
      };
    }

    // DUAL TOP INTAKE: rearTop === 'intake', frontTop === 'intake'
    if (rearTop === 'intake' && frontTop === 'intake') {
      return {
        id: 'leo-dual-top-intake',
        title: 'Dual Top Downdraft: Maximum Positive Pressure Array',
        tagline: '5x Total Intake Fans (3 Front + 2 Top ↓) • 1x Rear Exhaust ↑ • Ultra Overpressure',
        conditionDescription:
          'High positive pressure downdraft configuration where both top fans ingest cool air into the upper motherboard chamber. Generates extreme +170 CFM positive pressure, ensuring zero unfiltered dust entry and flooding the CPU tower cooler with room-temperature air.',
        fanSetupLabel: '3x Front Intake • 2x Top Intake ↓ • 1x Rear Exhaust ↑',
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '61°C' : speedProfile === 'turbo' ? '51°C' : '56°C',
          gpuLoad: speedProfile === 'silent' ? '65°C' : speedProfile === 'turbo' ? '56°C' : '62°C',
          vrmTemp: speedProfile === 'silent' ? '39°C' : '35°C',
          psuChamber: '31°C'
        },
        advantages: [
          'Extreme dust immunity: Heavy outward airflow prevents dust intrusion in high-dust workshop environments',
          'Supercharged VRM & RAM cooling: Direct vertical airflow washes continuously over upper motherboard phases',
          'High static air replenishment around the CPU heatsink'
        ],
        disadvantages: [
          'Top-Rear intake fights the natural convective rise of GPU heat, causing slight heat turbulence in the rear upper corner',
          'Single 120mm rear exhaust fan is heavily backpressured by 5 incoming intake fans'
        ],
        gpuUpwardFlowBehavior:
          'The upward rising heat from the GPU collides with the downward draft of the Top-Rear intake fan, forcing heat to disperse laterally out the rear I/O and PCIe vents.',
        recommendedUseCases: [
          'Extremely dusty rooms, carpeted floors, and high positive-pressure industrial setups'
        ],
        thermalTip:
          'Ensure the rear exhaust fan runs at maximum RPM to relieve the massive positive chamber pressure.'
      };
    }

    // FRONT-TOP INTAKE ONLY: frontTop === 'intake', rearTop === 'off'
    if (frontTop === 'intake' && rearTop === 'off') {
      return {
        id: 'leo-front-top-intake-only',
        title: '5-Fan Array: Front-Top Inflow Downdraft & Single Rear Exhaust',
        tagline: '4x Total Intake (3 Front + 1 Top-Front ↓) • 1x Rear Exhaust ↑ • High Positive Pressure',
        conditionDescription:
          'Utilizes the Top-Front mount as a supplementary cold air intake aimed directly at the DeepCool AG400 CPU cooler and RAM modules, with the rear-top mount remaining passive.',
        fanSetupLabel: '3x Front Intake • 1x Top-Front Intake ↓ • 1x Rear Exhaust ↑',
        speedProfileLabel: speedLabel,
        pressureType,
        netPressureCfm,
        intakeCfm,
        exhaustCfm,
        acousticDba: finalDba,
        acousticCategory,
        temperatures: {
          cpuLoad: speedProfile === 'silent' ? '62°C' : speedProfile === 'turbo' ? '52°C' : '57°C',
          gpuLoad: speedProfile === 'silent' ? '66°C' : speedProfile === 'turbo' ? '56°C' : '62°C',
          vrmTemp: speedProfile === 'silent' ? '41°C' : '37°C',
          psuChamber: '31°C'
        },
        advantages: [
          'Injects fresh cold air right in front of the AG400 CPU cooler push fan',
          'Maintains heavy positive pressure (+130 CFM) with filtered air',
          'Low total noise profile with only 5 fans running'
        ],
        disadvantages: [
          'Top panel settles dust when powered down that enters upon startup',
          'Upward GPU heat in the rear section relies entirely on the single rear 120mm exhaust fan'
        ],
        gpuUpwardFlowBehavior:
          'GPU upward plume rises naturally into the passive rear-top mesh and is drawn out by the rear exhaust fan.',
        recommendedUseCases: [
          'CPU-intensive coding and compiling where GPU stays idling or at light load'
        ],
        thermalTip:
          'Clean the top magnetic mesh filter regularly to prevent dust ingestion.'
      };
    }

    // STOCK SETUP: rearTop === 'off', frontTop === 'off' (or any remaining)
    return {
      id: 'leo-0-top-fans',
      title: '4-Fan Quad Array: Strong Positive Pressure (Stock Leo Setup)',
      tagline: '3x Front Mesh Intake • 1x Rear 120mm Exhaust • Passive Magnetic Top Mesh',
      conditionDescription:
        'The default factory configuration of the darkFlash Leo chassis. 3 front 120mm intake fans deliver pressurized ambient air into the SPCC steel chamber. Front Fan #1 feeds the DeepCool AG400 CPU cooler and RAM, Front Fan #2 feeds the RTX 3060 graphics card, and Front Fan #3 blows directly through the lower shroud cutout into the 3.5" HDD cage and 750W PSU. High positive pressure forces air outward through passive top vents and rear PCIe slots.',
      fanSetupLabel: '3x Front Intake • 0x Top Fans • 1x Rear Exhaust (4 Fans Active)',
      speedProfileLabel: speedLabel,
      pressureType,
      netPressureCfm,
      intakeCfm,
      exhaustCfm,
      acousticDba: finalDba,
      acousticCategory,
      temperatures: {
        cpuLoad: speedProfile === 'silent' ? '67°C' : speedProfile === 'turbo' ? '57°C' : '62°C',
        gpuLoad: speedProfile === 'silent' ? '68°C' : speedProfile === 'turbo' ? '58°C' : '64°C',
        vrmTemp: speedProfile === 'silent' ? '49°C' : '44°C',
        psuChamber: '31°C (Dual intake via Front Fan #3 and underside dust filter)'
      },
      advantages: [
        'Maximum dust protection: Strong positive pressure (+90 CFM) repels ambient dust from entering through unsealed seams or PCIe slots',
        'Silent acoustic signature: Only 4 total chassis fans spinning, minimizing mechanical motor vibrations and resonance',
        'Direct lower shroud airflow: Front Fan #3 provides unhindered cold intake directly into the HDD cage and 750W PSU tunnel',
        'Energy & wiring efficiency: Operates comfortably with standard motherboard fan headers without requiring secondary fan splitters'
      ],
      disadvantages: [
        'Upward heat accumulation: The RTX 3060 triple-fan assembly projects heated air upward; with no active top fans, a warm thermal pocket develops near the upper roof before slowly escaping rearward',
        'Single exhaust bottleneck: The lone 120mm rear exhaust fan carries the full burden of evacuating the combined CPU + GPU thermal dissipation',
        'Slightly higher CPU delta-T: CPU tower cooler ingests pre-warmed ambient air rising from the GPU backplate (+4°C under heavy combined workloads)'
      ],
      gpuUpwardFlowBehavior:
        'The 3 axial fans on the RTX 3060 pull air from the lower chamber and project it directly upward through the heatsink. Under this 4-fan layout, the upward discharge hits the passive top magnetic mesh. A portion escapes via natural thermal buoyancy, while the rest is drawn backward across the CPU zone toward the single rear exhaust fan.',
      recommendedUseCases: [
        'Full-time coding, IDE compiling, Docker development, and silent web browsing',
        'Carpeted or dusty environments where dust filtration is the #1 priority',
        'General productivity and moderate 1080p gaming sessions'
      ],
      thermalTip:
        'Leave the magnetic mesh filter on top to catch settling room dust when powered down, while positive pressure pushes internal air outward through it during operation.'
    };
  }

  /**
   * Retrieves live, configuration-aware condition details for any tapped chassis component.
   * Reflects real-time operating temperatures, airflow interaction, and dynamic impact
   * of the active top fan arrangement and fan speed profile.
   *
   * @param componentId - Selected component ID (e.g. 'cpu', 'gpu', 'ram', 'vrm', 'psu', 'nvme', 'hdd-bay', 'front-fan-1', etc.).
   * @param rearTop - Top-Rear fan direction ('off', 'exhaust', 'intake').
   * @param frontTop - Top-Front fan direction ('off', 'exhaust', 'intake').
   * @param speedProfile - Active fan speed profile ('silent', 'balanced', 'turbo').
   * @param layoutId - Active chassis layout ID ('standard-mesh' or 'dual-chamber').
   * @returns Detailed ComponentConditionDetail for the selected component.
   */
  public getComponentCondition(
    componentId: string,
    rearTop: TopFanDirection = 'off',
    frontTop: TopFanDirection = 'off',
    speedProfile: FanSpeedProfile = 'balanced',
    layoutId: 'standard-mesh' | 'dual-chamber' = 'standard-mesh'
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
}

