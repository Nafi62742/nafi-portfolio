import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { RunMateData, RunMateFeature, RunMateSlide } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Featured showcase component for the RunMate marathon & GPS running ecosystem.
 * Includes an interactive animated device mockup slider, feature category tabs,
 * and official store download action badges.
 */
@Component({
  selector: 'app-runmate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './runmate.html',
  styleUrl: './runmate.scss'
})
export class RunmateComponent implements OnInit, OnDestroy {
  /** Translation service for internationalized labels. */
  public readonly t = inject(TranslateService);

  /** Portfolio data service. */
  private readonly portfolioService = inject(PortfolioService);

  /** Full data payload for the RunMate product showcase. */
  public readonly runmateData: RunMateData = this.portfolioService.getRunMateData();

  /** Signal tracking currently active slide index in the showcase carousel. */
  public readonly activeSlideIndex = signal<number>(0);

  /** Signal tracking currently selected feature tab. */
  public readonly activeTab = signal<'runners' | 'organizers' | 'tech'>('runners');

  /** Signal holding fullscreen image url when lightbox is open. */
  public readonly activeFullscreenImage = signal<string | null>(null);

  /** Auto-play timer reference. */
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  /** Touch start coordinate for mobile swipe detection. */
  private touchStartX = 0;

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
   * Cleans up running timers on component destruction.
   */
  public ngOnDestroy(): void {
    this.stopAutoPlay();
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
   * Switches the active feature category tab.
   *
   * @param tab - Target tab identifier
   */
  public setTab(tab: 'runners' | 'organizers' | 'tech'): void {
    this.activeTab.set(tab);
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
}

