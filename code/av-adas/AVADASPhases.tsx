import { addPropertyControls, ControlType } from "framer"

interface PhaseItem {
    label: string
    title: string
    description: string
}

interface Props {
    eyebrow: string
    heading: string
    phases: PhaseItem[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASPhases(props: Props) {
    const {
        eyebrow = "AN EXPERT ENGAGEMENT, NOT A POC",
        heading = "A short scoping conversation first.\nNo commitment yet.",
        phases = [
            {
                label: "Pre-Discovery",
                title: "Pre-Discovery",
                description: "A short scoping conversation. No commitment yet.",
            },
            {
                label: "Phase A",
                title: "Understand & Define",
                description: "Your pipeline mapped; goal defined in numbers.",
            },
            {
                label: "Phase B",
                title: "Design & Demonstrate",
                description: "Tests run on your data and your models.",
            },
            {
                label: "Phase C",
                title: "Recommend & Enable",
                description: "Findings, recommendation, handover.",
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
                    gap: 56,
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
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h2>

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                        position: "relative",
                    }}
                >
                    {/* Timeline line */}
                    <div
                        style={{
                            position: "absolute",
                            left: 24,
                            top: 40,
                            bottom: 40,
                            width: 2,
                            background: `linear-gradient(to bottom, ${accentColor}40, ${accentColor}10)`,
                        }}
                    />

                    {phases.map((phase, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 32,
                                padding: "24px 0",
                                position: "relative",
                            }}
                        >
                            {/* Timeline dot */}
                            <div
                                style={{
                                    width: 50,
                                    minWidth: 50,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingTop: 4,
                                }}
                            >
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        backgroundColor: i === 0 ? accentColor : "transparent",
                                        border: `2px solid ${accentColor}`,
                                        boxShadow: i === 0 ? `0 0 12px ${accentColor}40` : "none",
                                    }}
                                />
                            </div>

                            {/* Content card */}
                            <div
                                style={{
                                    flex: 1,
                                    backgroundColor: cardBgColor,
                                    borderRadius: 16,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    padding: "28px 32px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: accentColor,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase" as const,
                                        fontFamily,
                                    }}
                                >
                                    {phase.label}
                                </span>
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
                                    {phase.title}
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
                                    {phase.description}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Final outcome */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 32,
                            padding: "24px 0",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                width: 50,
                                minWidth: 50,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                paddingTop: 4,
                            }}
                        >
                            <div
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    backgroundColor: accentColor,
                                    boxShadow: `0 0 16px ${accentColor}60`,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: "8px 0",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: accentColor,
                                    margin: 0,
                                    fontFamily,
                                }}
                            >
                                The decision and the plan, yours to act on.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(AVADASPhases, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "AN EXPERT ENGAGEMENT, NOT A POC",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "A short scoping conversation first.\nNo commitment yet.",
        displayTextArea: true,
    },
    phases: {
        type: ControlType.Array,
        title: "Phases",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Phase",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Phase title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Phase description",
                },
            },
        },
        defaultValue: [
            {
                label: "Pre-Discovery",
                title: "Pre-Discovery",
                description: "A short scoping conversation. No commitment yet.",
            },
            {
                label: "Phase A",
                title: "Understand & Define",
                description: "Your pipeline mapped; goal defined in numbers.",
            },
            {
                label: "Phase B",
                title: "Design & Demonstrate",
                description: "Tests run on your data and your models.",
            },
            {
                label: "Phase C",
                title: "Recommend & Enable",
                description: "Findings, recommendation, handover.",
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

export default AVADASPhases
