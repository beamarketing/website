// Beamr Homepage - Why Industry Leaders Trust Us
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Award {
    image: string
    name: string
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
    subheading: string
    awards: Award[]
    testimonials: Testimonial[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    showAwards: boolean
    style?: React.CSSProperties
}

function TrustSection(props: Props) {
    const {
        sectionLabel = "RECOGNITION",
        heading = "Why Industry Leaders Trust Us",
        subheading = "Award-winning technology trusted by the world's leading media companies.",
        awards = [
            { image: "", name: "Emmy Award" },
            { image: "", name: "NAB Show" },
            { image: "", name: "Streaming Media" },
            { image: "", name: "CSI Award" },
        ],
        testimonials = [
            {
                quote: "Beamr's CABR technology has reduced our CDN costs by 42% while maintaining the visual quality our viewers expect. It's been a game-changer for our streaming infrastructure.",
                author: "Sarah Chen",
                role: "VP of Engineering",
                company: "Major Streaming Platform",
                avatar: "",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        showAwards = true,
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
            <div
                style={{
                    maxWidth: 1280,
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

                {/* Awards */}
                {showAwards && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 40,
                            marginBottom: 56,
                            flexWrap: "wrap",
                        }}
                    >
                        {awards.map((award, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "20px 32px",
                                    backgroundColor: cardBgColor,
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {award.image ? (
                                    <img
                                        src={award.image}
                                        alt={award.name}
                                        style={{
                                            height: 48,
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 8,
                                            backgroundColor: `${accentColor}15`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 24,
                                        }}
                                    >
                                        🏆
                                    </div>
                                )}
                                <span
                                    style={{
                                        fontSize: 13,
                                        color: secondaryTextColor,
                                        fontFamily,
                                        fontWeight: 500,
                                    }}
                                >
                                    {award.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Testimonials */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                border: "1px solid rgba(255,255,255,0.06)",
                                padding: "40px 48px",
                                maxWidth: 800,
                                margin: "0 auto",
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            {/* Quote mark */}
                            <div
                                style={{
                                    fontSize: 48,
                                    color: accentColor,
                                    lineHeight: 1,
                                    marginBottom: 16,
                                    opacity: 0.5,
                                }}
                            >
                                &ldquo;
                            </div>

                            <p
                                style={{
                                    fontSize: 18,
                                    color: textColor,
                                    lineHeight: 1.7,
                                    margin: "0 0 24px",
                                    fontFamily,
                                    fontStyle: "italic",
                                    opacity: 0.9,
                                }}
                            >
                                {testimonial.quote}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        backgroundColor: `${accentColor}20`,
                                        flexShrink: 0,
                                    }}
                                >
                                    {testimonial.avatar ? (
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
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
                                                fontSize: 20,
                                                color: accentColor,
                                                fontWeight: 600,
                                                fontFamily,
                                            }}
                                        >
                                            {testimonial.author
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
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
                                        {testimonial.author}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        {testimonial.role}, {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(TrustSection, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "RECOGNITION",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Why Industry Leaders Trust Us",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Award-winning technology trusted by the world's leading media companies.",
        displayTextArea: true,
    },
    showAwards: {
        type: ControlType.Boolean,
        title: "Show Awards",
        defaultValue: true,
    },
    awards: {
        type: ControlType.Array,
        title: "Awards",
        maxCount: 8,
        hidden: (props) => !props.showAwards,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Award Name",
                    defaultValue: "Award",
                },
                image: {
                    type: ControlType.Image,
                    title: "Award Image",
                },
            },
        },
        defaultValue: [
            { name: "Emmy Award", image: "" },
            { name: "NAB Show", image: "" },
            { name: "Streaming Media", image: "" },
            { name: "CSI Award", image: "" },
        ],
    },
    testimonials: {
        type: ControlType.Array,
        title: "Testimonials",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                quote: {
                    type: ControlType.String,
                    title: "Quote",
                    defaultValue: "This is a testimonial quote.",
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
                    defaultValue: "Company Name",
                },
                avatar: {
                    type: ControlType.Image,
                    title: "Avatar",
                },
            },
        },
        defaultValue: [
            {
                quote: "Beamr's CABR technology has reduced our CDN costs by 42% while maintaining the visual quality our viewers expect. It's been a game-changer for our streaming infrastructure.",
                author: "Sarah Chen",
                role: "VP of Engineering",
                company: "Major Streaming Platform",
                avatar: "",
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

export default TrustSection
