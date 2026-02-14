// Industry Page - FAQ Section
// Framer Code Component with full property controls

import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface FAQItem {
    question: string
    answer: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    faqs: FAQItem[]
    allowMultipleOpen: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryFAQ(props: Props) {
    const {
        sectionLabel = "FAQ",
        heading = "Frequently asked questions",
        subheading = "Everything you need to know about Beamr's video optimization for media and entertainment.",
        faqs = [
            {
                question: "How does CABR technology work?",
                answer: "CABR (Content-Adaptive Bitrate Reduction) analyzes each frame of video content to find the optimal bitrate that maintains perceptual quality. Using advanced psycho-visual models, it identifies areas where bitrate can be reduced without any visible quality loss.",
            },
            {
                question: "What codecs and formats are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, VP9, and AV1. We handle all standard container formats (MP4, MKV, TS) and resolutions up to 8K, including HDR content.",
            },
            {
                question: "How much can I reduce my video bitrate?",
                answer: "Typical bitrate reductions range from 20% to 50%, depending on content type, codec, and current encoding efficiency. Some content types like animation and screen recordings can see reductions of up to 70%.",
            },
            {
                question: "Is there any quality loss?",
                answer: "No. Beamr's optimization is mathematically guaranteed to be perceptually lossless. Every optimized frame is verified against the source to ensure no visible quality degradation. This is validated through SSIM, VMAF, and our proprietary quality metrics.",
            },
            {
                question: "How does integration work?",
                answer: "Beamr provides a simple REST API and SDK that integrates directly into your existing encoding pipeline. Most integrations are completed in under a week, with no changes required to your existing workflow or infrastructure.",
            },
            {
                question: "What about pricing and ROI?",
                answer: "Pricing is based on minutes of video processed. Most customers see positive ROI within the first month through reduced CDN and storage costs. Contact our sales team for a custom quote based on your volume.",
            },
        ],
        allowMultipleOpen = false,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.06)",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())

    const toggleFaq = (index: number) => {
        setOpenIndexes((prev) => {
            const next = new Set(allowMultipleOpen ? prev : [])
            if (prev.has(index)) {
                next.delete(index)
            } else {
                next.add(index)
            }
            return next
        })
    }

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
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
                            maxWidth: 560,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* FAQ Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {faqs.map((faq, i) => {
                        const isOpen = openIndexes.has(i)
                        return (
                            <div
                                key={i}
                                style={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    borderTop: i === 0 ? `1px solid ${borderColor}` : "none",
                                    transition: "border-color 0.3s",
                                }}
                            >
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "24px 0",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        gap: 16,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: textColor,
                                            textAlign: "left",
                                            fontFamily,
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 22,
                                            color: accentColor,
                                            fontWeight: 300,
                                            flexShrink: 0,
                                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s",
                                            lineHeight: 1,
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    style={{
                                        maxHeight: isOpen ? 300 : 0,
                                        overflow: "hidden",
                                        transition: "max-height 0.3s ease-in-out",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: 15,
                                            color: secondaryTextColor,
                                            margin: "0 0 24px",
                                            lineHeight: 1.7,
                                            fontFamily,
                                            paddingRight: 40,
                                        }}
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryFAQ, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "FAQ",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Frequently asked questions",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Everything you need to know about Beamr's video optimization for media and entertainment.",
        displayTextArea: true,
    },
    allowMultipleOpen: {
        type: ControlType.Boolean,
        title: "Allow Multiple Open",
        defaultValue: false,
    },
    faqs: {
        type: ControlType.Array,
        title: "FAQ Items",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                question: {
                    type: ControlType.String,
                    title: "Question",
                    defaultValue: "Question goes here?",
                },
                answer: {
                    type: ControlType.String,
                    title: "Answer",
                    defaultValue: "Answer goes here.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                question: "How does CABR technology work?",
                answer: "CABR (Content-Adaptive Bitrate Reduction) analyzes each frame of video content to find the optimal bitrate that maintains perceptual quality. Using advanced psycho-visual models, it identifies areas where bitrate can be reduced without any visible quality loss.",
            },
            {
                question: "What codecs and formats are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, VP9, and AV1. We handle all standard container formats (MP4, MKV, TS) and resolutions up to 8K, including HDR content.",
            },
            {
                question: "How much can I reduce my video bitrate?",
                answer: "Typical bitrate reductions range from 20% to 50%, depending on content type, codec, and current encoding efficiency. Some content types like animation and screen recordings can see reductions of up to 70%.",
            },
            {
                question: "Is there any quality loss?",
                answer: "No. Beamr's optimization is mathematically guaranteed to be perceptually lossless. Every optimized frame is verified against the source to ensure no visible quality degradation.",
            },
            {
                question: "How does integration work?",
                answer: "Beamr provides a simple REST API and SDK that integrates directly into your existing encoding pipeline. Most integrations are completed in under a week.",
            },
            {
                question: "What about pricing and ROI?",
                answer: "Pricing is based on minutes of video processed. Most customers see positive ROI within the first month through reduced CDN and storage costs.",
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
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
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustryFAQ
