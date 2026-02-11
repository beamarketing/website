// Beamr Homepage - Navigation Bar
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface NavLink {
    label: string
    url: string
}

interface Props {
    logoText: string
    logoFontSize: number
    navLinks: NavLink[]
    ctaText: string
    ctaUrl: string
    bgColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    logoImage: string
    useLogoImage: boolean
    sticky: boolean
    style?: React.CSSProperties
}

function Navigation(props: Props) {
    const {
        logoText = "BEAMR",
        logoFontSize = 24,
        navLinks = [
            { label: "Solutions", url: "#solutions" },
            { label: "Products", url: "#products" },
            { label: "Technology", url: "#technology" },
            { label: "Blog", url: "#blog" },
            { label: "Company", url: "#company" },
        ],
        ctaText = "Let's Talk",
        ctaUrl = "#contact",
        bgColor = "rgba(7, 7, 28, 0.9)",
        textColor = "#ffffff",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        logoImage = "",
        useLogoImage = false,
        sticky = true,
        style,
    } = props

    return (
        <nav
            style={{
                ...style,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 48px",
                backgroundColor: bgColor,
                backdropFilter: "blur(12px)",
                position: sticky ? "sticky" : "relative",
                top: 0,
                zIndex: 1000,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {useLogoImage && logoImage ? (
                    <img
                        src={logoImage}
                        alt={logoText}
                        style={{ height: logoFontSize + 8, objectFit: "contain" }}
                    />
                ) : (
                    <span
                        style={{
                            fontSize: logoFontSize,
                            fontWeight: 700,
                            color: textColor,
                            letterSpacing: "0.05em",
                            fontFamily,
                        }}
                    >
                        {logoText}
                    </span>
                )}
            </div>

            {/* Nav Links */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                }}
            >
                {navLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.url}
                        style={{
                            color: textColor,
                            textDecoration: "none",
                            fontSize: 15,
                            fontWeight: 400,
                            opacity: 0.85,
                            transition: "opacity 0.2s",
                            fontFamily,
                        }}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* CTA Button */}
            <a
                href={ctaUrl}
                style={{
                    backgroundColor: accentColor,
                    color: "#07071c",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                    fontFamily,
                    whiteSpace: "nowrap",
                }}
            >
                {ctaText}
            </a>
        </nav>
    )
}

addPropertyControls(Navigation, {
    useLogoImage: {
        type: ControlType.Boolean,
        title: "Use Logo Image",
        defaultValue: false,
    },
    logoImage: {
        type: ControlType.Image,
        title: "Logo Image",
        hidden: (props) => !props.useLogoImage,
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "BEAMR",
        hidden: (props) => props.useLogoImage,
    },
    logoFontSize: {
        type: ControlType.Number,
        title: "Logo Size",
        defaultValue: 24,
        min: 14,
        max: 48,
        step: 1,
    },
    navLinks: {
        type: ControlType.Array,
        title: "Nav Links",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Link",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { label: "Solutions", url: "#solutions" },
            { label: "Products", url: "#products" },
            { label: "Technology", url: "#technology" },
            { label: "Blog", url: "#blog" },
            { label: "Company", url: "#company" },
        ],
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Let's Talk",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#contact",
    },
    sticky: {
        type: ControlType.Boolean,
        title: "Sticky Nav",
        defaultValue: true,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "rgba(7, 7, 28, 0.9)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
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

export default Navigation
