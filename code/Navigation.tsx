// Beamr Homepage - Navigation Bar with Mega Menu
// Supports overlay mode: transparent on hero, transitions to solid on scroll
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

// --- Sub-types ---

interface NavLink {
    label: string
    url: string
    hasDropdown: boolean
}

interface IndustryItem {
    icon: string
    title: string
    description: string
    url: string
}

interface UseCaseItem {
    icon: string
    title: string
    description: string
    url: string
}

interface FeaturedCard {
    badge: string
    title: string
    linkText: string
    linkUrl: string
    image: string
}

// --- Props ---

interface Props {
    // Logo
    logoText: string
    logoFontSize: number
    logoImage: string
    overlayLogoImage: string
    useLogoImage: boolean
    logoIconColor: string
    showLogoIcon: boolean

    // Nav links
    navLinks: NavLink[]

    // CTA
    ctaText: string
    ctaUrl: string
    ctaBgColor: string
    ctaTextColor: string

    // Mega menu content
    industriesLabel: string
    industries: IndustryItem[]
    useCasesLabel: string
    useCases: UseCaseItem[]
    featured: FeaturedCard

    // Styling
    bgColor: string
    textColor: string
    textHoverColor: string
    accentColor: string
    dropdownBgColor: string
    dropdownCardBgColor: string
    dropdownTextColor: string
    dropdownSecondaryTextColor: string
    borderColor: string
    fontFamily: string
    sticky: boolean

    // Overlay mode: transparent nav on hero, solid after scroll
    overlayMode: boolean
    overlayBgColor: string
    overlayTextColor: string
    scrollThreshold: number

    style?: React.CSSProperties
}

