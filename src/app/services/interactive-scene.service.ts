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

/** Wheel geometry for the right-side sports car SVG scene. */
export interface SportsCarWheel {
  cx: number;
  cy: number;
  r: number;
  rimR: number;
}

/** Right-side sports car geometry defined in interactive-scenes.json. */
export interface SportsCarScene {
  id: string;
  viewBox: string;
  bodyPath: string;
  roofGlassPath: string;
  rightDoorPath: string;
  sideIntakePath: string;
  spoilerPath: string;
  splitterPath: string;
  headlightPath: string;
  taillightPath: string;
  doorEmblem: string;
  doorSubLabel: string;
  rearWheel: SportsCarWheel;
  frontWheel: SportsCarWheel;
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

/** Relay node in the JSON-driven Contact Signal animation. */
export interface ContactRelayNode {
  id: string;
  x: number;
  y: number;
  code: string;
  label: string;
  sub: string;
}

/** Star item in the JSON-driven Contact Signal skyline. */
export interface ContactStar {
  cx: number;
  cy: number;
  r: number;
  delay: string;
}

/** Contact section JSON-driven interactive animation scene. */
export interface ContactSignalScene {
  id: string;
  relayViewBox: string;
  skylineViewBox: string;
  emblem: string;
  subLabel: string;
  orbitPath: string;
  nodes: Array<ContactRelayNode>;
  stars: Array<ContactStar>;
  tower: {
    x: number;
    y: number;
    beamPolygon: string;
    emblemCx: number;
    emblemCy: number;
  };
  buildings: Array<SkylineBuilding>;
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
    sportsCar: SportsCarScene;
    factory: {
      id: string;
      gears: Array<FactoryGear>;
      pistons: Array<FactoryPiston>;
    };
    engineHotspots: Array<EngineHotspot>;
    contactSignal: ContactSignalScene;
  };
}

/** Default embedded fallback matching assets/data/interactive-scenes.json for 0ms splash render. */
const DEFAULT_SCENES_CONFIG: InteractiveScenesConfig = {
  version: '2.0.0',
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
    sportsCar: {
      id: 'r007-gt-side',
      viewBox: '0 0 360 120',
      bodyPath: 'M 26 84 L 16 74 L 22 50 L 58 46 L 106 22 L 192 20 L 252 44 L 322 52 L 342 68 L 346 82 L 320 86 L 300 86 A 27 27 0 0 0 242 86 L 124 86 A 27 27 0 0 0 66 86 L 26 86 Z',
      roofGlassPath: 'M 112 26 L 188 24 L 240 44 L 116 45 Z',
      rightDoorPath: 'M 130 46 L 228 46 L 232 80 L 126 80 Z',
      sideIntakePath: 'M 134 54 L 166 50 L 156 75 L 130 73 Z',
      spoilerPath: 'M 20 50 L 8 30 L 34 30 L 36 48 Z',
      splitterPath: 'M 318 82 L 350 82 L 346 88 L 314 88 Z',
      headlightPath: 'M 304 54 L 338 62 L 332 69 L 300 62 Z',
      taillightPath: 'M 16 54 L 30 54 L 28 65 L 16 65 Z',
      doorEmblem: 'R 007',
      doorSubLabel: 'NAFI // GT',
      rearWheel:  { cx: 95,  cy: 84, r: 23, rimR: 15 },
      frontWheel: { cx: 271, cy: 84, r: 23, rimR: 15 }
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
    ],
    contactSignal: {
      id: 'contact-r007-uplink',
      relayViewBox: '0 0 600 130',
      skylineViewBox: '0 0 600 180',
      emblem: 'R-007',
      subLabel: 'DHAKA // LIVE UPLINK',
      orbitPath: 'M 58 68 Q 300 12 542 68',
      nodes: [
        { id: 'client', x: 58,  y: 68, code: '01', label: 'CLIENT FORM',   sub: 'JSON PAYLOAD' },
        { id: 'edge',   x: 218, y: 42, code: '02', label: 'R-007 GATEWAY', sub: 'TLS 1.3 EDGE' },
        { id: 'cloud',  x: 382, y: 42, code: '03', label: 'WEB3FORMS API', sub: 'REST DISPATCH' },
        { id: 'inbox',  x: 542, y: 68, code: '04', label: 'NAFI INBOX',    sub: 'DHAKA // READY' }
      ],
      stars: [
        { cx: 48,  cy: 26, r: 1.4, delay: '0s' },
        { cx: 124, cy: 18, r: 1.8, delay: '0.6s' },
        { cx: 210, cy: 32, r: 1.3, delay: '1.2s' },
        { cx: 295, cy: 16, r: 1.6, delay: '0.3s' },
        { cx: 362, cy: 28, r: 1.4, delay: '0.9s' },
        { cx: 528, cy: 22, r: 1.8, delay: '1.5s' },
        { cx: 576, cy: 38, r: 1.2, delay: '0.4s' }
      ],
      tower: {
        x: 152,
        y: 80,
        beamPolygon: '152,138 395,12 520,58',
        emblemCx: 452,
        emblemCy: 36
      },
      buildings: [
        { x: 20,  y: 118, w: 68, h: 62, windows: 4 },
        { x: 108, y: 96,  w: 84, h: 84, windows: 6 },
        { x: 210, y: 124, w: 76, h: 56, windows: 4 },
        { x: 304, y: 106, w: 92, h: 74, windows: 6 },
        { x: 414, y: 128, w: 74, h: 52, windows: 4 },
        { x: 504, y: 112, w: 78, h: 68, windows: 6 }
      ]
    }
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
   * Dismisses the R 007 car hood splash screen.
   */
  public closeSplash(): void {
    this.splashOpen.set(false);
  }

  /**
   * Re-opens and replays the R 007 car hood opening splash animation on demand.
   */
  public replaySplash(): void {
    this.splashRunId.update((n: number) => n + 1);
    this.splashOpen.set(true);
  }

  /**
   * Alias for `replaySplash()` triggered by the navbar, hero, and about buttons.
   */
  public triggerSplashReplay(): void {
    this.replaySplash();
  }
}
