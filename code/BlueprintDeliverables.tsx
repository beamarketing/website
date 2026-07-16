import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

interface PhaseItem {
    heading: string
    items: string
    iconImage: string
}

export default function BlueprintDeliverables(props) {
    const {
        phases = [
            {
                heading: "Know where you stand",
                items: "A map of your video pipeline, end to end\nWhat \"safe\" means for you – in numbers\nWhere to compress, how hard – lossy, lossless, or not at all",
            },
            {
                heading: "Tested on your data",
                items: "Compression experiments on your video data\nModel outputs compared: Raw/lossless/original vs. compressed, against your KPIs\nWhere models are sensitive – mitigation guidance, not just a verdict",
            },
            {
                heading: "Decide, with proof in hand",
                items: "Recommendation report with projected ROI, on your numbers\nScripts, recipes, configs, results – yours to keep\nReadout + Q&A",
            },
        ],
        accentColor = "#2563EB",
        cardBgColor = "#ffffff",
        cardBorderColor = "#E8EAF0",
        headingColor = "#1a1a2e",
        headingFontSize = 20,
        headingFontWeight = 700,
        itemColor = "#555555",
        itemFontSize = 15,
        bulletColor = "#2563EB",
        sectionTitle = "What You Get",
        sectionTitleColor = "#1a1a2e",
        sectionTitleFontSize = 44,
        sectionTitleFontWeight = 700,
        sectionTitleFontFamily = "'Poppins', sans-serif",
        showSectionTitle = true,
        sectionSubtitle = "",
        subtitleColor = "#666666",
        showSectionSubtitle = false,
        showPhaseNumbers = true,
        phaseNumberColor = "#2563EB",
        sectionBgColor = "#F7F8FC",
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headingFontFamily = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingTop = 80,
        paddingBottom = 80,
        cardBorderRadius = 16,
        showAccentTop = true,
        style,
    } = props

    const containerRef = useRef(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0
            setIsMobile(w < 560)
            setIsTablet(w >= 560 && w < 900)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const parseItems = (raw: string) =>
        raw
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)

    return (
        <section
            ref={containerRef}
            style={{
                backgroundColor: sectionBgColor,
                padding: isMobile
                    ? `${paddingTop}px 20px ${paddingBottom}px`
                    : `${paddingTop}px 40px ${paddingBottom}px`,
                fontFamily,
                ...style,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Section header */}
                {(showSectionTitle || (showSectionSubtitle && sectionSubtitle)) && (
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: isMobile ? 36 : 56,
                        }}
                    >
                        {showSectionTitle && (
                            <h2
                                style={{
                                    fontSize: isMobile
                                        ? Math.round(sectionTitleFontSize * 0.68)
                                        : sectionTitleFontSize,
                                    fontWeight: sectionTitleFontWeight,
                                    fontFamily: sectionTitleFontFamily,
                                    color: sectionTitleColor,
                                    margin: 0,
                                    lineHeight: 1.15,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {sectionTitle}
                            </h2>
                        )}
                        {showSectionSubtitle && sectionSubtitle && (
                            <p
                                style={{
                                    fontSize: isMobile ? 16 : 18,
                                    color: subtitleColor,
                                    marginTop: 14,
                                    marginBottom: 0,
                                    lineHeight: 1.5,
                                    fontFamily,
                                    maxWidth: 600,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                                dangerouslySetInnerHTML={{ __html: sectionSubtitle }}
                            />
                        )}
                    </div>
                )}

                {/* Phase cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : isTablet
                              ? "1fr 1fr"
                              : `repeat(${phases.length}, 1fr)`,
                        gap: isMobile ? 20 : 24,
                    }}
                >
                    {phases.map((phase, i) => {
                        const items = parseItems(phase.items || "")
                        return (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: cardBgColor,
                                    borderRadius: cardBorderRadius,
                                    border: `1px solid ${cardBorderColor}`,
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Accent top bar */}
                                {showAccentTop && (
                                    <div
                                        style={{
                                            height: 4,
                                            backgroundColor: accentColor,
                                        }}
                                    />
                                )}

                                <div
                                    style={{
                                        padding: isMobile ? "28px 24px 32px" : "32px 28px 36px",
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                    }}
                                >
                                    {/* Phase number */}
                                    {showPhaseNumbers && (
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: phaseNumberColor,
                                                fontFamily,
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                                marginBottom: 10,
                                            }}
                                        >
                                            Phase {i + 1}
                                        </div>
                                    )}

                                    {/* Icon */}
                                    {phase.iconImage && (
                                        <div style={{ marginBottom: 16 }}>
                                            <img
                                                src={phase.iconImage}
                                                alt=""
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Heading */}
                                    <h3
                                        style={{
                                            fontSize: headingFontSize,
                                            fontWeight: headingFontWeight,
                                            color: headingColor,
                                            fontFamily: headingFontFamily,
                                            margin: 0,
                                            marginBottom: 20,
                                            lineHeight: 1.3,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: phase.heading }}
                                    />

                                    {/* Deliverable items */}
                                    <ul
                                        style={{
                                            listStyle: "none",
                                            margin: 0,
                                            padding: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 14,
                                        }}
                                    >
                                        {items.map((item, j) => (
                                            <li
                                                key={j}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 12,
                                                    fontSize: itemFontSize,
                                                    color: itemColor,
                                                    lineHeight: 1.55,
                                                    fontFamily,
                                                }}
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    style={{
                                                        flexShrink: 0,
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    <path
                                                        d="M15 4.5L6.75 12.75L3 9"
                                                        stroke={bulletColor}
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span
                                                    dangerouslySetInnerHTML={{ __html: item }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(BlueprintDeliverables, {
    showSectionTitle: {
        type: ControlType.Boolean,
        title: "Show Title",
        defaultValue: true,
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "What You Get",
        hidden: (props) => !props.showSectionTitle,
    },
    sectionTitleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: "#1a1a2e",
        hidden: (props) => !props.showSectionTitle,
    },
    sectionTitleFontSize: {
        type: ControlType.Number,
        title: "Title Size",
        defaultValue: 44,
        min: 16,
        max: 96,
        step: 1,
        hidden: (props) => !props.showSectionTitle,
    },
    sectionTitleFontWeight: {
        type: ControlType.Number,
        title: "Title Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
        hidden: (props) => !props.showSectionTitle,
    },
    sectionTitleFontFamily: {
        type: ControlType.String,
        title: "Title Font",
        defaultValue: "'Poppins', sans-serif",
        hidden: (props) => !props.showSectionTitle,
    },
    showSectionSubtitle: {
        type: ControlType.Boolean,
        title: "Show Subtitle",
        defaultValue: false,
    },
    sectionSubtitle: {
        type: ControlType.String,
        title: "Subtitle (HTML)",
        defaultValue: "",
        displayTextArea: true,
        hidden: (props) => !props.showSectionSubtitle,
    },
    subtitleColor: {
        type: ControlType.Color,
        title: "Subtitle Color",
        defaultValue: "#666666",
        hidden: (props) => !props.showSectionSubtitle,
    },
    phases: {
        type: ControlType.Array,
        title: "Phases",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                iconImage: {
                    type: ControlType.Image,
                    title: "Icon",
                },
                heading: {
                    type: ControlType.String,
                    title: "Heading (HTML)",
                    defaultValue: "Phase heading",
                },
                items: {
                    type: ControlType.String,
                    title: "Items (one per line, HTML)",
                    defaultValue: "Deliverable item",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                heading: "Know where you stand",
                items: "A map of your video pipeline, end to end\nWhat \"safe\" means for you – in numbers\nWhere to compress, how hard – lossy, lossless, or not at all",
            },
            {
                heading: "Tested on your data",
                items: "Compression experiments on your video data\nModel outputs compared: Raw/lossless/original vs. compressed, against your KPIs\nWhere models are sensitive – mitigation guidance, not just a verdict",
            },
            {
                heading: "Decide, with proof in hand",
                items: "Recommendation report with projected ROI, on your numbers\nScripts, recipes, configs, results – yours to keep\nReadout + Q&A",
            },
        ],
    },
    showPhaseNumbers: {
        type: ControlType.Boolean,
        title: "Show Phase #",
        defaultValue: true,
    },
    phaseNumberColor: {
        type: ControlType.Color,
        title: "Phase # Color",
        defaultValue: "#2563EB",
        hidden: (props) => !props.showPhaseNumbers,
    },
    showAccentTop: {
        type: ControlType.Boolean,
        title: "Accent Top Bar",
        defaultValue: true,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2563EB",
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#1a1a2e",
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 20,
        min: 14,
        max: 36,
        step: 1,
    },
    headingFontWeight: {
        type: ControlType.Number,
        title: "Heading Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    itemColor: {
        type: ControlType.Color,
        title: "Item Color",
        defaultValue: "#555555",
    },
    itemFontSize: {
        type: ControlType.Number,
        title: "Item Size",
        defaultValue: 15,
        min: 12,
        max: 24,
        step: 1,
    },
    bulletColor: {
        type: ControlType.Color,
        title: "Checkmark Color",
        defaultValue: "#2563EB",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#ffffff",
    },
    cardBorderColor: {
        type: ControlType.Color,
        title: "Card Border",
        defaultValue: "#E8EAF0",
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 32,
        step: 2,
    },
    sectionBgColor: {
        type: ControlType.Color,
        title: "Section BG",
        defaultValue: "#F7F8FC",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 80,
        min: 0,
        max: 300,
        step: 4,
    },
    paddingBottom: {
        type: ControlType.Number,
        title: "Padding Bottom",
        defaultValue: 80,
        min: 0,
        max: 300,
        step: 4,
    },
})
