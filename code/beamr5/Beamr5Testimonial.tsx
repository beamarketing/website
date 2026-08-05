// Beamr 5 HEVC Page - Testimonial Section
// Light section: single large customer quote with attribution
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Props {
    quote: string
    author: string
    role: string
    company: string
    avatar: string
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

function Beamr5Testimonial(props: Props) {
    const {
        quote = "Not only did Beamr's encoder perform significantly faster, but it also produced superior video quality compared to other solutions including open source projects.",
        author = "Tomer Schechter",
        role = "CEO",
        company = "TAG Video Systems",
        avatar = "",
        bgColor = "#ffffff",
        cardBgColor = "#f7f8fb",
        textColor = "#0d0d0d",
        secondaryTextColor = "#5b5b66",
        accentColor = "#2f73ff",
        borderColor = "#e8eaf0",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const initials = author
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
                padding: "104px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    backgroundColor: cardBgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 28,
                    padding: "64px 56px",
                    textAlign: "center",
                }}
            >
                {/* Quote mark */}
                <div
                    style={{
                        fontSize: 64,
                        color: accentColor,
                        lineHeight: 0.6,
                        marginBottom: 24,
                        fontFamily: "Georgia, serif",
                    }}
                >
                    &ldquo;
                </div>

                <blockquote
                    style={{
                        fontSize: 26,
                        fontWeight: 500,
                        color: textColor,
                        lineHeight: 1.45,
                        letterSpacing: "-0.015em",
                        margin: "0 0 36px",
                        fontFamily: headingFont,
                    }}
                >
                    {quote}
                </blockquote>

                {/* Author */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            overflow: "hidden",
                            backgroundColor: `${accentColor}1a`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={author}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily: headingFont,
                                }}
                            >
                                {initials}
                            </span>
                        )}
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: textColor,
                                fontFamily: headingFont,
                            }}
                        >
                            {author}
                        </div>
                        <div
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                fontFamily,
                            }}
                        >
                            {role}, {company}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Beamr5Testimonial, {
    quote: {
        type: ControlType.String,
        title: "Quote",
        defaultValue:
            "Not only did Beamr's encoder perform significantly faster, but it also produced superior video quality compared to other solutions including open source projects.",
        displayTextArea: true,
    },
    author: {
        type: ControlType.String,
        title: "Author",
        defaultValue: "Tomer Schechter",
    },
    role: {
        type: ControlType.String,
        title: "Role",
        defaultValue: "CEO",
    },
    company: {
        type: ControlType.String,
        title: "Company",
        defaultValue: "TAG Video Systems",
    },
    avatar: {
        type: ControlType.Image,
        title: "Avatar",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#f7f8fb",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#0d0d0d",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#5b5b66",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#e8eaf0",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Testimonial
