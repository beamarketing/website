// Value Proposition Strip — Scroll-Linked Word Reveal
// Words go from 30% → 100% opacity as the section scrolls into view.
// Matches the VSN "About" section: left-aligned, CSS color transition, no sticky.
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
        dimOpacity,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        textAlign,
        paddingY,
        paddingX,
        maxWidth,
        style,
    } = props

    const sectionRef = useRef(null)
    const [revealedCount, setRevealedCount] = useState(0)

    // Scroll tracking: reveal happens as the section scrolls into view
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.85", "start 0.2"],
    })

    // Split text into words
    const words = useMemo(
        () => heading.split(/\s+/).filter(Boolean),
        [heading]
    )

    // Update revealed word count on scroll — only fires when count changes
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const clamped = Math.max(0, Math.min(1, latest))
        setRevealedCount(Math.round(clamped * words.length))
    })

    // Pre-compute colors
    const litColor = textColor
    const dimColor = colorWithAlpha(textColor, dimOpacity)

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                backgroundColor,
                padding: `${paddingY}px ${paddingX}px`,
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
                {words.map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        style={{
                            color:
                                i < revealedCount ? litColor : dimColor,
                            transition: "color 0.3s ease-out",
                            display: "inline",
                        }}
                    >
                        {word}{" "}
                    </span>
                ))}
            </p>
        </section>
    )
}

// ─── Defaults (matching the original VSN "About" section) ───────────────────

ValuePropositionStrip.defaultProps = {
    heading:
        "From ingest to archive, VSN provides broadcasters, media companies, sports organizations, and educational institutions with innovative, scalable software solutions designed to streamline complex workflows, enhance collaboration, and drive growth in a rapidly evolving digital landscape. Experience the difference of a truly unified, seamless, and reliable media ecosystem.",
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    dimOpacity: 0.3,
    fontSize: 56,
    fontWeight: 400,
    lineHeight: 1.03,
    letterSpacing: -0.02,
    textAlign: "left",
    paddingY: 80,
    paddingX: 80,
    maxWidth: 1280,
}

// ─── Property controls ──────────────────────────────────────────────────────

addPropertyControls(ValuePropositionStrip, {
    heading: {
        type: ControlType.String,
        title: "Text",
        displayTextArea: true,
        description:
            "Words light up one-by-one as the section scrolls into view",
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
        description: "Opacity of words before they are revealed",
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
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        min: 0,
        max: 200,
        step: 8,
        defaultValue: 80,
        unit: "px",
    },
    paddingX: {
        type: ControlType.Number,
        title: "Horizontal Padding",
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
})
