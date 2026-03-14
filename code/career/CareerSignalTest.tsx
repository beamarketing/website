// Career Signal Test Section — interactive checklist with signal meter
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"

const COLORS = {
    darkNavy: "#000737",
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    white: "#FFFFFF",
}

const DEFAULTS = {
    headingFont: "'Poppins', 'Inter', sans-serif",
    bodyFont: "'Inter', 'Poppins', sans-serif",
    signalHeadlineSize: 22,
    bodySize: 14,
}

// ═══════════════════════════════════════════════════════════════
// CAREER SIGNAL TEST — main export
// ═══════════════════════════════════════════════════════════════
interface CareerSignalTestProps {
    // Fonts
    headingFont: string
    bodyFont: string
    signalHeadlineSize: number
    bodySize: number
    // Colors
    bgColor: string
    headlineColor: string
    subtextColor: string
    itemTextColor: string
    resultTextColor: string
    accentColor: string
    // Copy
    headline: string
    subtext: string
    item1: string
    item2: string
    item3: string
    item4: string
    item5: string
    result0: string
    result1: string
    result3: string
    result5: string
    ctaText: string
    // Style
    style?: React.CSSProperties
}

function CareerSignalTest(props: CareerSignalTestProps) {
    const {
        headingFont = DEFAULTS.headingFont,
        bodyFont = DEFAULTS.bodyFont,
        signalHeadlineSize = DEFAULTS.signalHeadlineSize,
        bodySize = DEFAULTS.bodySize,
        bgColor = COLORS.darkNavy,
        headlineColor = COLORS.white,
        subtextColor = COLORS.white,
        itemTextColor = COLORS.white,
        resultTextColor = COLORS.white,
        accentColor = COLORS.accentBlue,
        headline = "Not sure?\nRun the test.",
        subtext = "Three or more true — we should talk.",
        item1 = "You've gone deep on something and can explain it without dumbing it down.",
        item2 = "You've shipped something real users depend on.",
        item3 = 'You care about "right" vs "good enough" — even when no one notices.',
        item4 = "You read this far instead of just scrolling to the titles.",
        item5 = "You want problems that don't exist at most companies.",
        result0 = "Check what's true.",
        result1 = "Signal detected. Below threshold.",
        result3 = "High signal. Let's talk.",
        result5 = "Zero wasted bits. Talk to us.",
        ctaText = "Apply",
        style,
    } = props

    const items = [item1, item2, item3, item4, item5]
    const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false))
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const checkedCount = checked.filter(Boolean).length

    const toggle = (index: number) => {
        setChecked((prev) => { const next = [...prev]; next[index] = !next[index]; return next })
    }

    const getResultText = () => {
        if (checkedCount === 0) return result0
        if (checkedCount <= 2) return result1
        if (checkedCount <= 4) return result3
        return result5
    }

    const isHot = checkedCount >= 3
    const headlineLines = headline.split("\n")

    return (
        <section style={{
            ...style,
            width: "100%", backgroundColor: bgColor,
            padding: isMobile ? "64px 24px" : "80px 48px",
            boxSizing: "border-box", position: "relative", overflow: "hidden",
        }}>
            {/* Background pixel grid */}
            <svg style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                zIndex: 0, pointerEvents: "none",
            }}>
                <rect x="10%" y="15%" width="40" height="40" fill="white" opacity="0.015" />
                <rect x="70%" y="25%" width="44" height="44" fill={COLORS.fullBlue} opacity="0.02" />
                <rect x="30%" y="70%" width="42" height="42" fill={COLORS.fullBlue} opacity="0.015" />
                <rect x="85%" y="75%" width="40" height="40" fill="white" opacity="0.02" />
            </svg>

            <div style={{
                maxWidth: 900, margin: "0 auto",
                display: "flex", flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 28 : 48, position: "relative", zIndex: 1,
            }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 260 }}>
                    <h2 style={{
                        fontFamily: headingFont, fontSize: signalHeadlineSize,
                        fontWeight: 700, color: headlineColor,
                        letterSpacing: "-0.3px", margin: "0 0 12px 0", lineHeight: 1.3,
                    }}>
                        {headlineLines.map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{line}</span>
                        ))}
                    </h2>
                    <p style={{
                        fontFamily: bodyFont, fontSize: bodySize,
                        color: subtextColor, opacity: 0.7, margin: 0, lineHeight: 1.5,
                    }}>
                        {subtext}
                    </p>
                </div>

                {/* Right */}
                <div style={{ flex: 1.3, minWidth: 320 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {items.map((item, i) => {
                            const isChecked = checked[i]
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggle(i)}
                                    style={{
                                        display: "flex", alignItems: "flex-start", gap: 12,
                                        padding: "12px 14px", borderRadius: 10,
                                        backgroundColor: isChecked ? `${accentColor}0D` : "rgba(255,255,255,0.04)",
                                        border: `1.5px solid ${isChecked ? `${accentColor}2E` : "rgba(255,255,255,0.12)"}`,
                                        cursor: "pointer", transition: "all 0.2s ease", userSelect: "none" as const,
                                    }}
                                    onMouseEnter={(e) => { if (!isChecked) e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)" }}
                                    onMouseLeave={(e) => { if (!isChecked) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)" }}
                                >
                                    <div style={{
                                        width: 18, height: 18, minWidth: 18, borderRadius: 5,
                                        border: isChecked ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                                        backgroundColor: isChecked ? accentColor : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.2s ease", marginTop: 1,
                                    }}>
                                        {isChecked && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span style={{
                                        fontFamily: bodyFont, fontSize: 12.5,
                                        color: itemTextColor, opacity: isChecked ? 1 : 0.7,
                                        lineHeight: 1.5, transition: "opacity 0.2s ease",
                                    }}>
                                        {item}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Signal meter + result */}
                    <div style={{
                        marginTop: 20, padding: "16px 18px", borderRadius: 10,
                        backgroundColor: isHot ? `${accentColor}12` : `${accentColor}08`,
                        border: `1.5px solid ${isHot ? `${accentColor}33` : `${accentColor}0F`}`,
                        boxShadow: isHot ? `0 0 24px ${accentColor}26` : "none",
                        display: "flex", alignItems: "center", gap: 16,
                        flexWrap: "wrap" as const, transition: "all 0.3s ease",
                    }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} style={{
                                    width: 32, height: 4, borderRadius: 2,
                                    backgroundColor: i < checkedCount ? accentColor : "rgba(255,255,255,0.1)",
                                    boxShadow: i < checkedCount ? `0 0 8px ${accentColor}40` : "none",
                                    transition: "all 0.3s ease",
                                }} />
                            ))}
                        </div>

                        <span style={{
                            fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
                            color: resultTextColor, opacity: checkedCount === 0 ? 0.6 : 0.9,
                            flex: 1, transition: "opacity 0.3s ease",
                        }}>
                            {getResultText()}
                        </span>

                        {isHot && (
                            <a
                                href="#open-roles"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })
                                }}
                                style={{
                                    fontFamily: headingFont, fontSize: 12, fontWeight: 600,
                                    color: COLORS.white, backgroundColor: accentColor,
                                    padding: "8px 20px", borderRadius: 6, textDecoration: "none",
                                    cursor: "pointer", transition: "background-color 0.2s ease",
                                    whiteSpace: "nowrap" as const,
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85" }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
                            >
                                {ctaText}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(CareerSignalTest, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULTS.headingFont },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULTS.bodyFont },
    signalHeadlineSize: { type: ControlType.Number, title: "Headline Size", defaultValue: 22, min: 14, max: 40, step: 1, unit: "px" },
    bodySize: { type: ControlType.Number, title: "Body Size", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: COLORS.darkNavy },
    headlineColor: { type: ControlType.Color, title: "Headline Color", defaultValue: COLORS.white },
    subtextColor: { type: ControlType.Color, title: "Subtext Color", defaultValue: COLORS.white },
    itemTextColor: { type: ControlType.Color, title: "Item Text Color", defaultValue: COLORS.white },
    resultTextColor: { type: ControlType.Color, title: "Result Text Color", defaultValue: COLORS.white },
    accentColor: { type: ControlType.Color, title: "Accent Color", defaultValue: COLORS.accentBlue },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Not sure?\nRun the test." },
    subtext: { type: ControlType.String, title: "Subtext", defaultValue: "Three or more true — we should talk." },
    item1: { type: ControlType.String, title: "Item 1", defaultValue: "You've gone deep on something and can explain it without dumbing it down." },
    item2: { type: ControlType.String, title: "Item 2", defaultValue: "You've shipped something real users depend on." },
    item3: { type: ControlType.String, title: "Item 3", defaultValue: 'You care about "right" vs "good enough" — even when no one notices.' },
    item4: { type: ControlType.String, title: "Item 4", defaultValue: "You read this far instead of just scrolling to the titles." },
    item5: { type: ControlType.String, title: "Item 5", defaultValue: "You want problems that don't exist at most companies." },
    result0: { type: ControlType.String, title: "Result (0)", defaultValue: "Check what's true." },
    result1: { type: ControlType.String, title: "Result (1–2)", defaultValue: "Signal detected. Below threshold." },
    result3: { type: ControlType.String, title: "Result (3–4)", defaultValue: "High signal. Let's talk." },
    result5: { type: ControlType.String, title: "Result (5)", defaultValue: "Zero wasted bits. Talk to us." },
    ctaText: { type: ControlType.String, title: "CTA Text", defaultValue: "Apply" },
})

export default CareerSignalTest
