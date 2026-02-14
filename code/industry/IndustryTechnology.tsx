// Industry Page - Technology / CABR Science Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface StatItem {
    value: string
    label: string
    description: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    useVideo: boolean
    mediaImage: string
    mediaVideo: string
    showPlayButton: boolean
    stats: StatItem[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryTechnology(props: Props) {
    const {
        sectionLabel = "TECHNOLOGY",
        heading = "The science behind CABR",
        subheading = "Our Content-Adaptive Bitrate Reduction technology uses perceptual quality optimization to deliver the highest quality at the lowest possible bitrate.",
        useVideo = false,
        mediaImage = "",
        mediaVideo = "",
        showPlayButton = true,
        stats = [
            {
                value: "50%",
                label: "Average Bitrate Reduction",
                description: "Typical bitrate savings across all content types with zero quality degradation.",
            },
            {
                value: "100%",
                label: "Quality Preservation",
                description: "Mathematically guaranteed to maintain perceptual quality on every frame.",
            },
            {
                value: "4K+",
                label: "Resolution Support",
                description: "Full support for 4K, 8K, HDR, and all modern video formats and codecs.",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily,
                        }}
                    >
                        {sectionLabel}
                    </span>
                    <h2
                        style={{
                            fontSize: 44,
                            fontWeight: 700,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            fontFamily,
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: "16px auto 0",
                            maxWidth: 640,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Media Placeholder */}
                <div
                    style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: 16,
                        overflow: "hidden",
                        position: "relative",
                        marginBottom: 40,
                        background: mediaImage
                            ? `url(${mediaImage}) center/cover no-repeat`
                            : "linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {useVideo && mediaVideo ? (
                        <video
                            src={mediaVideo}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            muted
                            loop
                            playsInline
                        />
                    ) : null}

                    {/* Play Button Overlay */}
                    {showPlayButton && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    backdropFilter: "blur(8px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    cursor: "pointer",
                                }}
                            >
                                <div
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderStyle: "solid",
                                        borderWidth: "12px 0 12px 22px",
                                        borderColor: `transparent transparent transparent ${textColor}`,
                                        marginLeft: 4,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                padding: 32,
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 36,
                                    fontWeight: 700,
                                    color: accentColor,
                                    marginBottom: 8,
                                    fontFamily,
                                    lineHeight: 1,
                                }}
                            >
                                {stat.value}
                            </div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: textColor,
                                    marginBottom: 8,
                                    fontFamily,
                                }}
                            >
                                {stat.label}
                            </div>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontFamily,
                                }}
                            >
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryTechnology, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "TECHNOLOGY",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The science behind CABR",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Our Content-Adaptive Bitrate Reduction technology uses perceptual quality optimization to deliver the highest quality at the lowest possible bitrate.",
        displayTextArea: true,
    },
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: false,
    },
    mediaImage: {
        type: ControlType.Image,
        title: "Media Image",
        hidden: (props) => props.useVideo,
    },
    mediaVideo: {
        type: ControlType.File,
        title: "Media Video",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    showPlayButton: {
        type: ControlType.Boolean,
        title: "Play Button",
        defaultValue: true,
    },
    stats: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                value: {
                    type: ControlType.String,
                    title: "Value",
                    defaultValue: "50%",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Stat Label",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Stat description goes here.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                value: "50%",
                label: "Average Bitrate Reduction",
                description: "Typical bitrate savings across all content types with zero quality degradation.",
            },
            {
                value: "100%",
                label: "Quality Preservation",
                description: "Mathematically guaranteed to maintain perceptual quality on every frame.",
            },
            {
                value: "4K+",
                label: "Resolution Support",
                description: "Full support for 4K, 8K, HDR, and all modern video formats and codecs.",
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0a0b1e",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#0f1029",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustryTechnology
