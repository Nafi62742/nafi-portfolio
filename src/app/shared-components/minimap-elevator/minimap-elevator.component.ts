import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { MINIMAP_NODES, MinimapNode, ScrollService } from '@services/scroll.service';

/**
 * Concept 4: Cyber Minimap Elevator Component.
 * An executive, glassmorphic blueprint elevator strip anchored to the right side of the screen.
 * Tracks precise document scroll progress and section depth, rendering architectural glyph nodes
 * and an interactive sliding elevator cursor that allows one-click jumping across chapters.
 */
@Component({
  selector: 'app-minimap-elevator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minimap-elevator.component.html',
  styleUrl: './minimap-elevator.component.scss'
})
export class MinimapElevatorComponent {
  public readonly scrollService = inject(ScrollService);

  /** 7 blueprint chapter nodes. */
  public readonly nodes: Array<MinimapNode> = MINIMAP_NODES;

  /** Active section node object. */
  public readonly activeNode = this.scrollService.activeNode;

  /** Formatted scroll percentage integer for the blueprint header (e.g. '42%'). */
  public readonly scrollPercent = computed<number>(() => {
    return Math.round(this.scrollService.scrollProgress() * 100);
  });

  /** Computed index of the active chapter (0 to 6). */
  public readonly activeIndex = computed<number>(() => {
    const active = this.activeNode();
    const idx: number = this.nodes.findIndex((n: MinimapNode) => n.id === active.id);
    return idx >= 0 ? idx : 0;
  });

  /**
   * Smoothly navigates to a designated chapter section.
   *
   * @param id - Section target DOM identifier
   */
  public navigateTo(id: string): void {
    this.scrollService.scrollTo(id);
  }

  /**
   * Scrolls smoothly to the very top (Hero).
   */
  public scrollToTop(): void {
    this.scrollService.scrollTo('hero');
  }

  /**
   * Scrolls smoothly to the dispatch console (Contact).
   */
  public scrollToBottom(): void {
    this.scrollService.scrollTo('contact');
  }
}

