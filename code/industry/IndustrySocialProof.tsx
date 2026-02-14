// Industry Page - Social Proof / Trust Section
// Framer Code Component with full property controls

import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface StatItem {
    value: string
    label: string
    description: string
}

interface Testimonial {
    quote: string
    author: string
    role: string
    company: string
    avatar: string
}

interface Props {
    sectionLabel: string
    heading: string
    stats: StatItem[]
    testimonials: Testimonial[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustrySocialProof(props: Props) {
    const {
        sectionLabel = "SOCIAL PROOF",
        heading = "Why industry leaders trust us",
        stats = [
            {
                value: "50%+",
                label: "Bitrate Reduction",
                description: "Average savings across all content types and codecs.",
            },
            {
                value: "200+",
                label: "Enterprise Clients",
                description: "Leading media and entertainment companies worldwide.",
            },
            {
                value: "10B+",
                label: "Videos Processed",
                description: "And counting — at scale, every single day.",
            },
        ],
        testimonials = [
            {
                quote: "Beamr's CABR technology reduced our CDN costs by 40% while our viewers reported improved streaming quality. It's been transformative for our platform.",
                author: "Sarah Chen",
                role: "VP of Engineering",
                company: "StreamCo",
                avatar: "",
            },
            {
                quote: "The integration was seamless and the results exceeded our expectations. We've processed over 2 billion videos with zero quality complaints.",
                author: "Michael Torres",
                role: "CTO",
                company: "MediaFlow",
                avatar: "",
            },
        ],
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const [activeTestimonial, setActiveTestimonial] = useState(0)
    const current = testimonials[activeTestimonial] || testimonials[0]

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

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
                <div style={{ textAlign: "center", marginBottom: 64 }}>
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
                </div>

                {/* Two-column layout */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 64,
                        alignItems: "start",
                    }}
                >
                    {/* Left: Stats */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "32px 0",
                                    borderBottom:
                                        i < stats.length - 1
                                            ? "1px solid rgba(255,255,255,0.08)"
                                            : "none",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 42,
                                        fontWeight: 700,
                                        color: accentColor,
                                        lineHeight: 1,
                                        marginBottom: 8,
                                        fontFamily,
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: textColor,
                                        marginBottom: 6,
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

                    {/* Right: Testimonial Card */}
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            borderRadius: 20,
                            padding: 40,
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: 360,
                        }}
                    >
                        {/* Quote mark */}
                        <div
                            style={{
                                fontSize: 48,
                                color: accentColor,
                                lineHeight: 1,
                                marginBottom: 16,
                                fontFamily: "Georgia, serif",
                                opacity: 0.6,
                            }}
                        >
                            &ldquo;
                        </div>

                        {/* Quote text */}
                        <p
                            style={{
                                fontSize: 17,
                                color: textColor,
                                lineHeight: 1.7,
                                margin: "0 0 32px",
                                fontFamily,
                                flex: 1,
                            }}
                        >
                            {current.quote}
                        </p>

                        {/* Author */}
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    marginBottom: 24,
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        backgroundColor: `${accentColor}20`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {current.avatar ? (
                                        <img
                                            src={current.avatar}
                                            alt={current.author}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 600,
                                                color: accentColor,
                                                fontFamily,
                                            }}
                                        >
                                            {getInitials(current.author)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: textColor,
                                            fontFamily,
                                        }}
                                    >
                                        {current.author}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        {current.role}, {current.company}
                                    </div>
                                </div>
                            </div>

                            {/* Pagination dots */}
                            {testimonials.length > 1 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                    }}
                                >
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTestimonial(i)}
                                            style={{
                                                width: i === activeTestimonial ? 24 : 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor:
                                                    i === activeTestimonial
                                                        ? accentColor
                                                        : "rgba(255,255,255,0.15)",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: 0,
                                                transition: "all 0.3s",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustrySocialProof, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "SOCIAL PROOF",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Why industry leaders trust us",
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
                    defaultValue: "50%+",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Stat Label",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Stat description.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                value: "50%+",
                label: "Bitrate Reduction",
                description: "Average savings across all content types and codecs.",
            },
            {
                value: "200+",
                label: "Enterprise Clients",
                description: "Leading media and entertainment companies worldwide.",
            },
            {
                value: "10B+",
                label: "Videos Processed",
                description: "And counting — at scale, every single day.",
            },
        ],
    },
    testimonials: {
        type: ControlType.Array,
        title: "Testimonials",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                quote: {
                    type: ControlType.String,
                    title: "Quote",
                    defaultValue: "This product transformed our workflow.",
                    displayTextArea: true,
                },
                author: {
                    type: ControlType.String,
                    title: "Author",
                    defaultValue: "John Doe",
                },
                role: {
                    type: ControlType.String,
                    title: "Role",
                    defaultValue: "VP of Engineering",
                },
                company: {
                    type: ControlType.String,
                    title: "Company",
                    defaultValue: "Company",
                },
                avatar: {
                    type: ControlType.Image,
                    title: "Avatar",
                },
            },
        },
        defaultValue: [
            {
                quote: "Beamr's CABR technology reduced our CDN costs by 40% while our viewers reported improved streaming quality. It's been transformative for our platform.",
                author: "Sarah Chen",
                role: "VP of Engineering",
                company: "StreamCo",
                avatar: "",
            },
            {
                quote: "The integration was seamless and the results exceeded our expectations. We've processed over 2 billion videos with zero quality complaints.",
                author: "Michael Torres",
                role: "CTO",
                company: "MediaFlow",
                avatar: "",
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
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustrySocialProof
