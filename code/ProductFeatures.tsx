// VISTA Product Page - Alternating Feature Blocks Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Feature {
    title: string
    description: string
    calloutLabel: string
    calloutText: string
    image: string
}

interface Props {
    sectionLabel: string
    sectionTitle: string
    features: Feature[]
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    calloutBgColor: string
    fontFamily: string
    paddingTop: number
    style?: React.CSSProperties
}

const defaultFeatures: Feature[] = [
    {
        title: "Real Human Viewers at Scale",
        description:
            "VISTA connects you with a worldwide panel of real human viewers who evaluate your video content under controlled conditions. No simulated scores or algorithmic guesswork — just authentic perceptual feedback from hundreds of viewers, delivered in hours instead of weeks.",
        calloutLabel: "Did you know?",
        calloutText:
            "Traditional lab-based subjective testing can cost upwards of $10,000 per session and take weeks to schedule. VISTA delivers comparable statistical rigor at a fraction of the cost and time.",
        image: "",
    },
    {
        title: "Gold-Standard Methodology",
        description:
            "Every VISTA test follows ITU-R BT.500 and ITU-T P.910 compliant methodologies, including DSCQS, DSIS, ACR, and DCR. Whether you need double-stimulus comparison or single-stimulus rating, VISTA ensures your results meet the highest standards of academic and industry research.",
        calloutLabel: "Did you know?",
        calloutText:
            "DSCQS (Double Stimulus Continuous Quality Scale) is considered the gold standard for codec comparison studies and is required by many peer-reviewed publications.",
        image: "",
    },
    {
        title: "Every Viewer, Verified",
        description:
            "VISTA automatically screens every viewer session using hidden reference pairs, content traps, and statistical outlier detection. Unreliable viewers are flagged and excluded from your final results, so you can trust the data without manual quality review.",
        calloutLabel: "Did you know?",
        calloutText:
            "In crowdsourced studies without verification, up to 30% of viewers may provide unreliable data — enough to skew your results and lead to wrong conclusions.",
        image: "",
    },
    {
        title: "Submit Tests Your Way",
        description:
            "Upload content and configure tests through our intuitive web dashboard, or integrate programmatically via VISTA's REST API. Automate test submission as part of your CI/CD pipeline, encoding benchmarks, or research workflows — no manual steps required.",
        calloutLabel: "Did you know?",
        calloutText:
            "Teams using API integration report 80% faster turnaround on iterative codec tuning, with tests submitted and results returned without ever leaving their existing toolchain.",
        image: "",
    },
    {
        title: "Clear Answers, Not More Data",
        description:
            "VISTA delivers publication-ready MOS scores, confidence intervals, and statistical significance tests — not raw spreadsheets. Interactive dashboards let you explore results visually, compare conditions side-by-side, and export charts directly into your reports and papers.",
        calloutLabel: "Did you know?",
        calloutText:
            "Each VISTA test aggregates 768+ individual quality decisions on average, providing tight confidence intervals that let you detect even small quality differences between conditions.",
        image: "",
    },
]

