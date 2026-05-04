// Beamr Developer Hub - OEM / Automotive Section
// Framer Code Component with full property controls.
// Mirrors the standalone developers.html page for embedding inside Framer pages.

import { addPropertyControls, ControlType } from "framer"

interface VPStat {
    value: string
    unit: string
    headline: string
    description: string
}

interface KPI {
    title: string
    description: string
    meta: string
}

interface Scenario {
    tag: string
    title: string
    description: string
    result: string
}

interface Guarantee {
    zero: string
    title: string
    description: string
}

interface BenchRow {
    name: string
    description: string
    category: string
    bitrateSaved: string
    perceptionDelta: string
    latencyDelta: string
    verdict: string
}

interface Props {
    eyebrow: string
    heading: string
    subheading: string

    showValueProp: boolean
    valuePropTitle: string
    valuePropStats: VPStat[]
    valuePropTags: string[]

    showKPIs: boolean
    kpiTitle: string
    kpis: KPI[]

    showScenarios: boolean
    scenariosTitle: string
    scenarios: Scenario[]

    showGuarantees: boolean
    guaranteesTitle: string
    guarantees: Guarantee[]

    showBenchmarks: boolean
    benchmarksTitle: string
    benchmarks: BenchRow[]

    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    accentGreen: string
    borderColor: string
    fontFamily: string

    style?: React.CSSProperties
}

const defaultStats: VPStat[] = [
    {
        value: "40",
        unit: "%+",
        headline: "Storage & bandwidth saved",
        description:
            "Achieved through Beamr H.265 content-adaptive optimization on representative automotive footage at production bitrates.",
    },
    {
        value: "≈0",
        unit: "",
        headline: "Accuracy delta",
        description:
            "Near-zero difference between original and compressed streams using perception accuracy as the primary reference point.",
    },
    {
        value: "100",
        unit: "%",
        headline: "Downstream parity",
        description:
            "No additional false positives, no false negatives, no detection or reaction delays, and no behavioral divergence.",
    },
]

const defaultKPIs: KPI[] = [
    {
        title: "Per-frame integrity",
        description:
            "Every frame is scored independently. Frames that exceed the perceptual threshold are flagged.",
        meta: "Reference: original sensor stream",
    },
    {
        title: "Edge & feature preservation",
        description:
            "Edge maps, gradient histograms and ML keypoint stability between source and compressed.",
        meta: "Edge IoU · Keypoint match rate",
    },
    {
        title: "Optical flow & temporal consistency",
        description:
            "End-point error of dense optical flow between consecutive frames; coherence across windows.",
        meta: "EPE · Flow drift",
    },
    {
        title: "Object, lane & sign detection",
        description:
            "mAP / IoU on cars, pedestrians, cyclists, lanes and traffic signs on original vs. compressed.",
        meta: "mAP · IoU@0.5 · F1",
    },
    {
        title: "Reasoning & tracking stability",
        description:
            "MOTA/IDF1 for multi-object tracking; trajectory-prediction stability over long windows.",
        meta: "MOTA · IDF1 · ID switches",
    },
    {
        title: "Behavioral parity downstream",
        description:
            "Maneuver-planning, brake and steering deltas vs. the reference pipeline must be sensor-noise level.",
        meta: "Δ-trajectory · Δ-control",
    },
]

const defaultScenarios: Scenario[] = [
    {
        tag: "Low light / night",
        title: "Low-light & night driving",
        description:
            "High-ISO sensor noise and tail-light glare. Beamr preserves sub-pixel edges that small-object detectors depend on at distance.",
        result: "0 added missed detections at ≤ 80 lux",
    },
    {
        tag: "Adverse weather",
        title: "Rain, fog & glare",
        description:
            "Validated on rainy windshield, dense fog and direct-sun glare. Edge and contrast preservation tuned so segmentation masks remain stable.",
        result: "≤ 0.4% mIoU delta",
    },
    {
        tag: "Long range",
        title: "Long-range detection",
        description:
            "Pedestrians and signs at 80–150m occupy very few pixels. The encoder allocates bits to those regions, not to sky or road texture.",
        result: "0 recall loss for objects > 25px",
    },
    {
        tag: "High dynamic motion",
        title: "High-speed & camera motion",
        description:
            "Highway speeds, sharp steering and pitch motion. Optical-flow EPE remains within sensor-noise bounds.",
        result: "< 0.1 px mean EPE delta",
    },
    {
        tag: "Critical maneuver",
        title: "Emergency braking",
        description:
            "AEB-relevant cut-in and lead-vehicle decel. Detection latency on compressed feeds matches the reference within frame-time resolution.",
        result: "0 ms added time-to-detect",
    },
    {
        tag: "Critical maneuver",
        title: "Lane-change & merge",
        description:
            "Multi-agent tracking through occlusion. ID-switch rate matches the uncompressed baseline; planner output is unchanged.",
        result: "0 behavioral divergence in planner",
    },
]

