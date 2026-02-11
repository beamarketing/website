// Beamr Homepage - Your Video Efficiency Partner Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Feature {
    icon: string
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    heading: string
    description: string
    features: Feature[]
    ctaText: string
    ctaUrl: string
    showCta: boolean
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

function PartnerSection(props: Props) {
    const {
        sectionLabel = "PARTNERSHIP",
        heading = "Your Video Efficiency Partner",
        description = "Whether you're a streaming giant or an AI startup, Beamr delivers measurable results with seamless integration into your existing workflow.",
        features = [
            {
                icon: "⚡",
                title: "Easy Integration",
                description:
                    "Drop-in compatibility with all major encoders and CDNs.",
            },
            {
                icon: "📊",
                title: "Real-Time Analytics",
                description:
                    "Monitor encoding performance and savings in real-time.",
            },
            {
                icon: "🔒",
                title: "Enterprise Security",
                description:
                    "SOC 2 compliant with end-to-end encryption for all content.",
            },
        ],
        ctaText = "Start Free Trial",
        ctaUrl = "#trial",
        showCta = true,
        mediaImage = "",
        mediaVideo = "",
        useVideo = false,
        layoutDirection = "right",
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const isRightLayout = layoutDirection === "right"

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
                        order: isRightLayout ? 0 : 1,
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

                    {/* Features */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            marginTop: 8,
                        }}
                    >
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    alignItems: "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: `${accentColor}12`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        flexShrink: 0,
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: textColor,
                                            margin: "0 0 4px",
                                            fontFamily,
                                        }}
                                    >
                                        {feature.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            margin: 0,
                                            lineHeight: 1.5,
                                            fontFamily,
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    {showCta && (
                        <a
                            href={ctaUrl}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                backgroundColor: accentColor,
                                color: "#07071c",
                                padding: "12px 28px",
                                borderRadius: 10,
                                fontSize: 15,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily,
                                alignSelf: "flex-start",
                                marginTop: 8,
                            }}
                        >
                            {ctaText}
                            <span style={{ fontSize: 16 }}>&#8594;</span>
                        </a>
                    )}
                </div>

                {/* Media */}
                <div
                    style={{
                        order: isRightLayout ? 1 : 0,
                        width: "100%",
                        aspectRatio: "4/3",
                        borderRadius: 16,
                        overflow: "hidden",
                        backgroundColor: cardBgColor,
                        border: "1px solid rgba(255,255,255,0.06)",
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
                            <span
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    fontFamily,
                                }}
                            >
                                Add image or video
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(PartnerSection, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "PARTNERSHIP",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Your Video Efficiency Partner",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Whether you're a streaming giant or an AI startup, Beamr delivers measurable results with seamless integration into your existing workflow.",
        displayTextArea: true,
    },
    features: {
        type: ControlType.Array,
        title: "Features",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon/Emoji",
                    defaultValue: "⚡",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Feature description.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                icon: "⚡",
                title: "Easy Integration",
                description:
                    "Drop-in compatibility with all major encoders and CDNs.",
            },
            {
                icon: "📊",
                title: "Real-Time Analytics",
                description:
                    "Monitor encoding performance and savings in real-time.",
            },
            {
                icon: "🔒",
                title: "Enterprise Security",
                description:
                    "SOC 2 compliant with end-to-end encryption for all content.",
            },
        ],
    },
    showCta: {
        type: ControlType.Boolean,
        title: "Show CTA",
        defaultValue: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Start Free Trial",
        hidden: (props) => !props.showCta,
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#trial",
        hidden: (props) => !props.showCta,
    },
    layoutDirection: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["left", "right"],
        optionTitles: ["Media Left", "Media Right"],
        defaultValue: "right",
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

export default PartnerSection
