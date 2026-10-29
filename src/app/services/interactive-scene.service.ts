import { Injectable, signal } from '@angular/core';

/** Splash stage item defined in interactive-scenes.json. */
export interface SplashStage {
  progress: number;
  status: string;
}

/** Splash telemetry readout defined in interactive-scenes.json. */
export interface SplashTelemetry {
  label: string;
  value: string;
}

/** Skyline building silhouette item defined in interactive-scenes.json. */
export interface SkylineBuilding {
  x: number;
  y: number;
  w: number;
  h: number;
  windows: number;
}

/** Factory gear item defined in interactive-scenes.json. */
export interface FactoryGear {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  speed: string;
  reverse: boolean;
}

/** Factory piston item defined in interactive-scenes.json. */
export interface FactoryPiston {
  x: number;
  delay: string;
}

/** Interactive engine bay hotspot item defined in interactive-scenes.json. */
export interface EngineHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
}

/** Full schema of assets/data/interactive-scenes.json. */
export interface InteractiveScenesConfig {
  version: string;
  theme: string;
  splash: {
    emblem: string;
    model: string;
    stages: Array<SplashStage>;
    telemetry: Array<SplashTelemetry>;
  };
  scenes: {
    skyline: {
      id: string;
      viewBox: string;
      buildings: Array<SkylineBuilding>;
    };
    factory: {
      id: string;
      gears: Array<FactoryGear>;
      pistons: Array<FactoryPiston>;
    };
    engineHotspots: Array<EngineHotspot>;
  };
}

/** Default embedded fallback matching assets/data/interactive-scenes.json for 0ms splash render. */
const DEFAULT_SCENES_CONFIG: InteractiveScenesConfig = {
  version: '1.0.0',
  theme: 'bluish-r007',
  splash: {
    emblem: 'R 007',
    model: 'RACER007 TWIN-TURBO ARCHITECTURE',
    stages: [
      { progress: 0,   status: 'IGNITION SEQUENCE ARMED // RACER007' },
      { progress: 30,  status: 'UNLOCKING R-007 HOOD LATCHES...' },
      { progress: 65,  status: 'OPENING R-007 HOOD // ENGINE BAY EXPOSED' },
      { progress: 90,  status: 'RACER007 FULL-STACK ENGINE AT 8,500 RPM' },
      { progress: 100, status: 'SYSTEMS ONLINE // ENTERING RACER007' }
    ],
    telemetry: [
      { label: 'DRIVER',  value: 'RACER007 // NAFI' },
      { label: 'ENGINE',  value: 'V8 FULL-STACK + AI' },
      { label: 'BOOST',   value: '2.4 BAR // CLOUD' },
      { label: 'STATUS',  value: 'READY TO RACE' }
    ]
  },
  scenes: {
    skyline: {
      id: 'skyline',
      viewBox: '0 0 1440 220',
      buildings: [
        { x: 20,   y: 90,  w: 75,  h: 130, windows: 6 },
        { x: 105,  y: 55,  w: 95,  h: 165, windows: 9 },
        { x: 215,  y: 110, w: 65,  h: 110, windows: 4 },
        { x: 295,  y: 40,  w: 110, h: 180, windows: 12 },
        { x: 420,  y: 75,  w: 85,  h: 145, windows: 8 },
        { x: 520,  y: 30,  w: 120, h: 190, windows: 14 },
        { x: 655,  y: 85,  w: 80,  h: 135, windows: 6 },
        { x: 750,  y: 50,  w: 105, h: 170, windows: 10 },
        { x: 870,  y: 95,  w: 70,  h: 125, windows: 6 },
        { x: 955,  y: 35,  w: 115, h: 185, windows: 12 },
        { x: 1085, y: 70,  w: 90,  h: 150, windows: 8 },
        { x: 1190, y: 45,  w: 100, h: 175, windows: 10 },
        { x: 1305, y: 80,  w: 110, h: 140, windows: 8 }
      ]
    },
    factory: {
      id: 'factory',
      gears: [
        { cx: 140, cy: 110, r: 52, teeth: 12, speed: '18s', reverse: false },
        { cx: 232, cy: 145, r: 36, teeth: 8,  speed: '12s', reverse: true },
        { cx: 880, cy: 95,  r: 64, teeth: 14, speed: '24s', reverse: false },
        { cx: 985, cy: 140, r: 40, teeth: 10, speed: '15s', reverse: true }
      ],
      pistons: [
        { x: 420, delay: '0s' },
        { x: 490, delay: '0.3s' },
        { x: 560, delay: '0.6s' },
        { x: 630, delay: '0.9s' }
      ]
    },
    engineHotspots: [
      {
        id: 'turbo-left',
        x: 145,
        y: 175,
        label: 'TWIN-TURBO FRONTEND',
        detail: 'Angular 20 · Flutter · Zoneless 60fps UI Rendering'
      },
      {
        id: 'v8-core',
        x: 260,
        y: 195,
        label: 'V8 CORE ENGINE',
        detail: 'Node.js · FastAPI · TypeScript · Microservices'
      },
      {
        id: 'turbo-right',
        x: 375,
        y: 175,
        label: 'CLOUD BOOST MANIFOLD',
        detail: 'AWS EC2 · S3 · Lambda · Docker · CI/CD Pipelines'
      },
      {
        id: 'ecu-ai',
        x: 260,
        y: 120,
        label: 'R-007 AI / ML ECU',
        detail: 'PyTorch · YOLOv9 · Data Engineering · IEEE/Springer'
      }
    ]
  }
};

/**
 * Service providing lightweight JSON-driven interactive scenes and
 * controlling the R-007 Car Hood splash screen state.
 */
@Injectable({ providedIn: 'root' })
export class InteractiveSceneService {
  /** Signal holding the loaded interactive scenes JSON config. */
  public readonly config = signal<InteractiveScenesConfig>(DEFAULT_SCENES_CONFIG);

  /** Signal controlling whether the R 007 car hood splash screen is active. */
  public readonly splashOpen = signal<boolean>(true);

  /** Signal incremented whenever the user manually replays the splash animation. */
  public readonly splashRunId = signal<number>(1);

  constructor() {
    this.loadJsonConfig();
  }

  /**
   * Loads assets/data/interactive-scenes.json so any edits to the JSON file
   * are reflected in the interactive scenes.
   */
  private loadJsonConfig(): void {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return;
    }
    fetch('assets/data/interactive-scenes.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: InteractiveScenesConfig | null) => {
        if (data && data.scenes && data.splash) {
          this.config.set(data);
        }
      })
      .catch(() => {
        // Fallback to embedded DEFAULT_SCENES_CONFIG
      });
  }

  /**
   * Re-opens and replays the R 007 car hood opening splash screen.
   */
  public triggerSplashReplay(): void {
    this.splashOpen.set(true);
    this.splashRunId.update((n: number) => n + 1);
  }

  /**
   * Dismisses the R 007 splash screen into the portfolio.
   */
  public closeSplash(): void {
    this.splashOpen.set(false);
  }
}

