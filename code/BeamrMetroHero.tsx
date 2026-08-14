// Beamr — IBC 2026 Metro Hero
// Full-bleed hero with an animated "metro lines" background.
// Framer Code Component with full property controls.
//
// The lines are built from waypoints via a single rounded-corner helper so
// every corner is geometrically correct at any size. Each line enters above
// the top edge and exits below the bottom edge and never reverses direction
// vertically, which guarantees full-height coverage regardless of how
// `preserveAspectRatio="slice"` crops the SVG on any viewport.

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

// viewBox the routes are authored against. Routes overshoot on every edge.
const VB_W = 1440
const VB_H = 900

// Build an SVG path from a polyline of [x, y] points with rounded corners.
// Works for any corner angle (orthogonal turns and diagonals alike): each
// interior vertex is replaced by two tangent points joined with a quadratic
// bezier whose control point is the original vertex. The radius is clamped so
// it never exceeds half of either adjacent segment.
function roundedPath(points: number[][], radius: number): string {
    if (points.length < 2) return ""
    if (points.length === 2) {
        return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`
    }

    const d: string[] = [`M ${points[0][0]} ${points[0][1]}`]

    for (let i = 1; i < points.length - 1; i++) {
        const [px, py] = points[i - 1]
        const [cx, cy] = points[i]
        const [nx, ny] = points[i + 1]

        const v1x = px - cx
        const v1y = py - cy
        const v2x = nx - cx
        const v2y = ny - cy

        const len1 = Math.hypot(v1x, v1y) || 1
        const len2 = Math.hypot(v2x, v2y) || 1
        const r = Math.min(radius, len1 / 2, len2 / 2)

        const p1x = cx + (v1x / len1) * r
        const p1y = cy + (v1y / len1) * r
        const p2x = cx + (v2x / len2) * r
        const p2y = cy + (v2y / len2) * r

        d.push(`L ${p1x} ${p1y}`)
        d.push(`Q ${cx} ${cy} ${p2x} ${p2y}`)
    }

    const last = points[points.length - 1]
    d.push(`L ${last[0]} ${last[1]}`)
    return d.join(" ")
}

export default function BeamrMetroHero(p: any) {
    const {
        eyebrow, line1, line2, accent, line3, subhead, ctaLabel, ctaHref,
        blue, navy, pink, white,
        fontFamily,
        eyebrowColor, eyebrowSize, eyebrowWeight,
        headlineColor, headlineSize, headlineWeight,
        accentColor, accentSize, accentWeight,
        subheadColor, subheadSize, subheadWeight,
        ctaColor, ctaSize, ctaWeight, ctaBg,
        lineWidth, lineRadius, lineOpacity,
    } = p

    const css = `.r{width:100%;min-height:92vh;display:flex;align-items:center;position:relative;padding:72px 0 56px;background:${blue};overflow:hidden;font-family:${fontFamily};box-sizing:border-box}
    .w{width:min(1180px,calc(100% - 48px));margin:auto;position:relative;z-index:3}
    .k{font-size:${eyebrowSize}px;font-weight:${eyebrowWeight};color:${eyebrowColor};letter-spacing:.18em;text-transform:uppercase;margin-bottom:24px}
    .h{font-size:${headlineSize}px;font-weight:${headlineWeight};color:${headlineColor};line-height:.86;letter-spacing:-.055em;text-transform:uppercase;max-width:940px;margin:0}
    .a{font-size:${accentSize}px;font-weight:${accentWeight};color:${accentColor};font-style:italic}
    .s{font-size:${subheadSize}px;font-weight:${subheadWeight};color:${subheadColor};max-width:700px;line-height:1.2;margin-top:34px}
    .c{display:inline-flex;gap:12px;align-items:center;background:${ctaBg};color:${ctaColor};font-size:${ctaSize}px;font-weight:${ctaWeight};text-decoration:none;padding:16px 24px;border-radius:999px;margin-top:30px}
    .l{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:${lineOpacity};overflow:hidden}
    .l svg{position:absolute;inset:0;width:100%;height:100%;display:block}
    @media(max-width:760px){.w{width:min(100% - 28px,1180px)}.r{min-height:88vh;padding-top:58px}.h{font-size:min(${headlineSize}px,18vw)}.a{font-size:inherit}.s{font-size:min(${subheadSize}px,5.5vw)}}`

    // Vertical overshoot beyond the viewBox so line ends are always off-canvas.
    const TOP = -200
    const BOTTOM = VB_H + 200

    // Each route runs from above the top edge to below the bottom edge and is
    // monotonic in y (never turns back upward), so it always spans the full
    // height whatever `slice` crops. Horizontal jogs give the "metro" step.
    const navyRoute = [
        [1120, TOP],
        [1120, 300],
        [820, 300],
        [820, BOTTOM],
    ]

    const whiteRoute = [
        [540, TOP],
        [540, 640],
        [960, 640],
        [960, BOTTOM],
    ]

    // Pink runs straight down, then breaks into a clean diagonal to the floor.
    const pinkRoute = [
        [1340, TOP],
        [1340, 420],
        [660, BOTTOM],
    ]

    const navyPath = roundedPath(navyRoute, lineRadius)
    const whitePath = roundedPath(whiteRoute, lineRadius)
    const pinkPath = roundedPath(pinkRoute, lineRadius)

    return (
        <section className="r">
            <style>{css}</style>

            <motion.div
                className="l"
                initial={{ opacity: 0 }}
                animate={{ opacity: lineOpacity }}
                transition={{ duration: 0.7 }}
            >
                <svg
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                >
                    <motion.path
                        d={navyPath}
                        fill="none"
                        stroke={navy}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />

                    <motion.path
                        d={pinkPath}
                        fill="none"
                        stroke={pink}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.35, delay: 0.08, ease: "easeInOut" }}
                    />

                    <motion.path
                        d={whitePath}
                        fill="none"
                        stroke={white}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.12, delay: 0.16, ease: "easeInOut" }}
                    />
                </svg>
            </motion.div>

            <div className="w">
                <div className="k">{eyebrow}</div>
                <h1 className="h">
                    {line1}
                    <br />
                    {line2} <span className="a">{accent}</span>
                    <br />
                    {line3}
                </h1>
                <div className="s">{subhead}</div>
                <a className="c" href={ctaHref}>
                    {ctaLabel} ↗
                </a>
            </div>
        </section>
    )
}

BeamrMetroHero.defaultProps = {
    eyebrow: "YOU FOUND THE NEXT STOP ↓",
    line1: "LOOKS GOOD",
    line2: "ON YOUR",
    accent: "VIDEO,",
    line3: "TOO.",
    subhead: "Turn HD into 4K with NVIDIA Video Super Resolution and Beamr.",
    ctaLabel: "SEE IT AT IBC",
    ctaHref: "#",
    blue: "#3475F5",
    navy: "#2F58A5",
    pink: "#EA8DBB",
    white: "#FFFFFF",
    fontFamily: "Poppins, Arial, sans-serif",
    eyebrowColor: "#FFFFFF",
    eyebrowSize: 13,
    eyebrowWeight: 700,
    headlineColor: "#FFFFFF",
    headlineSize: 112,
    headlineWeight: 900,
    accentColor: "#FFBE00",
    accentSize: 112,
    accentWeight: 900,
    subheadColor: "#FFFFFF",
    subheadSize: 28,
    subheadWeight: 400,
    ctaColor: "#111111",
    ctaSize: 15,
    ctaWeight: 800,
    ctaBg: "#FFFFFF",
    lineWidth: 62,
    lineRadius: 76,
    lineOpacity: 1,
}

addPropertyControls(BeamrMetroHero, {
    eyebrow: { type: ControlType.String, title: "Eyebrow" },
    line1: { type: ControlType.String, title: "Headline 1" },
    line2: { type: ControlType.String, title: "Headline 2" },
    accent: { type: ControlType.String, title: "Accent Text" },
    line3: { type: ControlType.String, title: "Headline 3" },
    subhead: { type: ControlType.String, title: "Subhead", displayTextArea: true },
    ctaLabel: { type: ControlType.String, title: "CTA Text" },
    ctaHref: { type: ControlType.Link, title: "CTA Link" },

    fontFamily: { type: ControlType.String, title: "Font Family" },

    eyebrowColor: { type: ControlType.Color, title: "Eyebrow Color" },
    eyebrowSize: { type: ControlType.Number, title: "Eyebrow Size", min: 8, max: 80 },
    eyebrowWeight: { type: ControlType.Number, title: "Eyebrow Weight", min: 100, max: 900, step: 100 },

    headlineColor: { type: ControlType.Color, title: "Headline Color" },
    headlineSize: { type: ControlType.Number, title: "Headline Size", min: 24, max: 220 },
    headlineWeight: { type: ControlType.Number, title: "Headline Weight", min: 100, max: 900, step: 100 },

    accentColor: { type: ControlType.Color, title: "Accent Color" },
    accentSize: { type: ControlType.Number, title: "Accent Size", min: 24, max: 220 },
    accentWeight: { type: ControlType.Number, title: "Accent Weight", min: 100, max: 900, step: 100 },

    subheadColor: { type: ControlType.Color, title: "Subhead Color" },
    subheadSize: { type: ControlType.Number, title: "Subhead Size", min: 10, max: 80 },
    subheadWeight: { type: ControlType.Number, title: "Subhead Weight", min: 100, max: 900, step: 100 },

    ctaColor: { type: ControlType.Color, title: "CTA Text Color" },
    ctaSize: { type: ControlType.Number, title: "CTA Text Size", min: 8, max: 50 },
    ctaWeight: { type: ControlType.Number, title: "CTA Weight", min: 100, max: 900, step: 100 },
    ctaBg: { type: ControlType.Color, title: "CTA Background" },

    blue: { type: ControlType.Color, title: "Background" },
    navy: { type: ControlType.Color, title: "Navy Line" },
    pink: { type: ControlType.Color, title: "Pink Line" },
    white: { type: ControlType.Color, title: "White Line" },

    lineWidth: { type: ControlType.Number, title: "All Line Width", min: 20, max: 140, step: 2 },
    lineRadius: { type: ControlType.Number, title: "Corner Radius", min: 20, max: 130, step: 2 },
    lineOpacity: { type: ControlType.Number, title: "Line Opacity", min: 0, max: 1, step: 0.05 },
})
