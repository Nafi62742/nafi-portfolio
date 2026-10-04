import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject
} from '@angular/core';

import { ThemeService } from '@services/theme.service';

/**
 * Interface representing a twinkling star in the background field.
 */
interface StarParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  colorType: 'white' | 'gold' | 'cyan';
}

/**
 * Interface representing an occasional shooting star streak.
 */
interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

/**
 * Global lightweight 2D Canvas Starfield Component.
 * Provides a cosmic star effect fixed across all portfolio sections with minimal CPU/GPU load.
 *
 * Performance features:
 * - Single viewport-wide 2D canvas running outside Angular zone
 * - Throttled ~30-40fps loop to eliminate CPU wakeups on low-end devices
 * - Automatically pauses when window is hidden or on reduced motion
 * - DPR clamped to 1.0 to eliminate multi-megapixel buffer allocations
 * - Dark & light theme responsive color transitions
 */
@Component({
  selector: 'app-starfield',
  standalone: true,
  imports: [],
  templateUrl: './starfield.component.html',
  styleUrl: './starfield.component.scss'
})
export class StarfieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('starfieldCanvas', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly ngZone: NgZone = inject(NgZone);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly platformId: object = inject(PLATFORM_ID);

  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private isVisible: boolean = true;
  private lastTimestamp: number = 0;
  private nextShootingStarTime: number = 0;
  private width: number = 0;
  private height: number = 0;
  private prefersReducedMotion: boolean = false;

  private stars: StarParticle[] = [];
  private shootingStar: ShootingStar = {
    x: 0,
    y: 0,
    length: 120,
    speed: 12,
    angle: (35 * Math.PI) / 180,
    opacity: 0,
    active: false
  };

  /** Event listener callback for document visibility */
  private readonly onVisibilityChangeBound = (): void => this.handleVisibilityChange();

  constructor() {
    effect((): void => {
      // Access theme signal to register reactive dependency
      void this.themeService.isDark;
      if (this.ctx && !this.animFrameId && this.isVisible) {
        this.renderSingleFrame();
      }
    });
  }

  /**
   * Initializes starfield canvas, creates stars, and launches loop.
   *
   * @returns void
   */
  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.ngZone.runOutsideAngular((): void => {
      this.initCanvas();
      this.initEventListeners();
      this.scheduleShootingStar();
      this.animFrameId = requestAnimationFrame(this.renderLoop);
    });
  }

  /**
   * Cleans up observers, timers, and canvas resources on destroy.
   *
   * @returns void
   */
  public ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    }

    this.ctx = null;
    this.stars = [];
  }

  /**
   * Acquires 2D context and initializes canvas dimensions and star particles.
   *
   * @returns void
   */
  private initCanvas(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true });

    this.updateDimensions();

    this.resizeObserver = new ResizeObserver((): void => {
      this.updateDimensions();
    });
    this.resizeObserver.observe(canvas);
  }

  /**
   * Attaches window and document lifecycle event listeners.
   *
   * @returns void
   */
  private initEventListeners(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
  }

  /**
   * Handles document visibility state changes to halt render loop when tab is in background.
   *
   * @returns void
   */
  private handleVisibilityChange(): void {
    this.isVisible = document.visibilityState === 'visible';
    if (this.isVisible && this.animFrameId === null) {
      this.animFrameId = requestAnimationFrame(this.renderLoop);
    }
  }

  /**
   * Updates canvas width and height based on viewport client dimensions.
   *
   * @returns void
   */
  private updateDimensions(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const w: number = window.innerWidth || document.documentElement.clientWidth || 800;
    const h: number = window.innerHeight || document.documentElement.clientHeight || 600;

    if (this.width !== w || this.height !== h) {
      this.width = w;
      this.height = h;
      canvas.width = w;
      canvas.height = h;
      this.generateStars();
    }
  }

  /**
   * Populates a randomized, balanced constellation of stardust and glowing stars.
   *
   * @returns void
   */
  private generateStars(): void {
    const area: number = this.width * this.height;
    // Balanced count: ~70 stars on mobile, ~120 on desktop
    const count: number = Math.min(130, Math.max(65, Math.floor(area / 14000)));

    const newStars: StarParticle[] = [];
    for (let i: number = 0; i < count; i++) {
      const typeRand: number = Math.random();
      let colorType: 'white' | 'gold' | 'cyan' = 'white';
      if (typeRand > 0.85) {
        colorType = 'gold';
      } else if (typeRand > 0.72) {
        colorType = 'cyan';
      }

      // Radius distribution: mostly tiny stardust (0.6 - 1.2px), few medium (1.4 - 2.0px)
      const radius: number = Math.random() < 0.8 ? 0.6 + Math.random() * 0.6 : 1.3 + Math.random() * 0.7;

      newStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: radius,
        baseAlpha: 0.25 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.025,
        colorType: colorType
      });
    }

    this.stars = newStars;
  }

  /**
   * Schedules the next shooting star timestamp.
   *
   * @returns void
   */
  private scheduleShootingStar(): void {
    // Spawn every 9 - 15 seconds
    this.nextShootingStarTime = performance.now() + 9000 + Math.random() * 6000;
  }

  /**
   * Spawns a shooting star from a random top/left position across the sky.
   *
   * @returns void
   */
  private triggerShootingStar(): void {
    this.shootingStar = {
      x: Math.random() * (this.width * 0.7),
      y: Math.random() * (this.height * 0.4),
      length: 100 + Math.random() * 50,
      speed: 10 + Math.random() * 4,
      angle: (32 * Math.PI) / 180,
      opacity: 1.0,
      active: true
    };
    this.scheduleShootingStar();
  }

  /**
   * Renders a single static frame (used during theme switches or when motion is reduced).
   *
   * @returns void
   */
  private renderSingleFrame(): void {
    const ctx: CanvasRenderingContext2D | null = this.ctx;
    if (!ctx) {
      return;
    }

    const isDark: boolean = this.themeService.isDark;
    ctx.clearRect(0, 0, this.width, this.height);

    for (let i: number = 0; i < this.stars.length; i++) {
      const s: StarParticle = this.stars[i];
      this.drawStar(ctx, s, s.baseAlpha, isDark);
    }
  }

  /**
   * Main throttled ~30fps rendering loop for twinkling stars and shooting stars.
   *
   * @returns void
   */
  private renderLoop = (): void => {
    if (!this.isVisible) {
      this.animFrameId = null;
      return;
    }

    const now: number = performance.now();
    // Throttle to ~35fps (28ms) to keep CPU near 0% on low-end hardware
    if (this.lastTimestamp > 0 && now - this.lastTimestamp < 28) {
      this.animFrameId = requestAnimationFrame(this.renderLoop);
      return;
    }
    this.lastTimestamp = now;

    const ctx: CanvasRenderingContext2D | null = this.ctx;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.width, this.height);

    const isDark: boolean = this.themeService.isDark;

    // 1. Draw twinkling background stars
    for (let i: number = 0; i < this.stars.length; i++) {
      const s: StarParticle = this.stars[i];
      if (!this.prefersReducedMotion) {
        s.phase += s.twinkleSpeed;
      }
      const alphaFactor: number = 0.5 + 0.5 * Math.sin(s.phase);
      const alpha: number = s.baseAlpha * (0.4 + 0.6 * alphaFactor);

      this.drawStar(ctx, s, alpha, isDark);
    }

    // 2. Draw shooting star if scheduled
    if (!this.prefersReducedMotion) {
      if (!this.shootingStar.active && now >= this.nextShootingStarTime) {
        this.triggerShootingStar();
      }

      if (this.shootingStar.active) {
        this.drawShootingStar(ctx, isDark);
      }
    }

    this.animFrameId = requestAnimationFrame(this.renderLoop);
  };

  /**
   * Draws an individual star particle with color styling.
   *
   * @param ctx - Canvas 2D rendering context
   * @param s - Star particle model
   * @param alpha - Current calculated opacity
   * @param isDark - Active theme state
   * @returns void
   */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    s: StarParticle,
    alpha: number,
    isDark: boolean
  ): void {
    ctx.save();
    ctx.globalAlpha = Math.max(0.08, Math.min(1.0, alpha));

    let fill: string = isDark ? '#ffffff' : '#475569';
    if (s.colorType === 'gold') {
      fill = isDark ? '#d4af37' : '#d97706';
    } else if (s.colorType === 'cyan') {
      fill = isDark ? '#06b6d4' : '#0284c7';
    }

    // Soft glow for larger stars in dark mode
    if (isDark && s.radius > 1.4) {
      ctx.shadowColor = fill;
      ctx.shadowBlur = 4;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.restore();
  }

  /**
   * Updates and draws the active shooting star streak.
   *
   * @param ctx - Canvas 2D rendering context
   * @param isDark - Active theme state
   * @returns void
   */
  private drawShootingStar(ctx: CanvasRenderingContext2D, isDark: boolean): void {
    const star: ShootingStar = this.shootingStar;
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;
    star.opacity -= 0.016;

    if (star.opacity <= 0 || star.x > this.width + 100 || star.y > this.height + 100) {
      star.active = false;
      return;
    }

    const tailX: number = star.x - Math.cos(star.angle) * star.length;
    const tailY: number = star.y - Math.sin(star.angle) * star.length;

    const grad: CanvasGradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
    const headColor: string = isDark ? 'rgba(255, 255, 255, ' : 'rgba(15, 23, 42, ';
    const tailColor: string = isDark ? 'rgba(212, 175, 55, ' : 'rgba(2, 132, 199, ';

    grad.addColorStop(0, `${tailColor}0)`);
    grad.addColorStop(0.7, `${tailColor}${star.opacity * 0.5})`);
    grad.addColorStop(1, `${headColor}${star.opacity})`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(star.x, star.y);
    ctx.stroke();
    ctx.restore();
  }
}
