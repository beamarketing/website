import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

interface ColumnData {
    heading: string
    row1: string
    row2: string
    row3: string
}

interface Props {
    columns: ColumnData[]
    headerBgColor: string
    headerTextColor: string
    headerFontWeight: number
    headerFontSize: number
    cellTextColor: string
    cellFontSize: number
    cellFontWeight: number
    borderColor: string
    bgColor: string
    rowAltBgColor: string
    fontFamily: string
    headingFontFamily: string
    borderRadius: number
    sectionTitle: string
    sectionTitleColor: string
    sectionTitleFontSize: number
    sectionTitleFontWeight: number
    sectionTitleFontFamily: string
    showSectionTitle: boolean
    sectionSubtitle: string
    subtitleColor: string
    showSectionSubtitle: boolean
    paddingTop: number
    paddingBottom: number
    sectionBgColor: string
    style?: React.CSSProperties
}

export default function BlueprintDeliverables(props: Props) {
    const {
        columns = [
            {
                heading: "Know where you stand",
                row1: "A map of your video pipeline, end to end",
                row2: 'What "safe" means for you – in numbers',
                row3: "Where to compress, how hard – lossy, lossless, or not at all",
            },
            {
                heading: "Tested on your data",
                row1: "Compression experiments on your video data",
                row2: "Model outputs compared: Raw/lossless/original vs. compressed, against your KPIs",
                row3: "Where models are sensitive – mitigation guidance, not just a verdict",
            },
            {
                heading: "Decide, with proof in hand",
                row1: "Recommendation report with projected ROI, on your numbers",
                row2: "Scripts, recipes, configs, results – yours to keep",
                row3: "Readout + Q&A",
            },
        ],
        headerBgColor = "#2563EB",
        headerTextColor = "#ffffff",
        headerFontWeight = 700,
        headerFontSize = 18,
        cellTextColor = "#1a1a2e",
        cellFontSize = 15,
        cellFontWeight = 400,
        borderColor = "#E5E7EB",
        bgColor = "#ffffff",
        rowAltBgColor = "#F9FAFB",
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headingFontFamily = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        borderRadius = 12,
        sectionTitle = "What You Get",
        sectionTitleColor = "#1a1a2e",
        sectionTitleFontSize = 44,
        sectionTitleFontWeight = 700,
        sectionTitleFontFamily = "'Poppins', sans-serif",
        showSectionTitle = true,
        sectionSubtitle = "",
        subtitleColor = "#666666",
        showSectionSubtitle = false,
        paddingTop = 80,
        paddingBottom = 80,
        sectionBgColor = "#ffffff",
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0
            setIsMobile(w < 700)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const rowKeys = ["row1", "row2", "row3"] as const
    const numRows = rowKeys.length

    if (isMobile) {
        return (
            <section
                ref={containerRef}
                style={{
                    backgroundColor: sectionBgColor,
                    padding: `${paddingTop}px 20px ${paddingBottom}px`,
                    fontFamily,
                    ...style,
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {showSectionTitle && (
                        <h2
                            style={{
                                fontSize: Math.round(sectionTitleFontSize * 0.7),
                                fontWeight: sectionTitleFontWeight,
                                fontFamily: sectionTitleFontFamily,
                                color: sectionTitleColor,
                                textAlign: "center",
                                marginBottom: showSectionSubtitle && sectionSubtitle ? 12 : 32,
                                lineHeight: 1.2,
                            }}
                        >
                            {sectionTitle}
                        </h2>
                    )}
                    {showSectionSubtitle && sectionSubtitle && (
                        <p
                            style={{
                                fontSize: 16,
                                color: subtitleColor,
                                textAlign: "center",
                                marginBottom: 32,
                                lineHeight: 1.5,
                                fontFamily,
                                maxWidth: 600,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            dangerouslySetInnerHTML={{ __html: sectionSubtitle }}
                        />
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {columns.map((col, ci) => (
                            <div
                                key={ci}
                                style={{
                                    borderRadius,
                                    overflow: "hidden",
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: headerBgColor,
                                        color: headerTextColor,
                                        fontSize: headerFontSize,
                                        fontWeight: headerFontWeight,
                                        fontFamily: headingFontFamily,
                                        padding: "16px 20px",
                                        lineHeight: 1.3,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: col.heading }}
                                />
                                {rowKeys.map((key, ri) => (
                                    <div
                                        key={ri}
                                        style={{
                                            padding: "16px 20px",
                                            fontSize: cellFontSize,
                                            fontWeight: cellFontWeight,
                                            color: cellTextColor,
                                            lineHeight: 1.6,
                                            fontFamily,
                                            backgroundColor: ri % 2 === 1 ? rowAltBgColor : bgColor,
                                            borderTop: `1px solid ${borderColor}`,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: col[key] }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            ref={containerRef}
            style={{
                backgroundColor: sectionBgColor,
                padding: `${paddingTop}px 40px ${paddingBottom}px`,
                fontFamily,
                ...style,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {showSectionTitle && (
                    <h2
                        style={{
                            fontSize: sectionTitleFontSize,
                            fontWeight: sectionTitleFontWeight,
                            fontFamily: sectionTitleFontFamily,
                            color: sectionTitleColor,
                            textAlign: "center",
                            marginBottom: showSectionSubtitle && sectionSubtitle ? 12 : 48,
                            lineHeight: 1.2,
                        }}
                    >
                        {sectionTitle}
                    </h2>
                )}
                {showSectionSubtitle && sectionSubtitle && (
                    <p
                        style={{
                            fontSize: 18,
                            color: subtitleColor,
                            textAlign: "center",
                            marginBottom: 48,
                            lineHeight: 1.5,
                            fontFamily,
                            maxWidth: 640,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        dangerouslySetInnerHTML={{ __html: sectionSubtitle }}
                    />
                )}
                <div
                    style={{
                        borderRadius,
                        overflow: "hidden",
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    {/* Header row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                            backgroundColor: headerBgColor,
                        }}
                    >
                        {columns.map((col, ci) => (
                            <div
                                key={ci}
                                style={{
                                    padding: "20px 28px",
                                    color: headerTextColor,
                                    fontSize: headerFontSize,
                                    fontWeight: headerFontWeight,
                                    fontFamily: headingFontFamily,
                                    lineHeight: 1.3,
                                    borderLeft: ci > 0 ? `1px solid rgba(255,255,255,0.2)` : "none",
                                }}
                                dangerouslySetInnerHTML={{ __html: col.heading }}
                            />
                        ))}
                    </div>

                    {/* Data rows */}
                    {rowKeys.map((key, ri) => (
                        <div
                            key={ri}
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                                backgroundColor: ri % 2 === 0 ? bgColor : rowAltBgColor,
                                borderTop: `1px solid ${borderColor}`,
                            }}
                        >
                            {columns.map((col, ci) => (
                                <div
                                    key={ci}
                                    style={{
                                        padding: "20px 28px",
                                        fontSize: cellFontSize,
                                        fontWeight: cellFontWeight,
                                        color: cellTextColor,
                                        lineHeight: 1.6,
                                        fontFamily,
                                        borderLeft: ci > 0 ? `1px solid ${borderColor}` : "none",
                                    }}
                                    dangerouslySetInnerHTML={{ __html: col[key] }}
                                />
                            ))}
                        </div>
                    ))}
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
    columns: {
        type: ControlType.Array,
        title: "Columns",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                heading: {
                    type: ControlType.String,
                    title: "Heading (HTML)",
                    defaultValue: "Column heading",
                },
                row1: {
                    type: ControlType.String,
                    title: "Row 1 (HTML)",
                    defaultValue: "Row 1 content",
                    displayTextArea: true,
                },
                row2: {
                    type: ControlType.String,
                    title: "Row 2 (HTML)",
                    defaultValue: "Row 2 content",
                    displayTextArea: true,
                },
                row3: {
                    type: ControlType.String,
                    title: "Row 3 (HTML)",
                    defaultValue: "Row 3 content",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                heading: "Know where you stand",
                row1: "A map of your video pipeline, end to end",
                row2: 'What "safe" means for you – in numbers',
                row3: "Where to compress, how hard – lossy, lossless, or not at all",
            },
            {
                heading: "Tested on your data",
                row1: "Compression experiments on your video data",
                row2: "Model outputs compared: Raw/lossless/original vs. compressed, against your KPIs",
                row3: "Where models are sensitive – mitigation guidance, not just a verdict",
            },
            {
                heading: "Decide, with proof in hand",
                row1: "Recommendation report with projected ROI, on your numbers",
                row2: "Scripts, recipes, configs, results – yours to keep",
                row3: "Readout + Q&A",
            },
        ],
    },
    headerBgColor: {
        type: ControlType.Color,
        title: "Header BG",
        defaultValue: "#2563EB",
    },
    headerTextColor: {
        type: ControlType.Color,
        title: "Header Text",
        defaultValue: "#ffffff",
    },
    headerFontSize: {
        type: ControlType.Number,
        title: "Header Size",
        defaultValue: 18,
        min: 12,
        max: 32,
        step: 1,
    },
    headerFontWeight: {
        type: ControlType.Number,
        title: "Header Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    cellTextColor: {
        type: ControlType.Color,
        title: "Cell Text Color",
        defaultValue: "#1a1a2e",
    },
    cellFontSize: {
        type: ControlType.Number,
        title: "Cell Size",
        defaultValue: 15,
        min: 12,
        max: 24,
        step: 1,
    },
    cellFontWeight: {
        type: ControlType.Number,
        title: "Cell Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Row BG",
        defaultValue: "#ffffff",
    },
    rowAltBgColor: {
        type: ControlType.Color,
        title: "Row Alt BG",
        defaultValue: "#F9FAFB",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#E5E7EB",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
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
    sectionBgColor: {
        type: ControlType.Color,
        title: "Section BG",
        defaultValue: "#ffffff",
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
