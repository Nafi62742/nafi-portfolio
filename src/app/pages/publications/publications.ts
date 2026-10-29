import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Publication } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/** Research node item for the knowledge graph animation. */
export interface ResearchNode {
  id: string;
  label: string;
  sub: string;
  icon: string;
  cx: number;
  cy: number;
  badge: string;
}

/**
 * Publications section component displaying research and publication cards
 * with an interactive neural research network & knowledge graph stage.
 */
@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publications.html',
  styleUrl: './publications.scss'
})
export class PublicationsComponent {
  /** All publications loaded from the portfolio service. */
  public readonly publications: Array<Publication>;

  /** Whether the neural research network stream is actively pulsing. */
  public readonly streamActive = signal<boolean>(true);

  /** Currently selected research node ID in the interactive graph. */
  public readonly activeNodeId = signal<string>('ieee-1');

  /** Interactive knowledge graph nodes representing research clusters. */
  public readonly researchNodes: Array<ResearchNode> = [
    { id: 'ieee-1', label: 'IEEE XPLORE', sub: 'COMPUTER VISION // REAL-TIME', icon: 'fa-brain', cx: 120, cy: 90, badge: 'CONFERENCE' },
    { id: 'springer-1', label: 'SPRINGER NATURE', sub: 'DEEP LEARNING // SCREENING', icon: 'fa-network-wired', cx: 360, cy: 90, badge: 'JOURNAL' },
    { id: 'doi-gate', label: 'DOI REGISTRY', sub: 'PEER-REVIEWED INDEX', icon: 'fa-fingerprint', cx: 240, cy: 195, badge: 'VERIFIED' },
  ];

  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);

  constructor() {
    this.publications = this.portfolio.getPublications();
  }

  /**
   * Toggles the live synapse data stream animation in the research network.
   */
  public toggleStream(): void {
    this.streamActive.update((active: boolean) => !active);
  }

  /**
   * Selects an active research node in the knowledge matrix.
   */
  public selectNode(id: string): void {
    this.activeNodeId.set(id);
  }

  /**
   * Converts a publication title to a URL-safe slug.
   *
   * @param title - The publication title to slugify
   * @returns A lowercase, hyphenated slug string
   */
  public toSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Identifies the publication type category based on venue description.
   *
   * @param venue - Venue string from publication metadata
   * @returns Clean category badge label
   */
  public getPublicationType(venue: string): string {
    if (venue.toLowerCase().includes('ieee') || venue.toLowerCase().includes('conference')) {
      return 'IEEE Conference Paper';
    }
    return 'Journal Article';
  }
}
