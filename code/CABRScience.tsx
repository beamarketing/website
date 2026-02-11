// Beamr Homepage - The Science Behind CABR Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface StatItem {
    value: string
    label: string
}

interface Props {
    sectionLabel: string
    heading: string
    description: string
    linkText: string
    linkUrl: string
    stats: StatItem[]
    mediaImage: string
    mediaVideo: string
    useVideo: boolean
    layoutDirection: string
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function CABRScience(props: Props) {
    const {
        sectionLabel = "TECHNOLOGY",
        heading = "The Science Behind CABR",
        description = "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters. The result: dramatically smaller files with mathematically proven quality preservation.",
        linkText = "Learn More About CABR",
        linkUrl = "#cabr",
        stats = [
            { value: "50%", label: "Smaller Files" },
            { value: "4K+", label: "Resolution Support" },
            { value: "100%", label: "Quality Preserved" },
        ],
        mediaImage = "",
        mediaVideo = "",
        useVideo = false,
        layoutDirection = "left",
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const isLeftLayout = layoutDirection === "left"

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
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 64,
                    alignItems: "center",
                }}
            >
                {/* Text Content */}
                <div
                    style={{
                        order: isLeftLayout ? 0 : 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
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
                            fontSize: 40,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {heading}
                    </h2>

                    <p
                        style={{
                            fontSize: 16,
                            color: secondaryTextColor,
                            margin: 0,
                            lineHeight: 1.7,
                            fontFamily,
                        }}
                    >
                        {description}
                    </p>

                    <a
                        href={linkUrl}
                        style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: accentColor,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily,
                        }}
                    >
                        {linkText} <span style={{ fontSize: 18 }}>&#8594;</span>
                    </a>

                    {/* Stats */}
                    <div
                        style={{
                            display: "flex",
                            gap: 40,
                            marginTop: 16,
                            paddingTop: 24,
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 700,
                                        color: accentColor,
                                        fontFamily,
                                        letterSpacing: "-0.02em",
                                        lineHeight: 1,
                                    }}
                                >
                                    {stat.value}
                                </span>
                                <span
                                    style={{
                                        fontSize: 13,
                                        color: secondaryTextColor,
                                        fontFamily,
                                    }}
                                >
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Media */}
                <div
                    style={{
                        order: isLeftLayout ? 1 : 0,
                        width: "100%",
                        aspectRatio: "4/3",
                        borderRadius: 16,
                        overflow: "hidden",
                        backgroundColor: cardBgColor,
                        border: "1px solid rgba(255,255,255,0.06)",
                        position: "relative",
                    }}
                >
                    {useVideo && mediaVideo ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            src={mediaVideo}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : mediaImage ? (
                        <img
                            src={mediaImage}
                            alt={heading}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `linear-gradient(135deg, ${cardBgColor} 0%, rgba(0,212,106,0.05) 100%)`,
                            }}
                        >
                            {/* Placeholder visualization */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        border: `3px solid ${accentColor}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 32,
                                            color: accentColor,
                                            marginLeft: 4,
                                        }}
                                    >
                                        &#9654;
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        fontFamily,
                                    }}
                                >
                                    Add video or image
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(CABRScience, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "TECHNOLOGY",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The Science Behind CABR",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters. The result: dramatically smaller files with mathematically proven quality preservation.",
        displayTextArea: true,
    },
    linkText: {
        type: ControlType.String,
        title: "Link Text",
        defaultValue: "Learn More About CABR",
    },
    linkUrl: {
        type: ControlType.String,
        title: "Link URL",
        defaultValue: "#cabr",
    },
    stats: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 5,
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
                    defaultValue: "Metric",
                },
            },
        },
        defaultValue: [
            { value: "50%", label: "Smaller Files" },
            { value: "4K+", label: "Resolution Support" },
            { value: "100%", label: "Quality Preserved" },
        ],
    },
    layoutDirection: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["left", "right"],
        optionTitles: ["Text Left", "Text Right"],
        defaultValue: "left",
    },
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: false,
    },
    mediaVideo: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    mediaImage: {
        type: ControlType.Image,
        title: "Image",
        hidden: (props) => props.useVideo,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Media BG",
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

export default CABRScience
