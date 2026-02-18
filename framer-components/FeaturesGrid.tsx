// Features Grid — Framer Code Component
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

const DEFAULT_FEATURES = [
    {
        icon: "⚡",
        title: "Flexibility & Integration",
        description:
            "Solutions that adapt to your needs, integrating seamlessly with existing infrastructure and third-party tools.",
    },
    {
        icon: "🤖",
        title: "AI Power",
        description:
            "Tangible benefits in automation, content discovery, and monetization with cutting-edge artificial intelligence.",
    },
    {
        icon: "🔗",
        title: "Unified Platform",
        description:
            "MAM, PAM, scheduling, and playout work together seamlessly, eliminating data silos.",
    },
    {
        icon: "🛡️",
        title: "Trust & Reliability",
        description:
            "Robust, scalable, and dependable solutions backed by expert support worldwide.",
    },
    {
        icon: "📈",
        title: "Maximize ROI",
        description:
            "Built to maximize efficiency, reduce operational costs, and unlock new revenue streams.",
    },
    {
        icon: "☁️",
        title: "Cloud Native",
        description:
            "Deploy on-premises, in the cloud, or hybrid — with full SaaS subscription options available.",
    },
]

function FeatureCard({ feature, index, isInView, accentColor, cardBg, textColor, borderRadius, enableAnimation }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            style={{
                backgroundColor: cardBg,
                borderRadius: borderRadius,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                border: `1px solid ${
                    isHovered
                        ? accentColor + "50"
                        : "rgba(255,255,255,0.07)"
                }`,
                cursor: "default",
                transition: "border-color 0.35s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={enableAnimation ? { opacity: 0, y: 35 } : false}
            animate={
                enableAnimation
                    ? isInView
                        ? { opacity: 1, y: 0 }
                        : undefined
                    : undefined
            }
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {/* Icon Container */}
            <div
                style={{
                    fontSize: 26,
                    lineHeight: 1,
                    width: 52,
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: accentColor + "14",
                    borderRadius: 12,
                    flexShrink: 0,
                }}
            >
                {feature.icon}
            </div>

            {/* Title */}
            <h3
                style={{
                    color: textColor,
                    fontSize: 19,
                    fontWeight: 600,
                    fontFamily:
                        "'Inter Display', Inter, system-ui, sans-serif",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                }}
            >
                {feature.title}
            </h3>

            {/* Description */}
            <p
                style={{
                    color: textColor,
                    opacity: 0.55,
                    fontSize: 15,
                    lineHeight: 1.65,
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 400,
                    margin: 0,
                }}
            >
                {feature.description}
            </p>
        </motion.div>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function FeaturesGrid(props) {
    const {
        sectionTitle,
        sectionSubtitle,
        features,
        columns,
        gap,
        backgroundColor,
        cardBackgroundColor,
        textColor,
        accentColor,
        cardBorderRadius,
        paddingY,
        paddingX,
        maxWidth,
        enableAnimation,
        style,
    } = props

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-60px" })

    const items = features && features.length > 0 ? features : DEFAULT_FEATURES

    return (
        <section
            ref={ref}
            style={{
                ...style,
                backgroundColor,
                padding: `${paddingY}px ${paddingX}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 56,
                overflow: "hidden",
            }}
        >
            {/* Section Header */}
            {(sectionTitle || sectionSubtitle) && (
                <motion.div
                    style={{
                        textAlign: "center",
                        maxWidth: 720,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                    initial={enableAnimation ? { opacity: 0, y: 30 } : false}
                    animate={
                        enableAnimation
                            ? isInView
                                ? { opacity: 1, y: 0 }
                                : undefined
                            : undefined
                    }
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {sectionTitle && (
                        <h2
                            style={{
                                color: textColor,
                                fontSize: "clamp(26px, 3.5vw, 42px)",
                                fontWeight: 600,
                                fontFamily:
                                    "'Inter Display', Inter, system-ui, sans-serif",
                                margin: 0,
                                letterSpacing: "-0.025em",
                                lineHeight: 1.2,
                            }}
                        >
                            {sectionTitle}
                        </h2>
                    )}
                    {sectionSubtitle && (
                        <p
                            style={{
                                color: textColor,
                                opacity: 0.55,
                                fontSize: "clamp(14px, 1.3vw, 17px)",
                                lineHeight: 1.65,
                                fontFamily: "Inter, system-ui, sans-serif",
                                margin: 0,
                            }}
                        >
                            {sectionSubtitle}
                        </p>
                    )}
                </motion.div>
            )}

            {/* Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: gap,
                    width: "100%",
                    maxWidth: maxWidth,
                }}
            >
                {items.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        feature={feature}
                        index={index}
                        isInView={isInView}
                        accentColor={accentColor}
                        cardBg={cardBackgroundColor}
                        textColor={textColor}
                        borderRadius={cardBorderRadius}
                        enableAnimation={enableAnimation}
                    />
                ))}
            </div>
        </section>
    )
}

FeaturesGrid.defaultProps = {
    sectionTitle: "Why leading media companies choose VSN",
    sectionSubtitle:
        "Our platform delivers measurable value across every stage of the content lifecycle.",
    features: DEFAULT_FEATURES,
    columns: 3,
    gap: 20,
    backgroundColor: "#0c0e15",
    cardBackgroundColor: "#13161f",
    textColor: "#ffffff",
    accentColor: "#c5e33d",
    cardBorderRadius: 16,
    paddingY: 100,
    paddingX: 40,
    maxWidth: 1280,
    enableAnimation: true,
}

addPropertyControls(FeaturesGrid, {
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        displayTextArea: true,
    },
    sectionSubtitle: {
        type: ControlType.String,
        title: "Section Subtitle",
        displayTextArea: true,
    },
    features: {
        type: ControlType.Array,
        title: "Features",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "⚡",
                    description: "Emoji or single character",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    displayTextArea: true,
                    defaultValue: "Brief description of this feature.",
                },
            },
        },
    },
    columns: {
        type: ControlType.Enum,
        title: "Columns",
        options: [2, 3, 4],
        optionTitles: ["2 Columns", "3 Columns", "4 Columns"],
        defaultValue: 3,
    },
    gap: {
        type: ControlType.Number,
        title: "Grid Gap",
        min: 8,
        max: 48,
        step: 4,
        defaultValue: 20,
        unit: "px",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0c0e15",
    },
    cardBackgroundColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#13161f",
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
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        min: 0,
        max: 32,
        step: 2,
        defaultValue: 16,
        unit: "px",
    },
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        min: 20,
        max: 200,
        step: 10,
        defaultValue: 100,
        unit: "px",
    },
    paddingX: {
        type: ControlType.Number,
        title: "Horizontal Padding",
        min: 16,
        max: 120,
        step: 8,
        defaultValue: 40,
        unit: "px",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        min: 600,
        max: 1600,
        step: 20,
        defaultValue: 1280,
        unit: "px",
    },
    enableAnimation: {
        type: ControlType.Boolean,
        title: "Enable Animation",
        defaultValue: true,
        description: "Staggered card entrance on scroll",
    },
})
