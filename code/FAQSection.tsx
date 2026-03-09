// Beamr Homepage - FAQ Section
// Framer Code Component with full property controls
// Accordion with plus/minus toggle, responsive, editable typography

import { addPropertyControls, ControlType } from "framer"
import React, { useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface FAQItem {
    question: string
    answer: string
}

interface Props {
    // Section
    sectionBgColor: string
    sectionPaddingDesktop: number
    sectionPaddingMobile: number
    maxContentWidth: number

    // Heading
    heading: string
    headingFontSize: number
    headingMobileFontSize: number
    headingFontFamily: string
    headingFontWeight: number
    headingLineHeight: number
    headingMobileLineHeight: number
    headingColor: string

    // FAQ items
    faqs: FAQItem[]
    allowMultipleOpen: boolean

    // Question typography
    questionFontSize: number
    questionMobileFontSize: number
    questionFontFamily: string
    questionFontWeight: number
    questionLineHeight: number
    questionColor: string

    // Answer typography
    answerFontSize: number
    answerMobileFontSize: number
    answerFontFamily: string
    answerFontWeight: number
    answerLineHeight: number
    answerColor: string

    // Accordion styling
    itemPaddingVertical: number
    itemPaddingHorizontal: number
    dividerColor: string
    iconColor: string
    iconSize: number

    // Spacing
    headerBottomGap: number

    // Breakpoint
    mobileBreakpoint: number

    style?: React.CSSProperties
}

// ─── Component ───────────────────────────────────────────────────────────────

function FAQSection(props: Props) {
    const {
        // Section
        sectionBgColor = "#F3F5FF",
        sectionPaddingDesktop = 96,
        sectionPaddingMobile = 48,
        maxContentWidth = 740,

        // Heading
        heading = "Frequently Asked Questions",
        headingFontSize = 36,
        headingMobileFontSize = 28,
        headingFontFamily = "Poppins, sans-serif",
        headingFontWeight = 500,
        headingLineHeight = 44,
        headingMobileLineHeight = 36,
        headingColor = "#171717",

        // FAQ items
        faqs = [
            {
                question:
                    "How does Beamr compare to other video compression solutions?",
                answer: "Beamr's patented CABR technology delivers up to 50% bitrate reduction while maintaining mathematically proven quality. Unlike traditional encoders, Beamr verifies every frame against the original.",
            },
            {
                question: "What video formats and codecs are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, AV1, and VP9. It works with standard container formats like MP4, MKV, and TS, at resolutions up to 8K.",
            },
            {
                question: "How long does integration take?",
                answer: "Most customers are up and running within days. Beamr provides drop-in compatibility with major encoding pipelines, CDNs, and cloud platforms.",
            },
            {
                question: "What kind of cost savings can I expect?",
                answer: "Typical customers see 30-50% reduction in CDN bandwidth costs and 20-40% storage savings. The exact savings depend on your content type, current encoding settings, and delivery infrastructure.",
            },
        ],
        allowMultipleOpen = false,

        // Question typography
        questionFontSize = 18,
        questionMobileFontSize = 16,
        questionFontFamily = "Inter, sans-serif",
        questionFontWeight = 500,
        questionLineHeight = 28,
        questionColor = "#171717",

        // Answer typography
        answerFontSize = 16,
        answerMobileFontSize = 14,
        answerFontFamily = "Inter, sans-serif",
        answerFontWeight = 400,
        answerLineHeight = 26,
        answerColor = "#666666",

        // Accordion styling
        itemPaddingVertical = 24,
        itemPaddingHorizontal = 16,
        dividerColor = "#E5E5E5",
        iconColor = "#666666",
        iconSize = 24,

        // Spacing
        headerBottomGap = 60,

        // Breakpoint
        mobileBreakpoint = 768,

        style,
    } = props

    // ─── Responsive detection ────────────────────────
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(1200)

    React.useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const isMobile = containerWidth < mobileBreakpoint
    const padding = isMobile ? sectionPaddingMobile : sectionPaddingDesktop
    const hPadding = isMobile ? 20 : 40

    // ─── Accordion state ─────────────────────────────
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

    // ─── Plus/Minus icon ─────────────────────────────
    const PlusMinusIcon = ({ isOpen }: { isOpen: boolean }) => (
        <div
            style={{
                width: iconSize,
                height: iconSize,
                position: "relative",
                flexShrink: 0,
            }}
        >
            {/* Horizontal bar (always visible) */}
            <div
                style={{
                    position: "absolute",
                    width: iconSize * 0.667,
                    height: 2,
                    left: iconSize * 0.167,
                    top: iconSize / 2 - 1,
                    backgroundColor: iconColor,
                    transition: "opacity 0.2s",
                }}
            />
            {/* Vertical bar (hidden when open) */}
            <div
                style={{
                    position: "absolute",
                    width: 2,
                    height: iconSize * 0.667,
                    left: iconSize / 2 - 1,
                    top: iconSize * 0.167,
                    backgroundColor: iconColor,
                    transition: "transform 0.2s, opacity 0.2s",
                    transform: isOpen ? "scaleY(0)" : "scaleY(1)",
                    opacity: isOpen ? 0 : 1,
                }}
            />
        </div>
    )

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: sectionBgColor,
                paddingLeft: hPadding,
                paddingRight: hPadding,
                paddingTop: padding,
                paddingBottom: padding,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    maxWidth: maxContentWidth,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: headerBottomGap,
                }}
            >
                {/* ─── Header ─────────────────────────────────── */}
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <h2
                        style={{
                            fontSize: isMobile
                                ? headingMobileFontSize
                                : headingFontSize,
                            fontFamily: headingFontFamily,
                            fontWeight: headingFontWeight,
                            lineHeight: `${isMobile ? headingMobileLineHeight : headingLineHeight}px`,
                            color: headingColor,
                            margin: 0,
                        }}
                    >
                        {heading}
                    </h2>
                </div>

                {/* ─── Accordion ──────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {faqs.map((faq, i) => {
                        const isOpen = openIndexes.has(i)
                        const isFirst = i === 0
                        return (
                            <div
                                key={i}
                                style={{
                                    borderTop: isFirst
                                        ? "none"
                                        : `1px solid ${dividerColor}`,
                                }}
                            >
                                {/* Question row */}
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: "100%",
                                        paddingTop: itemPaddingVertical,
                                        paddingBottom: itemPaddingVertical,
                                        paddingLeft: itemPaddingHorizontal,
                                        paddingRight: itemPaddingHorizontal + 14,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 16,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: isMobile
                                                ? questionMobileFontSize
                                                : questionFontSize,
                                            fontFamily: questionFontFamily,
                                            fontWeight: questionFontWeight,
                                            lineHeight: `${questionLineHeight}px`,
                                            color: questionColor,
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                    <PlusMinusIcon isOpen={isOpen} />
                                </button>

                                {/* Answer (collapsible) */}
                                <div
                                    style={{
                                        maxHeight: isOpen ? 1000 : 0,
                                        overflow: "hidden",
                                        transition:
                                            "max-height 0.3s ease-in-out",
                                    }}
                                >
                                    <div
                                        style={{
                                            paddingLeft:
                                                itemPaddingHorizontal,
                                            paddingRight:
                                                itemPaddingHorizontal + 14,
                                            paddingBottom:
                                                itemPaddingVertical,
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: isMobile
                                                    ? answerMobileFontSize
                                                    : answerFontSize,
                                                fontFamily: answerFontFamily,
                                                fontWeight: answerFontWeight,
                                                lineHeight: `${answerLineHeight}px`,
                                                color: answerColor,
                                                margin: 0,
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
        </div>
    )
}

// ─── Property Controls ───────────────────────────────────────────────────────

addPropertyControls(FAQSection, {
    // Section
    sectionBgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F3F5FF",
    },
    sectionPaddingDesktop: {
        type: ControlType.Number,
        title: "Padding (Desktop)",
        defaultValue: 96,
        min: 0,
        max: 200,
        step: 4,
    },
    sectionPaddingMobile: {
        type: ControlType.Number,
        title: "Padding (Mobile)",
        defaultValue: 48,
        min: 0,
        max: 120,
        step: 4,
    },
    maxContentWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 740,
        min: 400,
        max: 1200,
        step: 10,
    },
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile Breakpoint",
        defaultValue: 768,
        min: 320,
        max: 1200,
        step: 1,
    },

    // Heading
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Frequently Asked Questions",
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 36,
        min: 16,
        max: 72,
        step: 1,
    },
    headingMobileFontSize: {
        type: ControlType.Number,
        title: "Heading Size (M)",
        defaultValue: 28,
        min: 16,
        max: 48,
        step: 1,
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "Poppins, sans-serif",
    },
    headingFontWeight: {
        type: ControlType.Enum,
        title: "Heading Weight",
        options: [300, 400, 500, 600, 700],
        optionTitles: ["Light", "Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    headingLineHeight: {
        type: ControlType.Number,
        title: "Heading Line Ht",
        defaultValue: 44,
        min: 16,
        max: 100,
        step: 1,
    },
    headingMobileLineHeight: {
        type: ControlType.Number,
        title: "Heading Line Ht (M)",
        defaultValue: 36,
        min: 16,
        max: 80,
        step: 1,
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#171717",
    },

    // FAQ Items
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
                    "How does Beamr compare to other video compression solutions?",
                answer: "Beamr's patented CABR technology delivers up to 50% bitrate reduction while maintaining mathematically proven quality. Unlike traditional encoders, Beamr verifies every frame against the original.",
            },
            {
                question: "What video formats and codecs are supported?",
                answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, AV1, and VP9. It works with standard container formats like MP4, MKV, and TS, at resolutions up to 8K.",
            },
            {
                question: "How long does integration take?",
                answer: "Most customers are up and running within days. Beamr provides drop-in compatibility with major encoding pipelines, CDNs, and cloud platforms.",
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

    // Question typography
    questionFontSize: {
        type: ControlType.Number,
        title: "Question Size",
        defaultValue: 18,
        min: 12,
        max: 28,
        step: 1,
    },
    questionMobileFontSize: {
        type: ControlType.Number,
        title: "Question Size (M)",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
    },
    questionFontFamily: {
        type: ControlType.String,
        title: "Question Font",
        defaultValue: "Inter, sans-serif",
    },
    questionFontWeight: {
        type: ControlType.Enum,
        title: "Question Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    questionLineHeight: {
        type: ControlType.Number,
        title: "Question Line Ht",
        defaultValue: 28,
        min: 16,
        max: 48,
        step: 1,
    },
    questionColor: {
        type: ControlType.Color,
        title: "Question Color",
        defaultValue: "#171717",
    },

    // Answer typography
    answerFontSize: {
        type: ControlType.Number,
        title: "Answer Size",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
    },
    answerMobileFontSize: {
        type: ControlType.Number,
        title: "Answer Size (M)",
        defaultValue: 14,
        min: 12,
        max: 20,
        step: 1,
    },
    answerFontFamily: {
        type: ControlType.String,
        title: "Answer Font",
        defaultValue: "Inter, sans-serif",
    },
    answerFontWeight: {
        type: ControlType.Enum,
        title: "Answer Weight",
        options: [300, 400, 500, 600],
        optionTitles: ["Light", "Regular", "Medium", "SemiBold"],
        defaultValue: 400,
    },
    answerLineHeight: {
        type: ControlType.Number,
        title: "Answer Line Ht",
        defaultValue: 26,
        min: 16,
        max: 40,
        step: 1,
    },
    answerColor: {
        type: ControlType.Color,
        title: "Answer Color",
        defaultValue: "#666666",
    },

    // Accordion styling
    itemPaddingVertical: {
        type: ControlType.Number,
        title: "Item Pad V",
        defaultValue: 24,
        min: 8,
        max: 48,
        step: 2,
    },
    itemPaddingHorizontal: {
        type: ControlType.Number,
        title: "Item Pad H",
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 2,
    },
    dividerColor: {
        type: ControlType.Color,
        title: "Divider Color",
        defaultValue: "#E5E5E5",
    },
    iconColor: {
        type: ControlType.Color,
        title: "Icon Color",
        defaultValue: "#666666",
    },
    iconSize: {
        type: ControlType.Number,
        title: "Icon Size",
        defaultValue: 24,
        min: 16,
        max: 40,
        step: 2,
    },
    headerBottomGap: {
        type: ControlType.Number,
        title: "Header Gap",
        defaultValue: 60,
        min: 16,
        max: 120,
        step: 4,
    },
})

export default FAQSection
