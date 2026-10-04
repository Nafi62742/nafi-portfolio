import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';

import { ThemeService } from '@services/theme.service';

/**
 * Configuration interface for orbiting technology nodes.
 */
interface OrbitingTechNode {
  name: string;
  color: string;
  iconText: string;
  orbitRadiusRatio: number;
  speed: number;
  angle: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
}

/**
 * Configuration interface for ambient constellation dust particles.
 */
interface AmbientParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
}

/**
 * 2D projected coordinate with depth scale factor.
 */
interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  scale: number;
}

/**
 * Lightweight, high-performance 2D Canvas Technology Sphere component.
 * Replaces heavy WebGL/Three.js rendering with native HTML5 Canvas trigonometry.
 *
 * Key features:
 * - High-definition metallic core sphere with theme-adaptive specular highlights
 * - Dual 3D architectural orbital rings (Gold & Cyan) with authentic depth occlusion
 * - 6 Orbiting tech satellites (Angular, TypeScript, Node.js, AWS, Flutter, Docker)
 * - Drifting ambient constellation starfield
 * - Pointer parallax tilt & touch/mouse drag-to-rotate with smooth momentum damping
 * - Zone-isolated 60fps rendering, clamped DPR, and viewport IntersectionObserver
 * - Zero external 3D libraries — ultra-low memory & CPU footprint on low-end devices
 */