function ProductFeatures(props: Props) {
    const {
        sectionLabel = "Deep dive",
        sectionTitle = "Everything You Need in a Subjective Testing Platform",
        features = defaultFeatures,
        accentColor = "#4f3ef5",
        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#555",
        calloutBgColor = "#f5f3ff",
        fontFamily = "'Inter', sans-serif",
        paddingTop = 100,
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
        ? `${paddingTop}px 20px 60px`
        : isTablet
          ? `${paddingTop}px 32px 72px`
          : `${paddingTop}px 48px 100px`

    const titleFontSize = isMobile ? 32 : isTablet ? 38 : 44

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
                    maxWidth: 1180,
                    margin: "0 auto",
                }}
            >
                {/* Section Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: isMobile ? 48 : 72,
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
                            fontSize: titleFontSize,
                            fontWeight: 700,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                            maxWidth: 720,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                </div>

                {/* Feature Blocks */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? 48 : 80,
                    }}
                >
                    {features.map((feature, i) => {
                        const isReversed = i % 2 === 1

                        const textBlock = (
                            <div
                                key={`text-${i}`}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: isMobile ? 24 : 28,
                                        fontWeight: 700,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.25,
                                        fontFamily,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: isMobile ? 15 : 16,
                                        color: secondaryTextColor,
                                        margin: "16px 0 0",
                                        lineHeight: 1.7,
                                        fontFamily,
                                    }}
                                >
                                    {feature.description}
                                </p>

                                {/* Callout Box */}
                                {feature.calloutText && (
                                    <div
                                        style={{
                                            marginTop: 24,
                                            backgroundColor: calloutBgColor,
                                            borderLeft: `4px solid ${accentColor}`,
                                            borderRadius: 8,
                                            padding: isMobile
                                                ? "16px 16px"
                                                : "20px 24px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: accentColor,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                fontFamily,
                                            }}
                                        >
                                            {feature.calloutLabel ||
                                                "Did you know?"}
                                        </span>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: secondaryTextColor,
                                                margin: "8px 0 0",
                                                lineHeight: 1.65,
                                                fontFamily,
                                            }}
                                        >
                                            {feature.calloutText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )

                        const imageBlock = (
                            <div
                                key={`image-${i}`}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {feature.image ? (
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: 16,
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            aspectRatio: "4 / 3",
                                            backgroundColor: `${accentColor}0D`,
                                            borderRadius: 16,
                                            border: `1px solid ${accentColor}1A`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                        >
                                            <rect
                                                x="6"
                                                y="10"
                                                width="36"
                                                height="28"
                                                rx="4"
                                                stroke={accentColor}
                                                strokeWidth="2"
                                                strokeOpacity="0.3"
                                            />
                                            <circle
                                                cx="16"
                                                cy="20"
                                                r="3"
                                                stroke={accentColor}
                                                strokeWidth="2"
                                                strokeOpacity="0.3"
                                            />
                                            <path
                                                d="M6 32L16 24L24 30L32 22L42 32"
                                                stroke={accentColor}
                                                strokeWidth="2"
                                                strokeOpacity="0.3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )

                        if (isCompact) {
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 24,
                                    }}
                                >
                                    {textBlock}
                                    {imageBlock}
                                </div>
                            )
                        }

                        return (
                            <div
                                key={i}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 56,
                                    alignItems: "center",
                                    direction: isReversed ? "rtl" : "ltr",
                                }}
                            >
                                <div style={{ direction: "ltr" }}>
                                    {textBlock}
                                </div>
                                <div style={{ direction: "ltr" }}>
                                    {imageBlock}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ProductFeatures, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Deep dive",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue:
            "Everything You Need in a Subjective Testing Platform",
        displayTextArea: true,
    },
    features: {
        type: ControlType.Array,
        title: "Features",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Describe this feature.",
                    displayTextArea: true,
                },
                calloutLabel: {
                    type: ControlType.String,
                    title: "Callout Label",
                    defaultValue: "Did you know?",
                },
                calloutText: {
                    type: ControlType.String,
                    title: "Callout Text",
                    defaultValue: "An interesting fact about this feature.",
                    displayTextArea: true,
                },
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
            },
        },
        defaultValue: [
            {
                title: "Real Human Viewers at Scale",
                description:
                    "VISTA connects you with a worldwide panel of real human viewers who evaluate your video content under controlled conditions. No simulated scores or algorithmic guesswork — just authentic perceptual feedback from hundreds of viewers, delivered in hours instead of weeks.",
                calloutLabel: "Did you know?",
                calloutText:
                    "Traditional lab-based subjective testing can cost upwards of $10,000 per session and take weeks to schedule. VISTA delivers comparable statistical rigor at a fraction of the cost and time.",
                image: "",
            },
            {
                title: "Gold-Standard Methodology",
                description:
                    "Every VISTA test follows ITU-R BT.500 and ITU-T P.910 compliant methodologies, including DSCQS, DSIS, ACR, and DCR. Whether you need double-stimulus comparison or single-stimulus rating, VISTA ensures your results meet the highest standards of academic and industry research.",
                calloutLabel: "Did you know?",
                calloutText:
                    "DSCQS (Double Stimulus Continuous Quality Scale) is considered the gold standard for codec comparison studies and is required by many peer-reviewed publications.",
                image: "",
            },
            {
                title: "Every Viewer, Verified",
                description:
                    "VISTA automatically screens every viewer session using hidden reference pairs, content traps, and statistical outlier detection. Unreliable viewers are flagged and excluded from your final results, so you can trust the data without manual quality review.",
                calloutLabel: "Did you know?",
                calloutText:
                    "In crowdsourced studies without verification, up to 30% of viewers may provide unreliable data — enough to skew your results and lead to wrong conclusions.",
                image: "",
            },
            {
                title: "Submit Tests Your Way",
                description:
                    "Upload content and configure tests through our intuitive web dashboard, or integrate programmatically via VISTA's REST API. Automate test submission as part of your CI/CD pipeline, encoding benchmarks, or research workflows — no manual steps required.",
                calloutLabel: "Did you know?",
                calloutText:
                    "Teams using API integration report 80% faster turnaround on iterative codec tuning, with tests submitted and results returned without ever leaving their existing toolchain.",
                image: "",
            },
            {
                title: "Clear Answers, Not More Data",
                description:
                    "VISTA delivers publication-ready MOS scores, confidence intervals, and statistical significance tests — not raw spreadsheets. Interactive dashboards let you explore results visually, compare conditions side-by-side, and export charts directly into your reports and papers.",
                calloutLabel: "Did you know?",
                calloutText:
                    "Each VISTA test aggregates 768+ individual quality decisions on average, providing tight confidence intervals that let you detect even small quality differences between conditions.",
                image: "",
            },
        ],
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
        defaultValue: "#555",
    },
    calloutBgColor: {
        type: ControlType.Color,
        title: "Callout BG",
        defaultValue: "#f5f3ff",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 100,
        min: 0,
        max: 200,
        step: 4,
    },
})

export default ProductFeatures
