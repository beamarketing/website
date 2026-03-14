// Career Open Roles Section — filterable role list grouped by location
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"
import { COLORS, DEFAULT_FONTS, DEFAULT_ROLES } from "./theme"
import type { FontConfig, Role } from "./theme"

// ─── Role Row ──────────────────────────────────────────────────
function RoleRow({ role, headingFont, monoFont, bodyFont, roleTitleSize }: {
    role: Role
    headingFont: string
    monoFont: string
    bodyFont: string
    roleTitleSize: number
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <a
            href={role.url}
            style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: hovered ? "16px 16px 16px 28px" : "16px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                textDecoration: "none", position: "relative",
                transition: "all 0.25s ease", cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 3, height: hovered ? 28 : 0,
                background: `linear-gradient(${COLORS.accentBlue}, ${COLORS.fullBlue})`,
                borderRadius: 2, transition: "height 0.25s ease",
            }} />

            <span style={{
                fontFamily: headingFont, fontSize: roleTitleSize, fontWeight: 600,
                color: hovered ? COLORS.fullBlue : COLORS.darkText,
                transition: "color 0.2s ease",
            }}>
                {role.title}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                    fontFamily: monoFont, fontSize: 8, fontWeight: 500,
                    textTransform: "uppercase" as const, letterSpacing: "1.2px",
                    color: COLORS.fullBlue, backgroundColor: COLORS.lightLavender,
                    padding: "4px 8px", borderRadius: 4,
                    opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease",
                }}>
                    {role.department}
                </span>
                <span style={{
                    fontFamily: bodyFont, fontSize: 14, color: COLORS.muted,
                    transition: "transform 0.2s ease",
                    transform: hovered ? "translateX(4px)" : "translateX(0)",
                    display: "inline-block",
                }}>
                    →
                </span>
            </div>
        </a>
    )
}

// ═══════════════════════════════════════════════════════════════
// CAREER OPEN ROLES — main export
// ═══════════════════════════════════════════════════════════════
interface CareerOpenRolesProps {
    // Fonts
    headingFont: string
    bodyFont: string
    monoFont: string
    sectionHeadlineSize: number
    roleTitleSize: number
    bodySize: number
    // Copy
    headline: string
    filterLocationLabel: string
    filterDeptLabel: string
    emptyText: string
    // Data — Framer doesn't support complex arrays in controls,
    // so we use a JSON string for custom role data
    rolesJson: string
    // Style
    style?: React.CSSProperties
}

function CareerOpenRoles(props: CareerOpenRolesProps) {
    const {
        headingFont = DEFAULT_FONTS.heading,
        bodyFont = DEFAULT_FONTS.body,
        monoFont = DEFAULT_FONTS.mono,
        sectionHeadlineSize = DEFAULT_FONTS.sectionHeadlineSize,
        roleTitleSize = DEFAULT_FONTS.roleTitleSize,
        bodySize = DEFAULT_FONTS.bodySize,
        headline = "Find Your Next Career Opportunity",
        filterLocationLabel = "Location",
        filterDeptLabel = "Department",
        emptyText = "No roles match your filters. Try broadening your search.",
        rolesJson = "",
        style,
    } = props

    const [locationFilter, setLocationFilter] = useState("all")
    const [deptFilter, setDeptFilter] = useState("all")
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Parse roles from JSON or use defaults
    let roles: Role[] = DEFAULT_ROLES
    if (rolesJson && rolesJson.trim()) {
        try {
            const parsed = JSON.parse(rolesJson)
            if (Array.isArray(parsed)) roles = parsed
        } catch {}
    }

    const locations = Array.from(new Set(roles.map((r) => r.location)))
    const departments = Array.from(new Set(roles.map((r) => r.department)))

    const filtered = roles.filter((r) => {
        if (locationFilter !== "all" && r.location !== locationFilter) return false
        if (deptFilter !== "all" && r.department !== deptFilter) return false
        return true
    })

    const grouped: Record<string, Role[]> = {}
    for (const r of filtered) {
        if (!grouped[r.location]) grouped[r.location] = []
        grouped[r.location].push(r)
    }

    const selectStyle: React.CSSProperties = {
        fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
        padding: "10px 36px 10px 14px",
        border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 8,
        backgroundColor: COLORS.white, color: COLORS.darkText,
        appearance: "none" as const, cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896AB' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        outline: "none", minWidth: 160,
    }

    const labelStyle: React.CSSProperties = {
        fontFamily: monoFont, fontSize: 9, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "1.5px",
        color: COLORS.muted, opacity: 0.5, marginBottom: 6,
    }

    return (
        <section id="open-roles" style={{
            ...style,
            width: "100%", backgroundColor: COLORS.white,
            padding: isMobile ? "64px 24px" : "80px 48px", boxSizing: "border-box",
        }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <h2 style={{
                    fontFamily: headingFont, fontSize: sectionHeadlineSize,
                    fontWeight: 700, color: COLORS.darkText,
                    letterSpacing: "-0.5px", margin: "0 0 32px 0",
                }}>
                    {headline}
                </h2>

                <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" as const }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={labelStyle}>{filterLocationLabel}</span>
                        <select style={selectStyle} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                            <option value="all">All Locations</option>
                            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={labelStyle}>{filterDeptLabel}</span>
                        <select style={selectStyle} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                            <option value="all">All Departments</option>
                            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", marginBottom: 8 }} />

                {Object.entries(grouped).map(([location, locationRoles]) => (
                    <div key={location} style={{ marginBottom: 24 }}>
                        <div style={{
                            fontFamily: headingFont, fontSize: 12, fontWeight: 700,
                            textTransform: "uppercase" as const, letterSpacing: "1.5px",
                            color: COLORS.muted, opacity: 0.5, padding: "16px 0 8px",
                        }}>
                            {location}
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }} />
                        {locationRoles.map((role, i) => (
                            <RoleRow
                                key={i}
                                role={role}
                                headingFont={headingFont}
                                monoFont={monoFont}
                                bodyFont={bodyFont}
                                roleTitleSize={roleTitleSize}
                            />
                        ))}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p style={{
                        fontFamily: bodyFont, fontSize: bodySize,
                        color: COLORS.muted, padding: "32px 0", textAlign: "center",
                    }}>
                        {emptyText}
                    </p>
                )}
            </div>
        </section>
    )
}

addPropertyControls(CareerOpenRoles, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULT_FONTS.heading },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULT_FONTS.body },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: DEFAULT_FONTS.mono },
    sectionHeadlineSize: { type: ControlType.Number, title: "Headline Size", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    roleTitleSize: { type: ControlType.Number, title: "Role Title Size", defaultValue: 16, min: 12, max: 24, step: 1, unit: "px" },
    bodySize: { type: ControlType.Number, title: "Body Size", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Find Your Next Career Opportunity" },
    filterLocationLabel: { type: ControlType.String, title: "Location Label", defaultValue: "Location" },
    filterDeptLabel: { type: ControlType.String, title: "Dept Label", defaultValue: "Department" },
    emptyText: { type: ControlType.String, title: "Empty Text", defaultValue: "No roles match your filters. Try broadening your search." },
    rolesJson: { type: ControlType.String, title: "Roles (JSON)", defaultValue: "", description: "Optional JSON array of roles: [{title, department, location, url}]. Leave empty for defaults." },
})

export default CareerOpenRoles
