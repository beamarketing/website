# Beamr 5 HEVC — Framer Code Components

A rebuild of [beamr.com/beamr5-hevc](https://beamr.com/beamr5-hevc) in the **new
beamr.com design language**, following the [beamr.com/blueprint_av](https://beamr.com/blueprint_av)
page template. Every section is a standalone Framer code component with full
property controls.

## Components

| Component | File | Section |
|---|---|---|
| **Beamr5Nav** | `Beamr5Nav.tsx` | Sticky light top navigation + "Let's Talk" CTA |
| **Beamr5Hero** | `Beamr5Hero.tsx` | Dark cinematic hero, eyebrow pill, spec strip |
| **Beamr5Trust** | `Beamr5Trust.tsx` | "Trusted by top video streaming brands" logo bar |
| **Beamr5Features** | `Beamr5Features.tsx` | Capability cards (speed, HDR, ABR, low latency…) |
| **Beamr5Technical** | `Beamr5Technical.tsx` | Dark "HEVC, optimized for speed and quality" grid |
| **Beamr5Testimonial** | `Beamr5Testimonial.tsx` | TAG Video Systems customer quote |
| **Beamr5CTA** | `Beamr5CTA.tsx` | Dark "Ready to try…" call-to-action card |
| **Beamr5Footer** | `Beamr5Footer.tsx` | Dark footer, nav columns + newsletter |
| **Beamr5Page** | `Beamr5Page.tsx` | Full page composition (all sections) |

## Design Tokens (new beamr.com look)

| Token | Value | Usage |
|---|---|---|
| Heading font | `'Poppins', sans-serif` | All headings, logo, numbers |
| Body font | `'Inter', sans-serif` | Body copy, labels, buttons |
| Accent | `#2f73ff` | Buttons, links, highlights, glows |
| Light background | `#ffffff` | Nav, trust, features, testimonial |
| Card (light) | `#f7f8fb` | Feature/testimonial cards |
| Dark background | `#050516` | Hero, technical, CTA card, footer |
| Card (dark) | `#0e0e24` | Technical cards |
| Text | `#0d0d0d` / `#ffffff` | On light / on dark |
| Secondary text | `#5b5b66` / `#9a9ab0` | On light / on dark |
| Border (light) | `#e8eaf0` | Card + section borders |

## How to Use in Framer

1. Open your Framer project → **Assets** panel → **Code** tab → **+**.
2. Create one code file per `.tsx` above and paste the contents (keep file names
   matching, since `Beamr5Page.tsx` imports the others by name).
3. Either drag **Beamr5Page** onto a page for the full composition, or drop
   individual sections and stack them vertically.
4. Select any section to edit its text, colors, fonts, links and arrays from the
   **left property panel**. `Beamr5Page` exposes global `Accent Color`,
   `Heading Font` and `Body Font` plus per-section show/hide toggles.
5. Make sure **Poppins** and **Inter** are added under Project Settings → Fonts.

All sections are responsive (grids collapse on tablet/mobile).