function Navigation(props: Props) {
    const {
        logoText = "beamr",
        logoFontSize = 22,
        logoImage = "",
        overlayLogoImage = "",
        useLogoImage = false,
        logoIconColor = "#6C5CE7",
        showLogoIcon = true,

        navLinks = [
            { label: "Solutions", url: "#solutions", hasDropdown: true },
            { label: "Products", url: "#products", hasDropdown: true },
            { label: "Technology", url: "#technology", hasDropdown: false },
            { label: "Blog", url: "#blog", hasDropdown: false },
            { label: "Company", url: "#company", hasDropdown: false },
        ],

        ctaText = "Let's Talk",
        ctaUrl = "#contact",
        ctaBgColor = "#111111",
        ctaTextColor = "#ffffff",

        industriesLabel = "INDUSTRIES",
        industries = [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Cut CDN & storage costs 30-50% while keeping broadcast quality.",
                url: "#media",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Smarter vision AI pipelines with guaranteed compression.",
                url: "#ai",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "50% storage reduction with ML-safe compression for training data.",
                url: "#automotive",
            },
            {
                icon: "🏟️",
                title: "Sports Streaming",
                description:
                    "720p→4K Super Resolution without doubling file size.",
                url: "#sports",
            },
        ],

        useCasesLabel = "USE CASES",
        useCases = [
            {
                icon: "📡",
                title: "Reduce CDN Costs",
                description:
                    "Deliver same visual quality at significantly lower bitrates.",
                url: "#cdn",
            },
            {
                icon: "✨",
                title: "Improve Quality",
                description:
                    "Enhance visual quality while maintaining or reducing file size.",
                url: "#quality",
            },
            {
                icon: "💾",
                title: "Optimize Storage",
                description:
                    "Reduce storage requirements by up to 50% without quality loss.",
                url: "#storage",
            },
            {
                icon: "📺",
                title: "4K Upscaling",
                description:
                    "Upscale legacy content to 4K resolution efficiently.",
                url: "#upscaling",
            },
        ],

        featured = {
            badge: "CASE STUDY",
            title: "Netflix Achieves 40% CDN Savings with CABR Technology",
            linkText: "Read Case Study",
            linkUrl: "#case-study",
            image: "",
        },

        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        textHoverColor = "#6C5CE7",
        accentColor = "#6C5CE7",
        dropdownBgColor = "#ffffff",
        dropdownCardBgColor = "#111827",
        dropdownTextColor = "#1a1a2e",
        dropdownSecondaryTextColor = "#6b7280",
        borderColor = "#f0f0f0",
        fontFamily = "'Inter', sans-serif",
        sticky = true,

        overlayMode = true,
        overlayBgColor = "transparent",
        overlayTextColor = "#ffffff",
        scrollThreshold = 100,

        style,
    } = props

    const navRef = useRef<HTMLElement>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [pastThreshold, setPastThreshold] = useState(false)

    // Inject !important CSS to nuke all Framer wrapper spacing above the nav
    useEffect(() => {
        const id = "__nav-reset-css"
        if (document.getElementById(id)) return
        const style = document.createElement("style")
        style.id = id
        style.textContent = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
            }
            /* Framer page wrapper chain – kill all top spacing & gaps */
            body > div, body > div > div, body > div > div > div,
            body > div > div > div > div, body > div > div > div > div > div,
            [data-framer-page-optimized], [data-framer-page-optimized] > *,
            [data-framer-name], [data-framer-component-type] {
                padding-top: 0 !important;
                margin-top: 0 !important;
                gap: 0 !important;
            }
            /* Allow sticky + mega menu to escape Framer overflow:hidden */
            body > div, body > div > div, body > div > div > div,
            body > div > div > div > div, body > div > div > div > div > div {
                overflow: visible !important;
            }
        `
        document.head.appendChild(style)
    }, [])

    // Scroll-based overlay transition
    useEffect(() => {
        if (!overlayMode) {
            setPastThreshold(true)
            return
        }
        const findScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
            let node = el?.parentElement
            while (node && node !== document.body) {
                const style = getComputedStyle(node)
                if (
                    style.overflowY === "scroll" ||
                    style.overflowY === "auto" ||
                    node.scrollHeight > node.clientHeight
                ) {
                    return node
                }
                node = node.parentElement
            }
            return window
        }
        const scrollTarget = findScrollParent(navRef.current)
        const onScroll = () => {
            const scrollY =
                scrollTarget === window
                    ? window.scrollY
                    : (scrollTarget as HTMLElement).scrollTop
            setPastThreshold(scrollY >= scrollThreshold)
        }
        onScroll()
        const target = scrollTarget === window ? window : scrollTarget
        target.addEventListener("scroll", onScroll, { passive: true })
        return () => target.removeEventListener("scroll", onScroll)
    }, [overlayMode, scrollThreshold])

    // --- Determine current visual state ---
    const isOverlay = overlayMode && !pastThreshold

    const currentBg = isOverlay ? overlayBgColor : bgColor
    const currentText = isOverlay ? overlayTextColor : textColor
    const currentHover = isOverlay ? "rgba(255,255,255,0.7)" : textHoverColor
    const currentBorder = isOverlay ? "transparent" : borderColor
    const currentCtaBg = isOverlay ? "rgba(255,255,255,0.15)" : ctaBgColor
    const currentCtaText = isOverlay ? overlayTextColor : ctaTextColor
    const currentLogoText = isOverlay ? overlayTextColor : textColor

    // Chevron colors
    const chevronDefault = isOverlay ? "rgba(255,255,255,0.7)" : textColor
    const chevronActive = isOverlay ? "#ffffff" : textHoverColor

    return (
        <nav
            ref={navRef}
            style={{
                ...style,
                width: "100%",
                position: "sticky",
                top: 0,
                zIndex: 1100,
                fontFamily,
                boxSizing: "border-box",
            }}
            onMouseLeave={() => setActiveDropdown(null)}
        >
            {/* Main Bar */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 48px",
                    backgroundColor: currentBg,
                    borderBottom: `1px solid ${currentBorder}`,
                    boxSizing: "border-box",
                    position: "relative",
                    zIndex: 1101,
                    transition: "background-color 0.4s ease, border-color 0.4s ease",
                    backdropFilter: "none",
                    boxShadow: !isOverlay && overlayMode ? "0 2px 16px rgba(0,0,0,0.08)" : "none",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                    }}
                >
                    {useLogoImage && logoImage ? (
                        <div style={{ position: "relative", height: logoFontSize + 8 }}>
                            {/* Solid-state logo (shown when scrolled) */}
                            <img
                                src={logoImage}
                                alt={logoText}
                                style={{
                                    height: logoFontSize + 8,
                                    objectFit: "contain",
                                    transition: "opacity 0.4s ease",
                                    opacity: isOverlay ? 0 : 1,
                                }}
                            />
                            {/* Overlay-state logo (shown on hero) */}
                            <img
                                src={overlayLogoImage || logoImage}
                                alt={logoText}
                                style={{
                                    height: logoFontSize + 8,
                                    objectFit: "contain",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    transition: "opacity 0.4s ease",
                                    opacity: isOverlay ? 1 : 0,
                                    filter: !overlayLogoImage ? "brightness(0) invert(1)" : "none",
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            {showLogoIcon && (
                                <div
                                    style={{
                                        width: logoFontSize + 4,
                                        height: logoFontSize + 4,
                                        borderRadius: 6,
                                        backgroundColor: logoIconColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg
                                        width={logoFontSize * 0.55}
                                        height={logoFontSize * 0.55}
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <rect
                                            x="2"
                                            y="2"
                                            width="5"
                                            height="5"
                                            rx="1"
                                            fill="white"
                                            opacity="0.9"
                                        />
                                        <rect
                                            x="9"
                                            y="2"
                                            width="5"
                                            height="5"
                                            rx="1"
                                            fill="white"
                                            opacity="0.6"
                                        />
                                        <rect
                                            x="2"
                                            y="9"
                                            width="5"
                                            height="5"
                                            rx="1"
                                            fill="white"
                                            opacity="0.6"
                                        />
                                        <rect
                                            x="9"
                                            y="9"
                                            width="5"
                                            height="5"
                                            rx="1"
                                            fill="white"
                                            opacity="0.35"
                                        />
                                    </svg>
                                </div>
                            )}
                            <span
                                style={{
                                    fontSize: logoFontSize,
                                    fontWeight: 700,
                                    color: currentLogoText,
                                    letterSpacing: "-0.01em",
                                    fontFamily,
                                    transition: "color 0.4s ease",
                                }}
                            >
                                {logoText}
                            </span>
                        </>
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
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                            }}
                            onMouseEnter={() =>
                                link.hasDropdown
                                    ? setActiveDropdown(link.label)
                                    : setActiveDropdown(null)
                            }
                        >
                            <a
                                href={link.hasDropdown ? undefined : link.url}
                                style={{
                                    color:
                                        activeDropdown === link.label
                                            ? currentHover
                                            : currentText,
                                    textDecoration: "none",
                                    fontSize: 15,
                                    fontWeight: 500,
                                    transition: "color 0.3s ease",
                                    fontFamily,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "8px 0",
                                }}
                            >
                                {link.label}
                                {link.hasDropdown && (
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        style={{
                                            transition: "transform 0.2s",
                                            transform:
                                                activeDropdown === link.label
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                        }}
                                    >
                                        <path
                                            d="M3 4.5L6 7.5L9 4.5"
                                            stroke={
                                                activeDropdown === link.label
                                                    ? chevronActive
                                                    : chevronDefault
                                            }
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ transition: "stroke 0.3s ease" }}
                                        />
                                    </svg>
                                )}
                            </a>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <a
                    href={ctaUrl}
                    style={{
                        backgroundColor: currentCtaBg,
                        color: currentCtaText,
                        padding: "10px 24px",
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease",
                        fontFamily,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        border: isOverlay ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                    }}
                >
                    {ctaText}
                </a>
            </div>

            {/* Mega Menu Dropdown */}
            {activeDropdown === "Solutions" && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: dropdownBgColor,
                        borderBottom: `1px solid ${borderColor}`,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                        zIndex: 1100,
                        animation: "fadeIn 0.15s ease-out",
                    }}
                    onMouseEnter={() => setActiveDropdown("Solutions")}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <div
                        style={{
                            maxWidth: 1280,
                            margin: "0 auto",
                            padding: "36px 48px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1.1fr",
                            gap: 40,
                        }}
                    >
                        {/* Industries Column */}
                        <div>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: dropdownSecondaryTextColor,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    fontFamily,
                                    display: "block",
                                    marginBottom: 20,
                                }}
                            >
                                {industriesLabel}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                {industries.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.url}
                                        style={{
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            padding: "10px 12px",
                                            borderRadius: 10,
                                            transition: "background-color 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            ;(
                                                e.currentTarget as HTMLElement
                                            ).style.backgroundColor =
                                                "#f8f8fb"
                                        }}
                                        onMouseLeave={(e) => {
                                            ;(
                                                e.currentTarget as HTMLElement
                                            ).style.backgroundColor =
                                                "transparent"
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 20,
                                                lineHeight: 1,
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        >
                                            {item.icon}
                                        </span>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: dropdownTextColor,
                                                    fontFamily,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    color: dropdownSecondaryTextColor,
                                                    lineHeight: 1.4,
                                                    fontFamily,
                                                }}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Use Cases Column */}
                        <div>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: dropdownSecondaryTextColor,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    fontFamily,
                                    display: "block",
                                    marginBottom: 20,
                                }}
                            >
                                {useCasesLabel}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                {useCases.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.url}
                                        style={{
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            padding: "10px 12px",
                                            borderRadius: 10,
                                            transition: "background-color 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            ;(
                                                e.currentTarget as HTMLElement
                                            ).style.backgroundColor =
                                                "#f8f8fb"
                                        }}
                                        onMouseLeave={(e) => {
                                            ;(
                                                e.currentTarget as HTMLElement
                                            ).style.backgroundColor =
                                                "transparent"
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 20,
                                                lineHeight: 1,
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        >
                                            {item.icon}
                                        </span>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: dropdownTextColor,
                                                    fontFamily,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    color: dropdownSecondaryTextColor,
                                                    lineHeight: 1.4,
                                                    fontFamily,
                                                }}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Featured Card */}
                        <div
                            style={{
                                backgroundColor: dropdownCardBgColor,
                                borderRadius: 16,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Card Image */}
                            <div
                                style={{
                                    width: "100%",
                                    height: 140,
                                    overflow: "hidden",
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                }}
                            >
                                {featured.image ? (
                                    <img
                                        src={featured.image}
                                        alt={featured.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background:
                                                "linear-gradient(135deg, #1a1a3e 0%, #2d2d6a 100%)",
                                        }}
                                    />
                                )}
                            </div>

                            {/* Card Content */}
                            <div
                                style={{
                                    padding: "20px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    flex: 1,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: accentColor,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        fontFamily,
                                    }}
                                >
                                    {featured.badge}
                                </span>
                                <h4
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        margin: 0,
                                        lineHeight: 1.4,
                                        fontFamily,
                                    }}
                                >
                                    {featured.title}
                                </h4>
                                <a
                                    href={featured.linkUrl}
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: accentColor,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontFamily,
                                        marginTop: "auto",
                                    }}
                                >
                                    {featured.linkText}{" "}
                                    <span style={{ fontSize: 14 }}>
                                        &#8594;
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

addPropertyControls(Navigation, {
    // --- Logo ---
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
    overlayLogoImage: {
        type: ControlType.Image,
        title: "Logo (Transparent)",
        hidden: (props) => !props.useLogoImage || !props.overlayMode,
        description: "Logo shown when nav is transparent over hero. Falls back to inverted main logo.",
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "beamr",
        hidden: (props) => props.useLogoImage,
    },
    logoFontSize: {
        type: ControlType.Number,
        title: "Logo Size",
        defaultValue: 22,
        min: 14,
        max: 48,
        step: 1,
    },
    showLogoIcon: {
        type: ControlType.Boolean,
        title: "Show Logo Icon",
        defaultValue: true,
        hidden: (props) => props.useLogoImage,
    },
    logoIconColor: {
        type: ControlType.Color,
        title: "Icon Color",
        defaultValue: "#6C5CE7",
        hidden: (props) => props.useLogoImage || !props.showLogoIcon,
    },

    // --- Nav Links ---
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
                hasDropdown: {
                    type: ControlType.Boolean,
                    title: "Has Dropdown",
                    defaultValue: false,
                },
            },
        },
        defaultValue: [
            { label: "Solutions", url: "#solutions", hasDropdown: true },
            { label: "Products", url: "#products", hasDropdown: true },
            { label: "Technology", url: "#technology", hasDropdown: false },
            { label: "Blog", url: "#blog", hasDropdown: false },
            { label: "Company", url: "#company", hasDropdown: false },
        ],
    },

    // --- CTA ---
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
    ctaBgColor: {
        type: ControlType.Color,
        title: "CTA BG",
        defaultValue: "#111111",
    },
    ctaTextColor: {
        type: ControlType.Color,
        title: "CTA Text",
        defaultValue: "#ffffff",
    },

    // --- Mega Menu: Industries ---
    industriesLabel: {
        type: ControlType.String,
        title: "Industries Label",
        defaultValue: "INDUSTRIES",
    },
    industries: {
        type: ControlType.Array,
        title: "Industries",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon/Emoji",
                    defaultValue: "🎬",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Industry",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Industry description.",
                    displayTextArea: true,
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Cut CDN & storage costs 30-50% while keeping broadcast quality.",
                url: "#media",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Smarter vision AI pipelines with guaranteed compression.",
                url: "#ai",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "50% storage reduction with ML-safe compression for training data.",
                url: "#automotive",
            },
            {
                icon: "🏟️",
                title: "Sports Streaming",
                description:
                    "720p→4K Super Resolution without doubling file size.",
                url: "#sports",
            },
        ],
    },

    // --- Mega Menu: Use Cases ---
    useCasesLabel: {
        type: ControlType.String,
        title: "Use Cases Label",
        defaultValue: "USE CASES",
    },
    useCases: {
        type: ControlType.Array,
        title: "Use Cases",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon/Emoji",
                    defaultValue: "📡",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Use Case",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Use case description.",
                    displayTextArea: true,
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                icon: "📡",
                title: "Reduce CDN Costs",
                description:
                    "Deliver same visual quality at significantly lower bitrates.",
                url: "#cdn",
            },
            {
                icon: "✨",
                title: "Improve Quality",
                description:
                    "Enhance visual quality while maintaining or reducing file size.",
                url: "#quality",
            },
            {
                icon: "💾",
                title: "Optimize Storage",
                description:
                    "Reduce storage requirements by up to 50% without quality loss.",
                url: "#storage",
            },
            {
                icon: "📺",
                title: "4K Upscaling",
                description:
                    "Upscale legacy content to 4K resolution efficiently.",
                url: "#upscaling",
            },
        ],
    },

    // --- Featured Card ---
    featured: {
        type: ControlType.Object,
        title: "Featured Card",
        controls: {
            badge: {
                type: ControlType.String,
                title: "Badge",
                defaultValue: "CASE STUDY",
            },
            title: {
                type: ControlType.String,
                title: "Title",
                defaultValue:
                    "Netflix Achieves 40% CDN Savings with CABR Technology",
            },
            linkText: {
                type: ControlType.String,
                title: "Link Text",
                defaultValue: "Read Case Study",
            },
            linkUrl: {
                type: ControlType.String,
                title: "Link URL",
                defaultValue: "#case-study",
            },
            image: {
                type: ControlType.Image,
                title: "Image",
            },
        },
    },

    // --- Overlay Mode ---
    overlayMode: {
        type: ControlType.Boolean,
        title: "Overlay Mode",
        defaultValue: true,
        description: "Transparent on hero, solid after scroll. Use with HeroScroll.",
    },
    overlayBgColor: {
        type: ControlType.Color,
        title: "Overlay BG",
        defaultValue: "transparent",
        hidden: (props) => !props.overlayMode,
    },
    overlayTextColor: {
        type: ControlType.Color,
        title: "Overlay Text",
        defaultValue: "#ffffff",
        hidden: (props) => !props.overlayMode,
    },
    scrollThreshold: {
        type: ControlType.Number,
        title: "Scroll Threshold",
        defaultValue: 100,
        min: 10,
        max: 1500,
        step: 10,
        hidden: (props) => !props.overlayMode,
        description: "Pixels scrolled before nav transitions to solid",
    },

    // --- Styling ---
    sticky: {
        type: ControlType.Boolean,
        title: "Sticky Nav",
        defaultValue: true,
        hidden: (props) => props.overlayMode,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1a1a2e",
    },
    textHoverColor: {
        type: ControlType.Color,
        title: "Hover Color",
        defaultValue: "#6C5CE7",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#6C5CE7",
    },
    dropdownBgColor: {
        type: ControlType.Color,
        title: "Dropdown BG",
        defaultValue: "#ffffff",
    },
    dropdownCardBgColor: {
        type: ControlType.Color,
        title: "Featured Card BG",
        defaultValue: "#111827",
    },
    dropdownTextColor: {
        type: ControlType.Color,
        title: "Dropdown Text",
        defaultValue: "#1a1a2e",
    },
    dropdownSecondaryTextColor: {
        type: ControlType.Color,
        title: "Dropdown Secondary",
        defaultValue: "#6b7280",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#f0f0f0",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Navigation
