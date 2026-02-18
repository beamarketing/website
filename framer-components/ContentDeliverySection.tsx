// Content Delivery Section — Framer Code Component
// Split layout: text content + image/visual
// Paste this into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ContentDeliverySection(props) {
    const {
        tag,
        heading,
        highlightText,
        description,
        buttonText,
        buttonLink,
        image,
        imagePosition,
        showTag,
        backgroundColor,
        textColor,
        accentColor,
        tagBackgroundColor,
        buttonStyle: btnStyle,
        paddingY,
        paddingX,
        maxWidth,
        imageRadius,
        contentGap,
        enableAnimation,
        style,
    } = props

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })
    const shouldAnimate = enableAnimation && isInView

    const isImageLeft = imagePosition === "left"

    // Render heading with optional accent-colored highlight
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

    // Determine slide direction based on image position
    const textSlideX = isImageLeft ? 40 : -40
    const imageSlideX = isImageLeft ? -40 : 40

    // Placeholder when no image is uploaded
    const renderImage = () => {
        if (image) {
            return (
                <img
                    src={image}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: imageRadius,
                        display: "block",
                    }}
                />
            )
        }
        // Default placeholder — gradient mockup
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 360,
                    borderRadius: imageRadius,
                    background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 50%, ${backgroundColor} 100%)`,
                    border: `1px solid rgba(255,255,255,0.06)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: textColor,
                    opacity: 0.3,
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                Upload an image →
            </div>
        )
    }

    return (
        <section
            ref={ref}
            style={{
                ...style,
                backgroundColor,
                padding: `${paddingY}px ${paddingX}px`,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: isImageLeft ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: contentGap,
                    maxWidth: maxWidth,
                    width: "100%",
                    flexWrap: "wrap",
                }}
            >
                {/* Text Content Side */}
                <motion.div
                    style={{
                        flex: "1 1 420px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                        minWidth: 300,
                    }}
                    initial={
                        enableAnimation
                            ? { opacity: 0, x: textSlideX }
                            : false
                    }
                    animate={
                        shouldAnimate
                            ? { opacity: 1, x: 0 }
                            : undefined
                    }
                    transition={{
                        duration: 0.7,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {/* Tag / Label */}
                    {showTag && tag && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignSelf: "flex-start",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: accentColor,
                                    backgroundColor:
                                        tagBackgroundColor ||
                                        accentColor + "14",
                                    padding: "6px 14px",
                                    borderRadius: 100,
                                    lineHeight: 1,
                                }}
                            >
                                {tag}
                            </span>
                        </div>
                    )}

                    {/* Heading */}
                    <h2
                        style={{
                            color: textColor,
                            fontSize: "clamp(24px, 3vw, 40px)",
                            fontWeight: 600,
                            lineHeight: 1.2,
                            fontFamily:
                                "'Inter Display', Inter, system-ui, sans-serif",
                            margin: 0,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {renderHeading()}
                    </h2>

                    {/* Description */}
                    <p
                        style={{
                            color: textColor,
                            opacity: 0.6,
                            fontSize: "clamp(14px, 1.2vw, 17px)",
                            lineHeight: 1.7,
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontWeight: 400,
                            margin: 0,
                            maxWidth: 520,
                        }}
                    >
                        {description}
                    </p>

                    {/* CTA Button */}
                    {buttonText && (
                        <motion.a
                            href={buttonLink || "#"}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                alignSelf: "flex-start",
                                marginTop: 8,
                                padding:
                                    btnStyle === "filled"
                                        ? "14px 28px"
                                        : "0",
                                fontSize: 15,
                                fontWeight: 500,
                                fontFamily:
                                    "Inter, system-ui, sans-serif",
                                color:
                                    btnStyle === "filled"
                                        ? backgroundColor
                                        : accentColor,
                                backgroundColor:
                                    btnStyle === "filled"
                                        ? accentColor
                                        : "transparent",
                                border: "none",
                                borderRadius: 10,
                                cursor: "pointer",
                                textDecoration: "none",
                                letterSpacing: "-0.01em",
                            }}
                            whileHover={{
                                scale: btnStyle === "filled" ? 1.03 : 1,
                                opacity: 0.85,
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            {buttonText}
                            <span style={{ fontSize: 18 }}>→</span>
                        </motion.a>
                    )}
                </motion.div>

                {/* Image / Visual Side */}
                <motion.div
                    style={{
                        flex: "1 1 420px",
                        minWidth: 300,
                        position: "relative",
                    }}
                    initial={
                        enableAnimation
                            ? { opacity: 0, x: imageSlideX }
                            : false
                    }
                    animate={
                        shouldAnimate
                            ? { opacity: 1, x: 0 }
                            : undefined
                    }
                    transition={{
                        duration: 0.7,
                        delay: 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {renderImage()}
                </motion.div>
            </div>
        </section>
    )
}

ContentDeliverySection.defaultProps = {
    tag: "Content Delivery",
    heading:
        "Deliver content to every audience with professional precision",
    highlightText: "precision",
    description:
        "Experience the power of real-time content management and multi-platform distribution through a customizable workspace. Reach audiences across linear, OTT, and digital channels seamlessly.",
    buttonText: "Discover more",
    buttonLink: "#",
    image: "",
    imagePosition: "right",
    showTag: true,
    backgroundColor: "#0c0e15",
    textColor: "#ffffff",
    accentColor: "#c5e33d",
    tagBackgroundColor: "",
    buttonStyle: "link",
    paddingY: 100,
    paddingX: 40,
    maxWidth: 1280,
    imageRadius: 16,
    contentGap: 64,
    enableAnimation: true,
}

addPropertyControls(ContentDeliverySection, {
    tag: {
        type: ControlType.String,
        title: "Tag Label",
        defaultValue: "Content Delivery",
    },
    showTag: {
        type: ControlType.Boolean,
        title: "Show Tag",
        defaultValue: true,
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        displayTextArea: true,
    },
    highlightText: {
        type: ControlType.String,
        title: "Highlight Word",
        description:
            "This word appears in accent color with italic serif styling",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        displayTextArea: true,
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Discover more",
    },
    buttonLink: {
        type: ControlType.Link,
        title: "Button Link",
    },
    buttonStyle: {
        type: ControlType.Enum,
        title: "Button Style",
        options: ["link", "filled"],
        optionTitles: ["Text Link →", "Filled Button"],
        defaultValue: "link",
    },
    image: {
        type: ControlType.Image,
        title: "Image",
    },
    imagePosition: {
        type: ControlType.Enum,
        title: "Image Position",
        options: ["left", "right"],
        optionTitles: ["Left", "Right"],
        defaultValue: "right",
    },
    imageRadius: {
        type: ControlType.Number,
        title: "Image Radius",
        min: 0,
        max: 40,
        step: 2,
        defaultValue: 16,
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
    tagBackgroundColor: {
        type: ControlType.Color,
        title: "Tag Background",
        defaultValue: "rgba(197, 227, 61, 0.08)",
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
    contentGap: {
        type: ControlType.Number,
        title: "Content Gap",
        min: 20,
        max: 120,
        step: 4,
        defaultValue: 64,
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
        description:
            "Text and image slide in from opposite sides on scroll",
    },
})
