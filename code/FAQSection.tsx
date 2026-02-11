// Beamr Homepage - FAQ Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState } from "react"

interface FAQItem {
    question: string
    answer: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    faqs: FAQItem[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    allowMultipleOpen: boolean
    style?: React.CSSProperties
}

function FAQSection(props: Props) {
    const {
        sectionLabel = "FAQ",
        heading = "Frequently Asked Questions",
        subheading = "Everything you need to know about Beamr's video optimization technology.",
        faqs = [
            {
                question: "What is Content-Adaptive Bitrate (CABR)?",
                answer: "CABR is Beamr's patented technology that analyzes video content frame-by-frame and optimizes encoding parameters in real-time. It achieves up to 50% file size reduction while maintaining mathematically proven visual quality.",
            },
            {
                question: "How does Beamr maintain video quality?",
                answer: "Beamr uses perceptual quality metrics and a unique quality-assured encoding approach. Every encoded frame is verified against the original to ensure no perceptible quality loss, guaranteed by mathematical proof.",
            },
            {
                question: "What video formats and codecs are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, AV1, and VP9. It works with standard container formats like MP4, MKV, and TS, at resolutions up to 8K.",
            },
            {
                question: "How long does integration take?",
                answer: "Most customers are up and running within days. Beamr provides drop-in compatibility with major encoding pipelines, CDNs, and cloud platforms. Our team provides dedicated integration support.",
            },
            {
                question: "What kind of cost savings can I expect?",
                answer: "Typical customers see 30-50% reduction in CDN bandwidth costs and 20-40% storage savings. The exact savings depend on your content type, current encoding settings, and delivery infrastructure.",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        allowMultipleOpen = false,
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
            <div
                style={{
                    maxWidth: 800,
                    margin: "0 auto",
                }}
            >
                {/* Header */}
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
                            fontFamily,
                            letterSpacing: "-0.02em",
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {faqs.map((faq, i) => {
                        const isOpen = openIndexes.has(i)
                        return (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: cardBgColor,
                                    borderRadius: 12,
                                    border: `1px solid ${isOpen ? `${accentColor}30` : "rgba(255,255,255,0.06)"}`,
                                    overflow: "hidden",
                                    transition: "border-color 0.3s",
                                }}
                            >
                                {/* Question */}
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: "100%",
                                        padding: "20px 24px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 16,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        fontFamily,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            color: textColor,
                                            fontFamily,
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 20,
                                            color: accentColor,
                                            transform: isOpen
                                                ? "rotate(45deg)"
                                                : "rotate(0deg)",
                                            transition: "transform 0.3s",
                                            flexShrink: 0,
                                            lineHeight: 1,
                                        }}
                                    >
                                        +
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    style={{
                                        maxHeight: isOpen ? 500 : 0,
                                        overflow: "hidden",
                                        transition:
                                            "max-height 0.3s ease-in-out",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "0 24px 20px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 15,
                                                color: secondaryTextColor,
                                                margin: 0,
                                                lineHeight: 1.7,
                                                fontFamily,
                                            }}
                                        >
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(FAQSection, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "FAQ",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Frequently Asked Questions",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Everything you need to know about Beamr's video optimization technology.",
        displayTextArea: true,
    },
    faqs: {
        type: ControlType.Array,
        title: "FAQ Items",
        maxCount: 15,
        control: {
            type: ControlType.Object,
            controls: {
                question: {
                    type: ControlType.String,
                    title: "Question",
                    defaultValue: "What is this?",
                },
                answer: {
                    type: ControlType.String,
                    title: "Answer",
                    defaultValue: "This is the answer.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                question: "What is Content-Adaptive Bitrate (CABR)?",
                answer: "CABR is Beamr's patented technology that analyzes video content frame-by-frame and optimizes encoding parameters in real-time. It achieves up to 50% file size reduction while maintaining mathematically proven visual quality.",
            },
            {
                question: "How does Beamr maintain video quality?",
                answer: "Beamr uses perceptual quality metrics and a unique quality-assured encoding approach. Every encoded frame is verified against the original to ensure no perceptible quality loss, guaranteed by mathematical proof.",
            },
            {
                question: "What video formats and codecs are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, AV1, and VP9. It works with standard container formats like MP4, MKV, and TS, at resolutions up to 8K.",
            },
            {
                question: "How long does integration take?",
                answer: "Most customers are up and running within days. Beamr provides drop-in compatibility with major encoding pipelines, CDNs, and cloud platforms. Our team provides dedicated integration support.",
            },
            {
                question: "What kind of cost savings can I expect?",
                answer: "Typical customers see 30-50% reduction in CDN bandwidth costs and 20-40% storage savings. The exact savings depend on your content type, current encoding settings, and delivery infrastructure.",
            },
        ],
    },
    allowMultipleOpen: {
        type: ControlType.Boolean,
        title: "Multiple Open",
        defaultValue: false,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0a0b1e",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
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

export default FAQSection
