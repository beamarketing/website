# Framer Rebuild Guide - Beamr Homepage

This guide maps every section in `index.html` to exact Framer visual editor steps.
Open `index.html` in a browser as your visual reference while building in Framer.

---

## Design Tokens (Set in Framer Project Settings)

| Token | Value | Where |
|---|---|---|
| Font | Inter | Project Settings > Fonts > Google Fonts > Inter |
| Background | `#FFFFFF` | Page background |
| Dark BG | `#0F1117` | CABR section, Footer |
| Primary | `#4F46E5` | Buttons, links, accents |
| Text | `#111827` | Headings, body |
| Text Secondary | `#6B7280` | Descriptions, metadata |
| Text Light | `#9CA3AF` | Captions, labels |
| Border | `#E5E7EB` | Card borders |
| Card BG | `#F9FAFB` | Card backgrounds, alternating sections |
| Green Accent | `#10B981` | Badges, metrics |
| Purple Accent | `#6C5CE7` | Logo icon |

---

## How to Build Each Section in Framer

### 1. Navigation
- **Frame**: Width `Fill`, Height `Auto`, Padding `16px 32px`
- **Layout**: Flex Row, Space Between, Align Center
- **Background**: White, Border Bottom `1px #F3F4F6`
- **Position**: Sticky, Top 0, Z-Index 100
- **Logo**: Frame (Row) > Square `28x28 #6C5CE7 radius 6` + Text "beamr" (20px, Bold)
- **Links**: Frame (Row, gap 32) > Text elements (15px, Medium, `#111827`)
- **CTA**: Text "Let's Talk" > Fill `#111111`, Text White, Padding `10px 24px`, Radius 8

### 2. Hero
- **Frame**: Max Width 1200px, Padding `80px 32px 60px`
- **Layout**: Grid 2 columns, Gap 64
- **Left Column** (Stack, Vertical, Gap 24):
  - Label: Row > Circle `6x6 #4F46E5` + Text "MEDIA & ENTERTAINMENT" (13px, SemiBold, Uppercase)
  - Heading: Text (52px, ExtraBold, `#111827`, Line Height 1.08, Letter Spacing -0.03em)
  - Subtitle: Text (17px, Regular, `#6B7280`, Max Width 480)
  - Buttons: Row Gap 12 > Primary button (Fill `#111827` text White) + Secondary (Border 1.5px `#E5E7EB`)
  - Logos: Row Gap 28, Opacity 45% > Text items
- **Right Column**: Card component with stats (see HTML structure)
- **Animation**: Use Framer "Appear" effect > Fade + Slide Up, Stagger children

### 3. How Companies Use Beamr
- **Frame**: Full width, BG `#F9FAFB`, Padding `100px 32px`
- **Grid**: 5 columns, Gap 16
- **Cards**: Border `1px #E5E7EB`, Radius 16, Overflow Hidden
  - Image area: Height 130, BG gradient placeholder
  - Body: Padding 16
  - Meta: 11px uppercase, Light gray
  - Title: 14px SemiBold
- **Hover**: Scale card translateY(-6px), Shadow, Border color Primary
- **Animation**: Appear > Fade + Slide Up, Stagger 0.1s per card

### 4. CABR Science (Dark Section)
- **Frame**: Full width, BG `#0F1117`, Padding `100px 32px`
- **Grid**: 2 columns (1fr 1.2fr), Gap 64, Align Center
- **Left**: Stack > Label (Primary color) + Title (40px, White) + Desc (16px, White 60%) + Link
- **Right**: Video placeholder > Radius 16, BG gradient, Play button (64x64 circle, Primary)
- **Stats Row**: 4-column grid below, Border Top `1px rgba(255,255,255,0.08)`
  - Value: 28px Bold White
  - Label: 14px SemiBold White 70%
  - Desc: 13px White 40%
- **Animation**: Left slides from left, Right slides from right

### 5. Trust Section
- **3 Cards**: Grid 3 columns, Gap 24
  - Card: BG `#F9FAFB`, Border, Radius 16, Padding 32, Center text
  - Icon: 56x56 rounded square, BG `rgba(79,70,229,0.06)`
  - Value: 24px Bold
  - Label: 14px Secondary
- **Testimonial**: Max Width 800, Center, BG Card, Radius 24, Padding 48
  - Quote mark: 48px Primary, Opacity 40%
  - Quote text: 18px Italic
  - Author: Row > Avatar (48px circle, gradient) + Name/Role stack
- **Animation**: Cards fade up staggered, Testimonial scale in

### 6. Partner Section
- **Grid**: 2 columns (1fr 1.3fr), Gap 64
- **Left**: Label + Title + Description
- **Right**: Image/video frame, Aspect 4:3, Radius 24
- **Features Row**: 3-column grid below, Gap 32
  - Each: Row > Icon (40x40 rounded) + Stack (Title 15px Bold + Desc 13px)
- **Animation**: Left from left, Right from right, Features fade up

### 7. News Grid
- **Header**: Row, Space Between > Title stack + "Read more" link
- **Grid**: 3 columns (1.5fr 1fr 1fr), 2 rows, Gap 20
  - Featured card: Row Span 2, Image height 280
  - Regular cards: Image height 180
  - Card: Border, Radius 16, Overflow Hidden
  - Hover: translateY(-4px), Shadow, Border Primary
- **Animation**: Staggered fade up

### 8. FAQ
- **List**: Max Width 780, Center, Stack Vertical Gap 10
- **Items**: Border `1px #E5E7EB`, Radius 12
  - Question: Full width button, Row Space Between, Padding 18px 24px
  - Icon: 28x28 circle, BG Card, "+" text, Rotate 45deg on active
  - Answer: Max Height 0 -> 300px on toggle
- **Interaction**: In Framer, use "Component" with Variants (Closed/Open)
  - Closed: Answer hidden (Height 0, Overflow Hidden)
  - Open: Answer visible, Icon rotated, Border Primary

### 9. CTA
- **Card**: Max Width 860, Center, BG Card, Radius 24, Padding 72px 48px
- **Glow**: Absolute div, Radial gradient Primary 6%, Center
- **Title**: 40px Bold Center
- **Subtitle**: 17px Secondary Center, Max Width 480
- **Buttons**: Row Center Gap 12

### 10. Footer
- **Frame**: Full width, BG `#0F1117`, Padding `72px 32px 32px`
- **Newsletter Row**: Row Space Between, Border Bottom
- **Content Grid**: 5 columns (1.5fr 1fr 1fr 1fr 1fr)
  - Brand: Logo + Tagline + Social icons
  - Columns: Title (13px SemiBold White) + Links (14px, White 45%)
- **Bottom**: Row Space Between, Copyright + Legal links

---

## Framer Animations Mapping

| HTML Class | Framer Effect |
|---|---|
| `.reveal` | Appear > Fade + Move Y (40px -> 0), Duration 0.8s, Ease Out |
| `.reveal-left` | Appear > Fade + Move X (-40px -> 0) |
| `.reveal-right` | Appear > Fade + Move X (40px -> 0) |
| `.reveal-scale` | Appear > Fade + Scale (0.95 -> 1) |
| `.reveal-delay-N` | Set Delay: 0.1s * N |
| Card hover | Hover > Move Y -6px + Shadow increase |
| `.cabr-link:hover` | Hover > Gap increases (arrow moves right) |
| `.float` animation | Loop > Move Y (0 -> -12px -> 0), Duration 6s |
| FAQ toggle | Component Variant change with Smart Animate |

---

## Quick Framer Workflow

1. Create a new Framer project
2. Set page Background White, add Inter font
3. Build each section as a **Component** (so it's reusable)
4. Stack all sections vertically on the page using a **Stack** frame
5. Add **Appear** animations to each section's children
6. For FAQ, create a Component with two Variants (Closed/Open)
7. Replace all placeholder areas with your actual images/videos
8. Adjust all text content directly on the canvas
9. Publish!
