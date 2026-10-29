import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { FactoryGear, FactoryPiston, InteractiveSceneService } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Experience section component styled as the interactive horizontal-scrolling
 * "The Factory" conveyor belt from devinthehood.com, complete with JSON-driven
 * rotating gears, hydraulic press stamping, conveyor belt rollers, and wheel/drag scroll.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class ExperienceComponent {
  @ViewChild('beltViewport') public beltViewport?: ElementRef<HTMLElement>;

  /** All experience entries loaded from the portfolio service. */
  public readonly experiences: Array<Experience>;

  /** Whether the hydraulic press is currently mid-stamp animation. */
  public readonly isPressing = signal<boolean>(false);

  /** Whether crates are displayed in Raw Blueprint Wireframe mode vs Shipped mode. */
  public readonly isRawBlueprint = signal<boolean>(false);

  /** Layout mode: 'belt' (horizontal conveyor belt strip) or 'stack' (vertical stack). */
  public readonly layoutMode = signal<'belt' | 'stack'>('belt');

  /** Horizontal scroll progress (0..100) along the factory conveyor belt. */
  public readonly beltScrollPct = signal<number>(0);

  /** Whether the user is click-dragging the conveyor belt. */
  public readonly isDraggingBelt = signal<boolean>(false);

  /** Number of conveyor belt rollers to render. */
  public readonly rollers: Array<number> = Array.from({ length: 24 }, (_, i) => i);

  private dragStartX = 0;
  private dragStartScrollLeft = 0;

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

  constructor() {
    this.experiences = this.portfolio.getExperiences();
  }

  /**
   * Cycles the hydraulic press down and toggles/stamps the crates between
   * Raw Wireframe and Shipped Production state.
   */
  public cycleHydraulicPress(): void {
    if (this.isPressing()) {
      return;
    }
    this.isPressing.set(true);
    setTimeout(() => {
      this.isRawBlueprint.update((v: boolean) => !v);
    }, 260);
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
    el.scrollBy({ left: direction * 520, behavior: 'smooth' });
  }

  /**
   * Updates `beltScrollPct` when the horizontal conveyor belt scrolls.
   */
  public onBeltScroll(): void {
    this.updateBeltScrollPct();
  }

  /**
   * Converts vertical mouse-wheel scrolling over the conveyor belt into smooth
   * horizontal scrolling, releasing to page scroll at the start/end boundaries.
   */
  public onBeltWheel(event: WheelEvent): void {
    if (this.layoutMode() !== 'belt') {
      return;
    }
    const el = this.beltViewport?.nativeElement;
    if (!el) {
      return;
    }
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
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
    if (this.layoutMode() !== 'belt' || event.button !== 0) {
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
    el.scrollLeft = this.dragStartScrollLeft - deltaX * 1.25;
    this.updateBeltScrollPct();
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
