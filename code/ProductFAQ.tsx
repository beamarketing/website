// VISTA Product Page - FAQ Accordion Section
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface FAQItem {
    question: string
    answer: string
}

interface Props {
    sectionTitle: string
    items: FAQItem[]
    bgColor: string
    textColor: string
    secondaryTextColor: string
    borderColor: string
    fontFamily: string
    paddingTop: number
    maxWidth: number
    style?: React.CSSProperties
}

function ProductFAQ(props: Props) {
    const {
        sectionTitle = "Frequently Asked Questions",
        items = [
            {
                question: "How is VISTA different from VMAF, PSNR, or SSIM?",
                answer: "Traditional objective metrics like VMAF, PSNR, and SSIM attempt to approximate human perception through mathematical models, but they often miss subtleties that real viewers notice. VISTA uses actual human viewers to evaluate video quality, providing ground-truth perceptual scores that reflect how your audience truly experiences your content.",
            },
            {
                question: "Who are the viewers?",
                answer: "VISTA leverages a crowd-sourced panel of trained viewers who evaluate video quality under controlled conditions. An internal panel option is also available for enterprise customers. All viewers undergo continuous validation to ensure consistent, reliable scoring across every test.",
            },
            {
                question: "How long does it take to get results?",
                answer: "Most VISTA evaluations are completed in days, not weeks. The VistaOps team manages the entire process from submission to delivery, so your engineering team can stay focused on development while results are being collected.",
            },
            {
                question: "Is VISTA only for compression testing?",
                answer: "No. While compression optimization is a common use case, VISTA can evaluate any video transformation — including scaling, frame rate conversion, HDR tone mapping, codec migration, AI-based enhancement, and more. If it changes how the video looks, VISTA can measure the perceptual impact.",
            },
            {
                question: "What does the customer get?",
                answer: "Customers receive a structured report that includes per-clip perceptual quality scores, statistical confidence intervals, side-by-side rankings of tested conditions, and actionable recommendations. Raw data exports are also available for integration with internal analytics pipelines.",
            },
            {
                question: "How does pricing work?",
                answer: "VISTA is priced on a per-submission basis, making it easy to budget and scale. Your first test is free so you can experience the full workflow and see the quality of results before committing. Contact our team for volume pricing and enterprise plans.",
            },
        ],
        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#666666",
        borderColor = "#eeeeee",
        fontFamily = "'Inter', sans-serif",
        paddingTop = 100,
        maxWidth = 800,
        style,
    } = props

    const [openIndex, setOpenIndex] = useState<number>(0)

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

    const toggleItem = (index: number) => {
        setOpenIndex((prev) => (prev === index ? -1 : index))
    }

    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 60px`
        : isTablet
          ? `${paddingTop}px 32px 80px`
          : `${paddingTop}px 48px 100px`

    const titleSize = isMobile ? 28 : isTablet ? 34 : 40

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
                    maxWidth,
                    margin: "0 auto",
                }}
            >
                {/* Section Title */}
                <h2
                    style={{
                        fontSize: titleSize,
                        fontWeight: 700,
                        color: textColor,
                        textAlign: "center",
                        margin: "0 0 48px",
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        fontFamily,
                    }}
                >
                    {sectionTitle}
                </h2>

                {/* Accordion Items */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {items.map((item, i) => {
                        const isOpen = openIndex === i
                        return (
                            <div
                                key={i}
                                style={{
                                    borderBottom: `1px solid ${borderColor}`,
                                }}
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleItem(i)}
                                    style={{
                                        width: "100%",
                                        padding: isMobile
                                            ? "18px 0"
                                            : "22px 0",
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
                                            fontSize: isMobile ? 16 : 18,
                                            fontWeight: 600,
                                            color: textColor,
                                            lineHeight: 1.4,
                                            fontFamily,
                                        }}
                                    >
                                        {item.question}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 22,
                                            fontWeight: 300,
                                            color: textColor,
                                            transform: isOpen
                                                ? "rotate(45deg)"
                                                : "rotate(0deg)",
                                            transition: "transform 0.3s ease",
                                            flexShrink: 0,
                                            lineHeight: 1,
                                            width: 24,
                                            height: 24,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
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
                                            "max-height 0.35s ease-in-out",
                                    }}
                                >
                                    <div
                                        style={{
                                            paddingBottom: isMobile ? 18 : 22,
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: isMobile ? 14 : 16,
                                                color: secondaryTextColor,
                                                margin: 0,
                                                lineHeight: 1.7,
                                                fontFamily,
                                            }}
                                        >
                                            {item.answer}
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

addPropertyControls(ProductFAQ, {
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "Frequently Asked Questions",
    },
    items: {
        type: ControlType.Array,
        title: "FAQ Items",
        maxCount: 20,
        control: {
            type: ControlType.Object,
            controls: {
                question: {
                    type: ControlType.String,
                    title: "Question",
                    defaultValue: "New question?",
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
                question:
                    "How is VISTA different from VMAF, PSNR, or SSIM?",
                answer: "Traditional objective metrics like VMAF, PSNR, and SSIM attempt to approximate human perception through mathematical models, but they often miss subtleties that real viewers notice. VISTA uses actual human viewers to evaluate video quality, providing ground-truth perceptual scores that reflect how your audience truly experiences your content.",
            },
            {
                question: "Who are the viewers?",
                answer: "VISTA leverages a crowd-sourced panel of trained viewers who evaluate video quality under controlled conditions. An internal panel option is also available for enterprise customers. All viewers undergo continuous validation to ensure consistent, reliable scoring across every test.",
            },
            {
                question: "How long does it take to get results?",
                answer: "Most VISTA evaluations are completed in days, not weeks. The VistaOps team manages the entire process from submission to delivery, so your engineering team can stay focused on development while results are being collected.",
            },
            {
                question: "Is VISTA only for compression testing?",
                answer: "No. While compression optimization is a common use case, VISTA can evaluate any video transformation — including scaling, frame rate conversion, HDR tone mapping, codec migration, AI-based enhancement, and more. If it changes how the video looks, VISTA can measure the perceptual impact.",
            },
            {
                question: "What does the customer get?",
                answer: "Customers receive a structured report that includes per-clip perceptual quality scores, statistical confidence intervals, side-by-side rankings of tested conditions, and actionable recommendations. Raw data exports are also available for integration with internal analytics pipelines.",
            },
            {
                question: "How does pricing work?",
                answer: "VISTA is priced on a per-submission basis, making it easy to budget and scale. Your first test is free so you can experience the full workflow and see the quality of results before committing. Contact our team for volume pricing and enterprise plans.",
            },
        ],
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
        defaultValue: "#666666",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#eeeeee",
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
        max: 300,
        step: 4,
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 800,
        min: 400,
        max: 1200,
        step: 10,
    },
})

export default ProductFAQ
