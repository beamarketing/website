// Beamr - Thank You "More From" Resources Section
// Framer Code Component with full property controls
//
// Faithful port of the "More From CES" block on ces.tech/thank-you/:
//   - section header with bottom rule and a single h2
//   - 1 / 2 / 3 column grid of cards
//   - each card: image (16:9, rounded) with optional duration pill (with
//     play icon) on the bottom-left of the image, then a small type label
//     ("Podcast" / "Video" / etc.), then the title (h3), then a row of
//     topic chips pinned to the bottom of the card
//   - footer "See all content" button with a right arrow

import { addPropertyControls, ControlType } from "framer"

interface ResourceCard {
    image: string
    duration: string
    type: string
    title: string
    url: string
    topics: string
}

interface Props {
    heading: string
    resources: ResourceCard[]
    columns: number
    showFooterButton: boolean
    footerButtonText: string
    footerButtonUrl: string
    bgColor: string
    cardBgColor: string
    chipBgColor: string
    chipHoverBgColor: string
    durationBgColor: string
    textColor: string
    secondaryTextColor: string
    tertiaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    cardBorderRadius: number
    style?: React.CSSProperties
}

function PlayIcon({ color = "#ffffff" }: { color?: string }) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ marginRight: 6, flexShrink: 0 }}
        >
            <path d="M2.5 1.5L10 6L2.5 10.5V1.5Z" fill={color} />
        </svg>
    )
}

function ArrowRight({ color = "#ffffff" }: { color?: string }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ marginLeft: 8, flexShrink: 0 }}
        >
            <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function ThankYouResources(props: Props) {
    const {
        heading = "More From Beamr",
        resources = [
            {
                image: "",
                duration: "40:40",
                type: "Podcast",
                title: "A Smarter Vehicle Is a Safer Vehicle",
                url: "#",
                topics: "Vehicle Tech and Advanced Mobility",
            },
            {
                image: "",
                duration: "11:31",
                type: "Video",
                title: "Inside the C-Space Studio with Beamr Partners",
                url: "#",
                topics:
                    "Sports, Content and Entertainment, Marketing and Advertising",
            },
            {
                image: "",
                duration: "41:05",
                type: "Video",
                title: "Vehicle Payments — The Road Ahead",
                url: "#",
                topics: "Vehicle Tech and Advanced Mobility",
            },
        ],
        columns = 3,
        showFooterButton = true,
        footerButtonText = "See all content",
        footerButtonUrl = "#",
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        chipBgColor = "rgba(255,255,255,0.06)",
        chipHoverBgColor = "rgba(255,255,255,0.1)",
        durationBgColor = "rgba(0,0,0,0.55)",
        textColor = "#ffffff",
        secondaryTextColor = "#c2c2d6",
        tertiaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.08)",
        fontFamily = "'Inter', sans-serif",
        cardBorderRadius = 12,
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
                {/* Section header with bottom rule */}
                <header
                    style={{
                        marginBottom: 40,
                        paddingBottom: 24,
                        borderBottom: `1px solid ${borderColor}`,
                    }}
                >
                    <h2
                        id="MoreFromBeamr"
                        style={{
                            margin: 0,
                            fontSize: 28,
                            fontWeight: 600,
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                            color: textColor,
                            fontFamily,
                        }}
                    >
                        {heading}
                    </h2>
                </header>

                {/* Cards grid */}
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: 8,
                    }}
                >
                    {resources.map((card, i) => {
                        const topicList = (card.topics || "")
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)

                        return (
                            <li key={i} style={{ listStyle: "none" }}>
                                <a
                                    href={card.url || "#"}
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        padding: "16px 16px 24px",
                                        borderRadius: cardBorderRadius,
                                        backgroundColor: cardBgColor,
                                        color: textColor,
                                        textDecoration: "none",
                                        boxSizing: "border-box",
                                        fontFamily,
                                    }}
                                >
                                    {/* Image */}
                                    <div
                                        style={{
                                            position: "relative",
                                            marginBottom: 24,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                aspectRatio: "16 / 9",
                                                borderRadius: 8,
                                                overflow: "hidden",
                                                background: card.image
                                                    ? `url(${card.image}) center/cover no-repeat`
                                                    : `linear-gradient(135deg, #1a1b45 0%, #0f1029 100%)`,
                                            }}
                                        />
                                        {/* Duration pill (only if duration set) */}
                                        {card.duration && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    bottom: 12,
                                                    left: 12,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    minHeight: 28,
                                                    padding: "0 12px",
                                                    backgroundColor:
                                                        durationBgColor,
                                                    backdropFilter: "blur(20px)",
                                                    WebkitBackdropFilter:
                                                        "blur(20px)",
                                                    color: textColor,
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    borderRadius: 999,
                                                }}
                                            >
                                                <PlayIcon color={textColor} />
                                                <span>{card.duration}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Type label */}
                                    {card.type && (
                                        <span
                                            style={{
                                                display: "block",
                                                marginBottom: 12,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: tertiaryTextColor,
                                                fontFamily,
                                            }}
                                        >
                                            {card.type}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: 22,
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            letterSpacing: "-0.005em",
                                            color: textColor,
                                            fontFamily,
                                        }}
                                    >
                                        {card.title}
                                    </h3>

                                    {/* Topic chips, pinned to bottom */}
                                    {topicList.length > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "8px 4px",
                                                marginTop: "auto",
                                                paddingTop: 32,
                                            }}
                                        >
                                            {topicList.map((topic, j) => (
                                                <span
                                                    key={j}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        maxWidth: "100%",
                                                        height: 28,
                                                        padding: "0 12px",
                                                        backgroundColor:
                                                            chipBgColor,
                                                        color: secondaryTextColor,
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        borderRadius: 999,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        fontFamily,
                                                    }}
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </a>
                            </li>
                        )
                    })}
                </ul>

                {/* Footer button */}
                {showFooterButton && (
                    <footer style={{ marginTop: 48 }}>
                        <a
                            href={footerButtonUrl}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                minHeight: 48,
                                padding: "12px 20px",
                                backgroundColor: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: textColor,
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: 8,
                                textDecoration: "none",
                                fontFamily,
                            }}
                        >
                            <span style={{ marginRight: 4 }}>
                                {footerButtonText}
                            </span>
                            <ArrowRight color={textColor} />
                        </a>
                    </footer>
                )}
            </div>
        </section>
    )
}

addPropertyControls(ThankYouResources, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "More From Beamr",
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 3,
        min: 1,
        max: 4,
        step: 1,
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
    },
    resources: {
        type: ControlType.Array,
        title: "Cards",
        control: {
            type: ControlType.Object,
            controls: {
                image: { type: ControlType.Image, title: "Image" },
                duration: {
                    type: ControlType.String,
                    title: "Duration",
                    defaultValue: "40:40",
                },
                type: {
                    type: ControlType.String,
                    title: "Type",
                    defaultValue: "Podcast",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Card Title",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
                topics: {
                    type: ControlType.String,
                    title: "Topics",
                    defaultValue: "Topic A, Topic B",
                    description: "Comma-separated chips",
                },
            },
        },
    },
    showFooterButton: {
        type: ControlType.Boolean,
        title: "Footer Btn",
        defaultValue: true,
    },
    footerButtonText: {
        type: ControlType.String,
        title: "Btn Text",
        defaultValue: "See all content",
        hidden: (props) => !props.showFooterButton,
    },
    footerButtonUrl: {
        type: ControlType.String,
        title: "Btn URL",
        defaultValue: "#",
        hidden: (props) => !props.showFooterButton,
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
    chipBgColor: {
        type: ControlType.Color,
        title: "Chip BG",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    chipHoverBgColor: {
        type: ControlType.Color,
        title: "Chip Hover",
        defaultValue: "rgba(255,255,255,0.1)",
    },
    durationBgColor: {
        type: ControlType.Color,
        title: "Duration BG",
        defaultValue: "rgba(0,0,0,0.55)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#c2c2d6",
    },
    tertiaryTextColor: {
        type: ControlType.Color,
        title: "Tertiary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "rgba(255,255,255,0.08)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default ThankYouResources
