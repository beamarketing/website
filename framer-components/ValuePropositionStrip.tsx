// Value Proposition Strip — Scroll-Linked Word Reveal
// Each word lights up as the user scrolls. Text stays pinned in the viewport center.
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useMemo } from "react"

// ─── Individual word with scroll-driven opacity + lift ───────────────────────

function ScrollWord({
    word,
    scrollProgress,
    inputRange,
    dimOpacity,
    textColor,
    accentColor,
    isHighlight,
}) {
    const opacity = useTransform(scrollProgress, inputRange, [dimOpacity, 1])
    const y = useTransform(scrollProgress, inputRange, [8, 0])

    return (
        <motion.span
            style={{
                opacity,
                y,
                display: "inline-block",
                marginRight: "0.32em",
                color: isHighlight ? accentColor : textColor,
                fontStyle: isHighlight ? "italic" : "normal",
                fontFamily: isHighlight
                    ? "'Instrument Serif', Georgia, serif"
                    : "inherit",
                willChange: "transform, opacity",
            }}
        >
            {word}
        </motion.span>
    )
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ValuePropositionStrip(props) {
    const {
        heading,
        highlightText,
        description,
        showDescription,
        showScrollHint,
        scrollHintText,
        backgroundColor,
        textColor,
        accentColor,
        dimOpacity,
        scrollScreens,
        maxWidth,
        style,
    } = props

    const sectionRef = useRef(null)

    // Track scroll progress through this section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    })

    // ── Split heading into words ──
    const words = useMemo(
        () => heading.split(/\s+/).filter(Boolean),
        [heading]
    )

    // ── Find which word indices belong to the highlight phrase ──
    const highlightIndices = useMemo(() => {
        if (!highlightText) return new Set()
        const hlWords = highlightText.split(/\s+/).filter(Boolean)
        const indices = new Set()
        const clean = (s) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
        for (let i = 0; i <= words.length - hlWords.length; i++) {
            const match = hlWords.every(
                (hw, j) => clean(words[i + j]) === clean(hw)
            )
            if (match) {
                for (let j = 0; j < hlWords.length; j++) indices.add(i + j)
                break
            }
        }
        return indices
    }, [words, highlightText])

    // ── Scroll ranges ──
    // Words fill 0 → 0.75 of progress, description fills 0.78 → 0.95
    const headingEnd = showDescription ? 0.72 : 0.92
    const getWordRange = (index) => {
        const size = headingEnd / words.length
        return [index * size, (index + 1) * size]
    }

    // Description fades in after all words are revealed
    const descOpacity = useTransform(
        scrollYProgress,
        [0.76, 0.92],
        [0, 0.65]
    )
    const descY = useTransform(scrollYProgress, [0.76, 0.92], [16, 0])

    // Scroll hint fades out as soon as scrolling begins
    const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [0.45, 0])

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
            {/* Sticky container — stays centred in viewport while scrolling */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 40px",
                    gap: 28,
                    overflow: "hidden",
                }}
            >
                {/* Heading — each word individually animated */}
                <h2
                    style={{
                        fontSize: "clamp(28px, 4.2vw, 56px)",
                        fontWeight: 600,
                        lineHeight: 1.25,
                        fontFamily:
                            "'Inter Display', Inter, system-ui, sans-serif",
                        margin: 0,
                        maxWidth,
                        letterSpacing: "-0.03em",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        color: textColor,
                    }}
                >
                    {words.map((word, i) => (
                        <ScrollWord
                            key={`${word}-${i}`}
                            word={word}
                            scrollProgress={scrollYProgress}
                            inputRange={getWordRange(i)}
                            dimOpacity={dimOpacity}
                            textColor={textColor}
                            accentColor={accentColor}
                            isHighlight={highlightIndices.has(i)}
                        />
                    ))}
                </h2>

                {/* Description — fades in after the heading is fully revealed */}
                {showDescription && (
                    <motion.p
                        style={{
                            opacity: descOpacity,
                            y: descY,
                            color: textColor,
                            fontSize: "clamp(15px, 1.4vw, 19px)",
                            lineHeight: 1.65,
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontWeight: 400,
                            margin: 0,
                            maxWidth: maxWidth * 0.78,
                        }}
                    >
                        {description}
                    </motion.p>
                )}

                {/* Scroll hint — fades away on first scroll */}
                {showScrollHint && (
                    <motion.div
                        style={{
                            opacity: hintOpacity,
                            position: "absolute",
                            bottom: 48,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            color: textColor,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontWeight: 500,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                            }}
                        >
                            {scrollHintText}
                        </span>

                        {/* Animated chevron */}
                        <motion.svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            style={{ display: "block" }}
                            animate={{ y: [0, 5, 0] }}
                            transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <path
                                d="M4 7l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.svg>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

// ─── Defaults ────────────────────────────────────────────────────────────────

ValuePropositionStrip.defaultProps = {
    heading:
        "An open, flexible, and scalable platform that empowers your team to do more",
    highlightText: "flexible",
    description:
        "Collaborate effortlessly, automate repetitive tasks, and gain complete control over the entire media lifecycle — from ingest to archive, playout, and distribution.",
    showDescription: true,
    showScrollHint: true,
    scrollHintText: "Scroll",
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    accentColor: "#c5e33d",
    dimOpacity: 0.12,
    scrollScreens: 2.5,
    maxWidth: 900,
}

// ─── Property controls ──────────────────────────────────────────────────────

addPropertyControls(ValuePropositionStrip, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        displayTextArea: true,
        description: "Each word reveals one-by-one as the user scrolls",
    },
    highlightText: {
        type: ControlType.String,
        title: "Highlight Word",
        description:
            "This word (or phrase) renders in the accent color with italic serif styling",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        displayTextArea: true,
        hidden: (props) => !props.showDescription,
    },
    showDescription: {
        type: ControlType.Boolean,
        title: "Show Description",
        defaultValue: true,
    },
    showScrollHint: {
        type: ControlType.Boolean,
        title: "Scroll Hint",
        defaultValue: true,
        description: "Small 'Scroll' indicator at the bottom, fades on scroll",
    },
    scrollHintText: {
        type: ControlType.String,
        title: "Hint Text",
        defaultValue: "Scroll",
        hidden: (props) => !props.showScrollHint,
    },
    scrollScreens: {
        type: ControlType.Number,
        title: "Scroll Length",
        min: 1.5,
        max: 5,
        step: 0.5,
        defaultValue: 2.5,
        description:
            "How many screen-heights tall the section is. Higher = slower reveal. 2.5 = the user scrolls 2.5 viewport heights to reveal all words.",
    },
    dimOpacity: {
        type: ControlType.Number,
        title: "Dim Opacity",
        min: 0,
        max: 0.4,
        step: 0.02,
        defaultValue: 0.12,
        description: "How visible unrevealed words are (0 = invisible)",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        min: 400,
        max: 1400,
        step: 10,
        defaultValue: 900,
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
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#c5e33d",
    },
})
