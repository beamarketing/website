import { addPropertyControls, ControlType } from "framer"

interface Props {
    eyebrow: string
    heading: string
    card1Title: string
    card1Body: string
    card1Icon: string
    card2Title: string
    card2Body: string
    card2Icon: string
    bodyText: string
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    dangerColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASProblem(props: Props) {
    const {
        eyebrow = "THE PROBLEM",
        heading = "At petabyte scale, your video data\ngoes one of two ways",
        card1Title = "Delete data you may need",
        card1Body = "Affordable, but irreversible. The footage you drop today is the edge case you needed next quarter.",
        card1Icon = "✖",
        card2Title = "Keep everything in raw/lossless",
        card2Body = "Safe for your models, but unaffordable at scale.",
        card2Icon = "⚠",
        bodyText = "Compressing without a framework looks like the middle path — until video that “looks clean” quietly changes what a model detects. Most teams choose neither, and pay for both. Until now, those were the options.",
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        dangerColor = "#ff4d6a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const cards = [
        { title: card1Title, body: card1Body, icon: card1Icon, color: dangerColor },
        { title: card2Title, body: card2Body, icon: card2Icon, color: "#f59e0b" },
    ]

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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 48,
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        borderRadius: 100,
                        border: `1px solid ${dangerColor}30`,
                        backgroundColor: `${dangerColor}08`,
                        fontSize: 12,
                        color: dangerColor,
                        fontFamily,
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                        textTransform: "uppercase" as const,
                    }}
                >
                    {eyebrow}
                </div>

                <h2
                    style={{
                        fontSize: 44,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        fontFamily,
                        textAlign: "center",
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                        width: "100%",
                        maxWidth: 900,
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 20,
                                border: `1px solid ${card.color}20`,
                                padding: "40px 32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: `${card.color}12`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    color: card.color,
                                }}
                            >
                                {card.icon}
                            </div>
                            <h3
                                style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {card.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 15,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontFamily,
                                }}
                            >
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>

                <p
                    style={{
                        fontSize: 17,
                        color: secondaryTextColor,
                        margin: 0,
                        maxWidth: 720,
                        lineHeight: 1.7,
                        fontFamily,
                        textAlign: "center",
                    }}
                >
                    {bodyText}
                </p>
            </div>
        </section>
    )
}

addPropertyControls(AVADASProblem, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "THE PROBLEM",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "At petabyte scale, your video data\ngoes one of two ways",
        displayTextArea: true,
    },
    card1Title: {
        type: ControlType.String,
        title: "Card 1 Title",
        defaultValue: "Delete data you may need",
    },
    card1Body: {
        type: ControlType.String,
        title: "Card 1 Body",
        defaultValue: "Affordable, but irreversible. The footage you drop today is the edge case you needed next quarter.",
        displayTextArea: true,
    },
    card1Icon: {
        type: ControlType.String,
        title: "Card 1 Icon",
        defaultValue: "✖",
    },
    card2Title: {
        type: ControlType.String,
        title: "Card 2 Title",
        defaultValue: "Keep everything in raw/lossless",
    },
    card2Body: {
        type: ControlType.String,
        title: "Card 2 Body",
        defaultValue: "Safe for your models, but unaffordable at scale.",
        displayTextArea: true,
    },
    card2Icon: {
        type: ControlType.String,
        title: "Card 2 Icon",
        defaultValue: "⚠",
    },
    bodyText: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue: "Compressing without a framework looks like the middle path — until video that “looks clean” quietly changes what a model detects. Most teams choose neither, and pay for both. Until now, those were the options.",
        displayTextArea: true,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
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
    dangerColor: {
        type: ControlType.Color,
        title: "Danger Color",
        defaultValue: "#ff4d6a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default AVADASProblem
