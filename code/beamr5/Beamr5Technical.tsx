// Beamr 5 HEVC Page - Technical Deep-Dive Section
// Dark section: numbered grid of encoder engineering capabilities
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface TechItem {
    title: string
    description: string
}

interface Props {
    eyebrow: string
    heading: string
    subheading: string
    items: TechItem[]
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

function Beamr5Technical(props: Props) {
    const {
        eyebrow = "UNDER THE HOOD",
        heading = "HEVC, optimized for speed and quality",
        subheading = "A complete, deeply tunable encoding engine built on years of patented compression research.",
        items = [
            {
                title: "On-the-fly control",
                description:
                    'Unique "on-the-fly" controls for resolution, bitrate, GOP structure, SAO and Deblocking.',
            },
            {
                title: "Speed & quality control",
                description:
                    "An extensive variety of tradeoffs between speed and quality needs — from ultra-quick low-latency settings to superb offline commercial quality.",
            },
            {
                title: "Complete API",
                description:
                    "Easy to integrate libraries, fully documented, including sample encoder, decoder, and analyzer example application source code.",
            },
            {
                title: "Advanced rate control",
                description:
                    "Support for CBR, VBR and Fixed QP, with patented predictive inter and intra complexity analysis for maximized bit allocation, bitrate stability and quality.",
            },
            {
                title: "Patented motion estimation",
                description:
                    "Efficient inter-frame prediction with an expanded toolset for high-motion content: Asymmetric Motion Partitions (AMP), Temporal MV prediction and weighted prediction for fade detection.",
            },
        ],
        bgColor = "#050516",
        cardBgColor = "#0e0e24",
        textColor = "#ffffff",
        secondaryTextColor = "#9a9ab0",
        accentColor = "#2f73ff",
        borderColor = "rgba(255,255,255,0.08)",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const cls = "beamr5-tech"

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "104px 48px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-20%",
                    right: "-10%",
                    width: "60%",
                    height: "80%",
                    background: `radial-gradient(ellipse at center, ${accentColor}18 0%, transparent 65%)`,
                    pointerEvents: "none",
                }}
            />

            <style>{`
                .${cls}-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                @media (max-width: 900px) {
                    .${cls}-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 620px) {
                    .${cls}-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
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
                            margin: "18px auto 0",
                            maxWidth: 620,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Cards */}
                <div className={`${cls}-grid`}>
                    {items.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                border: `1px solid ${borderColor}`,
                                borderRadius: 18,
                                padding: 30,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily: headingFont,
                                    letterSpacing: "0.08em",
                                    marginBottom: 18,
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3
                                style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: "0 0 12px",
                                    lineHeight: 1.3,
                                    letterSpacing: "-0.01em",
                                    fontFamily: headingFont,
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 15.5,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.65,
                                    fontFamily,
                                }}
                            >
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Beamr5Technical, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "UNDER THE HOOD",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "HEVC, optimized for speed and quality",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "A complete, deeply tunable encoding engine built on years of patented compression research.",
        displayTextArea: true,
    },
    items: {
        type: ControlType.Array,
        title: "Tech Items",
        maxCount: 9,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Capability",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description goes here.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                title: "On-the-fly control",
                description:
                    'Unique "on-the-fly" controls for resolution, bitrate, GOP structure, SAO and Deblocking.',
            },
            {
                title: "Speed & quality control",
                description:
                    "An extensive variety of tradeoffs between speed and quality needs — from ultra-quick low-latency settings to superb offline commercial quality.",
            },
            {
                title: "Complete API",
                description:
                    "Easy to integrate libraries, fully documented, including sample encoder, decoder, and analyzer example application source code.",
            },
            {
                title: "Advanced rate control",
                description:
                    "Support for CBR, VBR and Fixed QP, with patented predictive inter and intra complexity analysis for maximized bit allocation, bitrate stability and quality.",
            },
            {
                title: "Patented motion estimation",
                description:
                    "Efficient inter-frame prediction with an expanded toolset for high-motion content: Asymmetric Motion Partitions (AMP), Temporal MV prediction and weighted prediction for fade detection.",
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#050516",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#0e0e24",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#9a9ab0",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.08)",
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

export default Beamr5Technical
