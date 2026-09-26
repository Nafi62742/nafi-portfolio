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
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

import { ThemeService } from '@services/theme.service';

/**
 * Interface defining tech node satellite configuration.
 */
interface OrbitingTechNode {
  name: string;
  color: string;
  iconText: string;
  orbitRadius: number;
  speed: number;
  angle: number;
  tiltX: number;
  tiltZ: number;
  mesh?: THREE.Group;
}

/**
 * Interactive 3D WebGL Sphere Component built with Three.js.
 * Features:
 * - High-poly metallic core sphere with glowing inner energy
 * - Architectural metallic gold and cyan orbital rings inspired by luxury editorial design
 * - Dynamic 3D orbiting tech satellite nodes (Angular, AWS, Flutter, Node, TypeScript, Docker)
 * - Drifting ambient particle constellation
 * - Mouse parallax tilt & smooth drag rotation
 * - Dark & light theme responsive rendering
 * - Zone-isolated 60fps rendering with IntersectionObserver pausing for zero battery drain
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

  private readonly ngZone = inject(NgZone);
  private readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  // Three.js core members
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private animFrameId: number | null = null;

  // Scene object groups
  private rootGroup: THREE.Group | null = null;
  private coreMesh: THREE.Mesh | null = null;
  private wireframeMesh: THREE.LineSegments | null = null;
  private goldRingMesh: THREE.Mesh | null = null;
  private cyanRingMesh: THREE.Mesh | null = null;
  private pointLight: THREE.PointLight | null = null;
  private dirLight: THREE.DirectionalLight | null = null;
  private ambientLight: THREE.AmbientLight | null = null;

  // Tech satellites with slow, graceful orbital velocities
  private techNodes: OrbitingTechNode[] = [
    { name: 'Angular', color: '#E23237', iconText: 'NG', orbitRadius: 4.1, speed: 0.0028, angle: 0, tiltX: 0.35, tiltZ: 0.1 },
    { name: 'TypeScript', color: '#3178C6', iconText: 'TS', orbitRadius: 4.1, speed: 0.0028, angle: Math.PI * 0.66, tiltX: 0.35, tiltZ: 0.1 },
    { name: 'Node.js', color: '#68A063', iconText: 'JS', orbitRadius: 4.1, speed: 0.0028, angle: Math.PI * 1.33, tiltX: 0.35, tiltZ: 0.1 },
    { name: 'AWS', color: '#FF9900', iconText: 'AWS', orbitRadius: 5.1, speed: -0.0020, angle: Math.PI * 0.25, tiltX: -0.45, tiltZ: -0.25 },
    { name: 'Flutter', color: '#02569B', iconText: 'FL', orbitRadius: 5.1, speed: -0.0020, angle: Math.PI * 0.95, tiltX: -0.45, tiltZ: -0.25 },
    { name: 'Docker', color: '#2496ED', iconText: 'DK', orbitRadius: 5.1, speed: -0.0020, angle: Math.PI * 1.65, tiltX: -0.45, tiltZ: -0.25 }
  ];

  // Mouse / Interaction tracking
  private mouseX = 0;
  private mouseY = 0;
  private targetRotX = 0;
  private targetRotY = 0;
  private currentRotX = 0;
  private currentRotY = 0;
  private isDragging = false;
  private prevPointerX = 0;
  private prevPointerY = 0;
  private isVisible = true;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  /** Bound event listener handlers for clean unbinding */
  private onPointerMoveBound = (e: MouseEvent | TouchEvent): void => this.handlePointerMove(e);
  private onPointerDownBound = (e: MouseEvent | TouchEvent): void => this.handlePointerDown(e);
  private onPointerUpBound = (): void => this.handlePointerUp();

  constructor() {
    // Reactively adapt 3D materials when theme changes
    effect(() => {
      const isDark = this.themeService.isDark;
      if (this.scene && this.renderer) {
        this.updateThemeVisuals(isDark);
      }
    });
  }

  /**
   * Initializes 3D scene after view elements are mounted.
   */
  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.initEventListeners();
      this.initObservers();
      this.animate();
    });
  }

  /**
   * Cleans up all WebGL resources, timers, and observers on component destroy.
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
    this.disposeThree();
  }

  /**
   * Initializes the Three.js scene, camera, lights, and 3D meshes.
   */
  private initThree(): void {
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera with wide frustum and spacious framing (prevents any left/right clipping)
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 18.0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Root Group
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // 5. Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, this.themeService.isDark ? 0.8 : 1.2);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfff0d0, 2.5);
    this.dirLight.position.set(5, 8, 5);
    this.scene.add(this.dirLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-6, -4, -4);
    this.scene.add(rimLight);

    this.pointLight = new THREE.PointLight(0xd4af37, 3.0, 15);
    this.pointLight.position.set(0, 0, 0);
    this.scene.add(this.pointLight);

    // 6. Build 3D Objects
    this.createCoreSphere();
    this.createOrbitalRings();
    this.createTechSatellites();

    this.updateThemeVisuals(this.themeService.isDark);
  }

  /**
   * Creates the central high-definition metallic core sphere with glowing wireframe.
   */
  private createCoreSphere(): void {
    if (!this.rootGroup) return;

    // Central core sphere geometry (wider diameter)
    const coreGeo = new THREE.SphereGeometry(2.5, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 1.5
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.rootGroup.add(this.coreMesh);

    // Subtle icosahedron geometric wireframe lattice
    const wireGeo = new THREE.IcosahedronGeometry(2.65, 2);
    const wireEdges = new THREE.WireframeGeometry(wireGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    this.wireframeMesh = new THREE.LineSegments(wireEdges, wireMat);
    this.rootGroup.add(this.wireframeMesh);
  }

  /**
   * Creates the architectural metallic gold and cyan orbital rings.
   */
  private createOrbitalRings(): void {
    if (!this.rootGroup) return;

    // Primary Metallic Gold Ring (wider span)
    const goldRingGeo = new THREE.TorusGeometry(4.1, 0.052, 24, 120);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.98,
      roughness: 0.12,
      emissive: 0x4a3b00,
      emissiveIntensity: 0.25
    });
    this.goldRingMesh = new THREE.Mesh(goldRingGeo, goldRingMat);
    this.goldRingMesh.rotation.x = THREE.MathUtils.degToRad(68);
    this.goldRingMesh.rotation.y = THREE.MathUtils.degToRad(20);
    this.rootGroup.add(this.goldRingMesh);

    // Secondary Cyan Tech Orbital Ring (wider span)
    const cyanRingGeo = new THREE.TorusGeometry(5.1, 0.026, 16, 120);
    const cyanRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.85,
      roughness: 0.3,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4
    });
    this.cyanRingMesh = new THREE.Mesh(cyanRingGeo, cyanRingMat);
    this.cyanRingMesh.rotation.x = THREE.MathUtils.degToRad(-45);
    this.cyanRingMesh.rotation.z = THREE.MathUtils.degToRad(30);
    this.rootGroup.add(this.cyanRingMesh);

    // Inner dashed orbit guide
    const guideGeo = new THREE.RingGeometry(3.28, 3.31, 64);
    const guideEdges = new THREE.WireframeGeometry(guideGeo);
    const guideMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.18
    });
    const guideMesh = new THREE.LineSegments(guideEdges, guideMat);
    guideMesh.rotation.x = THREE.MathUtils.degToRad(90);
    this.rootGroup.add(guideMesh);
  }

  /**
   * Generates canvas textures and 3D satellite badges orbiting in true 3D space.
   */
  private createTechSatellites(): void {
    if (!this.rootGroup) return;

    this.techNodes.forEach((node) => {
      const group = new THREE.Group();

      // Satellite glowing sphere core
      const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.6
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Create high-res circular canvas badge sprite
      const badgeTexture = this.generateBadgeTexture(node.iconText, node.color);
      const spriteMat = new THREE.SpriteMaterial({
        map: badgeTexture,
        transparent: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.9, 0.9, 1);
      sprite.position.set(0, 0.42, 0);
      group.add(sprite);

      this.rootGroup?.add(group);
      node.mesh = group;
    });
  }

  /**
   * Generates a sharp canvas texture for technology icons/monograms.
   */
  private generateBadgeTexture(text: string, accentColor: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background circle
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 14, 26, 0.92)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = accentColor;
    ctx.stroke();

    // Text label
    ctx.font = 'bold 36px "Space Grotesk", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 10;
    ctx.fillText(text, 64, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Main 60fps render loop with smooth lerp physics.
   */
  private animate = (): void => {
    if (!this.isVisible) {
      this.animFrameId = requestAnimationFrame(this.animate);
      return;
    }

    // Smooth lerp rotation toward mouse/drag target
    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.05;
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.05;

    if (this.rootGroup) {
      this.rootGroup.rotation.y += 0.0007;
      this.rootGroup.rotation.x = this.currentRotX;
      this.rootGroup.rotation.z = -this.currentRotY * 0.5;
    }

    // Rotate core mesh & wireframe in counter directions
    if (this.coreMesh) {
      this.coreMesh.rotation.y += 0.0009;
    }
    if (this.wireframeMesh) {
      this.wireframeMesh.rotation.y -= 0.0005;
      this.wireframeMesh.rotation.x += 0.0002;
    }

    // Precession rotation for rings
    if (this.goldRingMesh) {
      this.goldRingMesh.rotation.z += 0.0014;
    }
    if (this.cyanRingMesh) {
      this.cyanRingMesh.rotation.z -= 0.0010;
    }

    // Update 3D positions of tech satellites
    this.techNodes.forEach((node) => {
      node.angle += node.speed;
      const x = Math.cos(node.angle) * node.orbitRadius;
      const y = Math.sin(node.angle) * Math.sin(node.tiltX) * node.orbitRadius;
      const z = Math.sin(node.angle) * Math.cos(node.tiltX) * node.orbitRadius;

      if (node.mesh) {
        node.mesh.position.set(x, y, z);
      }
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Updates lighting and materials to match Dark/Light mode seamlessly.
   */
  private updateThemeVisuals(isDark: boolean): void {
    if (this.ambientLight) {
      this.ambientLight.intensity = isDark ? 0.85 : 1.3;
      this.ambientLight.color.setHex(isDark ? 0xffffff : 0xf8fafc);
    }

    if (this.coreMesh) {
      const mat = this.coreMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(isDark ? 0x0a0c10 : 0x1e2430);
      mat.metalness = isDark ? 0.92 : 0.85;
      mat.roughness = isDark ? 0.18 : 0.25;
    }

    if (this.goldRingMesh) {
      const mat = this.goldRingMesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isDark ? 0.28 : 0.45;
    }
  }

  /**
   * Initializes mouse movement and drag gesture listeners.
   */
  private initEventListeners(): void {
    const container = this.containerRef.nativeElement;

    container.addEventListener('mousemove', this.onPointerMoveBound, { passive: true });
    container.addEventListener('mousedown', this.onPointerDownBound);
    window.addEventListener('mouseup', this.onPointerUpBound);

    container.addEventListener('touchmove', this.onPointerMoveBound, { passive: true });
    container.addEventListener('touchstart', this.onPointerDownBound, { passive: true });
    window.addEventListener('touchend', this.onPointerUpBound);
  }

  /**
   * Removes all event listeners on cleanup.
   */
  private removeEventListeners(): void {
    const container = this.containerRef?.nativeElement;
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
   * Handles pointer motion for interactive parallax tilt and rotational dragging.
   */
  private handlePointerMove(e: MouseEvent | TouchEvent): void {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (this.isDragging) {
      const deltaX = clientX - this.prevPointerX;
      const deltaY = clientY - this.prevPointerY;
      this.targetRotY += deltaX * 0.01;
      this.targetRotX += deltaY * 0.01;
      this.prevPointerX = clientX;
      this.prevPointerY = clientY;
    } else {
      const rect = this.containerRef.nativeElement.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      this.mouseX = nx;
      this.mouseY = ny;
      this.targetRotX = -this.mouseY * 0.35;
      this.targetRotY = this.mouseX * 0.45;
    }
  }

  /**
   * Starts drag-to-rotate interaction.
   */
  private handlePointerDown(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.prevPointerX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.prevPointerY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  }

  /**
   * Ends drag interaction.
   */
  private handlePointerUp(): void {
    this.isDragging = false;
  }

  /**
   * Sets up ResizeObserver for responsive canvas scaling and IntersectionObserver for pausing offscreen.
   */
  private initObservers(): void {
    const container = this.containerRef.nativeElement;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this.camera && this.renderer) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.isVisible = entry.isIntersecting;
        }
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(container);
  }

  /**
   * Deep disposal of all WebGL meshes, materials, and textures.
   */
  private disposeThree(): void {
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          if (obj.geometry) {
            obj.geometry.dispose();
          }
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
  }
}

