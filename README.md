# Beamr Homepage - Framer Code Components

A complete set of Framer code components for the Beamr homepage design. Every element is fully customizable through Framer's left panel property controls.

## Components

| Component | File | Description |
|---|---|---|
| **Navigation** | `code/Navigation.tsx` | Top nav bar with logo, links, and CTA button |
| **Hero** | `code/Hero.tsx` | Hero section with heading, subheading, badge, and video preview |
| **LogoBar** | `code/LogoBar.tsx` | Trusted-by logo strip |
| **Solutions** | `code/Solutions.tsx` | Industry solutions cards grid |
| **CompanyUsage** | `code/CompanyUsage.tsx` | Metrics/use-case cards (CDN costs, storage, quality) |
| **CABRScience** | `code/CABRScience.tsx` | Split layout: text + media with stats |
| **TrustSection** | `code/TrustSection.tsx` | Awards and testimonial quotes |
| **PartnerSection** | `code/PartnerSection.tsx` | Features list + media split layout |
| **NewsSection** | `code/NewsSection.tsx` | Blog post cards grid |
| **FAQSection** | `code/FAQSection.tsx` | Accordion FAQ with open/close animation |
| **CTASection** | `code/CTASection.tsx` | Call-to-action card with glow effect |
| **Footer** | `code/Footer.tsx` | Full footer with columns, newsletter, socials |
| **Homepage** | `code/Homepage.tsx` | Full page composition (all sections combined) |
| **ThankYou** | `code/ThankYou.tsx` | Post-submission confirmation hero (checkmark, message, CTAs) |
| **ThankYouResources** | `code/ThankYouResources.tsx` | "More From Beamr" 3-card grid (videos / case studies) |
| **ThankYouPage** | `code/ThankYouPage.tsx` | Full thank-you page: Navigation + ThankYou + Resources + Footer |

## How to Use in Framer

### Option 1: Use Individual Sections (Recommended)

1. Open your Framer project
2. Go to **Assets** panel > **Code** tab
3. Click **+** to create a new code file
4. Copy the contents of each `.tsx` file into a new Framer code file
5. Name each file to match (e.g., `Navigation.tsx`, `Hero.tsx`, etc.)
6. The components will appear in the **Insert** panel under **Code**
7. Drag each section onto your canvas page and stack them vertically
8. Click any section to see its property controls in the **left panel**

### Option 2: Use the Full Homepage Component

1. Import **all** component files into your Framer project (same steps as above)
2. Also import `Homepage.tsx`
3. Drag the `Homepage` component onto your page
4. Use the left panel toggles to show/hide any section
5. Set global accent color, background, and font from the top-level controls

### Option 3: Copy into Framer via Code Editor

1. In Framer, open **Code** from the left sidebar
2. Create new files and paste each component's code
3. Make sure file names match the import paths in `Homepage.tsx`

## What You Can Customize (Left Panel)

Every component exposes property controls for:

- **Text**: All headings, subheadings, descriptions, labels, button text
- **Images**: Card images, logo images, avatars, background images
- **Videos**: Background videos, section media videos
- **Colors**: Background, text, accent, card backgrounds, borders
- **Font**: Font family for all text elements
- **Layout**: Column counts, border radius, padding, layout direction
- **Visibility**: Toggle sections, badges, buttons, awards on/off
- **Links**: All URLs for buttons, navigation, cards
- **Arrays**: Add/remove/reorder cards, FAQ items, nav links, blog posts, etc.

## Design Tokens (Defaults)

| Token | Value | Usage |
|---|---|---|
| Background | `#07071c` | Main page background |
| Card BG | `#0f1029` | Card and section backgrounds |
| Accent | `#00d46a` | Green CTA buttons, links, highlights |
| Text | `#ffffff` | Primary text color |
| Secondary Text | `#8b8ba3` | Descriptions, metadata |
| Border | `rgba(255,255,255,0.06)` | Subtle card borders |
| Font | `'Inter', sans-serif` | All typography |

## File Structure

```
code/
  utils/
    theme.ts          # Shared color/font/spacing constants
  Navigation.tsx      # Sticky nav bar
  Hero.tsx            # Hero with video preview
  LogoBar.tsx         # Partner logos strip
  Solutions.tsx       # 3-card industry solutions
  CompanyUsage.tsx    # 4-card metrics grid
  CABRScience.tsx     # Technology split section
  TrustSection.tsx    # Awards + testimonials
  PartnerSection.tsx  # Features + media split
  NewsSection.tsx     # Blog cards grid
  FAQSection.tsx      # Accordion FAQ
  CTASection.tsx      # CTA card with glow
  Footer.tsx          # Full footer
  Homepage.tsx        # Complete page assembly
  ThankYou.tsx        # Post-submission confirmation hero
  ThankYouResources.tsx # "More From Beamr" recommended content
  ThankYouPage.tsx    # Full thank-you page composition
```

## Thank-You Page

Inspired by `ces.tech/thank-you/`. Use `ThankYouPage` for the full page or
drop `ThankYou` and `ThankYouResources` individually between `Navigation`
and `Footer`. All copy, links, and the resource cards are editable from the
left panel — including a per-card `isVideo` toggle that swaps the play
overlay for a plain thumbnail.
