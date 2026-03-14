// Beamr Website - 404 Not Found Page
// Framer Code Component with full property controls
// "We Compressed This Page a Bit Too Hard."

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"

interface Props {
    heading: string
    body: string
    subBody: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showDiagnostics: boolean
    bgColor: string
    textColor: string
    accentColor: string
    secondaryTextColor: string
    illustrationFontSize: number
    illustrationFontFamily: string
    illustrationFontWeight: number
    headingFontFamily: string
    bodyFontFamily: string
    style?: React.CSSProperties
}

// Inline SVG 404 illustration — Beamr's eye analyzing and deconstructing "404"
function Illustration404({
    accentColor,
    textColor,
    fontSize,
    fontFamily,
    fontWeight,
}: {
    accentColor: string
    textColor: string
    fontSize: number
    fontFamily: string
    fontWeight: number
}) {
    const [scattered, setScattered] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setScattered(true), 600)
        return () => clearTimeout(timer)
    }, [])

    return (
        <svg
            viewBox="0 0 800 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", maxWidth: 720, height: "auto" }}
        >
            {/* First "4" — fully opaque */}
            <text
                x="80"
                y="240"
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                fontSize={fontSize}
                fill={textColor}
                opacity="1"
            >
                4
            </text>

            {/* "0" — semi-transparent, being interrogated */}
            <g opacity="0.35">
                <text
                    x="280"
                    y="240"
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    fontSize={fontSize}
                    fill={textColor}
                >
                    0
                </text>
            </g>

            {/* Crop marks around the "0" */}
            <g stroke={accentColor} strokeWidth="1.5" opacity="0.6">
                {/* Top-left crop */}
                <line x1="275" y1="42" x2="275" y2="62" />
                <line x1="275" y1="42" x2="295" y2="42" />
                {/* Top-right crop */}
                <line x1="445" y1="42" x2="445" y2="62" />
                <line x1="445" y1="42" x2="425" y2="42" />
                {/* Bottom-left crop */}
                <line x1="275" y1="258" x2="275" y2="238" />
                <line x1="275" y1="258" x2="295" y2="258" />
                {/* Bottom-right crop */}
                <line x1="445" y1="258" x2="445" y2="238" />
                <line x1="445" y1="258" x2="425" y2="258" />
            </g>

            {/* Scan line across the "0" */}
            <line
                x1="270"
                y1="150"
                x2="450"
                y2="150"
                stroke={accentColor}
                strokeWidth="1"
                opacity="0.8"
                strokeDasharray="6 3"
            >
                <animate
                    attributeName="y1"
                    values="60;245;60"
                    dur="3s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y2"
                    values="60;245;60"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </line>

            {/* Beamr analysis eye — pointed at the "0" */}
            <g transform="translate(360, 40)">
                <ellipse
                    cx="0"
                    cy="0"
                    rx="18"
                    ry="10"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.8"
                />
                <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill={accentColor}
                    opacity="0.9"
                >
                    <animate
                        attributeName="r"
                        values="3;5;3"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>
                {/* Scan rays from eye */}
                <line
                    x1="0"
                    y1="12"
                    x2="-20"
                    y2="50"
                    stroke={accentColor}
                    strokeWidth="0.5"
                    opacity="0.3"
                    strokeDasharray="3 3"
                />
                <line
                    x1="0"
                    y1="12"
                    x2="20"
                    y2="50"
                    stroke={accentColor}
                    strokeWidth="0.5"
                    opacity="0.3"
                    strokeDasharray="3 3"
                />
            </g>

            {/* Last "4" — dissolving with scattered pixel debris */}
            <text
                x="480"
                y="240"
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                fontSize={fontSize}
                fill={textColor}
                opacity="0.15"
            >
                4
            </text>

            {/* Scattered pixel debris from the last "4" */}
            {[
                { x: 620, y: 80, size: 8, delay: 0, opacity: 0.6 },
                { x: 650, y: 120, size: 6, delay: 0.2, opacity: 0.5 },
                { x: 670, y: 160, size: 10, delay: 0.4, opacity: 0.4 },
                { x: 690, y: 90, size: 5, delay: 0.1, opacity: 0.35 },
                { x: 710, y: 200, size: 7, delay: 0.3, opacity: 0.3 },
                { x: 640, y: 200, size: 4, delay: 0.5, opacity: 0.5 },
                { x: 730, y: 140, size: 9, delay: 0.15, opacity: 0.25 },
                { x: 660, y: 60, size: 5, delay: 0.35, opacity: 0.45 },
                { x: 750, y: 100, size: 6, delay: 0.25, opacity: 0.2 },
                { x: 720, y: 220, size: 4, delay: 0.45, opacity: 0.3 },
                { x: 680, y: 240, size: 7, delay: 0.55, opacity: 0.35 },
                { x: 760, y: 180, size: 3, delay: 0.6, opacity: 0.15 },
            ].map((p, i) => (
                <rect
                    key={i}
                    x={scattered ? p.x : 580}
                    y={scattered ? p.y : 150}
                    width={p.size}
                    height={p.size}
                    fill={textColor}
                    opacity={p.opacity}
                    style={{
                        transition: `all 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s`,
                    }}
                />
            ))}

            {/* BQM Badge: "VERDICT: REMOVABLE" */}
            <g transform="translate(620, 30)">
                <rect
                    x="0"
                    y="0"
                    width="140"
                    height="24"
                    rx="4"
                    fill={accentColor}
                    opacity="0.15"
                />
                <rect
                    x="0"
                    y="0"
                    width="140"
                    height="24"
                    rx="4"
                    stroke={accentColor}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.4"
                />
                <text
                    x="10"
                    y="16"
                    fontFamily="'SF Mono', 'Fira Code', monospace"
                    fontSize="9"
                    fontWeight="600"
                    fill={accentColor}
                    opacity="0.9"
                    letterSpacing="0.05em"
                >
                    VERDICT: REMOVABLE
                </text>
            </g>

            {/* Badge: "PAGE BITS: 0 found" */}
            <g transform="translate(620, 62)">
                <rect
                    x="0"
                    y="0"
                    width="120"
                    height="22"
                    rx="4"
                    fill="rgba(255,255,255,0.04)"
                />
                <rect
                    x="0"
                    y="0"
                    width="120"
                    height="22"
                    rx="4"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="0.5"
                    fill="none"
                />
                <text
                    x="10"
                    y="15"
                    fontFamily="'SF Mono', 'Fira Code', monospace"
                    fontSize="8.5"
                    fill={textColor}
                    opacity="0.45"
                    letterSpacing="0.03em"
                >
                    PAGE BITS: 0 found
                </text>
            </g>

            {/* Monospace diagnostic line at bottom */}
            <text
                x="400"
                y="300"
                textAnchor="middle"
                fontFamily="'SF Mono', 'Fira Code', 'Courier New', monospace"
                fontSize="10"
                fill={textColor}
                opacity="0.2"
                letterSpacing="0.06em"
            >
                COMPRESS_RATIO: &#8734; / QUALITY_DELTA: N/A / OUTPUT: 0
                bytes
            </text>
        </svg>
    )
}

