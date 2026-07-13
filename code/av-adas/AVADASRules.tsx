import { addPropertyControls, ControlType } from "framer"

interface RuleItem {
    title: string
    description: string
}

interface Props {
    heading: string
    rules: RuleItem[]
    bodyText: string
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASRules(props: Props) {
    const {
        heading = "You don't leave with a one-time answer.\nYou leave with your rules, written down.",
        rules = [
            {
                title: "Which models are covered",
                description: "Perception, depth, embeddings and more.",
            },
            {
                title: "How much compression is safe, for which data",
                description: "And where lossless is the answer.",
            },
            {
                title: "Which metrics must hold",
                description: "Your metrics, at your thresholds.",
            },
        ],
        bodyText = "A test answers today's question. Your rules keep answering it. In the report, this becomes the foundation of your compression policy.",
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
                <h2
                    style={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        fontFamily,
                        textAlign: "center",
                        whiteSpace: "pre-line",
                        maxWidth: 800,
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
                        maxWidth: 960,
                    }}
                >
                    {rules.map((rule, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "32px 24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    backgroundColor: `${accentColor}12`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 4px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 18,
                                        color: accentColor,
                                    }}
                                >
                                    ✓
                                </span>
                            </div>
                            <h3
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {rule.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontFamily,
                                }}
                            >
                                {rule.description}
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

addPropertyControls(AVADASRules, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "You don't leave with a one-time answer.\nYou leave with your rules, written down.",
        displayTextArea: true,
    },
    rules: {
        type: ControlType.Array,
        title: "Rules",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Rule title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Rule description",
                },
            },
        },
        defaultValue: [
            { title: "Which models are covered", description: "Perception, depth, embeddings and more." },
            { title: "How much compression is safe, for which data", description: "And where lossless is the answer." },
            { title: "Which metrics must hold", description: "Your metrics, at your thresholds." },
        ],
    },
    bodyText: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue: "A test answers today's question. Your rules keep answering it. In the report, this becomes the foundation of your compression policy.",
        displayTextArea: true,
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

export default AVADASRules
