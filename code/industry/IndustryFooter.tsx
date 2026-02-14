// Industry Page - Footer Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LinkItem {
    text: string
    url: string
}

interface FooterColumn {
    title: string
    links: LinkItem[]
}

interface SocialLink {
    platform: string
    url: string
}

interface Props {
    logoText: string
    tagline: string
    columns: FooterColumn[]
    socialLinks: SocialLink[]
    copyright: string
    bottomLinks: LinkItem[]
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

// Simple SVG icons for social platforms
const socialIcons: Record<string, string> = {
    twitter: "𝕏",
    linkedin: "in",
    youtube: "▶",
    github: "⌨",
    facebook: "f",
}

function IndustryFooter(props: Props) {
    const {
        logoText = "beamr",
        tagline = "Optimizing the world's video, one frame at a time.",
        columns = [
            {
                title: "Product",
                links: [
                    { text: "CABR Technology", url: "#" },
                    { text: "Beamr Cloud", url: "#" },
                    { text: "On-Premise", url: "#" },
                    { text: "Pricing", url: "#" },
                ],
            },
            {
                title: "Solutions",
                links: [
                    { text: "Media & Entertainment", url: "#" },
                    { text: "Streaming", url: "#" },
                    { text: "Cloud Gaming", url: "#" },
                    { text: "Social Media", url: "#" },
                ],
            },
            {
                title: "Resources",
                links: [
                    { text: "Documentation", url: "#" },
                    { text: "Blog", url: "#" },
                    { text: "Case Studies", url: "#" },
                    { text: "API Reference", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { text: "About", url: "#" },
                    { text: "Careers", url: "#" },
                    { text: "Contact", url: "#" },
                    { text: "Press", url: "#" },
                ],
            },
        ],
        socialLinks = [
            { platform: "twitter", url: "#" },
            { platform: "linkedin", url: "#" },
            { platform: "youtube", url: "#" },
            { platform: "github", url: "#" },
        ],
        copyright = "© 2026 Beamr. All rights reserved.",
        bottomLinks = [
            { text: "Privacy Policy", url: "#" },
            { text: "Terms of Service", url: "#" },
            { text: "Cookie Policy", url: "#" },
        ],
        bgColor = "#050516",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.06)",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <footer
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "80px 48px 40px",
                boxSizing: "border-box",
                fontFamily,
                borderTop: `1px solid ${borderColor}`,
            }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Top section */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `1.5fr repeat(${columns.length}, 1fr)`,
                        gap: 48,
                        marginBottom: 64,
                    }}
                >
                    {/* Logo & tagline */}
                    <div>
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: textColor,
                                marginBottom: 16,
                                fontFamily,
                            }}
                        >
                            {logoText}
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                margin: "0 0 24px",
                                lineHeight: 1.6,
                                maxWidth: 240,
                                fontFamily,
                            }}
                        >
                            {tagline}
                        </p>

                        {/* Social links */}
                        <div style={{ display: "flex", gap: 12 }}>
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textDecoration: "none",
                                        color: secondaryTextColor,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        fontFamily,
                                        transition: "border-color 0.3s",
                                    }}
                                >
                                    {socialIcons[social.platform] || social.platform[0]?.toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {columns.map((col, i) => (
                        <div key={i}>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: textColor,
                                    marginBottom: 20,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    fontFamily,
                                }}
                            >
                                {col.title}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                {col.links.map((link, j) => (
                                    <a
                                        key={j}
                                        href={link.url}
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            textDecoration: "none",
                                            fontFamily,
                                            transition: "color 0.2s",
                                        }}
                                    >
                                        {link.text}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: `1px solid ${borderColor}`,
                        paddingTop: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            color: secondaryTextColor,
                            fontFamily,
                        }}
                    >
                        {copyright}
                    </span>
                    <div style={{ display: "flex", gap: 24 }}>
                        {bottomLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    textDecoration: "none",
                                    fontFamily,
                                }}
                            >
                                {link.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

addPropertyControls(IndustryFooter, {
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "beamr",
    },
    tagline: {
        type: ControlType.String,
        title: "Tagline",
        defaultValue: "Optimizing the world's video, one frame at a time.",
        displayTextArea: true,
    },
    columns: {
        type: ControlType.Array,
        title: "Nav Columns",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Column Title",
                    defaultValue: "Column",
                },
                links: {
                    type: ControlType.Array,
                    title: "Links",
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
                        { text: "Link 1", url: "#" },
                        { text: "Link 2", url: "#" },
                        { text: "Link 3", url: "#" },
                    ],
                },
            },
        },
        defaultValue: [
            {
                title: "Product",
                links: [
                    { text: "CABR Technology", url: "#" },
                    { text: "Beamr Cloud", url: "#" },
                    { text: "On-Premise", url: "#" },
                    { text: "Pricing", url: "#" },
                ],
            },
            {
                title: "Solutions",
                links: [
                    { text: "Media & Entertainment", url: "#" },
                    { text: "Streaming", url: "#" },
                    { text: "Cloud Gaming", url: "#" },
                    { text: "Social Media", url: "#" },
                ],
            },
            {
                title: "Resources",
                links: [
                    { text: "Documentation", url: "#" },
                    { text: "Blog", url: "#" },
                    { text: "Case Studies", url: "#" },
                    { text: "API Reference", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { text: "About", url: "#" },
                    { text: "Careers", url: "#" },
                    { text: "Contact", url: "#" },
                    { text: "Press", url: "#" },
                ],
            },
        ],
    },
    socialLinks: {
        type: ControlType.Array,
        title: "Social Links",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                platform: {
                    type: ControlType.Enum,
                    title: "Platform",
                    options: ["twitter", "linkedin", "youtube", "github", "facebook"],
                    optionTitles: ["Twitter/X", "LinkedIn", "YouTube", "GitHub", "Facebook"],
                    defaultValue: "twitter",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { platform: "twitter", url: "#" },
            { platform: "linkedin", url: "#" },
            { platform: "youtube", url: "#" },
            { platform: "github", url: "#" },
        ],
    },
    copyright: {
        type: ControlType.String,
        title: "Copyright",
        defaultValue: "© 2026 Beamr. All rights reserved.",
    },
    bottomLinks: {
        type: ControlType.Array,
        title: "Bottom Links",
        maxCount: 5,
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
            { text: "Privacy Policy", url: "#" },
            { text: "Terms of Service", url: "#" },
            { text: "Cookie Policy", url: "#" },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#050516",
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
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustryFooter
