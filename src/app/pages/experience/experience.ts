import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { FactoryGear, FactoryPiston, InteractiveSceneService } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/** Spark particle emitted when the hydraulic press stamps a crate. */
export interface PressSpark {
  id: number;
  tx: number;
  ty: number;
}

/**
 * Experience section component styled as the interactive horizontal-scrolling
 * "The Factory" conveyor belt from devinthehood.com, complete with sticky
 * vertical-to-horizontal scroll lock, rotating gears, hydraulic press with
 * 18-spark burst, career progression milestones, and spinning conveyor rollers.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('beltViewport') public beltViewport?: ElementRef<HTMLElement>;
  @ViewChild('factorySection') public factorySection?: ElementRef<HTMLElement>;
  @ViewChild('factorySticky') public factorySticky?: ElementRef<HTMLElement>;

  /** All experience entries loaded from the portfolio service. */
  public readonly experiences: Array<Experience>;

  /** Whether the hydraulic press is currently mid-stamp animation. */
  public readonly isPressing = signal<boolean>(false);

  /** Whether crates are displayed in Raw Blueprint Wireframe mode vs Shipped mode. */
  public readonly isRawBlueprint = signal<boolean>(false);

  /** Horizontal scroll progress (0..100) along the factory conveyor belt. */
  public readonly beltScrollPct = signal<number>(0);

  /** Whether the user is click-dragging the conveyor belt. */
  public readonly isDraggingBelt = signal<boolean>(false);

  /** Sticky scroll runway height in pixels for vertical-to-horizontal scroll lock. */
  public readonly runwayHeightPx = signal<number | null>(null);

  /** Active 18-spark burst particles emitted by the hydraulic press (devinthehood Yt pattern). */
  public readonly sparks = signal<Array<PressSpark>>([]);

  /** Number of conveyor belt rollers to render. */
  public readonly rollers: Array<number> = Array.from({ length: 28 }, (_, i) => i);

  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private syncingFromWindowScroll = false;
  private lastAutoStampZone = -1;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  private resizeObserver: ResizeObserver | null = null;

  private readonly portfolio: PortfolioService = inject(PortfolioService);
  public readonly t: TranslateService = inject(TranslateService);
  public readonly sceneService: InteractiveSceneService = inject(InteractiveSceneService);

  /** Rotating factory gears loaded from assets/data/interactive-scenes.json. */
  public readonly gears = computed<Array<FactoryGear>>(() =>
    this.sceneService.config().scenes.factory.gears
  );

  /** Animated factory pistons loaded from assets/data/interactive-scenes.json. */
  public readonly pistons = computed<Array<FactoryPiston>>(() =>
    this.sceneService.config().scenes.factory.pistons
  );

  /** Total career stations on the belt. */
  public readonly totalBeltItems = computed<number>(
    () => this.experiences.length
  );

  /** Number of crates shipped based on belt scroll progress (devinthehood data-shipped counter). */
  public readonly shippedCount = computed<number>(() => {
    const total = this.totalBeltItems();
    const pct = this.beltScrollPct();
    return Math.min(total, Math.max(1, Math.round((pct / 100) * (total - 1)) + 1));
  });

  constructor() {
    this.experiences = this.portfolio.getExperiences();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculateRunway();
      this.onWindowScroll();
    }, 100);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.recalculateRunway();
        this.onWindowScroll();
      });
      if (this.beltViewport?.nativeElement) {
        this.resizeObserver.observe(this.beltViewport.nativeElement);
      }
      if (this.factorySticky?.nativeElement) {
        this.resizeObserver.observe(this.factorySticky.nativeElement);
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeObserver?.disconnect();
  }

  /**
   * Scrubs the horizontal conveyor belt via range slider.
   */
  public onBeltScrub(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const el = this.beltViewport?.nativeElement;
    if (!input || !el) {
      return;
    }
    const pct: number = Number(input.value);
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    const targetLeft: number = (pct / 100) * maxScroll;

    if (this.runwayHeightPx() !== null && this.factorySection?.nativeElement) {
      const sectionTop: number = this.factorySection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 70 + targetLeft), behavior: 'auto' });
    } else {
      el.scrollLeft = targetLeft;
      this.beltScrollPct.set(pct);
    }
  }

  /**
   * Cycles the hydraulic press down, emits an 18-spark burst, and toggles/stamps
   * the crates between Raw Wireframe and Shipped Production state.
   */
  public cycleHydraulicPress(toggleRaw = true): void {
    if (this.isPressing()) {
      return;
    }
    this.isPressing.set(true);
    this.emitSparkBurst();

    if (toggleRaw) {
      setTimeout(() => {
        this.isRawBlueprint.update((v: boolean) => !v);
      }, 240);
    }
    setTimeout(() => {
      this.isPressing.set(false);
    }, 620);
  }

  /**
   * Scrolls the horizontal conveyor belt left or right.
   */
  public scrollBelt(direction: -1 | 1): void {
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    const delta = direction * 520;
    if (this.runwayHeightPx() !== null && this.factorySection?.nativeElement) {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }

  /**
   * Returns to the start of the conveyor belt (Station 01).
   */
  public scrollToBeltStart(): void {
    const el = this.beltViewport?.nativeElement;
    if (this.runwayHeightPx() !== null && this.factorySection?.nativeElement) {
      const sectionTop = this.factorySection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 70), behavior: 'smooth' });
    } else if (el) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.recalculateRunway();
      this.onWindowScroll();
    }, 100);
  }

  /**
   * Syncs vertical window scroll inside `.factory` into horizontal `scrollLeft`
   * so scrolling down scrolls the entire factory belt before advancing to the next section.
   */
  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (this.runwayHeightPx() === null) {
      return;
    }
    const sectionEl = this.factorySection?.nativeElement;
    const stickyEl = this.factorySticky?.nativeElement;
    const viewportEl = this.beltViewport?.nativeElement;
    if (!sectionEl || !stickyEl || !viewportEl) {
      return;
    }

    const maxScroll = Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);
    if (maxScroll <= 0) {
      return;
    }

    const rect = sectionEl.getBoundingClientRect();
    const stickyOffset = 70;
    const runwayTravel = Math.max(1, sectionEl.offsetHeight - stickyEl.offsetHeight);
    const rawScrolled = stickyOffset - rect.top;
    const clampedScrolled = Math.min(runwayTravel, Math.max(0, rawScrolled));
    const progressRatio = clampedScrolled / runwayTravel;
    const pct = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

    this.syncingFromWindowScroll = true;
    viewportEl.scrollLeft = progressRatio * maxScroll;
    this.beltScrollPct.set(pct);

    // Auto-stamp hydraulic press with sparks at key conveyor checkpoints (25%, 50%, 75%)
    const zone = Math.floor(pct / 25);
    if (zone > 0 && zone !== this.lastAutoStampZone) {
      this.lastAutoStampZone = zone;
      this.cycleHydraulicPress(false);
    }

    setTimeout(() => {
      this.syncingFromWindowScroll = false;
    }, 0);
  }

  /**
   * Updates `beltScrollPct` when the horizontal conveyor belt scrolls.
   */
  public onBeltScroll(): void {
    if (this.syncingFromWindowScroll) {
      return;
    }
    this.updateBeltScrollPct();
  }

  /**
   * Converts mouse-wheel scrolling over the conveyor belt into smooth horizontal progress.
   */
  public onBeltWheel(event: WheelEvent): void {
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      return;
    }

    if (this.runwayHeightPx() !== null) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const atStart: boolean = el.scrollLeft <= 2;
        const atEnd: boolean = el.scrollLeft >= maxScroll - 2;
        if ((event.deltaX < 0 && !atStart) || (event.deltaX > 0 && !atEnd)) {
          event.preventDefault();
          window.scrollBy({ top: event.deltaX, behavior: 'auto' });
        }
      }
      return;
    }

    const atStart: boolean = el.scrollLeft <= 2;
    const atEnd: boolean = el.scrollLeft >= maxScroll - 2;

    if ((event.deltaY < 0 && !atStart) || (event.deltaY > 0 && !atEnd)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY * 1.15;
      this.updateBeltScrollPct();
    }
  }

  /**
   * Starts click-and-drag scrolling on the horizontal conveyor belt.
   */
  public onBeltDragStart(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    this.isDraggingBelt.set(true);
    this.dragStartX = event.pageX;
    this.dragStartScrollLeft = el.scrollLeft;
  }

  @HostListener('window:mousemove', ['$event'])
  public onWindowMouseMove(event: MouseEvent): void {
    if (!this.isDraggingBelt()) {
      return;
    }
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    const deltaX: number = event.pageX - this.dragStartX;
    const targetLeft = this.dragStartScrollLeft - deltaX * 1.25;
    if (this.runwayHeightPx() !== null && this.factorySection?.nativeElement) {
      const sectionTop = this.factorySection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 68 + targetLeft), behavior: 'auto' });
    } else {
      el.scrollLeft = targetLeft;
      this.updateBeltScrollPct();
    }
  }

  @HostListener('window:mouseup')
  public onWindowMouseUp(): void {
    if (this.isDraggingBelt()) {
      this.isDraggingBelt.set(false);
    }
  }

  /**
   * Calculates a formatted duration string between two dates using time as a value.
   *
   * @param startDateStr - Start date in 'MMM YYYY' format (e.g. 'Aug 2023')
   * @param endDateStr - End date in 'MMM YYYY' format, or null for Present
   * @returns Human-readable duration string (e.g. '2 yrs 6 mos', '2 mos')
   */
  public calculateDuration(startDateStr: string, endDateStr: string | null): string {
    const start: Date = this.parseMonthYear(startDateStr);
    const end: Date = endDateStr ? this.parseMonthYear(endDateStr) : new Date();

    const totalMonths: number =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    const safeMonths: number = Math.max(1, totalMonths);

    const years: number = Math.floor(safeMonths / 12);
    const months: number = safeMonths % 12;

    if (years > 0 && months > 0) {
      return `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'yr' : 'yrs'}`;
    }
    return `${safeMonths} ${safeMonths === 1 ? 'mo' : 'mos'}`;
  }

  /**
   * Computes the cumulative professional tenure from the earliest role to present.
   *
   * @returns Cumulative tenure duration string
   */
  public getTotalTenure(): string {
    if (this.experiences.length === 0) {
      return '0 mos';
    }
    const earliestRole: Experience = this.experiences[this.experiences.length - 1];
    return this.calculateDuration(earliestRole.startDate, null);
  }

  /**
   * Emits 18 radial spark particles from the hydraulic press head (devinthehood Yt pattern).
   */
  private emitSparkBurst(): void {
    const generated: Array<PressSpark> = Array.from({ length: 18 }, (_, i) => {
      const angle = (Math.PI * i) / 17;
      const dist = 50 + ((i * 23) % 75);
      return {
        id: i,
        tx: Math.round(-Math.cos(angle) * dist),
        ty: Math.round(-Math.sin(angle) * dist * 0.75)
      };
    });
    this.sparks.set(generated);
    setTimeout(() => {
      this.sparks.set([]);
    }, 750);
  }

  private recalculateRunway(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const viewportEl = this.beltViewport?.nativeElement;
    const stickyEl = this.factorySticky?.nativeElement;
    if (!viewportEl || !stickyEl || window.innerWidth <= 768) {
      this.runwayHeightPx.set(null);
      return;
    }
    const maxScroll = Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);
    if (maxScroll <= 20) {
      this.runwayHeightPx.set(null);
      return;
    }
    this.runwayHeightPx.set(stickyEl.offsetHeight + maxScroll);
  }

  /**
   * Parses a 'MMM YYYY' string into a JavaScript Date object.
   *
   * @param str - Date string in 'MMM YYYY' format
   * @returns Parsed Date object
   */
  private parseMonthYear(str: string): Date {
    const monthNames: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const parts: string[] = str.trim().split(' ');
    const monthIdx: number = monthNames.indexOf(parts[0]);
    const year: number = parseInt(parts[1], 10) || new Date().getFullYear();
    return new Date(year, monthIdx >= 0 ? monthIdx : 0, 1);
  }

  private updateBeltScrollPct(): void {
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      this.beltScrollPct.set(0);
      return;
    }
    const pct: number = Math.round((el.scrollLeft / maxScroll) * 100);
    this.beltScrollPct.set(Math.max(0, Math.min(100, pct)));
  }
}
