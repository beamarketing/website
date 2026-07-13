import { addPropertyControls, ControlType } from "framer"

interface CardItem {
    step: string
    title: string
    body: string
}

interface Props {
    eyebrow: string
    heading: string
    cards: CardItem[]
    footnote: string
    showFootnote: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASThirdOption(props: Props) {
    const {
        eyebrow = "NOW THERE’S A THIRD OPTION",
        heading = "We call it ML-Safe Encoding",
        cards = [
            {
                step: "01",
                title: "We learn your pipeline first",
                body: "Mapped end to end. Your goal, translated into numbers together, before anything is tested.",
            },
            {
                step: "02",
                title: "The tests run on your models, your data, your KPIs",
                body: "Independent evidence from your pipeline, not someone’s benchmark.",
            },
            {
                step: "03",
                title: "You get the plan",
                body: "The report and everything we built, handed over. Where the answer is “don’t compress,” the report says so.",
            },
        ],
        footnote = "No model access? Proxy models work, or your team runs the tests and shares the results. Model binaries never leave your control.",
        showFootnote = true,
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
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
                        border: `1px solid ${accentColor}30`,
                        backgroundColor: `${accentColor}08`,
                        fontSize: 12,
                        color: accentColor,
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
                    }}
                >
                    {heading}
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 24,
                        width: "100%",
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "40px 32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily,
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {card.step}
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

                {showFootnote && (
                    <p
                        style={{
                            fontSize: 14,
                            color: secondaryTextColor,
                            margin: 0,
                            maxWidth: 720,
                            lineHeight: 1.6,
                            fontFamily,
                            textAlign: "center",
                            fontStyle: "italic",
                            opacity: 0.8,
                        }}
                    >
                        {footnote}
                    </p>
                )}
            </div>
        </section>
    )
}

addPropertyControls(AVADASThirdOption, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "NOW THERE’S A THIRD OPTION",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "We call it ML-Safe Encoding",
    },
    cards: {
        type: ControlType.Array,
        title: "Cards",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                step: {
                    type: ControlType.String,
                    title: "Step",
                    defaultValue: "01",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Step title",
                },
                body: {
                    type: ControlType.String,
                    title: "Body",
                    defaultValue: "Step description",
                },
            },
        },
        defaultValue: [
            {
                step: "01",
                title: "We learn your pipeline first",
                body: "Mapped end to end. Your goal, translated into numbers together, before anything is tested.",
            },
            {
                step: "02",
                title: "The tests run on your models, your data, your KPIs",
                body: "Independent evidence from your pipeline, not someone’s benchmark.",
            },
            {
                step: "03",
                title: "You get the plan",
                body: "The report and everything we built, handed over. Where the answer is “don’t compress,” the report says so.",
            },
        ],
    },
    showFootnote: {
        type: ControlType.Boolean,
        title: "Show Footnote",
        defaultValue: true,
    },
    footnote: {
        type: ControlType.String,
        title: "Footnote",
        defaultValue: "No model access? Proxy models work, or your team runs the tests and shares the results. Model binaries never leave your control.",
        displayTextArea: true,
        hidden: (props) => !props.showFootnote,
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

export default AVADASThirdOption
