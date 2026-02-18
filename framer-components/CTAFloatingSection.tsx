// CTA Section with Floating Background Images — Framer Code Component
// Dynamic floating images drift behind the CTA content
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef, useMemo } from "react"

// Pre-defined float paths for each slot — organic, non-repeating feel
const FLOAT_PATHS = [
    {
        x: [0, 25, -15, 30, -10, 0],
        y: [0, -20, 15, -30, 10, 0],
        rotate: [0, 4, -3, 5, -2, 0],
    },
    {
        x: [0, -20, 30, -10, 20, 0],
        y: [0, 15, -25, 20, -15, 0],
        rotate: [0, -3, 5, -4, 2, 0],
    },
    {
        x: [0, 15, -25, 20, -30, 0],
        y: [0, -30, 10, -15, 25, 0],
        rotate: [0, 5, -2, 3, -5, 0],
    },
    {
        x: [0, -30, 15, -20, 25, 0],
        y: [0, 20, -20, 30, -10, 0],
        rotate: [0, -4, 3, -5, 4, 0],
    },
    {
        x: [0, 20, -10, 25, -20, 0],
        y: [0, -15, 25, -20, 15, 0],
        rotate: [0, 3, -4, 2, -3, 0],
    },
]

// Default positions for floating elements (percentage-based)
const DEFAULT_POSITIONS = [
    { top: "5%", left: "8%", size: 180 },
    { top: "12%", right: "6%", size: 140 },
    { bottom: "15%", left: "5%", size: 120 },
    { bottom: "8%", right: "10%", size: 160 },
    { top: "40%", left: "75%", size: 100 },
]

// Default gradient blobs when no images are uploaded
const DEFAULT_GRADIENTS = [
    "linear-gradient(135deg, #c5e33d33 0%, #c5e33d08 100%)",
    "linear-gradient(225deg, #c5e33d25 0%, #0c0e15 100%)",
    "linear-gradient(180deg, #c5e33d18 0%, transparent 100%)",
    "linear-gradient(315deg, #c5e33d20 0%, #0c0e15 100%)",
    "linear-gradient(45deg, #c5e33d15 0%, transparent 100%)",
]

