// Beamr Careers Page — full-page composition
// Imports standalone section components from career/ folder
// Each section can also be used independently in Framer

import { addPropertyControls, ControlType } from "framer"
import { useEffect } from "react"
import CareerHero from "./career/CareerHero"
import CareerOpenRoles from "./career/CareerOpenRoles"
import CareerSignalTest from "./career/CareerSignalTest"
import CareerCTA from "./career/CareerCTA"
import CareerFooterStats from "./career/CareerFooterStats"

// ═══════════════════════════════════════════════════════════════
// CAREERS PAGE — full-page composer
// ═══════════════════════════════════════════════════════════════
interface CareersPageProps {
    // Fonts
    headingFont: string
    bodyFont: string
    monoFont: string
    // Font sizes
    heroHeadlineSize: number
    heroSubheadlineSize: number
    sectionHeadlineSize: number
    signalHeadlineSize: number
    roleTitleSize: number
    bodySize: number
    statNumberSize: number
    labelSize: number
    ctaButtonSize: number
    // Hero copy
    heroBadge: string
    heroHeadline: string
    heroSubheadline1: string
    heroSubheadline2: string
    heroCtaText: string
    heroStat1Value: string
    heroStat1Label: string
    heroStat2Value: string
    heroStat2Unit: string
    heroStat2Label: string
    heroStat3Value: string
    heroStat3Label: string
    // Open Roles copy
    rolesHeadline: string
    rolesFilterLocationLabel: string
    rolesFilterDeptLabel: string
    rolesEmptyText: string
    roles: any[]
    // Signal Test copy
    signalHeadline: string
    signalSubtext: string
    signalItem1: string
    signalItem2: string
    signalItem3: string
    signalItem4: string
    signalItem5: string
    signalResult0: string
    signalResult1: string
    signalResult3: string
    signalResult5: string
    signalCtaText: string
    // CTA copy
    ctaHeadline: string
    ctaSubtext: string
    ctaPrimaryText: string
    ctaSecondaryText: string
    // URLs
    openAppUrl: string
    linkedInUrl: string
    // Footer Stats copy
    footerStat1Value: string
    footerStat1Label: string
    footerStat2Value: string
    footerStat2Unit: string
    footerStat2Label: string
    footerStat3Value: string
    footerStat3Label: string
    footerStat4Value: string
    footerStat4Label: string
    // Style
    style?: React.CSSProperties
}

