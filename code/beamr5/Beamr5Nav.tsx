// Beamr 5 HEVC Page - Navigation
// Light sticky top nav matching the new beamr.com design language
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface NavLink {
    text: string
    url: string
}

interface Props {
    logoText: string
    logoIconColor: string
    links: NavLink[]
    ctaText: string
    ctaUrl: string
    showCta: boolean
    bgColor: string
    textColor: string
    accentColor: string
    borderColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

function Beamr5Nav(props: Props) {
    const {
        logoText = "beamr",
        logoIconColor = "#2f73ff",
        links = [
            { text: "Media & Entertainment", url: "#" },
            { text: "Autonomous Vehicles", url: "#" },
            { text: "Beamr 5", url: "#" },
            { text: "News", url: "#" },
        ],
        ctaText = "Let's Talk",
        ctaUrl = "#",
        showCta = true,
        bgColor = "#ffffff",
        textColor = "#0d0d0d",
        accentColor = "#2f73ff",
        borderColor = "#e8eaf0",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <nav
            style={{
                ...style,
                width: "100%",
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: bgColor,
                borderBottom: `1px solid ${borderColor}`,
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "16px 48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                {/* Logo */}
                <a
                    href="#"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        textDecoration: "none",
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: logoIconColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 11,
                                height: 11,
                                borderRadius: 3,
                                background: "#ffffff",
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: 21,
                            fontWeight: 700,
                            color: textColor,
                            letterSpacing: "-0.02em",
                            fontFamily: headingFont,
                        }}
                    >
                        {logoText}
                    </span>
                </a>

                {/* Links */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    {links.map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color: textColor,
                                textDecoration: "none",
                                fontFamily,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {link.text}
                        </a>
                    ))}
                    {showCta && (
                        <a
                            href={ctaUrl}
                            style={{
                                backgroundColor: accentColor,
                                color: "#ffffff",
                                padding: "10px 22px",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {ctaText}
                        </a>
                    )}
                </div>
            </div>
        </nav>
    )
}

addPropertyControls(Beamr5Nav, {
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "beamr",
    },
    logoIconColor: {
        type: ControlType.Color,
        title: "Logo Icon",
        defaultValue: "#2f73ff",
    },
    links: {
        type: ControlType.Array,
        title: "Nav Links",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                text: {
                    type: ControlType.String,
                    title: "Text",
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
            { text: "Media & Entertainment", url: "#" },
            { text: "Autonomous Vehicles", url: "#" },
            { text: "Beamr 5", url: "#" },
            { text: "News", url: "#" },
        ],
    },
    showCta: {
        type: ControlType.Boolean,
        title: "Show CTA",
        defaultValue: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Let's Talk",
        hidden: (props) => !props.showCta,
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
        hidden: (props) => !props.showCta,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#0d0d0d",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#e8eaf0",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Nav