function FloatingElement({
    image,
    index,
    accentColor,
    animationSpeed,
    blurAmount,
    elementOpacity,
}) {
    const path = FLOAT_PATHS[index % FLOAT_PATHS.length]
    const pos = DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length]
    const baseDuration = 18 + index * 4

    // Speed multiplier: 1 = normal, 0.5 = slow, 2 = fast
    const duration = baseDuration / animationSpeed

    const positionStyle = {
        position: "absolute" as const,
        top: pos.top || "auto",
        bottom: pos.bottom || "auto",
        left: pos.left || "auto",
        right: pos.right || "auto",
        width: pos.size,
        height: pos.size,
    }

    return (
        <motion.div
            style={{
                ...positionStyle,
                borderRadius: "50%",
                overflow: "hidden",
                filter: `blur(${blurAmount}px)`,
                opacity: elementOpacity,
                willChange: "transform",
            }}
            animate={{
                x: path.x,
                y: path.y,
                rotate: path.rotate,
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 1.5,
            }}
        >
            {image ? (
                <img
                    src={image}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background:
                            DEFAULT_GRADIENTS[
                                index % DEFAULT_GRADIENTS.length
                            ].replace(/#c5e33d/g, accentColor),
                    }}
                />
            )}
        </motion.div>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CTAFloatingSection(props) {
    const {
        heading,
        highlightText,
        description,
        buttonText,
        buttonLink,
        secondaryButtonText,
        secondaryButtonLink,
        floatingImage1,
        floatingImage2,
        floatingImage3,
        floatingImage4,
        floatingImage5,
        floatingCount,
        backgroundColor,
        textColor,
        accentColor,
        buttonTextColor,
        overlayStrength,
        animationSpeed,
        blurAmount,
        elementOpacity,
        paddingY,
        minHeight,
        enableAnimation,
        style,
    } = props

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })
    const shouldAnimate = enableAnimation && isInView

    const floatingImages = [
        floatingImage1,
        floatingImage2,
        floatingImage3,
        floatingImage4,
        floatingImage5,
    ].slice(0, floatingCount)

    // Render heading with highlighted text
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
                        fontFamily:
                            "'Instrument Serif', Georgia, serif",
                    }}
                >
                    {highlightText}
                </span>
                {parts.slice(1).join(highlightText)}
            </>
        )
    }

    return (
        <section
            ref={ref}
            style={{
                ...style,
                backgroundColor,
                position: "relative",
                overflow: "hidden",
                minHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Floating Background Elements */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                {floatingImages.map((img, index) => (
                    <FloatingElement
                        key={index}
                        image={img}
                        index={index}
                        accentColor={accentColor}
                        animationSpeed={animationSpeed}
                        blurAmount={blurAmount}
                        elementOpacity={elementOpacity}
                    />
                ))}
            </div>

            {/* Radial gradient overlay for readability */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at center, ${backgroundColor}${Math.round(
                        overlayStrength * 255
                    )
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )} 0%, ${backgroundColor}${Math.round(
                        overlayStrength * 0.6 * 255
                    )
                        .toString(16)
                        .padStart(2, "0")} 100%)`,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* CTA Content */}
            <motion.div
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 24,
                    padding: `${paddingY}px 40px`,
                    maxWidth: 800,
                    width: "100%",
                }}
                initial={enableAnimation ? { opacity: 0, y: 40 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                {/* Heading */}
                <h2
                    style={{
                        color: textColor,
                        fontSize: "clamp(28px, 4vw, 52px)",
                        fontWeight: 600,
                        lineHeight: 1.15,
                        fontFamily:
                            "'Inter Display', Inter, system-ui, sans-serif",
                        margin: 0,
                        letterSpacing: "-0.025em",
                    }}
                >
                    {renderHeading()}
                </h2>

                {/* Description */}
                <p
                    style={{
                        color: textColor,
                        opacity: 0.65,
                        fontSize: "clamp(15px, 1.4vw, 19px)",
                        lineHeight: 1.65,
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 400,
                        margin: 0,
                        maxWidth: 600,
                    }}
                >
                    {description}
                </p>

                {/* Button Row */}
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 12,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {/* Primary Button */}
                    {buttonText && (
                        <motion.a
                            href={buttonLink || "#"}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                padding: "16px 32px",
                                fontSize: 15,
                                fontWeight: 600,
                                fontFamily:
                                    "Inter, system-ui, sans-serif",
                                color:
                                    buttonTextColor || backgroundColor,
                                backgroundColor: accentColor,
                                border: "none",
                                borderRadius: 12,
                                cursor: "pointer",
                                textDecoration: "none",
                                letterSpacing: "-0.01em",
                                lineHeight: 1,
                            }}
                            whileHover={{
                                scale: 1.04,
                                boxShadow: `0 8px 30px ${accentColor}35`,
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                        >
                            {buttonText}
                        </motion.a>
                    )}

                    {/* Secondary Button */}
                    {secondaryButtonText && (
                        <motion.a
                            href={secondaryButtonLink || "#"}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                padding: "16px 32px",
                                fontSize: 15,
                                fontWeight: 500,
                                fontFamily:
                                    "Inter, system-ui, sans-serif",
                                color: textColor,
                                backgroundColor: "transparent",
                                border: `1px solid rgba(255,255,255,0.2)`,
                                borderRadius: 12,
                                cursor: "pointer",
                                textDecoration: "none",
                                letterSpacing: "-0.01em",
                                lineHeight: 1,
                            }}
                            whileHover={{
                                borderColor: "rgba(255,255,255,0.45)",
                                scale: 1.03,
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                        >
                            {secondaryButtonText}
                        </motion.a>
                    )}
                </div>
            </motion.div>
        </section>
    )
}

CTAFloatingSection.defaultProps = {
    heading: "Ready to transform your media workflow?",
    highlightText: "transform",
    description:
        "Get in touch to book a demo, explore our solutions, or learn how VSN can help streamline your operations and unlock new opportunities.",
    buttonText: "Book a Demo",
    buttonLink: "#",
    secondaryButtonText: "Contact Sales",
    secondaryButtonLink: "#",
    floatingImage1: "",
    floatingImage2: "",
    floatingImage3: "",
    floatingImage4: "",
    floatingImage5: "",
    floatingCount: 5,
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    accentColor: "#c5e33d",
    buttonTextColor: "#0c0e15",
    overlayStrength: 0.65,
    animationSpeed: 1,
    blurAmount: 40,
    elementOpacity: 0.5,
    paddingY: 120,
    minHeight: 560,
    enableAnimation: true,
}

addPropertyControls(CTAFloatingSection, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        displayTextArea: true,
    },
    highlightText: {
        type: ControlType.String,
        title: "Highlight Word",
        description: "Displayed in accent color with italic serif styling",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        displayTextArea: true,
    },
    buttonText: {
        type: ControlType.String,
        title: "Primary Button",
        defaultValue: "Book a Demo",
    },
    buttonLink: {
        type: ControlType.Link,
        title: "Primary Link",
    },
    secondaryButtonText: {
        type: ControlType.String,
        title: "Secondary Button",
        defaultValue: "Contact Sales",
    },
    secondaryButtonLink: {
        type: ControlType.Link,
        title: "Secondary Link",
    },
    floatingCount: {
        type: ControlType.Number,
        title: "Floating Elements",
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 5,
        description: "Number of floating background shapes (0–5)",
    },
    floatingImage1: {
        type: ControlType.Image,
        title: "Float Image 1",
        hidden: (props) => props.floatingCount < 1,
    },
    floatingImage2: {
        type: ControlType.Image,
        title: "Float Image 2",
        hidden: (props) => props.floatingCount < 2,
    },
    floatingImage3: {
        type: ControlType.Image,
        title: "Float Image 3",
        hidden: (props) => props.floatingCount < 3,
    },
    floatingImage4: {
        type: ControlType.Image,
        title: "Float Image 4",
        hidden: (props) => props.floatingCount < 4,
    },
    floatingImage5: {
        type: ControlType.Image,
        title: "Float Image 5",
        hidden: (props) => props.floatingCount < 5,
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
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text Color",
        defaultValue: "#0c0e15",
    },
    overlayStrength: {
        type: ControlType.Number,
        title: "Overlay Darkness",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.65,
        description:
            "How dark the gradient overlay is over floating elements (0 = transparent, 1 = solid)",
    },
    animationSpeed: {
        type: ControlType.Number,
        title: "Float Speed",
        min: 0.3,
        max: 3,
        step: 0.1,
        defaultValue: 1,
        description: "Speed of floating animation (1 = normal)",
    },
    blurAmount: {
        type: ControlType.Number,
        title: "Float Blur",
        min: 0,
        max: 80,
        step: 5,
        defaultValue: 40,
        unit: "px",
        description: "Blur applied to floating elements for depth",
    },
    elementOpacity: {
        type: ControlType.Number,
        title: "Float Opacity",
        min: 0.1,
        max: 1,
        step: 0.05,
        defaultValue: 0.5,
    },
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        min: 40,
        max: 240,
        step: 10,
        defaultValue: 120,
        unit: "px",
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        min: 300,
        max: 900,
        step: 20,
        defaultValue: 560,
        unit: "px",
    },
    enableAnimation: {
        type: ControlType.Boolean,
        title: "Enable Animation",
        defaultValue: true,
        description:
            "Content fade-in on scroll + floating background elements",
    },
})
