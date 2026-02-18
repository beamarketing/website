// Value Proposition Strip — Framer Code Component
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ValuePropositionStrip(props) {
    const {
        heading,
        highlightText,
        description,
        showDividerAbove,
        showDividerBelow,
        backgroundColor,
        textColor,
        accentColor,
        dividerColor,
        paddingY,
        maxWidth,
        enableAnimation,
        style,
    } = props

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const shouldAnimate = enableAnimation && isInView

    // Render heading with the highlighted word in accent color + italic
    const renderHeading = () => {
        if (!highlightText || !heading.includes(highlightText)) {
            return heading
        }
        const parts = heading.split(highlightText)
        return (
            <>
                {parts[0]}
                <span
                    style={{
                        color: accentColor,
                        fontStyle: "italic",
                        fontFamily: "'Instrument Serif', Georgia, serif",
                    }}
                >
                    {highlightText}
                </span>
                {parts.slice(1).join(highlightText)}
            </>
        )
    }

    const dividerStyle = {
        width: 60,
        height: 2,
        backgroundColor: dividerColor || accentColor,
        borderRadius: 1,
        opacity: 0.5,
    }

    return (
        <motion.section
            ref={ref}
            style={{
                ...style,
                backgroundColor,
                padding: `${paddingY}px 40px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 24,
                overflow: "hidden",
            }}
            initial={enableAnimation ? { opacity: 0, y: 50 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {showDividerAbove && <div style={dividerStyle} />}

            <motion.h2
                style={{
                    color: textColor,
                    fontSize: "clamp(28px, 4vw, 52px)",
                    fontWeight: 600,
                    lineHeight: 1.15,
                    fontFamily: "'Inter Display', Inter, system-ui, sans-serif",
                    margin: 0,
                    maxWidth: maxWidth,
                    letterSpacing: "-0.025em",
                    width: "100%",
                }}
                initial={enableAnimation ? { opacity: 0, y: 30 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                {renderHeading()}
            </motion.h2>

            <motion.p
                style={{
                    color: textColor,
                    opacity: 0.65,
                    fontSize: "clamp(15px, 1.5vw, 19px)",
                    lineHeight: 1.65,
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 400,
                    margin: 0,
                    maxWidth: maxWidth * 0.78,
                    width: "100%",
                }}
                initial={enableAnimation ? { opacity: 0, y: 20 } : false}
                animate={shouldAnimate ? { opacity: 0.65, y: 0 } : undefined}
                transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                {description}
            </motion.p>

            {showDividerBelow && <div style={dividerStyle} />}
        </motion.section>
    )
}

ValuePropositionStrip.defaultProps = {
    heading:
        "An open, flexible, and scalable platform that empowers your team",
    highlightText: "flexible",
    description:
        "Collaborate effortlessly, automate repetitive tasks, and gain complete control over the entire media lifecycle — from ingest to archive, playout, and distribution.",
    showDividerAbove: false,
    showDividerBelow: false,
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    accentColor: "#c5e33d",
    dividerColor: "",
    paddingY: 120,
    maxWidth: 900,
    enableAnimation: true,
}

addPropertyControls(ValuePropositionStrip, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        displayTextArea: true,
    },
    highlightText: {
        type: ControlType.String,
        title: "Highlight Word",
        description: "This word will appear in the accent color with italic styling",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        displayTextArea: true,
    },
    showDividerAbove: {
        type: ControlType.Boolean,
        title: "Divider Above",
        defaultValue: false,
    },
    showDividerBelow: {
        type: ControlType.Boolean,
        title: "Divider Below",
        defaultValue: false,
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
    dividerColor: {
        type: ControlType.Color,
        title: "Divider Color",
        defaultValue: "#c5e33d",
    },
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        min: 20,
        max: 240,
        step: 10,
        defaultValue: 120,
        unit: "px",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Content Max Width",
        min: 400,
        max: 1400,
        step: 10,
        defaultValue: 900,
        unit: "px",
    },
    enableAnimation: {
        type: ControlType.Boolean,
        title: "Enable Animation",
        defaultValue: true,
        description: "Scroll-triggered fade-in and slide-up",
    },
})
