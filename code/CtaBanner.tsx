// CtaBanner – Full-width CTA banner with decorative line-gradient SVG
//
// Design:
//   • Vivid lime-green background with rounded corners (desktop)
//   • Decorative vertical-line SVG pattern on the right (desktop) / bottom (mobile)
//   • Lines increase in stroke-width to create a gradient/halftone effect
//   • Bold heading + subtitle + pill button with stripe-reveal hover
//
// Framer Code Component with full property controls

import { useState, useRef, useEffect, useCallback } from "react"
import { addPropertyControls, ControlType } from "framer"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
    heading: string
    subheading: string
    buttonText: string
    buttonUrl: string
    bgColor: string
    textColor: string
    buttonBgColor: string
    buttonTextColor: string
    buttonHoverBgColor: string
    lineColor: string
    borderRadius: number
    fontFamily: string
    style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Decorative SVG – Desktop (right side)
// Two groups of vertical lines with progressive stroke widths
// Top half: thin→thick (left→right), bottom half: thick→thin (left→right)
// ---------------------------------------------------------------------------

function DesktopLines({ color }: { color: string }) {
    // Top group: 19 lines, x from ~158 to ~494, stroke 0.5→9.5
    const topLines = Array.from({ length: 19 }, (_, i) => ({
        x: 157.677 + i * 18.71,
        strokeWidth: 0.5 + i * 0.5,
    }))

    // Bottom group: 27 lines, x from ~494 down to ~8, stroke 3→16
    const bottomLines = Array.from({ length: 27 }, (_, i) => ({
        x: 494.452 - i * 18.71,
        strokeWidth: 3 + i * 0.5,
    }))

    return (
        <svg
            height="100%"
            viewBox="0 0 508 501"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <g>
                {topLines.map((l, i) => (
                    <path
                        key={`t${i}`}
                        d={`M${l.x} 0.5V250.5`}
                        stroke={color}
                        strokeWidth={l.strokeWidth}
                    />
                ))}
                {bottomLines.map((l, i) => (
                    <path
                        key={`b${i}`}
                        d={`M${l.x} 250.5V500.5`}
                        stroke={color}
                        strokeWidth={l.strokeWidth}
                    />
                ))}
            </g>
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Decorative SVG – Mobile (bottom)
// ---------------------------------------------------------------------------

function MobileLines({ color }: { color: string }) {
    // Top group: 23 lines, x from 59→367.71, stroke 0.375→8.625
    const topLines = Array.from({ length: 23 }, (_, i) => ({
        x: 59 + i * 14.032,
        strokeWidth: 0.375 + i * 0.375,
    }))

    // Bottom group: 27 lines, x from 367.371 down to ~2.53, stroke 1.875→11.625
    const bottomLines = Array.from({ length: 27 }, (_, i) => ({
        x: 367.371 - i * 14.032,
        strokeWidth: 1.875 + i * 0.375,
    }))

    return (
        <svg
            width="100%"
            viewBox="0 0 375 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <g>
                {topLines.map((l, i) => (
                    <path
                        key={`mt${i}`}
                        d={`M${l.x} 0.118V137.118`}
                        stroke={color}
                        strokeWidth={l.strokeWidth}
                    />
                ))}
                {bottomLines.map((l, i) => (
                    <path
                        key={`mb${i}`}
                        d={`M${l.x} 137.118V273.118`}
                        stroke={color}
                        strokeWidth={l.strokeWidth}
                    />
                ))}
            </g>
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Animated button with stripe-reveal hover
// ---------------------------------------------------------------------------

function StripeButton({
    text,
    href,
    bgColor,
    textColor,
    hoverBgColor,
    fontFamily,
}: {
    text: string
    href: string
    bgColor: string
    textColor: string
    hoverBgColor: string
    fontFamily: string
}) {
    const [hovered, setHovered] = useState(false)
    const STRIPE_COUNT = 4

    return (
        <a
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "inline-block",
                textDecoration: "none",
                borderRadius: 9999,
                position: "relative",
                overflow: "hidden",
                backgroundColor: bgColor,
                cursor: "pointer",
            }}
        >
            {/* Stripe overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                }}
            >
                {Array.from({ length: STRIPE_COUNT }, (_, i) => {
                    const fromLeft = i % 2 === 0
                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                backgroundColor: hoverBgColor,
                                transform: hovered
                                    ? "translateX(0)"
                                    : `translateX(${fromLeft ? "-101%" : "101%"})`,
                                transition: `transform 0.45s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.03}s`,
                                willChange: "transform",
                            }}
                        />
                    )
                })}
            </div>

            {/* Text */}
            <span
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "block",
                    padding: "15px 36px",
                    fontSize: 17,
                    fontWeight: 600,
                    color: textColor,
                    fontFamily,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    lineHeight: 1.35,
                }}
            >
                {text}
            </span>
        </a>
    )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function CtaBanner(props: Props) {
    const {
        heading = "Discover the \nfuture of play",
        subheading = "Ready to start? \nGet in touch to see how we can help.",
        buttonText = "Start Now",
        buttonUrl = "/contact-sales/",
        bgColor = "rgb(225, 255, 103)",
        textColor = "#0a1628",
        buttonBgColor = "#0a1628",
        buttonTextColor = "#ffffff",
        buttonHoverBgColor = "#2563eb",
        lineColor = "#ffffff",
        borderRadius = 12,
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    return (
        <section
            style={{
                ...style,
                width: "100%",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            {/* Outer wrapper with max-width + padding */}
            <div
                style={{
                    maxWidth: 1376,
                    margin: "0 auto",
                    padding: isMobile ? "24px 0 72px" : "24px 16px 96px",
                    boxSizing: "border-box",
                }}
            >
                {/* Card */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: isMobile ? 0 : borderRadius,
                        backgroundColor: bgColor,
                        padding: isMobile ? "72px 0 0" : "76px 80px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* ===================================================== */}
                    {/* Desktop SVG pattern — right side                       */}
                    {/* ===================================================== */}
                    {!isMobile && (
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                height: "100%",
                                pointerEvents: "none",
                            }}
                        >
                            <DesktopLines color={lineColor} />
                        </div>
                    )}

                    {/* ===================================================== */}
                    {/* Heading                                                */}
                    {/* ===================================================== */}
                    <h2
                        style={{
                            position: "relative",
                            fontSize: isMobile ? 40 : 72,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.08,
                            letterSpacing: "-0.02em",
                            fontFamily,
                            textAlign: isMobile ? "center" : "left",
                            maxWidth: isMobile ? "80%" : "50%",
                            marginLeft: isMobile ? "auto" : 0,
                            marginRight: isMobile ? "auto" : 0,
                            padding: isMobile ? "0 24px" : 0,
                            whiteSpace: "pre-line",
                            boxSizing: "border-box",
                        }}
                    >
                        {heading}
                    </h2>

                    {/* ===================================================== */}
                    {/* Subheading                                             */}
                    {/* ===================================================== */}
                    {subheading && (
                        <p
                            style={{
                                position: "relative",
                                fontSize: 20,
                                color: textColor,
                                margin: 0,
                                marginTop: 20,
                                lineHeight: 1.5,
                                fontFamily,
                                textAlign: isMobile ? "center" : "left",
                                padding: isMobile ? "0 24px" : 0,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {subheading}
                        </p>
                    )}

                    {/* ===================================================== */}
                    {/* Button                                                 */}
                    {/* ===================================================== */}
                    <div
                        style={{
                            position: "relative",
                            marginTop: isMobile ? 32 : 56,
                            padding: isMobile ? "0 24px" : 0,
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                        }}
                    >
                        <StripeButton
                            text={buttonText}
                            href={buttonUrl}
                            bgColor={buttonBgColor}
                            textColor={buttonTextColor}
                            hoverBgColor={buttonHoverBgColor}
                            fontFamily={fontFamily}
                        />
                    </div>

                    {/* ===================================================== */}
                    {/* Mobile SVG pattern — bottom                            */}
                    {/* ===================================================== */}
                    {isMobile && (
                        <div
                            style={{
                                marginTop: 48,
                                width: "100%",
                                pointerEvents: "none",
                            }}
                        >
                            <MobileLines color={lineColor} />
                        </div>
                    )}

                    {/* Bottom spacer for desktop (matches sm:pb-72) */}
                    {!isMobile && <div style={{ height: 0 }} />}
                </div>
            </div>
        </section>
    )
}

// ---------------------------------------------------------------------------
// Framer Property Controls
// ---------------------------------------------------------------------------

addPropertyControls(CtaBanner, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Discover the \nfuture of play",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "Ready to start? \nGet in touch to see how we can help.",
        displayTextArea: true,
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Start Now",
    },
    buttonUrl: {
        type: ControlType.String,
        title: "Button URL",
        defaultValue: "/contact-sales/",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "rgb(225, 255, 103)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#0a1628",
    },
    buttonBgColor: {
        type: ControlType.Color,
        title: "Button BG",
        defaultValue: "#0a1628",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#ffffff",
    },
    buttonHoverBgColor: {
        type: ControlType.Color,
        title: "Button Hover BG",
        defaultValue: "#2563eb",
    },
    lineColor: {
        type: ControlType.Color,
        title: "Line Color",
        defaultValue: "#ffffff",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default CtaBanner
