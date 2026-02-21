// Value Proposition Strip — Scroll-Linked Word Reveal
// Words go from 30% → 100% opacity via CSS color transition as you scroll.
// Section is taller than one viewport; text stays pinned with position: sticky.
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { useRef, useMemo, useState } from "react"

// ─── Hex → rgba helper ──────────────────────────────────────────────────────

function colorWithAlpha(color, alpha) {
    if (!color) return `rgba(255,255,255,${alpha})`
    if (color.startsWith("#")) {
        const hex = color.replace("#", "")
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
    }
    if (color.startsWith("rgba")) {
        return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)
    }
    return color
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ValuePropositionStrip(props) {
    const {
        heading,
        backgroundColor,
        textColor,
        highlightColor,
        highlightStart,
        highlightEnd,
        dimOpacity,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        textAlign,
        paddingX,
        maxWidth,
        scrollScreens,
        style,
    } = props

    const sectionRef = useRef(null)
    const [revealedCount, setRevealedCount] = useState(0)

    // Scroll progress spans the full section height
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    })

    // Split text into words
    const words = useMemo(
        () => heading.split(/\s+/).filter(Boolean),
        [heading]
    )

    // Update revealed word count on scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const clamped = Math.max(0, Math.min(1, latest))
        setRevealedCount(Math.round(clamped * words.length))
    })

    // Pre-compute colors
    const litColor = textColor
    const dimColor = colorWithAlpha(textColor, dimOpacity)
    const hlLitColor = highlightColor || textColor
    const hlDimColor = colorWithAlpha(highlightColor || textColor, dimOpacity)
    // Convert 1-based panel values to 0-based indices
    const hlStart = (highlightStart || 0) - 1
    const hlEnd = (highlightEnd || 0) - 1

    return (
        <section
            ref={sectionRef}
            style={{
                width: style?.width || "100%",
                height: `${scrollScreens * 100}vh`,
                position: "relative",
                backgroundColor,
            }}
        >
            {/* Sticky container — text stays visible while scrolling through */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    alignItems: textAlign === "center" ? "center" : "flex-start",
                    justifyContent: textAlign === "center" ? "center" : "flex-start",
                    padding: `0 ${paddingX}px`,
                    paddingTop: textAlign === "center" ? 0 : "15vh",
                }}
            >
                <p
                    style={{
                        fontFamily:
                            "'Inter Display', Inter, system-ui, sans-serif",
                        fontWeight,
                        fontSize,
                        lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                        textAlign,
                        textWrap: "balance",
                        margin: 0,
                        padding: 0,
                        whiteSpace: "pre-wrap",
                        overflow: "visible",
                        display: "block",
                        maxWidth,
                        userSelect: "text",
                    }}
                >
                    {words.map((word, i) => {
                        const inHighlight =
                            highlightColor &&
                            hlStart >= 0 &&
                            hlEnd >= hlStart &&
                            i >= hlStart &&
                            i <= hlEnd
                        const lit = inHighlight ? hlLitColor : litColor
                        const dim = inHighlight ? hlDimColor : dimColor
                        return (
                            <span
                                key={`${word}-${i}`}
                                style={{
                                    color:
                                        i < revealedCount ? lit : dim,
                                    transition: "color 0.3s ease-out",
                                    display: "inline",
                                }}
                            >
                                {word}{" "}
                            </span>
                        )
                    })}
                </p>
            </div>
        </section>
    )
}

// ─── Defaults ───────────────────────────────────────────────────────────────

ValuePropositionStrip.defaultProps = {
    heading:
        "From ingest to archive, VSN provides broadcasters, media companies, sports organizations, and educational institutions with innovative, scalable software solutions designed to streamline complex workflows, enhance collaboration, and drive growth in a rapidly evolving digital landscape. Experience the difference of a truly unified, seamless, and reliable media ecosystem.",
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    highlightColor: "",
    highlightStart: 0,
    highlightEnd: 0,
    dimOpacity: 0.3,
    fontSize: 56,
    fontWeight: 400,
    lineHeight: 1.03,
    letterSpacing: -0.02,
    textAlign: "left",
    paddingX: 80,
    maxWidth: 1280,
    scrollScreens: 2.5,
}

// ─── Property controls ──────────────────────────────────────────────────────

addPropertyControls(ValuePropositionStrip, {
    heading: {
        type: ControlType.String,
        title: "Text",
        displayTextArea: true,
        description:
            "Words light up one-by-one as you scroll through the section",
    },
    textAlign: {
        type: ControlType.Enum,
        title: "Alignment",
        options: ["left", "center"],
        optionTitles: ["Left", "Center"],
        defaultValue: "left",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Font Size",
        min: 20,
        max: 80,
        step: 1,
        defaultValue: 56,
        unit: "px",
    },
    fontWeight: {
        type: ControlType.Enum,
        title: "Font Weight",
        options: [300, 400, 500, 600, 700],
        optionTitles: ["Light", "Regular", "Medium", "Semi Bold", "Bold"],
        defaultValue: 400,
    },
    lineHeight: {
        type: ControlType.Number,
        title: "Line Height",
        min: 0.8,
        max: 2,
        step: 0.01,
        defaultValue: 1.03,
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Letter Spacing",
        min: -0.1,
        max: 0.1,
        step: 0.005,
        defaultValue: -0.02,
        unit: "em",
    },
    dimOpacity: {
        type: ControlType.Number,
        title: "Dim Opacity",
        min: 0.05,
        max: 0.6,
        step: 0.05,
        defaultValue: 0.3,
        description: "Opacity of unrevealed words (0.3 = original)",
    },
    scrollScreens: {
        type: ControlType.Number,
        title: "Scroll Length",
        min: 1.5,
        max: 5,
        step: 0.5,
        defaultValue: 2.5,
        description:
            "Section height in viewports. Higher = slower reveal. 2.5 = natural pace, 4 = dramatic.",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        min: 400,
        max: 1600,
        step: 20,
        defaultValue: 1280,
        unit: "px",
    },
    paddingX: {
        type: ControlType.Number,
        title: "Side Padding",
        min: 0,
        max: 200,
        step: 8,
        defaultValue: 80,
        unit: "px",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0c0e15",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    highlightColor: {
        type: ControlType.Color,
        title: "Highlight Color",
        defaultValue: "",
        description:
            "Pick a color, then set Start / End word numbers to highlight a range.",
    },
    highlightStart: {
        type: ControlType.Number,
        title: "Highlight Start",
        min: 0,
        max: 200,
        step: 1,
        defaultValue: 0,
        description: "First word to highlight (1-based). 0 = off.",
    },
    highlightEnd: {
        type: ControlType.Number,
        title: "Highlight End",
        min: 0,
        max: 200,
        step: 1,
        defaultValue: 0,
        description: "Last word to highlight (1-based, inclusive).",
    },
})