@Component({
  selector: 'app-hero-sphere',
  standalone: true,
  imports: [],
  templateUrl: './hero-sphere.component.html',
  styleUrl: './hero-sphere.component.scss'
})
export class HeroSphereComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('containerRef', { static: true })
  private readonly containerRef!: ElementRef<HTMLDivElement>;

  private readonly ngZone: NgZone = inject(NgZone);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly platformId: object = inject(PLATFORM_ID);

  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible: boolean = true;
  private lastTimestamp: number = 0;
  private dpr: number = 1;
  private cssWidth: number = 440;
  private cssHeight: number = 440;

  // Interaction & rotation state
  private currentRotX: number = 0;
  private currentRotY: number = 0;
  private targetRotX: number = 0;
  private targetRotY: number = 0;
  private autoRotY: number = 0;
  private isDragging: boolean = false;
  private prevPointerX: number = 0;
  private prevPointerY: number = 0;
  private prefersReducedMotion: boolean = false;

  // Tech satellites mapped to orbital planes
  private readonly techNodes: OrbitingTechNode[] = [
    {
      name: 'Angular',
      color: '#E23237',
      iconText: 'NG',
      orbitRadiusRatio: 1.62,
      speed: 0.0032,
      angle: 0,
      tiltX: (68 * Math.PI) / 180,
      tiltY: (20 * Math.PI) / 180,
      tiltZ: 0
    },
    {
      name: 'TypeScript',
      color: '#3178C6',
      iconText: 'TS',
      orbitRadiusRatio: 1.62,
      speed: 0.0032,
      angle: (Math.PI * 2) / 3,
      tiltX: (68 * Math.PI) / 180,
      tiltY: (20 * Math.PI) / 180,
      tiltZ: 0
    },
    {
      name: 'Node.js',
      color: '#22c55e',
      iconText: 'JS',
      orbitRadiusRatio: 1.62,
      speed: 0.0032,
      angle: (Math.PI * 4) / 3,
      tiltX: (68 * Math.PI) / 180,
      tiltY: (20 * Math.PI) / 180,
      tiltZ: 0
    },
    {
      name: 'AWS',
      color: '#FF9900',
      iconText: 'AWS',
      orbitRadiusRatio: 2.05,
      speed: -0.0024,
      angle: Math.PI * 0.25,
      tiltX: (-45 * Math.PI) / 180,
      tiltY: 0,
      tiltZ: (30 * Math.PI) / 180
    },
    {
      name: 'Flutter',
      color: '#0284c7',
      iconText: 'FL',
      orbitRadiusRatio: 2.05,
      speed: -0.0024,
      angle: Math.PI * 0.92,
      tiltX: (-45 * Math.PI) / 180,
      tiltY: 0,
      tiltZ: (30 * Math.PI) / 180
    },
    {
      name: 'Docker',
      color: '#0ea5e9',
      iconText: 'DK',
      orbitRadiusRatio: 2.05,
      speed: -0.0024,
      angle: Math.PI * 1.58,
      tiltX: (-45 * Math.PI) / 180,
      tiltY: 0,
      tiltZ: (30 * Math.PI) / 180
    }
  ];

  // Subtle ambient background particles
  private readonly particles: AmbientParticle[] = Array.from(
    { length: 22 },
    (_: unknown, i: number): AmbientParticle => ({
      x: (Math.random() - 0.5) * 520,
      y: (Math.random() - 0.5) * 520,
      z: (Math.random() - 0.5) * 380,
      radius: 1.0 + Math.random() * 1.4,
      color: i % 2 === 0 ? '#d4af37' : '#06b6d4',
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.02
    })
  );

  /** Bound pointer event listeners for cleanup */
  private readonly onPointerMoveBound = (e: MouseEvent | TouchEvent): void => this.handlePointerMove(e);
  private readonly onPointerDownBound = (e: MouseEvent | TouchEvent): void => this.handlePointerDown(e);
  private readonly onPointerUpBound = (): void => this.handlePointerUp();

  /**
   * Initializes canvas animation and listeners after view mounting.
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
      this.initObservers();
      this.animFrameId = requestAnimationFrame(this.render);
    });
  }

  /**
   * Cleans up animation frame, observers, and DOM event listeners.
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

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.removeEventListeners();
    this.ctx = null;
  }

  /**
   * Acquires the 2D rendering context and configures initial dimensions.
   *
   * @returns void
   */
  private initCanvas(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true });

    const container: HTMLDivElement = this.containerRef.nativeElement;
    const initialWidth: number = container.clientWidth || 440;
    const initialHeight: number = container.clientHeight || 440;
    this.updateCanvasDimensions(initialWidth, initialHeight);
  }

  /**
   * Updates canvas pixel buffer and logical resolution while capping DPR.
   *
   * @param cssWidth - Measured container client width
   * @param cssHeight - Measured container client height
   * @returns void
   */
  private updateCanvasDimensions(cssWidth: number, cssHeight: number): void {
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    const rawDpr: number = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.dpr = Math.min(rawDpr, 1.5);

    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    canvas.width = Math.round(cssWidth * this.dpr);
    canvas.height = Math.round(cssHeight * this.dpr);
  }

  /**
   * Attaches pointer and touch listeners for interactive rotation and dragging.
   *
   * @returns void
   */
  private initEventListeners(): void {
    const container: HTMLDivElement = this.containerRef.nativeElement;

    container.addEventListener('mousemove', this.onPointerMoveBound, { passive: true });
    container.addEventListener('mousedown', this.onPointerDownBound);
    window.addEventListener('mouseup', this.onPointerUpBound);

    container.addEventListener('touchmove', this.onPointerMoveBound, { passive: true });
    container.addEventListener('touchstart', this.onPointerDownBound, { passive: true });
    window.addEventListener('touchend', this.onPointerUpBound);
  }

  /**
   * Detaches all bound pointer and touch listeners.
   *
   * @returns void
   */
  private removeEventListeners(): void {
    const container: HTMLDivElement | null = this.containerRef?.nativeElement;
    if (container) {
      container.removeEventListener('mousemove', this.onPointerMoveBound);
      container.removeEventListener('mousedown', this.onPointerDownBound);
      container.removeEventListener('touchmove', this.onPointerMoveBound);
      container.removeEventListener('touchstart', this.onPointerDownBound);
    }
    window.removeEventListener('mouseup', this.onPointerUpBound);
    window.removeEventListener('touchend', this.onPointerUpBound);
  }

  /**
   * Sets up ResizeObserver for container resizing and IntersectionObserver for offscreen pausing.
   *
   * @returns void
   */
  private initObservers(): void {
    const container: HTMLDivElement = this.containerRef.nativeElement;

    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
      for (let i: number = 0; i < entries.length; i++) {
        const entry: ResizeObserverEntry = entries[i];
        const width: number = entry.contentRect.width;
        const height: number = entry.contentRect.height;
        if (width > 0 && height > 0) {
          this.updateCanvasDimensions(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);

    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        for (let i: number = 0; i < entries.length; i++) {
          const entry: IntersectionObserverEntry = entries[i];
          const wasVisible: boolean = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !wasVisible && this.animFrameId === null) {
            this.animFrameId = requestAnimationFrame(this.render);
          }
        }
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(container);
  }

  /**
   * Handles pointer motion for interactive 3D parallax tilt and drag rotation.
   *
   * @param e - Mouse or touch event
   * @returns void
   */
  private handlePointerMove(e: MouseEvent | TouchEvent): void {
    const clientX: number = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY: number = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (this.isDragging) {
      const deltaX: number = clientX - this.prevPointerX;
      const deltaY: number = clientY - this.prevPointerY;
      this.targetRotY += deltaX * 0.008;
      this.targetRotX += deltaY * 0.008;
      this.prevPointerX = clientX;
      this.prevPointerY = clientY;
    } else {
      const rect: DOMRect = this.containerRef.nativeElement.getBoundingClientRect();
      const nx: number = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny: number = -(((clientY - rect.top) / rect.height) * 2 - 1);
      this.targetRotX = -ny * 0.28;
      this.targetRotY = nx * 0.38;
    }
  }

  /**
   * Initiates drag rotation interaction.
   *
   * @param e - Mouse or touch event
   * @returns void
   */
  private handlePointerDown(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.prevPointerX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.prevPointerY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  }

  /**
   * Concludes drag rotation interaction.
   *
   * @returns void
   */
  private handlePointerUp(): void {
    this.isDragging = false;
  }

  /**
   * Rotates a 3D coordinate around X, Y, and Z axes sequentially.
   *
   * @param x - X coordinate in 3D space
   * @param y - Y coordinate in 3D space
   * @param z - Z coordinate in 3D space
   * @param rx - Rotation angle in radians around X axis
   * @param ry - Rotation angle in radians around Y axis
   * @param rz - Rotation angle in radians around Z axis
   * @returns Transformed 3D coordinate tuple [x, y, z]
   */
  private rotatePoint(
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ): [number, number, number] {
    // 1. Rotate around X axis
    const cosRx: number = Math.cos(rx);
    const sinRx: number = Math.sin(rx);
    const y1: number = y * cosRx - z * sinRx;
    const z1: number = y * sinRx + z * cosRx;

    // 2. Rotate around Y axis
    const cosRy: number = Math.cos(ry);
    const sinRy: number = Math.sin(ry);
    const x2: number = x * cosRy + z1 * sinRy;
    const z2: number = -x * sinRy + z1 * cosRy;

    // 3. Rotate around Z axis
    const cosRz: number = Math.cos(rz);
    const sinRz: number = Math.sin(rz);
    const x3: number = x2 * cosRz - y1 * sinRz;
    const y3: number = x2 * sinRz + y1 * cosRz;

    return [x3, y3, z2];
  }

  /**
   * Projects a 3D point into 2D canvas pixel coordinates using perspective projection.
   *
   * @param x - Transformed X coordinate
   * @param y - Transformed Y coordinate
   * @param z - Transformed Z coordinate
   * @param cx - Center X offset on the canvas
   * @param cy - Center Y offset on the canvas
   * @param fov - Focal length for perspective division
   * @returns 2D canvas screen coordinate with depth scale
   */
  private project(
    x: number,
    y: number,
    z: number,
    cx: number,
    cy: number,
    fov: number
  ): ProjectedPoint {
    const scale: number = fov / Math.max(10, fov - z);
    return {
      x: cx + x * scale,
      y: cy + y * scale,
      z: z,
      scale: scale
    };
  }

  /**
   * Main 60fps rendering loop using pure 2D Canvas and mathematical depth sorting.
   *
   * @returns void
   */
  private render = (): void => {
    if (!this.isVisible) {
      this.animFrameId = null;
      return;
    }

    const now: number = performance.now();
    if (this.lastTimestamp > 0 && now - this.lastTimestamp < 14) {
      this.animFrameId = requestAnimationFrame(this.render);
      return;
    }
    this.lastTimestamp = now;

    const ctx: CanvasRenderingContext2D | null = this.ctx;
    if (!ctx) {
      return;
    }

    // Smooth rotational damping
    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.06;
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.06;

    if (!this.prefersReducedMotion) {
      this.autoRotY += 0.0016;
    }

    // Advance orbital satellite angles
    for (let i: number = 0; i < this.techNodes.length; i++) {
      const node: OrbitingTechNode = this.techNodes[i];
      if (!this.prefersReducedMotion) {
        node.angle += node.speed;
      }
    }

    const cx: number = this.cssWidth / 2;
    const cy: number = this.cssHeight / 2;
    const baseRadius: number = Math.min(this.cssWidth, this.cssHeight) * 0.21;
    const fov: number = 550;
    const isDark: boolean = this.themeService.isDark;

    // Clear frame
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    // 1. Background ambient particles
    this.drawBackgroundParticles(ctx, cx, cy, fov);

    // 2. PASS 1 (Behind Sphere: Z < 0): Back segments of rings and satellites
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 1.62,
      (68 * Math.PI) / 180,
      (20 * Math.PI) / 180,
      0,
      isDark ? 'rgba(212, 175, 55, 0.85)' : 'rgba(217, 119, 6, 0.9)',
      false,
      true,
      fov
    );
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 1.48,
      (68 * Math.PI) / 180,
      (20 * Math.PI) / 180,
      0,
      isDark ? 'rgba(212, 175, 55, 0.25)' : 'rgba(217, 119, 6, 0.3)',
      true,
      true,
      fov
    );

    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 2.05,
      (-45 * Math.PI) / 180,
      0,
      (30 * Math.PI) / 180,
      isDark ? 'rgba(6, 182, 212, 0.85)' : 'rgba(2, 132, 199, 0.9)',
      false,
      true,
      fov
    );
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 2.18,
      (-45 * Math.PI) / 180,
      0,
      (30 * Math.PI) / 180,
      isDark ? 'rgba(6, 182, 212, 0.22)' : 'rgba(2, 132, 199, 0.28)',
      true,
      true,
      fov
    );

    this.drawSatellites(ctx, cx, cy, baseRadius, true, isDark, fov);

    // 3. PASS 2 (Center Core Sphere: Z = 0): Central metallic sphere & wireframe lattice
    this.drawCoreSphere(ctx, cx, cy, baseRadius, isDark);
    this.drawWireframeLattice(ctx, cx, cy, baseRadius, isDark, fov);

    // 4. PASS 3 (In Front of Sphere: Z >= 0): Front segments of rings and satellites
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 1.62,
      (68 * Math.PI) / 180,
      (20 * Math.PI) / 180,
      0,
      isDark ? 'rgba(212, 175, 55, 0.85)' : 'rgba(217, 119, 6, 0.9)',
      false,
      false,
      fov
    );
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 1.48,
      (68 * Math.PI) / 180,
      (20 * Math.PI) / 180,
      0,
      isDark ? 'rgba(212, 175, 55, 0.25)' : 'rgba(217, 119, 6, 0.3)',
      true,
      false,
      fov
    );

    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 2.05,
      (-45 * Math.PI) / 180,
      0,
      (30 * Math.PI) / 180,
      isDark ? 'rgba(6, 182, 212, 0.85)' : 'rgba(2, 132, 199, 0.9)',
      false,
      false,
      fov
    );
    this.drawOrbitalRing(
      ctx,
      cx,
      cy,
      baseRadius * 2.18,
      (-45 * Math.PI) / 180,
      0,
      (30 * Math.PI) / 180,
      isDark ? 'rgba(6, 182, 212, 0.22)' : 'rgba(2, 132, 199, 0.28)',
      true,
      false,
      fov
    );

    this.drawSatellites(ctx, cx, cy, baseRadius, false, isDark, fov);

    ctx.restore();

    this.animFrameId = requestAnimationFrame(this.render);
  };

  /**
   * Draws drifting ambient constellation particles in 3D space.
   *
   * @param ctx - Canvas 2D rendering context
   * @param cx - Center X coordinate
   * @param cy - Center Y coordinate
   * @param fov - Perspective focal length
   * @returns void
   */
  private drawBackgroundParticles(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    fov: number
  ): void {
    ctx.save();
    for (let i: number = 0; i < this.particles.length; i++) {
      const p: AmbientParticle = this.particles[i];
      p.phase += p.speed;

      const world: [number, number, number] = this.rotatePoint(
        p.x,
        p.y,
        p.z,
        this.currentRotX * 0.4,
        this.currentRotY * 0.4 + this.autoRotY * 0.3,
        0
      );
      const proj: ProjectedPoint = this.project(world[0], world[1], world[2], cx, cy, fov);

      const alpha: number = 0.2 + 0.2 * Math.sin(p.phase);
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, p.radius * proj.scale, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Renders an orbital ring tilted in 3D space with depth-filtered segment passes.
   *
   * @param ctx - Canvas 2D rendering context
   * @param cx - Center X coordinate
   * @param cy - Center Y coordinate
   * @param radius - Ring radius in 3D units
   * @param tiltX - Fixed ring tilt angle around X axis
   * @param tiltY - Fixed ring tilt angle around Y axis
   * @param tiltZ - Fixed ring tilt angle around Z axis
   * @param color - Stroke color string
   * @param isDashed - Whether to render with dashed styling
   * @param isBehindPass - True to render segments behind center plane, false for front
   * @param fov - Perspective focal length
   * @returns void
   */
  private drawOrbitalRing(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    tiltX: number,
    tiltY: number,
    tiltZ: number,
    color: string,
    isDashed: boolean,
    isBehindPass: boolean,
    fov: number
  ): void {
    const segments: number = 72;
    const points: ProjectedPoint[] = [];

    for (let i: number = 0; i <= segments; i++) {
      const theta: number = (i / segments) * Math.PI * 2;
      const x0: number = Math.cos(theta) * radius;
      const y0: number = 0;
      const z0: number = Math.sin(theta) * radius;

      const tilted: [number, number, number] = this.rotatePoint(x0, y0, z0, tiltX, tiltY, tiltZ);
      const world: [number, number, number] = this.rotatePoint(
        tilted[0],
        tilted[1],
        tilted[2],
        this.currentRotX,
        this.currentRotY + this.autoRotY * 0.5,
        0
      );

      points.push(this.project(world[0], world[1], world[2], cx, cy, fov));
    }

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = isDashed ? 1 : 2;
    if (isDashed) {
      ctx.setLineDash([4, 6]);
    } else {
      ctx.setLineDash([]);
    }

    let inSubpath: boolean = false;
    ctx.beginPath();
    for (let i: number = 0; i < segments; i++) {
      const p1: ProjectedPoint = points[i];
      const p2: ProjectedPoint = points[i + 1];
      const avgZ: number = (p1.z + p2.z) / 2;
      const isMatch: boolean = isBehindPass ? avgZ < -6 : avgZ >= -6;

      if (isMatch) {
        if (!inSubpath) {
          ctx.moveTo(p1.x, p1.y);
          inSubpath = true;
        }
        ctx.lineTo(p2.x, p2.y);
      } else {
        inSubpath = false;
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Renders the central metallic core sphere with radial energy aura and specular gradient.
   *
   * @param ctx - Canvas 2D rendering context
   * @param cx - Center X coordinate
   * @param cy - Center Y coordinate
   * @param radius - Sphere radius in pixels
   * @param isDark - Active theme indicator
   * @returns void
   */
  private drawCoreSphere(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    isDark: boolean
  ): void {
    ctx.save();

    // 1. Soft atmospheric energy glow behind the core
    const auraGradient: CanvasGradient = ctx.createRadialGradient(
      cx,
      cy,
      radius * 0.7,
      cx,
      cy,
      radius * 1.55
    );
    if (isDark) {
      auraGradient.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
      auraGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      auraGradient.addColorStop(0, 'rgba(99, 102, 241, 0.14)');
      auraGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = auraGradient;
    ctx.fill();

    // 2. High-definition metallic core sphere with specular gradient
    const lightOffsetX: number = -radius * 0.32;
    const lightOffsetY: number = -radius * 0.32;
    const coreGradient: CanvasGradient = ctx.createRadialGradient(
      cx + lightOffsetX,
      cy + lightOffsetY,
      radius * 0.05,
      cx,
      cy,
      radius
    );

    if (isDark) {
      coreGradient.addColorStop(0, '#334155');
      coreGradient.addColorStop(0.2, '#1e293b');
      coreGradient.addColorStop(0.65, '#0f172a');
      coreGradient.addColorStop(1, '#020617');
    } else {
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.25, '#f1f5f9');
      coreGradient.addColorStop(0.7, '#cbd5e1');
      coreGradient.addColorStop(1, '#64748b');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();

    // 3. Delicate metallic specular rim
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.35)' : 'rgba(217, 119, 6, 0.4)';
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Renders the 3D rotating wireframe geodesic lattice over the front hemisphere.
   *
   * @param ctx - Canvas 2D rendering context
   * @param cx - Center X coordinate
   * @param cy - Center Y coordinate
   * @param radius - Core sphere radius in pixels
   * @param isDark - Active theme indicator
   * @param fov - Perspective focal length
   * @returns void
   */
  private drawWireframeLattice(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    isDark: boolean,
    fov: number
  ): void {
    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.22)' : 'rgba(180, 83, 9, 0.24)';
    ctx.lineWidth = 1;

    // 1. Latitudinal arcs
    const latitudes: number[] = [-50, -25, 0, 25, 50];
    const steps: number = 48;

    for (let l: number = 0; l < latitudes.length; l++) {
      const latRad: number = (latitudes[l] * Math.PI) / 180;
      const rSlice: number = radius * Math.cos(latRad);
      const ySlice: number = radius * Math.sin(latRad);

      let inPath: boolean = false;
      ctx.beginPath();
      for (let s: number = 0; s <= steps; s++) {
        const lonRad: number = (s / steps) * Math.PI * 2;
        const x0: number = rSlice * Math.cos(lonRad);
        const y0: number = ySlice;
        const z0: number = rSlice * Math.sin(lonRad);

        const world: [number, number, number] = this.rotatePoint(
          x0,
          y0,
          z0,
          this.currentRotX,
          this.currentRotY + this.autoRotY,
          0
        );

        if (world[2] > 0) {
          const pt: ProjectedPoint = this.project(world[0], world[1], world[2], cx, cy, fov);
          if (!inPath) {
            ctx.moveTo(pt.x, pt.y);
            inPath = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          inPath = false;
        }
      }
      ctx.stroke();
    }

    // 2. Longitudinal meridians
    const meridians: number[] = [0, 30, 60, 90, 120, 150];
    for (let m: number = 0; m < meridians.length; m++) {
      const mAngle: number = (meridians[m] * Math.PI) / 180;
      let inPath: boolean = false;
      ctx.beginPath();
      for (let s: number = 0; s <= steps; s++) {
        const latRad: number = -Math.PI / 2 + (s / steps) * Math.PI;
        const x0: number = radius * Math.cos(latRad) * Math.sin(mAngle);
        const y0: number = radius * Math.sin(latRad);
        const z0: number = radius * Math.cos(latRad) * Math.cos(mAngle);

        const world: [number, number, number] = this.rotatePoint(
          x0,
          y0,
          z0,
          this.currentRotX,
          this.currentRotY + this.autoRotY,
          0
        );

        if (world[2] > 0) {
          const pt: ProjectedPoint = this.project(world[0], world[1], world[2], cx, cy, fov);
          if (!inPath) {
            ctx.moveTo(pt.x, pt.y);
            inPath = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          inPath = false;
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Renders the orbiting technology satellites with badges and brand color accents.
   *
   * @param ctx - Canvas 2D rendering context
   * @param cx - Center X coordinate
   * @param cy - Center Y coordinate
   * @param baseRadius - Core sphere base radius
   * @param isBehindPass - True to render satellites with negative depth (behind center)
   * @param isDark - Active theme indicator
   * @param fov - Perspective focal length
   * @returns void
   */
  private drawSatellites(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    baseRadius: number,
    isBehindPass: boolean,
    isDark: boolean,
    fov: number
  ): void {
    for (let i: number = 0; i < this.techNodes.length; i++) {
      const node: OrbitingTechNode = this.techNodes[i];
      const orbitRadius: number = baseRadius * node.orbitRadiusRatio;

      const x0: number = Math.cos(node.angle) * orbitRadius;
      const y0: number = 0;
      const z0: number = Math.sin(node.angle) * orbitRadius;

      const tilted: [number, number, number] = this.rotatePoint(
        x0,
        y0,
        z0,
        node.tiltX,
        node.tiltY,
        node.tiltZ
      );
      const world: [number, number, number] = this.rotatePoint(
        tilted[0],
        tilted[1],
        tilted[2],
        this.currentRotX,
        this.currentRotY + this.autoRotY * 0.5,
        0
      );

      const isMatch: boolean = isBehindPass ? world[2] < -6 : world[2] >= -6;
      if (!isMatch) {
        continue;
      }

      const proj: ProjectedPoint = this.project(world[0], world[1], world[2], cx, cy, fov);
      const badgeR: number = Math.max(13, Math.round(18 * proj.scale));

      ctx.save();
      ctx.globalAlpha = isBehindPass ? 0.6 : 1.0;

      // Glow halo
      ctx.shadowColor = node.color;
      ctx.shadowBlur = Math.round(9 * proj.scale);

      // Badge disc
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#0b111e' : '#ffffff';
      ctx.fill();

      // Badge border
      ctx.lineWidth = Math.max(1.5, 2 * proj.scale);
      ctx.strokeStyle = node.color;
      ctx.stroke();

      // Monogram label
      ctx.shadowBlur = 0;
      ctx.font = `bold ${Math.max(9, Math.round(11 * proj.scale))}px "Space Grotesk", "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillText(node.iconText, proj.x, proj.y + 0.5);

      ctx.restore();
    }
  }
}
