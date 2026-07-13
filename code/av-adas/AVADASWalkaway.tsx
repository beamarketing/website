import { addPropertyControls, ControlType } from "framer"

interface ColumnItem {
    title: string
    items: string[]
}

interface Props {
    heading: string
    columns: ColumnItem[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASWalkaway(props: Props) {
    const {
        heading = "What you walk away with",
        columns = [
            {
                title: "Know where you stand",
                items: [
                    "A map of your pipeline end to end.",
                    "What "safe" means for you, in numbers.",
                    "Where to compress, how hard — lossy, lossless, or not at all.",
                ],
            },
            {
                title: "Tested on your data",
                items: [
                    "Compression experiments on your footage.",
                    "Model outputs compared against your KPIs.",
                    "Where models are sensitive — mitigation guidance, not just a verdict.",
                ],
            },
            {
                title: "Decide, with proof in hand",
                items: [
                    "Recommendation report with projected ROI on your numbers.",
                    "Scripts, recipes, configs, results — yours to keep.",
                    "Readout + Q&A.",
                ],
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
                    {columns.map((col, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "40px 32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                            }}
                        >
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
                                {col.title}
                            </h3>
                            <ul
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {col.items.map((item, j) => (
                                    <li
                                        key={j}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 10,
                                            fontSize: 15,
                                            color: secondaryTextColor,
                                            lineHeight: 1.6,
                                            fontFamily,
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                backgroundColor: accentColor,
                                                marginTop: 8,
                                                flexShrink: 0,
                                            }}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(AVADASWalkaway, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "What you walk away with",
    },
    columns: {
        type: ControlType.Array,
        title: "Columns",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Column title",
                },
                items: {
                    type: ControlType.Array,
                    title: "Items",
                    maxCount: 6,
                    control: {
                        type: ControlType.String,
                        defaultValue: "Item text",
                    },
                    defaultValue: ["Item 1", "Item 2", "Item 3"],
                },
            },
        },
        defaultValue: [
            {
                title: "Know where you stand",
                items: [
                    "A map of your pipeline end to end.",
                    "What "safe" means for you, in numbers.",
                    "Where to compress, how hard — lossy, lossless, or not at all.",
                ],
            },
            {
                title: "Tested on your data",
                items: [
                    "Compression experiments on your footage.",
                    "Model outputs compared against your KPIs.",
                    "Where models are sensitive — mitigation guidance, not just a verdict.",
                ],
            },
            {
                title: "Decide, with proof in hand",
                items: [
                    "Recommendation report with projected ROI on your numbers.",
                    "Scripts, recipes, configs, results — yours to keep.",
                    "Readout + Q&A.",
                ],
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

export default AVADASWalkaway
