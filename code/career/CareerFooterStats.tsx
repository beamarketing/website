// Career Footer Stats Section — credibility stats row
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"
import { COLORS, DEFAULT_FONTS } from "./theme"

// ═══════════════════════════════════════════════════════════════
// CAREER FOOTER STATS — main export
// ═══════════════════════════════════════════════════════════════
interface CareerFooterStatsProps {
    // Fonts
    bodyFont: string
    monoFont: string
    statNumberSize: number
    labelSize: number
    // Stat 1
    stat1Value: string
    stat1Label: string
    // Stat 2
    stat2Value: string
    stat2Unit: string
    stat2Label: string
    // Stat 3
    stat3Value: string
    stat3Label: string
    // Stat 4
    stat4Value: string
    stat4Label: string
    // Style
    style?: React.CSSProperties
}

function CareerFooterStats(props: CareerFooterStatsProps) {
    const {
        bodyFont = DEFAULT_FONTS.body,
        monoFont = DEFAULT_FONTS.mono,
        statNumberSize = DEFAULT_FONTS.statNumberSize,
        labelSize = DEFAULT_FONTS.labelSize,
        stat1Value = "53", stat1Label = "Patents",
        stat2Value = "1", stat2Unit = "Emmy", stat2Label = "Technology & Engineering",
        stat3Value = "12", stat3Label = "APIs in the GPU driver",
        stat4Value = "~50", stat4Label = "People",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const stats = [
        { value: stat1Value, label: stat1Label },
        { value: stat2Value, unit: stat2Unit, label: stat2Label },
        { value: stat3Value, label: stat3Label },
        { value: stat4Value, label: stat4Label },
    ]

    return (
        <section style={{
            ...style,
            width: "100%", backgroundColor: COLORS.white,
            padding: isMobile ? "24px 24px 48px" : "24px 48px 48px",
            boxSizing: "border-box",
        }}>
            <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                gap: isMobile ? 24 : 48, flexWrap: "wrap" as const,
                maxWidth: 900, margin: "0 auto",
            }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{
                            fontFamily: monoFont, fontSize: statNumberSize,
                            fontWeight: 700, color: COLORS.darkBg, letterSpacing: "-1px",
                        }}>
                            {stat.value}
                            {stat.unit && (
                                <span style={{ color: COLORS.accentBlue, fontSize: 13, marginLeft: 4 }}>
                                    {stat.unit}
                                </span>
                            )}
                        </span>
                        <span style={{
                            fontFamily: bodyFont, fontSize: labelSize,
                            color: COLORS.muted, letterSpacing: "0.3px", marginTop: 2, textAlign: "center",
                        }}>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}

addPropertyControls(CareerFooterStats, {
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULT_FONTS.body },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: DEFAULT_FONTS.mono },
    statNumberSize: { type: ControlType.Number, title: "Stat Number Size", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    labelSize: { type: ControlType.Number, title: "Label Size", defaultValue: 11, min: 8, max: 16, step: 1, unit: "px" },
    stat1Value: { type: ControlType.String, title: "Stat 1 Value", defaultValue: "53" },
    stat1Label: { type: ControlType.String, title: "Stat 1 Label", defaultValue: "Patents" },
    stat2Value: { type: ControlType.String, title: "Stat 2 Value", defaultValue: "1" },
    stat2Unit: { type: ControlType.String, title: "Stat 2 Unit", defaultValue: "Emmy" },
    stat2Label: { type: ControlType.String, title: "Stat 2 Label", defaultValue: "Technology & Engineering" },
    stat3Value: { type: ControlType.String, title: "Stat 3 Value", defaultValue: "12" },
    stat3Label: { type: ControlType.String, title: "Stat 3 Label", defaultValue: "APIs in the GPU driver" },
    stat4Value: { type: ControlType.String, title: "Stat 4 Value", defaultValue: "~50" },
    stat4Label: { type: ControlType.String, title: "Stat 4 Label", defaultValue: "People" },
})

export default CareerFooterStats
