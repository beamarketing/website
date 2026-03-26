// Product Page - Final CTA Section
// Centered call-to-action with large heading, subtitle, and button
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    heading: string
    subtitle: string
    ctaText: string
    ctaUrl: string
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    fontFamily: string
    paddingTop: number
    style?: React.CSSProperties
}

function ProductCTA(props: Props) {
    const {
        heading = "Ready to put real eyes\non your video quality?",
        subtitle = "See how much certainty you can add with a personalized demo.",
        ctaText = "Let's Talk \u2192",
        ctaUrl = "#",
        accentColor = "#4f3ef5",
        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#888888",
        fontFamily = "'Inter', sans-serif",
        paddingTop = 120,
        style,
    } = props

    // Responsive detection via ResizeObserver
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0
            setIsMobile(w < 480)
            setIsTablet(w >= 480 && w < 900)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const isCompact = isMobile || isTablet

    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 100px`
        : isTablet
          ? `${paddingTop}px 32px 120px`
          : `${paddingTop}px 48px 120px`

    const headingSize = isMobile ? 32 : isTablet ? 38 : 48

    // Hover state for the CTA button
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: sectionPadding,
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {/* Heading */}
                <h2
                    style={{
                        fontSize: headingSize,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.2,
                        fontFamily,
                        letterSpacing: "-0.02em",
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h2>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: isMobile ? 16 : 18,
                        color: secondaryTextColor,
                        margin: "20px 0 0",
                        maxWidth: 520,
                        lineHeight: 1.6,
                        fontFamily,
                    }}
                >
                    {subtitle}
                </p>

                {/* CTA Button */}
                <a
                    href={ctaUrl}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        marginTop: 36,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: isMobile ? "14px 28px" : "16px 36px",
                        backgroundColor: accentColor,
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily,
                        textDecoration: "none",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        transition:
                            "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                        transform: isHovered
                            ? "translateY(-2px)"
                            : "translateY(0)",
                        boxShadow: isHovered
                            ? `0 8px 24px ${accentColor}40`
                            : `0 2px 8px ${accentColor}20`,
                        opacity: isHovered ? 0.92 : 1,
                        lineHeight: "24px",
                        letterSpacing: "0.01em",
                    }}
                >
                    {ctaText}
                </a>
            </div>
        </section>
    )
}

addPropertyControls(ProductCTA, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Ready to put real eyes\non your video quality?",
        displayTextArea: true,
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue:
            "See how much certainty you can add with a personalized demo.",
        displayTextArea: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Let's Talk \u2192",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 120,
        min: 0,
        max: 300,
        step: 4,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4f3ef5",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1a1a2e",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#888888",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default ProductCTA
