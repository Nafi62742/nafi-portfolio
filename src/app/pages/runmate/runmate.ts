import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import { RunMateData, RunMateFeature, RunMateSlide } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Featured showcase component for the RunMate marathon & GPS running ecosystem.
 * Includes an interactive animated device mockup slider, sticky vertical-to-horizontal
 * scrollable feature strip (devinthehood style), and official store download action badges.
 */
@Component({
  selector: 'app-runmate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './runmate.html',
  styleUrl: './runmate.scss'
})
export class RunmateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('featuresRunway') public featuresRunway?: ElementRef<HTMLElement>;
  @ViewChild('featuresSticky') public featuresSticky?: ElementRef<HTMLElement>;
  @ViewChild('featuresViewport') public featuresViewport?: ElementRef<HTMLElement>;
  @ViewChild('slidesViewport') public slidesViewport?: ElementRef<HTMLElement>;

  /** Translation service for internationalized labels. */
  public readonly t = inject(TranslateService);

  /** Portfolio data service. */
  private readonly portfolioService = inject(PortfolioService);

  /** Full data payload for the RunMate product showcase. */
  public readonly runmateData: RunMateData = this.portfolioService.getRunMateData();

  /** Signal tracking currently active slide index in the showcase carousel. */
  public readonly activeSlideIndex = signal<number>(0);

  /** Signal tracking currently selected feature tab ('all' defaults to all features on the horizontal strip). */
  public readonly activeTab = signal<'all' | 'runners' | 'races' | 'organizers' | 'tech'>('all');

  /** Horizontal scroll progress (0..100) for the features strip. */
  public readonly featureScrollPct = signal<number>(0);

  /** Dynamic runway height (px) for vertical-to-horizontal sticky scroll lock. */
  public readonly featuresRunwayHeightPx = signal<number | null>(null);

  /** Whether the user is currently dragging the horizontal features strip. */
  public readonly isDraggingFeatures = signal<boolean>(false);

  /** Signal holding fullscreen image url when lightbox is open. */
  public readonly activeFullscreenImage = signal<string | null>(null);

  /** Auto-play timer reference. */
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  /** Touch start coordinate for mobile swipe detection. */
  private touchStartX = 0;

  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private resizeObserver: ResizeObserver | null = null;

  /**
   * Global keyboard listener to close lightbox on Escape.
   *
   * @param event - Keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (this.activeFullscreenImage() !== null && event.key === 'Escape') {
      this.closeFullscreen();
    }
  }

  /**
   * Initializes the component and starts slider auto-play.
   */
  public ngOnInit(): void {
    this.startAutoPlay();
  }

  /**
   * Measures the horizontal features strip after view initialization.
   */
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculateRunway();
      this.syncHorizontalFromVerticalScroll();
    }, 80);

    if (typeof ResizeObserver !== 'undefined' && this.featuresViewport?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.recalculateRunway();
        this.syncHorizontalFromVerticalScroll();
      });
      this.resizeObserver.observe(this.featuresViewport.nativeElement);
    }
  }

  /**
   * Cleans up running timers on component destruction.
   */
  public ngOnDestroy(): void {
    this.stopAutoPlay();
    this.resizeObserver?.disconnect();
  }

  /**
   * Synchronizes the horizontal features strip with vertical page scrolling.
   */
  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (!this.isDraggingFeatures()) {
      this.syncHorizontalFromVerticalScroll();
    }
  }

  /**
   * Recalculates the sticky runway height when the viewport resizes.
   */
  @HostListener('window:resize')
  public onWindowResize(): void {
    this.recalculateRunway();
    this.syncHorizontalFromVerticalScroll();
  }

  /**
   * Advances carousel to the next slide.
   */
  public nextSlide(): void {
    const total: number = this.runmateData.slides.length;
    this.activeSlideIndex.update((curr: number) => (curr + 1) % total);
  }

  /**
   * Moves carousel to the previous slide.
   */
  public prevSlide(): void {
    const total: number = this.runmateData.slides.length;
    this.activeSlideIndex.update((curr: number) => (curr - 1 + total) % total);
  }

  /**
   * Sets carousel directly to a specific slide index.
   *
   * @param index - Target slide index
   */
  public goToSlide(index: number): void {
    if (index >= 0 && index < this.runmateData.slides.length) {
      this.activeSlideIndex.set(index);
    }
  }

  /**
   * Switches the active feature category tab and resets horizontal scroll position.
   *
   * @param tab - Target tab identifier
   */
  public setTab(tab: 'all' | 'runners' | 'races' | 'organizers' | 'tech'): void {
    this.activeTab.set(tab);
    setTimeout(() => {
      const el = this.featuresViewport?.nativeElement;
      if (el) {
        el.scrollLeft = 0;
        this.updateFeatureScrollPct();
      }
      this.recalculateRunway();
    }, 30);
  }

  /**
   * Scrolls the horizontal features strip left or right.
   *
   * @param direction - -1 for left, 1 for right
   */
  public scrollFeatures(direction: -1 | 1): void {
    const el = this.featuresViewport?.nativeElement;
    if (!el) {
      return;
    }
    const maxScroll: number = Math.max(1, el.scrollWidth - el.clientWidth);
    const targetScrollLeft: number = Math.max(0, Math.min(maxScroll, el.scrollLeft + direction * 380));
    const ratio: number = targetScrollLeft / maxScroll;
    if (!this.scrollWindowToFeatureRatio(ratio)) {
      el.scrollBy({ left: direction * 380, behavior: 'smooth' });
    }
  }

  /**
   * Updates `featureScrollPct` when the horizontal features viewport scrolls.
   */
  public onFeaturesScroll(): void {
    this.updateFeatureScrollPct();
  }

  /**
   * Converts horizontal trackpad scrolling over the features strip into vertical page scroll
   * so the sticky runway stays synchronized.
   */
  public onFeaturesWheel(event: WheelEvent): void {
    const el = this.featuresViewport?.nativeElement;
    if (!el) {
      return;
    }
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      window.scrollBy({ top: event.deltaX, behavior: 'auto' });
    }
  }

  /**
   * Converts vertical mouse-wheel scrolling over the horizontal slides filmstrip
   * into horizontal scrolling.
   */
  public onSlidesWheel(event: WheelEvent): void {
    const el = this.slidesViewport?.nativeElement;
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
      el.scrollLeft += event.deltaY;
    }
  }

  /**
   * Starts click-and-drag scrolling on the horizontal features strip.
   */
  public onFeaturesDragStart(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    const el = this.featuresViewport?.nativeElement;
    if (!el) {
      return;
    }
    this.isDraggingFeatures.set(true);
    this.dragStartX = event.pageX;
    this.dragStartScrollLeft = el.scrollLeft;
  }

  @HostListener('window:mousemove', ['$event'])
  public onWindowMouseMove(event: MouseEvent): void {
    if (!this.isDraggingFeatures()) {
      return;
    }
    const el = this.featuresViewport?.nativeElement;
    if (!el) {
      return;
    }
    const deltaX: number = event.pageX - this.dragStartX;
    el.scrollLeft = this.dragStartScrollLeft - deltaX * 1.25;
    this.updateFeatureScrollPct();
  }

  @HostListener('window:mouseup')
  public onWindowMouseUp(): void {
    if (this.isDraggingFeatures()) {
      this.isDraggingFeatures.set(false);
    }
  }

  /**
   * Scrubs the horizontal features strip via range slider.
   */
  public onFeatureScrub(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const el = this.featuresViewport?.nativeElement;
    if (!input || !el) {
      return;
    }
    const pct: number = Number(input.value);
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    const ratio: number = Math.max(0, Math.min(1, pct / 100));
    el.scrollLeft = ratio * maxScroll;
    this.featureScrollPct.set(pct);
    this.scrollWindowToFeatureRatio(ratio);
  }

  /**
   * Opens the fullscreen image lightbox modal.
   *
   * @param imageUrl - URL of image to display
   */
  public openFullscreen(imageUrl: string): void {
    this.activeFullscreenImage.set(imageUrl);
    this.stopAutoPlay();
  }

  /**
   * Closes the fullscreen image lightbox modal.
   */
  public closeFullscreen(): void {
    this.activeFullscreenImage.set(null);
    this.startAutoPlay();
  }

  /**
   * Closes the fullscreen modal when clicking the backdrop overlay.
   *
   * @param event - Mouse event from the backdrop
   */
  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeFullscreen();
    }
  }

  /**
   * Returns list of features matching the currently active tab.
   *
   * @returns Array of RunMateFeature items
   */
  public get filteredFeatures(): Array<RunMateFeature> {
    if (this.activeTab() === 'all') {
      return this.runmateData.features;
    }
    return this.runmateData.features.filter(
      (f: RunMateFeature) => f.category === this.activeTab()
    );
  }

  /**
   * Starts the 5.5-second interval timer for slider auto-play.
   */
  public startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, 5500);
  }

  /**
   * Stops slider auto-play (e.g. on mouse hover or touch interaction).
   */
  public stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  /**
   * Records touch start position for swipe gesture handling.
   *
   * @param event - Touch event
   */
  public onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.stopAutoPlay();
  }

  /**
   * Evaluates horizontal touch delta to trigger slide navigation.
   *
   * @param event - Touch event
   */
  public onTouchEnd(event: TouchEvent): void {
    const touchEndX: number = event.changedTouches[0].clientX;
    const deltaX: number = touchEndX - this.touchStartX;

    if (deltaX > 50) {
      this.prevSlide();
    } else if (deltaX < -50) {
      this.nextSlide();
    }
    this.startAutoPlay();
  }

  /**
   * Helper to safely open external store download URLs in a new window.
   *
   * @param url - Destination store URL
   */
  public openLink(url?: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Getter for current active slide object.
   *
   * @returns Active RunMateSlide
   */
  public get currentSlide(): RunMateSlide {
    return this.runmateData.slides[this.activeSlideIndex()];
  }

  private updateFeatureScrollPct(): void {
    const el = this.featuresViewport?.nativeElement;
    if (!el) {
      return;
    }
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      this.featureScrollPct.set(0);
      return;
    }
    const pct: number = Math.round((el.scrollLeft / maxScroll) * 100);
    this.featureScrollPct.set(Math.max(0, Math.min(100, pct)));
  }

  private recalculateRunway(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const stickyEl = this.featuresSticky?.nativeElement;
    const viewportEl = this.featuresViewport?.nativeElement;
    if (!stickyEl || !viewportEl) {
      return;
    }
    if (window.innerWidth <= 900) {
      this.featuresRunwayHeightPx.set(null);
      return;
    }
    const maxScroll: number = Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);
    const stickyHeight: number = Math.max(stickyEl.offsetHeight, 440);
    this.featuresRunwayHeightPx.set(Math.round(stickyHeight + maxScroll * 0.95));
  }

  private syncHorizontalFromVerticalScroll(): void {
    if (typeof window === 'undefined' || window.innerWidth <= 900) {
      return;
    }
    const runwayEl = this.featuresRunway?.nativeElement;
    const stickyEl = this.featuresSticky?.nativeElement;
    const viewportEl = this.featuresViewport?.nativeElement;
    if (!runwayEl || !stickyEl || !viewportEl) {
      return;
    }
    const maxScroll: number = viewportEl.scrollWidth - viewportEl.clientWidth;
    if (maxScroll <= 0) {
      return;
    }
    const rect: DOMRect = runwayEl.getBoundingClientRect();
    const stickyOffsetTop = 88;
    const travel: number = runwayEl.offsetHeight - stickyEl.offsetHeight;
    if (travel <= 10) {
      return;
    }
    const scrolledInto: number = stickyOffsetTop - rect.top;
    const ratio: number = Math.max(0, Math.min(1, scrolledInto / travel));
    viewportEl.scrollLeft = ratio * maxScroll;
    this.featureScrollPct.set(Math.round(ratio * 100));
  }

  private scrollWindowToFeatureRatio(ratio: number): boolean {
    if (typeof window === 'undefined' || window.innerWidth <= 900) {
      return false;
    }
    const runwayEl = this.featuresRunway?.nativeElement;
    const stickyEl = this.featuresSticky?.nativeElement;
    if (!runwayEl || !stickyEl) {
      return false;
    }
    const travel: number = runwayEl.offsetHeight - stickyEl.offsetHeight;
    if (travel <= 10) {
      return false;
    }
    const stickyOffsetTop = 88;
    const runwayTop: number = window.scrollY + runwayEl.getBoundingClientRect().top - stickyOffsetTop;
    const targetY: number = runwayTop + Math.max(0, Math.min(1, ratio)) * travel;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    return true;
  }
}