function CareersPage(props: CareersPageProps) {
    const {
        headingFont = "'Poppins', 'Inter', sans-serif",
        bodyFont = "'Inter', 'Poppins', sans-serif",
        monoFont = "'JetBrains Mono', 'Fira Code', monospace",
        heroHeadlineSize = 130,
        heroSubheadlineSize = 18,
        sectionHeadlineSize = 28,
        signalHeadlineSize = 22,
        roleTitleSize = 16,
        bodySize = "'Inter', 'Poppins', sans-serif"Size,
        statNumberSize = 28,
        labelSize = 11,
        ctaButtonSize = 14,
        heroBadge = "Now Hiring",
        heroHeadline = "EVERY\nBIT\nCOUNTS.",
        heroSubheadline1 = "We analyze every bit to find the ones that matter.",
        heroSubheadline2 = "We hire the same way.",
        heroCtaText = "See Open Roles ↓",
        heroStat1Value = "53", heroStat1Label = "Patents",
        heroStat2Value = "1", heroStat2Unit = "Emmy", heroStat2Label = "Technology & Engineering",
        heroStat3Value = "~50", heroStat3Label = "People",
        rolesHeadline = "Find Your Next Career Opportunity",
        rolesFilterLocationLabel = "Location",
        rolesFilterDeptLabel = "Department",
        rolesEmptyText = "No roles match your filters. Try broadening your search.",
        roles: roles = [],
        signalHeadline = "Not sure?\nRun the test.",
        signalSubtext = "Three or more true — we should talk.",
        signalItem1 = "You've gone deep on something and can explain it without dumbing it down.",
        signalItem2 = "You've shipped something real users depend on.",
        signalItem3 = 'You care about "right" vs "good enough" — even when no one notices.',
        signalItem4 = "You read this far instead of just scrolling to the titles.",
        signalItem5 = "You want problems that don't exist at most companies.",
        signalResult0 = "Check what's true.",
        signalResult1 = "Signal detected. Below threshold.",
        signalResult3 = "High signal. Let's talk.",
        signalResult5 = "Zero wasted bits. Talk to us.",
        signalCtaText = "Apply",
        ctaHeadline = "Not every bit makes the cut.",
        ctaSubtext = "Don't see your role? Tell us what we're missing.",
        ctaPrimaryText = "Send Us Your Story",
        ctaSecondaryText = "Follow on LinkedIn",
        openAppUrl = "#open-application",
        linkedInUrl = "#linkedin",
        footerStat1Value = "53", footerStat1Label = "Patents",
        footerStat2Value = "1", footerStat2Unit = "Emmy", footerStat2Label = "Technology & Engineering",
        footerStat3Value = "12", footerStat3Label = "APIs in the GPU driver",
        footerStat4Value = "~50", footerStat4Label = "People",
        style,
    } = props

    // Scroll-triggered fade-in
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement
                        el.style.opacity = "1"
                        el.style.transform = "translateY(0)"
                        observer.unobserve(el)
                    }
                }
            },
            { threshold: 0.1 }
        )
        const sections = document.querySelectorAll("[data-careers-reveal]")
        sections.forEach((s) => {
            const el = s as HTMLElement
            el.style.opacity = "0"
            el.style.transform = "translateY(12px)"
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
            observer.observe(el)
        })
        return () => observer.disconnect()
    }, [])

    return (
        <div style={{
            ...style, width: "100%", display: "flex",
            flexDirection: "column" as const, minHeight: "100vh",
            backgroundColor: "#FFFFFF",
        }}>
            <CareerHero
                headingFont={headingFont}
                bodyFont={bodyFont}
                monoFont={monoFont}
                heroHeadlineSize={heroHeadlineSize}
                heroSubheadlineSize={heroSubheadlineSize}
                statNumberSize={statNumberSize}
                labelSize={labelSize}
                ctaButtonSize={ctaButtonSize}
                badge={heroBadge}
                headline={heroHeadline}
                subheadline1={heroSubheadline1}
                subheadline2={heroSubheadline2}
                ctaText={heroCtaText}
                stat1Value={heroStat1Value}
                stat1Label={heroStat1Label}
                stat2Value={heroStat2Value}
                stat2Unit={heroStat2Unit}
                stat2Label={heroStat2Label}
                stat3Value={heroStat3Value}
                stat3Label={heroStat3Label}
            />

            <div data-careers-reveal>
                <CareerOpenRoles
                    headingFont={headingFont}
                    bodyFont={bodyFont}
                    monoFont={monoFont}
                    sectionHeadlineSize={sectionHeadlineSize}
                    roleTitleSize={roleTitleSize}
                    bodySize={bodySize}
                    headline={rolesHeadline}
                    filterLocationLabel={rolesFilterLocationLabel}
                    filterDeptLabel={rolesFilterDeptLabel}
                    emptyText={rolesEmptyText}
                    roles={roles}
                />
            </div>

            <div data-careers-reveal>
                <CareerSignalTest
                    headingFont={headingFont}
                    bodyFont={bodyFont}
                    signalHeadlineSize={signalHeadlineSize}
                    bodySize={bodySize}
                    headline={signalHeadline}
                    subtext={signalSubtext}
                    item1={signalItem1}
                    item2={signalItem2}
                    item3={signalItem3}
                    item4={signalItem4}
                    item5={signalItem5}
                    result0={signalResult0}
                    result1={signalResult1}
                    result3={signalResult3}
                    result5={signalResult5}
                    ctaText={signalCtaText}
                />
            </div>

            <div data-careers-reveal>
                <CareerCTA
                    headingFont={headingFont}
                    bodyFont={bodyFont}
                    bodySize={bodySize}
                    ctaButtonSize={ctaButtonSize}
                    headline={ctaHeadline}
                    subtext={ctaSubtext}
                    primaryText={ctaPrimaryText}
                    secondaryText={ctaSecondaryText}
                    openAppUrl={openAppUrl}
                    linkedInUrl={linkedInUrl}
                />
            </div>

            <div data-careers-reveal>
                <CareerFooterStats
                    bodyFont={bodyFont}
                    monoFont={monoFont}
                    statNumberSize={statNumberSize}
                    labelSize={labelSize}
                    stat1Value={footerStat1Value}
                    stat1Label={footerStat1Label}
                    stat2Value={footerStat2Value}
                    stat2Unit={footerStat2Unit}
                    stat2Label={footerStat2Label}
                    stat3Value={footerStat3Value}
                    stat3Label={footerStat3Label}
                    stat4Value={footerStat4Value}
                    stat4Label={footerStat4Label}
                />
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// FRAMER PROPERTY CONTROLS
// ═══════════════════════════════════════════════════════════════
addPropertyControls(CareersPage, {
    // ─── Typography ───────────────────────────────────────────
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: "'Poppins', 'Inter', sans-serif" },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: "'Inter', 'Poppins', sans-serif" },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: "'JetBrains Mono', 'Fira Code', monospace" },
    heroHeadlineSize: { type: ControlType.Number, title: "Hero Headline", defaultValue: 130, min: 48, max: 200, step: 1, unit: "px" },
    heroSubheadlineSize: { type: ControlType.Number, title: "Hero Subhead", defaultValue: 18, min: 12, max: 32, step: 1, unit: "px" },
    sectionHeadlineSize: { type: ControlType.Number, title: "Section Head", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    signalHeadlineSize: { type: ControlType.Number, title: "Signal Head", defaultValue: 22, min: 14, max: 40, step: 1, unit: "px" },
    roleTitleSize: { type: ControlType.Number, title: "Role Title", defaultValue: 16, min: 12, max: 24, step: 1, unit: "px" },
    bodySize: { type: ControlType.Number, title: "Body Text", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    statNumberSize: { type: ControlType.Number, title: "Stat Numbers", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    labelSize: { type: ControlType.Number, title: "Labels", defaultValue: 11, min: 8, max: 16, step: 1, unit: "px" },
    ctaButtonSize: { type: ControlType.Number, title: "CTA Button", defaultValue: 14, min: 10, max: 20, step: 1, unit: "px" },

    // ─── Hero ─────────────────────────────────────────────────
    heroBadge: { type: ControlType.String, title: "Badge", defaultValue: "Now Hiring" },
    heroHeadline: { type: ControlType.String, title: "Headline", defaultValue: "EVERY\nBIT\nCOUNTS." },
    heroSubheadline1: { type: ControlType.String, title: "Subhead (dim)", defaultValue: "We analyze every bit to find the ones that matter." },
    heroSubheadline2: { type: ControlType.String, title: "Subhead (bold)", defaultValue: "We hire the same way." },
    heroCtaText: { type: ControlType.String, title: "Hero CTA", defaultValue: "See Open Roles ↓" },
    heroStat1Value: { type: ControlType.String, title: "Stat 1 Value", defaultValue: "53" },
    heroStat1Label: { type: ControlType.String, title: "Stat 1 Label", defaultValue: "Patents" },
    heroStat2Value: { type: ControlType.String, title: "Stat 2 Value", defaultValue: "1" },
    heroStat2Unit: { type: ControlType.String, title: "Stat 2 Unit", defaultValue: "Emmy" },
    heroStat2Label: { type: ControlType.String, title: "Stat 2 Label", defaultValue: "Technology & Engineering" },
    heroStat3Value: { type: ControlType.String, title: "Stat 3 Value", defaultValue: "~50" },
    heroStat3Label: { type: ControlType.String, title: "Stat 3 Label", defaultValue: "People" },

    // ─── Open Roles ───────────────────────────────────────────
    rolesHeadline: { type: ControlType.String, title: "Roles Headline", defaultValue: "Find Your Next Career Opportunity" },
    rolesFilterLocationLabel: { type: ControlType.String, title: "Location Label", defaultValue: "Location" },
    rolesFilterDeptLabel: { type: ControlType.String, title: "Dept Label", defaultValue: "Department" },
    rolesEmptyText: { type: ControlType.String, title: "Empty Text", defaultValue: "No roles match your filters. Try broadening your search." },
    roles: {
        type: ControlType.Array,
        title: "Roles",
        description: "Add, edit, or remove roles. Leave empty to use built-in defaults.",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "New Role" },
                department: {
                    type: ControlType.Enum,
                    title: "Department",
                    options: ["Engineering", "Research", "Product", "Operations", "Design", "Marketing", "Sales", "HR"],
                    defaultValue: "Engineering",
                },
                location: { type: ControlType.String, title: "Location", defaultValue: "Tel Aviv" },
                type: {
                    type: ControlType.Enum,
                    title: "Type",
                    options: ["Full-time", "Part-time", "Contract", "Internship"],
                    defaultValue: "Full-time",
                },
                description: { type: ControlType.String, title: "Description", defaultValue: "Describe the role..." },
                requirements: { type: ControlType.String, title: "Requirements", defaultValue: "", description: "One per line" },
                niceToHave: { type: ControlType.String, title: "Nice to Have", defaultValue: "", description: "One per line" },
            },
        },
        defaultValue: [],
    },

    // ─── Signal Test ──────────────────────────────────────────
    signalHeadline: { type: ControlType.String, title: "Signal Headline", defaultValue: "Not sure?\nRun the test." },
    signalSubtext: { type: ControlType.String, title: "Signal Subtext", defaultValue: "Three or more true — we should talk." },
    signalItem1: { type: ControlType.String, title: "Signal Item 1", defaultValue: "You've gone deep on something and can explain it without dumbing it down." },
    signalItem2: { type: ControlType.String, title: "Signal Item 2", defaultValue: "You've shipped something real users depend on." },
    signalItem3: { type: ControlType.String, title: "Signal Item 3", defaultValue: 'You care about "right" vs "good enough" — even when no one notices.' },
    signalItem4: { type: ControlType.String, title: "Signal Item 4", defaultValue: "You read this far instead of just scrolling to the titles." },
    signalItem5: { type: ControlType.String, title: "Signal Item 5", defaultValue: "You want problems that don't exist at most companies." },
    signalResult0: { type: ControlType.String, title: "Result (0)", defaultValue: "Check what's true." },
    signalResult1: { type: ControlType.String, title: "Result (1–2)", defaultValue: "Signal detected. Below threshold." },
    signalResult3: { type: ControlType.String, title: "Result (3–4)", defaultValue: "High signal. Let's talk." },
    signalResult5: { type: ControlType.String, title: "Result (5)", defaultValue: "Zero wasted bits. Talk to us." },
    signalCtaText: { type: ControlType.String, title: "Signal CTA", defaultValue: "Apply" },

    // ─── CTA ──────────────────────────────────────────────────
    ctaHeadline: { type: ControlType.String, title: "CTA Headline", defaultValue: "Not every bit makes the cut." },
    ctaSubtext: { type: ControlType.String, title: "CTA Subtext", defaultValue: "Don't see your role? Tell us what we're missing." },
    ctaPrimaryText: { type: ControlType.String, title: "CTA Primary", defaultValue: "Send Us Your Story" },
    ctaSecondaryText: { type: ControlType.String, title: "CTA Secondary", defaultValue: "Follow on LinkedIn" },

    // ─── URLs ─────────────────────────────────────────────────
    openAppUrl: { type: ControlType.String, title: "Open App URL", defaultValue: "#open-application" },
    linkedInUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "#linkedin" },

    // ─── Footer Stats ─────────────────────────────────────────
    footerStat1Value: { type: ControlType.String, title: "Footer Stat 1 Val", defaultValue: "53" },
    footerStat1Label: { type: ControlType.String, title: "Footer Stat 1 Lbl", defaultValue: "Patents" },
    footerStat2Value: { type: ControlType.String, title: "Footer Stat 2 Val", defaultValue: "1" },
    footerStat2Unit: { type: ControlType.String, title: "Footer Stat 2 Unit", defaultValue: "Emmy" },
    footerStat2Label: { type: ControlType.String, title: "Footer Stat 2 Lbl", defaultValue: "Technology & Engineering" },
    footerStat3Value: { type: ControlType.String, title: "Footer Stat 3 Val", defaultValue: "12" },
    footerStat3Label: { type: ControlType.String, title: "Footer Stat 3 Lbl", defaultValue: "APIs in the GPU driver" },
    footerStat4Value: { type: ControlType.String, title: "Footer Stat 4 Val", defaultValue: "~50" },
    footerStat4Label: { type: ControlType.String, title: "Footer Stat 4 Lbl", defaultValue: "People" },
})

export default CareersPage
