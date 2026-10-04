# Nafi Ahmed — Portfolio Design System & Architecture Guide

> **Version:** 2.0  
> **Last Updated:** September 2026  
> **Author:** Nafi Ahmed  
> **Application:** [nafi.dev](https://nafi.dev)  

---

## 1. Executive Summary & Design Philosophy

The portfolio of **Nafi Ahmed** is engineered as a high-performance, immersive single-page web application (SPA) built with **Angular (Standalone Architecture)**, **Tailwind CSS & Vanilla SCSS**, and **Three.js (WebGL)**. 

The visual design is grounded in an **editorial luxury tech aesthetic** inspired by modern design studios, characterized by:
- **Default Dark Mode** with deep space hues, luminous ambient accents, and ultra-high readability.
- **Alternating Cosmic Rhythm**: Odd-numbered sections feature a multi-layered CSS cosmic starfield and shooting stars, while even-numbered sections maintain clean solid surfaces for optical contrast.
- **True 3D Interactive WebGL Hero Graphic**: A metallic orbital core sphere surrounded by dynamic tech satellites (Angular, TypeScript, AWS, Flutter, Node.js, Docker).
- **Glassmorphism & Optical Depth Bloom**: Subtle semi-transparent surfaces with backdrop blur, glowing borders on hover, and smooth scroll reveals.

---

## 2. Color Palette & Design Tokens

The application utilizes a CSS Custom Property architecture defined in `src/styles.scss`, supporting both Dark Mode (default) and Light Mode.

```mermaid
graph TD
    A[Root Design System] --> B[Dark Theme (Default)]
    A --> C[Light Theme]
    B --> B1[Base: #090d16]
    B --> B2[Surface: #0e1424]
    B --> B3[Card: #131c2e]
    B --> B4[Primary Accent: #6366f1 Indigo]
    B --> B5[Secondary Accent: #06b6d4 Cyan]
    C --> C1[Base: #f9f7f7]
    C --> C2[Surface: #dbe2ef]
    C --> C3[Card: #ffffff]
    C --> C4[Primary: #3f72af]
    C --> C5[Dark Contrast: #112d4e]
```

### 2.1 Dark Mode Tokens (Default)

| Token | Value | Visual Purpose |
| :--- | :--- | :--- |
| `--bg-base` | `#090d16` | Deep obsidian base canvas for odd sections and root background |
| `--bg-surface` | `#0e1424` | Midnight navy background for even sections and container panels |
| `--bg-card` | `#131c2e` | Elevated glass card background surface |
| `--bg-card-hover` | `#19243b` | Interactive card hover state |
| `--text-primary` | `#f8fafc` | Pure bright text for headings and primary content |
| `--text-secondary`| `#94a3b8` | Slate text for body paragraphs and descriptions |
| `--text-muted` | `#64748b` | Muted slate for metadata, tags, and microcopy |
| `--border-color` | `rgba(255, 255, 255, 0.08)` | Subtle translucent border for structural division |
| `--gradient-primary` | `linear-gradient(135deg, #6366f1, #06b6d4)` | Signature Indigo-to-Cyan gradient for titles & CTAs |
| `--hero-accent` | `#38bdf8` | Luminous sky blue accent |

### 2.2 Light Mode Tokens

| Token | Value | Visual Purpose |
| :--- | :--- | :--- |
| `--bg-base` | `#f9f7f7` | Soft pearl canvas |
| `--bg-surface` | `#dbe2ef` | Crisp ice-blue surface |
| `--bg-card` | `#ffffff` | Pure white elevated cards |
| `--text-primary` | `#112d4e` | Deep navy for strong contrast typography |
| `--text-secondary`| `#3e4d61` | Charcoal for body copy |
| `--text-muted` | `#3f72af` | Soft oceanic blue for metadata |
| `--gradient-primary` | `linear-gradient(135deg, #3f72af, #112d4e)` | Royal blue gradient |

---

## 3. Typography & Font Hierarchy

The portfolio employs a curated four-tier font system to establish visual hierarchy and technical authority:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Host Grotesk (700-800)  → Section Titles, Hero Name, Card Headers     │
├────────────────────────────────────────────────────────────────────────┤
│ Inter (300-600)          → Body Copy, Paragraphs, UI Text, Navigation │
├────────────────────────────────────────────────────────────────────────┤
│ Fira Code (400-500)      → Tech Badges, Code Snippets, Dates, Period   │
├────────────────────────────────────────────────────────────────────────┤
│ Azeret Mono (500-700)    → Status Pills, Badges, Metrics & Numbers     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Host Grotesk** (`Host Grotesk`, system-ui, sans-serif): Contemporary geometric display typeface used for `h1`, `h2`, `h3`, and major title anchors.
2. **Inter** (`Inter`, -apple-system, sans-serif): Clean, neutral grotesque font optimized for high legibility across desktop and mobile screens.
3. **Fira Code** (`Fira Code`, monospace): Developer monospace typeface for tech stack chips, timestamps, terminal references, and technical attributes.
4. **Azeret Mono** (`Azeret Mono`, monospace): Stylized industrial monospace used for status capsule pills and metrics.

---

## 4. Layout Architecture & Section Rhythm

The homepage is organized into a carefully balanced alternating rhythm that provides visual variety while preserving content hierarchy:

```
┌────┬─────────────────┬──────────────────┬─────────────────────────────┐
│ #  │ Section         │ Background Type  │ Visual Characteristic       │
├────┼─────────────────┼──────────────────┼─────────────────────────────┤
│ 01 │ Hero            │ Starfield (Odd)  │ 3D Sphere, Intro, Live CTAs │
│ 02 │ About           │ Solid Surface    │ Bio, Metric Cards, Facts    │
│ 03 │ Skills          │ Starfield (Odd)  │ Categorized Tech Badges     │
│ 04 │ Experience      │ Solid Surface    │ Illuminated Timeline Spine  │
│ 05 │ Projects        │ Starfield (Odd)  │ Keyvo Inset Cards & Links   │
│ 06 │ RunMate Club    │ Solid Surface    │ Interactive App Showcase    │
│ 07 │ Publications    │ Starfield (Odd)  │ Academic Research Cards     │
│ 08 │ Education       │ Solid Surface    │ Degree & Leadership Grid    │
│ 09 │ Contact         │ Starfield (Odd)  │ Glassmorphism Form & Links  │
│ 10 │ Footer          │ Starfield (Odd)  │ Brand Signature & Scroll-up │
└────┴─────────────────┴──────────────────┴─────────────────────────────┘
```

---

## 5. Core Visual Elements & Key Components

### 5.1 Interactive Technology Sphere (Hero Section)

The hero graphic is a lightweight native HTML5 Canvas 2D interactive component (`src/app/shared-components/hero-sphere/`) built with pure JavaScript trigonometry (replacing Three.js for optimal 60fps performance on low-end devices):

- **Metallic Core**: Central metallic sphere with theme-adaptive radial gradients, specular highlights, and a rotating 3D wireframe lattice on the front hemisphere.
- **Architectural Orbital Rings**:
  - Primary **Gold Ring** rotated at `68°` with metallic golden specular response and inner guide orbit.
  - Secondary **Cyan Tech Ring** rotated at `-45°` with luminous neon glow.
  - Depth-filtered rendering (Painter's algorithm) ensuring true 3D occlusion behind and in front of the core sphere.
- **Orbiting 3D Satellites**: 6 tech nodes (**Angular**, **TypeScript**, **Node.js**, **AWS**, **Flutter**, **Docker**) orbiting on distinct planes with brand-colored glowing badges and depth scaling.
- **Interactivity**: Pointer parallax tilt and touch/mouse drag-to-rotate with smooth momentum damping.
- **Performance**: Zero external 3D libraries, clamped DPR (`<= 1.5`), runs outside Angular Zone via `NgZone.runOutsideAngular()`, frame-rate throttling, and automatically pauses rendering when scrolled offscreen via `IntersectionObserver`.

```
                  ┌──────────────────────────────┐
                  │      3D Tech Satellites      │
                  │   [NG] [TS] [JS] [AWS] [FL]  │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │   Gold & Cyan Rings   │
                     │  (Dual Orbit Planes)  │
                     └───────────┬───────────┘
                                 │
                     ┌───────────▼───────────┐
                     │ Metallic Core Sphere  │
                     │ (Icosahedron Lattice) │
                     └───────────────────────┘
```

---

### 5.2 Cosmic Starfield Engine

Implemented purely in CSS without heavy canvas dependencies, the starfield engine (`src/styles.scss`) renders three continuous parallax layers:

- **Layer 1 (`.stars-sm`)**: Fine 1px stardust clusters moving on a 90-second linear trajectory with gentle 4-second twinkling.
- **Layer 2 (`.stars-md`)**: 2px sparkling celestial stars drifting in reverse on a 65-second cycle with scaling micro-pulses.
- **Layer 3 (`.stars-lg`)**: 3px glowing stars with soft radial aureoles (gold, cyan, and indigo hues).
- **Shooting Stars (`.shooting-star-track`)**: High-velocity light streaks rotating at `-35°` with drop-shadow tails firing on 9-second and 14-second intervals.

---

### 5.3 Keyvo-Inspired Project Cards (Projects Section)

The project cards (`src/app/pages/projects/`) employ an inset display canvas architecture:

1. **Top Accent Line**: Thin 2px gradient line matching the project's signature brand color that illuminates on hover.
2. **Keyvo Inset Display Canvas**: 110px soft inset preview bay containing an elevated 52px floating icon wrapper with spring rotation.
3. **Floating Quick Actions**: Direct action buttons (GitHub, Google Play, App Store, YouTube, Live Demo) pinned to the top-right corner of the canvas.
4. **Identity & Status Pill**: Role typography accompanied by a status pill capsule (`Office` in indigo or `Personal` in emerald) featuring a live radar dot.
5. **Card Footer**: Clean technology badges paired with an animated "See Details" arrow link.

---

### 5.4 Illuminated Timeline Spine (Experience Section)

The experience section (`src/app/pages/experience/`) presents a continuous vertical timeline:

- **Active Role Radar Beacon**: For current employment (`Software Developer @ XORGeek`), the timeline node pulses with an emerald/cyan outer ring (`marker-pulse-ring`).
- **Gradient Spine Line**: Connects timeline nodes seamlessly with a top-to-bottom gradient.
- **Insight Items**: Interactive bullet points with micro-chevron boxes that highlight and translate slightly on hover.
- **Tech Stack Footer**: Dedicated chip list showcasing the specific engineering stack utilized during each tenure.

---

### 5.5 Academic Research Showcase (Publications Section)

The publications section (`src/app/pages/publications/`) provides an editorial research layout:

- **Type Ribbon**: Badges classifying papers as `IEEE Conference Paper` or `Journal Article`.
- **Inset Abstract Block**: Highlighted abstract quote with a colored left accent border (`borderLeftColor`).
- **Venue & Indexing Box**: Displays publication citations, volume numbers, and publishing houses clearly.
- **Research Keywords**: Quick-access tags for domains such as Machine Learning, Computer Vision, and Climate Modeling.
- **Dual Action Bar**: Links to the internal deep-dive page and the official DOI/IEEE publication link.

---

### 5.6 Academic Credentials & Leadership (Education Section)

The education section (`src/app/pages/education/`) utilizes a responsive two-column grid:

- **Left Column (Academic Background)**: Glassmorphism credential cards for B.Sc. Computer Science (AUST), HSC, and SSC with core coursework tags (Data Structures, OOP, Database Systems, Operating Systems, Networks, Software Engineering). **All GPA/CGPA displays are removed for clean professional presentation.**
- **Right Column (Leadership & Extracurriculars)**: Vertical leadership timeline showcasing society organizing, innovation club memberships, and workshop facilitation.

---

### 5.7 RunMate Club Interactive App Showcase

A custom product section (`src/app/pages/runmate/`) dedicated to the flagship marathon companion platform:

- **Live Device Showcase**: Realistic mobile UI slide carousel displaying real-time GPS tracking, leaderboards, certificates, and event flows.
- **Category Filter Tabs**: Interactive tabs for *Runners*, *Race Organizers*, and *Core Tech*.
- **Tech Stack & Store Badges**: Direct access links to Google Play, Apple App Store, and the Web Admin portal.

---

## 6. Micro-Interactions & Animation Guidelines

All animations follow strict timing and easing curves for a cohesive, natural feel:

```scss
// Standard Easing Curves
$ease-spring: cubic-bezier(0.16, 1, 0.3, 1);    // Fast out, slow settle (Reveal & Cards)
$ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); // Playful snap (Icons & Badges)
$ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);     // Standard material transition

// Standard Durations
$duration-fast:   150ms; // Button active states, badges
$duration-medium: 250ms; // Hover transitions, color shifts
$duration-slow:   400ms; // Card hover elevations, theme toggle
$duration-reveal: 700ms; // Scroll reveal blur bloom
```

### Optical Depth Bloom (Scroll Reveal)
Elements marked with `.reveal` enter the viewport with zero opacity, a soft `8px` Gaussian blur, and a subtle scale shift (`0.96` to `1.0`), smoothly focusing into view when triggered by the IntersectionObserver.

---

## 7. Performance & Accessibility Standards

- **Zero Layout Shift (CLS = 0)**: Fixed aspect ratios and explicit SVG bounding boxes prevent content jumping during load.
- **Color Contrast (WCAG AA Compliant)**: Text colors ensure minimum 4.5:1 contrast ratios in both light and dark modes.
- **Zero Heavy Image Placeholders**: Clean vector icons (`FontAwesome 6`), CSS radial gradients, and real application assets are utilized exclusively.
- **Dark Mode Default**: Root `<html>` element is initialized with `data-theme="dark"` to eliminate theme flash during hydration.
- **TypeScript & Linting**: Built with strict typing (`strict: true`), OnPush change detection where applicable, and verified via `npm run lint` with 0 warnings.

---

## 8. Summary of File Locations

| Feature / System | Key Files |
| :--- | :--- |
| **Global Theme & Tokens** | `src/styles.scss`, `src/app/services/theme.service.ts` |
| **Hero & Interactive Canvas Sphere** | `src/app/pages/hero/`, `src/app/shared-components/hero-sphere/` |
| **Navigation & Header** | `src/app/shared-components/navbar/` |
| **Project Cards** | `src/app/pages/projects/`, `src/app/pages/projects/project-details/` |
| **Experience Timeline** | `src/app/pages/experience/` |
| **Research Publications** | `src/app/pages/publications/`, `src/app/pages/publications/publication-details/` |
| **Education & Leadership** | `src/app/pages/education/` |
| **RunMate Product Showcase**| `src/app/pages/runmate/` |
| **Contact & Form** | `src/app/pages/contact/` |
| **Footer Component** | `src/app/shared-components/footer/` |
| **Data Service** | `src/app/services/portfolio.service.ts` |