const defaultGuarantees: Guarantee[] = [
    {
        zero: "0",
        title: "Added false positives",
        description:
            "No new objects, signs or hazards hallucinated by detection models on compressed input.",
    },
    {
        zero: "0",
        title: "Added false negatives",
        description: "No object, lane or sign recall loss vs. uncompressed reference.",
    },
    {
        zero: "0 ms",
        title: "Detection / reaction delay",
        description:
            "Time-to-detect and time-to-react remain within the reference frame interval.",
    },
    {
        zero: "0",
        title: "Behavioral divergence",
        description:
            "No deviation in maneuver-planning or control outputs between compressed and reference pipelines.",
    },
]

const defaultBenchmarks: BenchRow[] = [
    {
        name: "NVIDIA Cosmos Curate",
        description: "AI training corpus · multi-camera driving",
        category: "Autonomous Driving",
        bitrateSaved: "42% saved",
        perceptionDelta: "< 0.3% mAP",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
    {
        name: "nuScenes",
        description: "Multi-modal AV dataset",
        category: "Autonomous Driving",
        bitrateSaved: "45% saved",
        perceptionDelta: "< 0.5% mAP",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
    {
        name: "Waymo Open Perception",
        description: "Object detection & tracking",
        category: "Autonomous Driving",
        bitrateSaved: "40% saved",
        perceptionDelta: "< 0.4% mAP",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
    {
        name: "BDD100K",
        description: "Lane & drivable-area segmentation",
        category: "ADAS",
        bitrateSaved: "43% saved",
        perceptionDelta: "< 0.4% mIoU",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
    {
        name: "Cityscapes",
        description: "Semantic segmentation",
        category: "ADAS",
        bitrateSaved: "41% saved",
        perceptionDelta: "< 0.3% mIoU",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
    {
        name: "KITTI",
        description: "Detection, flow, depth",
        category: "Autonomous Driving",
        bitrateSaved: "44% saved",
        perceptionDelta: "< 0.3% AP",
        latencyDelta: "0 ms",
        verdict: "Pass",
    },
]

function DeveloperHub(props: Props) {
    const {
        eyebrow = "Developer Hub · Automotive AI",
        heading = "Perception-safe video compression for automotive AI pipelines.",
        subheading = "40%+ storage and bandwidth savings with near-zero accuracy delta. Validated on driving datasets, NVIDIA Cosmos Curate, and OEM safety scenarios.",

        showValueProp = true,
        valuePropTitle = "One-slide summary for OEM stakeholders.",
        valuePropStats = defaultStats,
        valuePropTags = [
            "NVIDIA Cosmos Curate compatible",
            "H.265 / HEVC",
            "Perception-first quality",
            "ASIL-relevant scenarios",
            "Lossless re-encode for AI training",
            "SDK + GPU pipeline",
        ],

        showKPIs = true,
        kpiTitle = "Perception-critical KPIs — not generic video metrics.",
        kpis = defaultKPIs,

        showScenarios = true,
        scenariosTitle = "Robustness across scenarios OEMs scrutinize.",
        scenarios = defaultScenarios,

        showGuarantees = true,
        guaranteesTitle = "What Beamr promises to your downstream stack.",
        guarantees = defaultGuarantees,

        showBenchmarks = true,
        benchmarksTitle = "Quantitative results on automotive datasets.",
        benchmarks = defaultBenchmarks,

        bgColor = "#ffffff",
        cardBgColor = "#f9fafb",
        textColor = "#111827",
        secondaryTextColor = "#6b7280",
        accentColor = "#4F46E5",
        accentGreen = "#10b981",
        borderColor = "#e5e7eb",
        fontFamily = "'Inter', sans-serif",

        style,
    } = props

    return (
        <section
            style={{
                background: bgColor,
                color: textColor,
                fontFamily,
                padding: "96px 32px",
                width: "100%",
                ...style,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ maxWidth: 760, marginBottom: 56 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: accentColor,
                            background: `${accentColor}14`,
                            padding: "6px 12px",
                            borderRadius: 100,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 18,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: accentColor,
                            }}
                        />
                        {eyebrow}
                    </div>
                    <h2
                        style={{
                            fontSize: 44,
                            fontWeight: 800,
                            letterSpacing: "-0.025em",
                            lineHeight: 1.1,
                            margin: 0,
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            lineHeight: 1.65,
                            marginTop: 16,
                            maxWidth: 640,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Value Proposition */}
                {showValueProp && (
                    <div
                        style={{
                            background: "linear-gradient(180deg,#fff 0%,#fafbff 100%)",
                            border: `1px solid ${borderColor}`,
                            borderRadius: 24,
                            padding: "48px 40px",
                            boxShadow: "0 24px 64px rgba(15,17,23,0.06)",
                            position: "relative",
                            overflow: "hidden",
                            marginBottom: 80,
                        }}
                    >
                        <h3
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                marginBottom: 28,
                                letterSpacing: "-0.015em",
                            }}
                        >
                            {valuePropTitle}
                        </h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3,1fr)",
                                gap: 32,
                            }}
                        >
                            {valuePropStats.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        borderLeft: `3px solid ${accentColor}`,
                                        paddingLeft: 20,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 52,
                                            fontWeight: 800,
                                            letterSpacing: "-0.035em",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {s.value}
                                        <span
                                            style={{
                                                color: accentColor,
                                                fontSize: 34,
                                            }}
                                        >
                                            {s.unit}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            marginTop: 14,
                                        }}
                                    >
                                        {s.headline}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            marginTop: 6,
                                            lineHeight: 1.55,
                                        }}
                                    >
                                        {s.description}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {valuePropTags && valuePropTags.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 10,
                                    marginTop: 32,
                                    paddingTop: 24,
                                    borderTop: `1px dashed ${borderColor}`,
                                }}
                            >
                                {valuePropTags.map((t, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: textColor,
                                            background: "#fff",
                                            border: `1px solid ${borderColor}`,
                                            borderRadius: 100,
                                            padding: "6px 14px",
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* KPI Grid */}
                {showKPIs && (
                    <div style={{ marginBottom: 80 }}>
                        <h3
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                marginBottom: 28,
                            }}
                        >
                            {kpiTitle}
                        </h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3,1fr)",
                                gap: 16,
                            }}
                        >
                            {kpis.map((k, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "#fff",
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: 16,
                                        padding: "28px 24px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 700,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {k.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {k.description}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: accentColor,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                            marginTop: 16,
                                        }}
                                    >
                                        {k.meta}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Scenarios */}
                {showScenarios && (
                    <div style={{ marginBottom: 80 }}>
                        <h3
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                marginBottom: 28,
                            }}
                        >
                            {scenariosTitle}
                        </h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3,1fr)",
                                gap: 16,
                            }}
                        >
                            {scenarios.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: cardBgColor,
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: 16,
                                        padding: "28px 24px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: accentGreen,
                                            background: `${accentGreen}1A`,
                                            padding: "4px 10px",
                                            borderRadius: 100,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            display: "inline-block",
                                            marginBottom: 14,
                                        }}
                                    >
                                        {s.tag}
                                    </span>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {s.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {s.description}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 16,
                                            paddingTop: 14,
                                            borderTop: `1px solid ${borderColor}`,
                                            fontSize: 13,
                                            color: textColor,
                                        }}
                                    >
                                        <strong style={{ color: accentGreen }}>✓</strong>{" "}
                                        {s.result}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guarantees */}
                {showGuarantees && (
                    <div style={{ marginBottom: 80 }}>
                        <h3
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                marginBottom: 28,
                            }}
                        >
                            {guaranteesTitle}
                        </h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4,1fr)",
                                gap: 16,
                            }}
                        >
                            {guarantees.map((g, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: cardBgColor,
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: 16,
                                        padding: "28px 24px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 32,
                                            fontWeight: 800,
                                            color: accentGreen,
                                            letterSpacing: "-0.02em",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {g.zero}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 700,
                                            marginTop: 12,
                                        }}
                                    >
                                        {g.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: secondaryTextColor,
                                            marginTop: 8,
                                            lineHeight: 1.55,
                                        }}
                                    >
                                        {g.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benchmarks */}
                {showBenchmarks && (
                    <div>
                        <h3
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                marginBottom: 28,
                            }}
                        >
                            {benchmarksTitle}
                        </h3>
                        <div
                            style={{
                                border: `1px solid ${borderColor}`,
                                borderRadius: 16,
                                overflow: "hidden",
                                background: "#fff",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: 14,
                                }}
                            >
                                <thead>
                                    <tr style={{ background: cardBgColor }}>
                                        {[
                                            "Dataset / Suite",
                                            "Domain",
                                            "Bitrate Saved",
                                            "Perception Δ",
                                            "Latency Δ",
                                            "Verdict",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "16px 20px",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: secondaryTextColor,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em",
                                                    borderBottom: `1px solid ${borderColor}`,
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {benchmarks.map((b, i) => (
                                        <tr key={i}>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        color: textColor,
                                                    }}
                                                >
                                                    {b.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: secondaryTextColor,
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {b.description}
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    color: secondaryTextColor,
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                {b.category}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background: `${accentColor}1A`,
                                                        color: accentColor,
                                                        padding: "4px 10px",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    {b.bitrateSaved}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background: `${accentGreen}1A`,
                                                        color: "#047857",
                                                        padding: "4px 10px",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    {b.perceptionDelta}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background: `${accentGreen}1A`,
                                                        color: "#047857",
                                                        padding: "4px 10px",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    {b.latencyDelta}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom:
                                                        i === benchmarks.length - 1
                                                            ? "none"
                                                            : `1px solid ${borderColor}`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background: `${accentGreen}1A`,
                                                        color: "#047857",
                                                        padding: "4px 10px",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    {b.verdict}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(DeveloperHub, {
    eyebrow: { type: ControlType.String, defaultValue: "Developer Hub · Automotive AI" },
    heading: {
        type: ControlType.String,
        defaultValue:
            "Perception-safe video compression for automotive AI pipelines.",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        defaultValue:
            "40%+ storage and bandwidth savings with near-zero accuracy delta.",
        displayTextArea: true,
    },

    showValueProp: { type: ControlType.Boolean, defaultValue: true },
    valuePropTitle: {
        type: ControlType.String,
        defaultValue: "One-slide summary for OEM stakeholders.",
    },
    valuePropStats: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                value: { type: ControlType.String, defaultValue: "40" },
                unit: { type: ControlType.String, defaultValue: "%+" },
                headline: { type: ControlType.String, defaultValue: "" },
                description: {
                    type: ControlType.String,
                    defaultValue: "",
                    displayTextArea: true,
                },
            },
        },
    },
    valuePropTags: {
        type: ControlType.Array,
        control: { type: ControlType.String },
    },

    showKPIs: { type: ControlType.Boolean, defaultValue: true },
    kpiTitle: { type: ControlType.String, defaultValue: "" },
    kpis: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String },
                description: {
                    type: ControlType.String,
                    displayTextArea: true,
                },
                meta: { type: ControlType.String },
            },
        },
    },

    showScenarios: { type: ControlType.Boolean, defaultValue: true },
    scenariosTitle: { type: ControlType.String, defaultValue: "" },
    scenarios: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                tag: { type: ControlType.String },
                title: { type: ControlType.String },
                description: {
                    type: ControlType.String,
                    displayTextArea: true,
                },
                result: { type: ControlType.String },
            },
        },
    },

    showGuarantees: { type: ControlType.Boolean, defaultValue: true },
    guaranteesTitle: { type: ControlType.String, defaultValue: "" },
    guarantees: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                zero: { type: ControlType.String, defaultValue: "0" },
                title: { type: ControlType.String },
                description: {
                    type: ControlType.String,
                    displayTextArea: true,
                },
            },
        },
    },

    showBenchmarks: { type: ControlType.Boolean, defaultValue: true },
    benchmarksTitle: { type: ControlType.String, defaultValue: "" },
    benchmarks: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String },
                description: { type: ControlType.String },
                category: { type: ControlType.String },
                bitrateSaved: { type: ControlType.String },
                perceptionDelta: { type: ControlType.String },
                latencyDelta: { type: ControlType.String },
                verdict: { type: ControlType.String, defaultValue: "Pass" },
            },
        },
    },

    bgColor: { type: ControlType.Color, defaultValue: "#ffffff" },
    cardBgColor: { type: ControlType.Color, defaultValue: "#f9fafb" },
    textColor: { type: ControlType.Color, defaultValue: "#111827" },
    secondaryTextColor: { type: ControlType.Color, defaultValue: "#6b7280" },
    accentColor: { type: ControlType.Color, defaultValue: "#4F46E5" },
    accentGreen: { type: ControlType.Color, defaultValue: "#10b981" },
    borderColor: { type: ControlType.Color, defaultValue: "#e5e7eb" },
    fontFamily: {
        type: ControlType.String,
        defaultValue: "'Inter', sans-serif",
    },
})

export default DeveloperHub
