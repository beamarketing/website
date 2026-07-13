import { addPropertyControls, ControlType } from "framer"
import { useState } from "react"

interface Deliverable {
    number: string
    title: string
    description: string
    phase: string
}

interface Props {
    heading: string
    deliverables: Deliverable[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASDeliverables(props: Props) {
    const {
        heading = "Three phases, eight deliverables",
        deliverables = [
            {
                number: "1",
                title: "Current-State Mapping",
                description: "An end-to-end map of your pipeline and data lifecycle (capture → offload → cloud → curation → training → validation → archive/delete).",
                phase: "Phase A — Understand & Define",
            },
            {
                number: "2",
                title: "Acceptance Criteria",
                description: "Your metrics at your thresholds, written down. We sharpen "don't degrade my models" into numbers. We don't invent them.",
                phase: "Phase A — Understand & Define",
            },
            {
                number: "3",
                title: "Encoding Strategy",
                description: "Where to compress and how hard (lossy, lossless, hybrid; hardware-aware), plus the experiment plan to validate it.",
                phase: "Phase A — Understand & Define",
            },
            {
                number: "4",
                title: "Encoding Experiments",
                description: "Your footage across operating points, benchmarked vs. your current codec and open-source; rate, quality, throughput, and cost on your actual cloud rates. Measured, not extrapolated.",
                phase: "Phase B — Design & Demonstrate",
            },
            {
                number: "5",
                title: "ML-Safety Analysis",
                description: "Model outputs compared (raw/lossless/original vs. compressed) against your KPIs; per-KPI results, worst cases, failure modes, and mitigation guidance — not just a verdict.",
                phase: "Phase B — Design & Demonstrate",
            },
            {
                number: "6",
                title: "Findings & Recommendation Report",
                description: "One document: the decision and the path, with projected ROI on your volumes and rates. A report you can forward.",
                phase: "Phase C — Recommend & Enable",
            },
            {
                number: "7",
                title: "Working Artifacts & Handover",
                description: "Encoding recipes, configs, conversion scripts, working points, test outputs. Yours to keep and re-run when models or data change.",
                phase: "Phase C — Recommend & Enable",
            },
            {
                number: "8",
                title: "Readout",
                description: "A live demo with your data, anticipated Q&A, and a summary ready to share inside your org.",
                phase: "Phase C — Recommend & Enable",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const phases = Array.from(new Set(deliverables.map((d) => d.phase)))
    const [activePhase, setActivePhase] = useState(phases[0])

    const filtered = deliverables.filter((d) => d.phase === activePhase)

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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    {phases.map((phase, i) => (
                        <button
                            key={i}
                            onClick={() => setActivePhase(phase)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: activePhase === phase
                                    ? `1px solid ${accentColor}`
                                    : "1px solid rgba(255,255,255,0.1)",
                                backgroundColor: activePhase === phase
                                    ? `${accentColor}15`
                                    : "rgba(255,255,255,0.04)",
                                color: activePhase === phase ? accentColor : secondaryTextColor,
                                fontSize: 14,
                                fontWeight: 600,
                                fontFamily,
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {phase}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: filtered.length > 2 ? "1fr 1fr 1fr" : "1fr 1fr",
                        gap: 24,
                        width: "100%",
                    }}
                >
                    {filtered.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "36px 28px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
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
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily,
                                }}
                            >
                                {item.number}
                            </div>
                            <h3
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.65,
                                    fontFamily,
                                }}
                            >
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(AVADASDeliverables, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Three phases, eight deliverables",
    },
    deliverables: {
        type: ControlType.Array,
        title: "Deliverables",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                number: {
                    type: ControlType.String,
                    title: "Number",
                    defaultValue: "1",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Deliverable title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Deliverable description",
                },
                phase: {
                    type: ControlType.String,
                    title: "Phase",
                    defaultValue: "Phase A — Understand & Define",
                },
            },
        },
        defaultValue: [
            { number: "1", title: "Current-State Mapping", description: "An end-to-end map of your pipeline and data lifecycle.", phase: "Phase A — Understand & Define" },
            { number: "2", title: "Acceptance Criteria", description: "Your metrics at your thresholds, written down.", phase: "Phase A — Understand & Define" },
            { number: "3", title: "Encoding Strategy", description: "Where to compress and how hard, plus the experiment plan.", phase: "Phase A — Understand & Define" },
            { number: "4", title: "Encoding Experiments", description: "Your footage benchmarked across operating points.", phase: "Phase B — Design & Demonstrate" },
            { number: "5", title: "ML-Safety Analysis", description: "Model outputs compared against your KPIs.", phase: "Phase B — Design & Demonstrate" },
            { number: "6", title: "Findings & Recommendation Report", description: "The decision and the path, with projected ROI.", phase: "Phase C — Recommend & Enable" },
            { number: "7", title: "Working Artifacts & Handover", description: "Encoding recipes, configs, scripts. Yours to keep.", phase: "Phase C — Recommend & Enable" },
            { number: "8", title: "Readout", description: "A live demo with your data and anticipated Q&A.", phase: "Phase C — Recommend & Enable" },
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

export default AVADASDeliverables