function NotFound(props: Props) {
    const {
        heading = "We Compressed This Page a Bit Too Hard.",
        body = "We analyze every bit. This one had zero worth keeping.",
        subBody = "Don't worry \u2014 the rest of the site survived compression just fine.",
        ctaPrimaryText = "Back to Safe Bits",
        ctaPrimaryUrl = "/",
        ctaSecondaryText = "Explore Use Cases",
        ctaSecondaryUrl = "/use-cases",
        showDiagnostics = true,
        illustrationFontSize = 220,
        illustrationFontFamily = "'Poppins', 'Inter', sans-serif",
        illustrationFontWeight = 700,
        bgColor = "#000737",
        textColor = "#ffffff",
        accentColor = "#4A7BF7",
        secondaryTextColor = "#8b8ba3",
        headingFontFamily = "'Poppins', 'Inter', sans-serif",
        bodyFontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bgColor,
                padding: "80px 48px",
                boxSizing: "border-box",
                fontFamily: bodyFontFamily,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle glow */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 800,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                {/* 404 Illustration — the hero */}
                <Illustration404
                    accentColor={accentColor}
                    textColor={textColor}
                    fontSize={illustrationFontSize}
                    fontFamily={illustrationFontFamily}
                    fontWeight={illustrationFontWeight}
                />

                {/* Heading */}
                <h1
                    style={{
                        fontSize: 44,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        marginTop: 16,
                        lineHeight: 1.15,
                        fontFamily: headingFontFamily,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {heading}
                </h1>

                {/* Body */}
                <p
                    style={{
                        fontSize: 18,
                        color: textColor,
                        opacity: 0.5,
                        margin: 0,
                        maxWidth: 520,
                        lineHeight: 1.6,
                        fontFamily: bodyFontFamily,
                    }}
                >
                    {body}
                </p>

                {/* Sub-body */}
                <p
                    style={{
                        fontSize: 15,
                        color: secondaryTextColor,
                        margin: 0,
                        maxWidth: 480,
                        lineHeight: 1.6,
                        fontFamily: bodyFontFamily,
                    }}
                >
                    {subBody}
                </p>

                {/* CTAs — side by side */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 16,
                    }}
                >
                    {/* Primary: blue badge style */}
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: accentColor,
                            color: "#ffffff",
                            padding: "14px 32px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            fontFamily: bodyFontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaPrimaryText}
                        <span style={{ fontSize: 18 }}>&#8594;</span>
                    </a>

                    {/* Secondary: ghost pill style */}
                    <a
                        href={ctaSecondaryUrl}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: textColor,
                            padding: "14px 32px",
                            borderRadius: 100,
                            fontSize: 16,
                            fontWeight: 500,
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontFamily: bodyFontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaSecondaryText}
                        <span style={{ fontSize: 18 }}>&#8594;</span>
                    </a>
                </div>

                {/* Diagnostic footer text — analysis card feel */}
                {showDiagnostics && (
                    <div
                        style={{
                            marginTop: 48,
                            padding: "12px 24px",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.06)",
                            backgroundColor: "rgba(255,255,255,0.02)",
                        }}
                    >
                        <span
                            style={{
                                fontFamily:
                                    "'SF Mono', 'Fira Code', 'Courier New', monospace",
                                fontSize: 11,
                                color: textColor,
                                opacity: 0.2,
                                letterSpacing: "0.05em",
                            }}
                        >
                            COMPRESS_RATIO: &#8734; &nbsp;/&nbsp;
                            QUALITY_DELTA: N/A &nbsp;/&nbsp; OUTPUT: 0 bytes
                        </span>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(NotFound, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "We Compressed This Page a Bit Too Hard.",
        displayTextArea: true,
    },
    body: {
        type: ControlType.String,
        title: "Body",
        defaultValue:
            "We analyze every bit. This one had zero worth keeping.",
        displayTextArea: true,
    },
    subBody: {
        type: ControlType.String,
        title: "Sub-body",
        defaultValue:
            "Don't worry \u2014 the rest of the site survived compression just fine.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Back to Safe Bits",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "/",
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Explore Use Cases",
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "/use-cases",
    },
    showDiagnostics: {
        type: ControlType.Boolean,
        title: "Show Diagnostics",
        defaultValue: true,
    },
    illustrationFontSize: {
        type: ControlType.Number,
        title: "404 Font Size",
        defaultValue: 220,
        min: 100,
        max: 300,
        step: 10,
    },
    illustrationFontFamily: {
        type: ControlType.String,
        title: "404 Font Family",
        defaultValue: "'Poppins', 'Inter', sans-serif",
    },
    illustrationFontWeight: {
        type: ControlType.Number,
        title: "404 Font Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#000737",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4A7BF7",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', 'Inter', sans-serif",
    },
    bodyFontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default NotFound
