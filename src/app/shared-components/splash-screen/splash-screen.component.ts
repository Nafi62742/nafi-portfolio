import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';

import { InteractiveSceneService, SplashStage } from '@services/interactive-scene.service';

/**
 * Custom R-007 Car Hood Opening Splash Screen component.
 * Displays a sports car hood with capital "R" and "007" emblem that unlocks
 * and pivots open in 3D perspective to reveal a spinning V8 Twin-Turbo engine bay.
 */
@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss'
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  public readonly sceneService = inject(InteractiveSceneService);

  /** Loading progress percentage (0 to 100). */
  public readonly progress = signal<number>(0);

  /** Whether the car hood is popped open showing the engine bay. */
  public readonly hoodPopped = signal<boolean>(false);

  /** Whether the splash screen is currently playing its exit veil transition. */
  public readonly isExiting = signal<boolean>(false);

  private timerId: ReturnType<typeof setInterval> | null = null;
  private exitTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Current stage status text from the JSON config based on progress. */
  public readonly currentStatus = computed<string>(() => {
    const stages: Array<SplashStage> = this.sceneService.config().splash.stages;
    const p: number = this.progress();
    let active: string = stages[0]?.status ?? 'IGNITION ARMED // R-007';
    for (const s of stages) {
      if (p >= s.progress) {
        active = s.status;
      }
    }
    return active;
  });

  /** Dynamic RPM readout synced with progress and hood state. */
  public readonly rpmValue = computed<number>(() => {
    const base: number = 1200 + Math.round(this.progress() * 73);
    return this.hoodPopped() ? Math.max(base, 6800) : base;
  });

  constructor() {
    effect(() => {
      const runId: number = this.sceneService.splashRunId();
      if (runId > 1) {
        this.startSequence();
      }
    });
  }

  public ngOnInit(): void {
    this.startSequence();
  }

  public ngOnDestroy(): void {
    this.clearTimers();
  }

  /**
   * Starts or restarts the R-007 hood opening sequence from 0% to 100%.
   */
  public startSequence(): void {
    this.clearTimers();
    this.progress.set(0);
    this.hoodPopped.set(false);
    this.isExiting.set(false);

    this.timerId = setInterval(() => {
      const next: number = Math.min(100, this.progress() + 2);
      this.progress.set(next);

      if (next >= 34 && !this.hoodPopped()) {
        this.hoodPopped.set(true);
      }

      if (next >= 100) {
        this.clearTimers();
        this.exitTimeoutId = setTimeout(() => {
          this.dismissSplash();
        }, 650);
      }
    }, 38);
  }

  /**
   * Manually toggles or pops the R 007 car hood immediately when clicked.
   */
  public popHoodNow(): void {
    this.hoodPopped.set(true);
    if (this.progress() < 65) {
      this.progress.set(68);
    }
  }

  /**
   * Smoothly exits the splash screen and reveals the portfolio.
   */
  public dismissSplash(): void {
    this.clearTimers();
    this.hoodPopped.set(true);
    this.progress.set(100);
    this.isExiting.set(true);
    this.exitTimeoutId = setTimeout(() => {
      this.sceneService.closeSplash();
    }, 520);
  }

  private clearTimers(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.exitTimeoutId !== null) {
      clearTimeout(this.exitTimeoutId);
      this.exitTimeoutId = null;
    }
  }
}

