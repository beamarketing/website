// Beamr 5 HEVC Page - Feature Cards Section
// Light section: grid of capability cards with optional bullet lists
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface FeatureCard {
    icon: string
    title: string
    description: string
    bullets: string[]
    wide: boolean
}

interface Props {
    eyebrow: string
    heading: string
    subheading: string
    cards: FeatureCard[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

function Beamr5Features(props: Props) {
    const {
        eyebrow = "CAPABILITIES",
        heading = "Everything you need in a professional HEVC encoder",
        subheading = "From real-time 4Kp60 performance to full HDR and multi-stream ABR — Beamr 5 covers the entire spectrum of encoding demands.",
        cards = [
            {
                icon: "⚡",
                title: "Unrivaled speed, supreme quality",
                description:
                    "Ultra-efficient real-time performance up to 4Kp60 paired with superior video quality.",
                bullets: [],
                wide: true,
            },
            {
                icon: "🧩",
                title: "Compatible & versatile",
                description: "",
                bullets: [
                    "Windows, Linux and Mac platforms",
                    "Both x86 and ARM architectures",
                    "Support for multiple HEVC profiles",
                ],
                wide: false,
            },
            {
                icon: "🌈",
                title: "HDR inside",
                description: "",
                bullets: [
                    "Supports 10 and 12 bit color",
                    "Dolby Vision, HDR10 and HLG with accompanying metadata",
                ],
                wide: false,
            },
            {
                icon: "🔀",
                title: "Multi-stream support (ABR)",
                description:
                    "Efficiently create multiple output streams with different resolutions and bitrates from a single source.",
                bullets: [],
                wide: false,
            },
            {
                icon: "⏱️",
                title: "Low latency",
                description: "",
                bullets: [
                    "Real-time, low-latency encoding at resolutions up to 4K",
                    "Optimized for video conferencing, surveillance and visually guided remote control systems",
                ],
                wide: false,
            },
        ],
        bgColor = "#ffffff",
        cardBgColor = "#f7f8fb",
        textColor = "#0d0d0d",
        secondaryTextColor = "#5b5b66",
        accentColor = "#2f73ff",
        borderColor = "#e8eaf0",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const cls = "beamr5-features"

    return (
        <section
            id="specs"
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "104px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <style>{`
                .${cls}-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                .${cls}-grid > .wide { grid-column: span 2; }
                @media (max-width: 900px) {
                    .${cls}-grid { grid-template-columns: repeat(2, 1fr); }
                    .${cls}-grid > .wide { grid-column: span 2; }
                }
                @media (max-width: 620px) {
                    .${cls}-grid { grid-template-columns: 1fr; }
                    .${cls}-grid > .wide { grid-column: span 1; }
                }
            `}</style>

            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ maxWidth: 720, marginBottom: 56 }}>
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily,
                        }}
                    >
                        {eyebrow}
                    </span>
                    <h2
                        style={{
                            fontSize: 42,
                            fontWeight: 700,
                            color: textColor,
                            margin: "14px 0 0",
                            lineHeight: 1.14,
                            letterSpacing: "-0.025em",
                            fontFamily: headingFont,
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: "18px 0 0",
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Cards */}
                <div className={`${cls}-grid`}>
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className={card.wide ? "wide" : ""}
                            style={{
                                backgroundColor: cardBgColor,
                                border: `1px solid ${borderColor}`,
                                borderRadius: 18,
                                padding: 32,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: `${accentColor}14`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                    marginBottom: 20,
                                }}
                            >
                                {card.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: 21,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: "0 0 12px",
                                    lineHeight: 1.25,
                                    letterSpacing: "-0.01em",
                                    fontFamily: headingFont,
                                }}
                            >
                                {card.title}
                            </h3>

                            {card.description ? (
                                <p
                                    style={{
                                        fontSize: 15.5,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.65,
                                        fontFamily,
                                    }}
                                >
                                    {card.description}
                                </p>
                            ) : null}

                            {card.bullets && card.bullets.length > 0 ? (
                                <ul
                                    style={{
                                        listStyle: "none",
                                        margin: card.description ? "16px 0 0" : 0,
                                        padding: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                    }}
                                >
                                    {card.bullets.map((b, j) => (
                                        <li
                                            key={j}
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                fontSize: 15.5,
                                                color: secondaryTextColor,
                                                lineHeight: 1.55,
                                                fontFamily,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    marginTop: 7,
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: accentColor,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Beamr5Features, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "CAPABILITIES",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Everything you need in a professional HEVC encoder",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "From real-time 4Kp60 performance to full HDR and multi-stream ABR — Beamr 5 covers the entire spectrum of encoding demands.",
        displayTextArea: true,
    },
    cards: {
        type: ControlType.Array,
        title: "Feature Cards",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "⚡",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "",
                    displayTextArea: true,
                },
                bullets: {
                    type: ControlType.Array,
                    title: "Bullets",
                    maxCount: 6,
                    control: {
                        type: ControlType.String,
                    },
                    defaultValue: [],
                },
                wide: {
                    type: ControlType.Boolean,
                    title: "Wide (2 cols)",
                    defaultValue: false,
                },
            },
        },
        defaultValue: [
            {
                icon: "⚡",
                title: "Unrivaled speed, supreme quality",
                description:
                    "Ultra-efficient real-time performance up to 4Kp60 paired with superior video quality.",
                bullets: [],
                wide: true,
            },
            {
                icon: "🧩",
                title: "Compatible & versatile",
                description: "",
                bullets: [
                    "Windows, Linux and Mac platforms",
                    "Both x86 and ARM architectures",
                    "Support for multiple HEVC profiles",
                ],
                wide: false,
            },
            {
                icon: "🌈",
                title: "HDR inside",
                description: "",
                bullets: [
                    "Supports 10 and 12 bit color",
                    "Dolby Vision, HDR10 and HLG with accompanying metadata",
                ],
                wide: false,
            },
            {
                icon: "🔀",
                title: "Multi-stream support (ABR)",
                description:
                    "Efficiently create multiple output streams with different resolutions and bitrates from a single source.",
                bullets: [],
                wide: false,
            },
            {
                icon: "⏱️",
                title: "Low latency",
                description: "",
                bullets: [
                    "Real-time, low-latency encoding at resolutions up to 4K",
                    "Optimized for video conferencing, surveillance and visually guided remote control systems",
                ],
                wide: false,
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#f7f8fb",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#0d0d0d",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#5b5b66",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#e8eaf0",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Features
