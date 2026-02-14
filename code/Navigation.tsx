// Beamr Homepage - Navigation Bar with Mega Menu
// Supports overlay mode: transparent on hero, transitions to solid on scroll
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

// --- Sub-types ---

interface DropdownItem {
    title: string
    description: string
    url: string
}

interface NavLink {
    label: string
    url: string
    hasDropdown: boolean
    col1Label: string
    col1Items: DropdownItem[]
    col2Label: string
    col2Items: DropdownItem[]
    showFeatured: boolean
    featuredBadge: string
    featuredTitle: string
    featuredLinkText: string
    featuredLinkUrl: string
    featuredImage: string
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

    // Nav links (includes dropdown configuration per item)
    navLinks: NavLink[]

    // CTA
    ctaText: string
    ctaUrl: string
    ctaBgColor: string
    ctaTextColor: string

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
            {
                label: "Solutions",
                url: "#solutions",
                hasDropdown: true,
                col1Label: "INDUSTRIES",
                col1Items: [
                    {
                        title: "Media & Entertainment",
                        description:
                            "Cut CDN & storage costs 30-50% while keeping broadcast quality.",
                        url: "#media",
                    },
                    {
                        title: "AI / Machine Learning",
                        description:
                            "Smarter vision AI pipelines with guaranteed compression.",
                        url: "#ai",
                    },
                    {
                        title: "Autonomous Vehicles",
                        description:
                            "50% storage reduction with ML-safe compression for training data.",
                        url: "#automotive",
                    },
                    {
                        title: "Sports Streaming",
                        description:
                            "720p to 4K Super Resolution without doubling file size.",
                        url: "#sports",
                    },
                ],
                col2Label: "USE CASES",
                col2Items: [
                    {
                        title: "Reduce CDN Costs",
                        description:
                            "Deliver same visual quality at significantly lower bitrates.",
                        url: "#cdn",
                    },
                    {
                        title: "Improve Quality",
                        description:
                            "Enhance visual quality while maintaining or reducing file size.",
                        url: "#quality",
                    },
                    {
                        title: "Optimize Storage",
                        description:
                            "Reduce storage requirements by up to 50% without quality loss.",
                        url: "#storage",
                    },
                    {
                        title: "4K Upscaling",
                        description:
                            "Upscale legacy content to 4K resolution efficiently.",
                        url: "#upscaling",
                    },
                ],
                showFeatured: true,
                featuredBadge: "CASE STUDY",
                featuredTitle:
                    "Netflix Achieves 40% CDN Savings with CABR Technology",
                featuredLinkText: "Read Case Study",
                featuredLinkUrl: "#case-study",
                featuredImage: "",
            },
            {
                label: "Products",
                url: "#products",
                hasDropdown: true,
                col1Label: "PRODUCTS",
                col1Items: [],
                col2Label: "",
                col2Items: [],
                showFeatured: false,
                featuredBadge: "",
                featuredTitle: "",
                featuredLinkText: "",
                featuredLinkUrl: "",
                featuredImage: "",
            },
            {
                label: "Technology",
                url: "#technology",
                hasDropdown: false,
                col1Label: "",
                col1Items: [],
                col2Label: "",
                col2Items: [],
                showFeatured: false,
                featuredBadge: "",
                featuredTitle: "",
                featuredLinkText: "",
                featuredLinkUrl: "",
                featuredImage: "",
            },
            {
                label: "Blog",
                url: "#blog",
                hasDropdown: false,
                col1Label: "",
                col1Items: [],
                col2Label: "",
                col2Items: [],
                showFeatured: false,
                featuredBadge: "",
                featuredTitle: "",
                featuredLinkText: "",
                featuredLinkUrl: "",
                featuredImage: "",
            },
            {
                label: "Company",
                url: "#company",
                hasDropdown: false,
                col1Label: "",
                col1Items: [],
                col2Label: "",
                col2Items: [],
                showFeatured: false,
                featuredBadge: "",
                featuredTitle: "",
                featuredLinkText: "",
                featuredLinkUrl: "",
                featuredImage: "",
            },
        ],

        ctaText = "Let's Talk",
        ctaUrl = "#contact",
        ctaBgColor = "#111111",
        ctaTextColor = "#ffffff",

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
    const [forceSolid, setForceSolid] = useState(false)

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
        const findScrollParent = (
            el: HTMLElement | null
        ): HTMLElement | Window => {
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

    // Auto-detect background luminance behind the nav.
    // When overlayMode is on but the page behind the nav is light,
    // force solid mode so the nav text stays visible.
    useEffect(() => {
        if (!overlayMode) {
            setForceSolid(false)
            return
        }
        const checkBackground = () => {
            if (!navRef.current) return
            const rect = navRef.current.getBoundingClientRect()
            const x = rect.left + rect.width / 2
            const y = rect.bottom + 10
            const elements = document.elementsFromPoint(x, y)
            const behind = elements.find(
                (el) => !navRef.current!.contains(el)
            )
            if (!behind) {
                setForceSolid(true)
                return
            }
            // Walk up ancestry to find an opaque background color
            let node: Element | null = behind
            while (node && node !== document.documentElement) {
                const bg = getComputedStyle(node).backgroundColor
                const m = bg.match(
                    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/
                )
                if (m) {
                    const a =
                        m[4] !== undefined ? parseFloat(m[4]) : 1
                    if (a > 0.5) {
                        const lum =
                            (0.299 * +m[1] +
                                0.587 * +m[2] +
                                0.114 * +m[3]) /
                            255
                        setForceSolid(lum > 0.45)
                        return
                    }
                }
                node = node.parentElement
            }
            // No opaque background found - assume light page
            setForceSolid(true)
        }
        // Check after render settles, then periodically
        const raf = requestAnimationFrame(checkBackground)
        const interval = setInterval(checkBackground, 1500)
        return () => {
            cancelAnimationFrame(raf)
            clearInterval(interval)
        }
    }, [overlayMode])

    // --- Determine current visual state ---
    const isOverlay = overlayMode && !pastThreshold && !forceSolid

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

    // Find the active dropdown navLink
    const activeLink = activeDropdown
        ? navLinks.find(
              (l) => l.hasDropdown && l.label === activeDropdown
          )
        : null

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
                    transition:
                        "background-color 0.4s ease, border-color 0.4s ease",
                    backdropFilter: "none",
                    boxShadow:
                        !isOverlay && overlayMode
                            ? "0 2px 16px rgba(0,0,0,0.08)"
                            : "none",
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
                        <div
                            style={{
                                position: "relative",
                                height: logoFontSize + 8,
                            }}
                        >
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
                                    filter: !overlayLogoImage
                                        ? "brightness(0) invert(1)"
                                        : "none",
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
                                href={
                                    link.hasDropdown ? undefined : link.url
                                }
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
                                            style={{
                                                transition: "stroke 0.3s ease",
                                            }}
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
                        transition:
                            "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease",
                        fontFamily,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        border: isOverlay
                            ? "1px solid rgba(255,255,255,0.2)"
                            : "1px solid transparent",
                    }}
                >
                    {ctaText}
                </a>
            </div>

            {/* Mega Menu Dropdown - renders for whichever navLink is active */}
            {activeLink && (() => {
                const hasCol1 =
                    activeLink.col1Items && activeLink.col1Items.length > 0
                const hasCol2 =
                    activeLink.col2Items && activeLink.col2Items.length > 0
                const hasFeatured = activeLink.showFeatured

                if (!hasCol1 && !hasCol2 && !hasFeatured) return null

                const cols: string[] = []
                if (hasCol1) cols.push("1fr")
                if (hasCol2) cols.push("1fr")
                if (hasFeatured) cols.push("1.1fr")

                return (
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
                        onMouseEnter={() =>
                            setActiveDropdown(activeLink.label)
                        }
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <div
                            style={{
                                maxWidth: 1280,
                                margin: "0 auto",
                                padding: "36px 48px",
                                display: "grid",
                                gridTemplateColumns: cols.join(" "),
                                gap: 40,
                            }}
                        >
                            {/* Column 1 */}
                            {hasCol1 && (
                                <div>
                                    {activeLink.col1Label && (
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
                                            {activeLink.col1Label}
                                        </span>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                        }}
                                    >
                                        {activeLink.col1Items.map(
                                            (item, j) => (
                                                <a
                                                    key={j}
                                                    href={item.url}
                                                    style={{
                                                        textDecoration: "none",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "10px 12px",
                                                        borderRadius: 10,
                                                        transition:
                                                            "background-color 0.15s",
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
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Column 2 */}
                            {hasCol2 && (
                                <div>
                                    {activeLink.col2Label && (
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
                                            {activeLink.col2Label}
                                        </span>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                        }}
                                    >
                                        {activeLink.col2Items.map(
                                            (item, j) => (
                                                <a
                                                    key={j}
                                                    href={item.url}
                                                    style={{
                                                        textDecoration: "none",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "10px 12px",
                                                        borderRadius: 10,
                                                        transition:
                                                            "background-color 0.15s",
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
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Featured Card */}
                            {hasFeatured && (
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
                                            backgroundColor:
                                                "rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        {activeLink.featuredImage ? (
                                            <img
                                                src={activeLink.featuredImage}
                                                alt={activeLink.featuredTitle}
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
                                            {activeLink.featuredBadge}
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
                                            {activeLink.featuredTitle}
                                        </h4>
                                        <a
                                            href={activeLink.featuredLinkUrl}
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
                                            {activeLink.featuredLinkText}{" "}
                                            <span style={{ fontSize: 14 }}>
                                                &#8594;
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })()}
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
        description:
            "Logo shown when nav is transparent over hero. Falls back to inverted main logo.",
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

    // --- Nav Links (with inline dropdown configuration) ---
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
                // --- Column 1 ---
                col1Label: {
                    type: ControlType.String,
                    title: "Col 1 Label",
                    defaultValue: "COLUMN 1",
                    hidden: (props: any) => !props.hasDropdown,
                },
                col1Items: {
                    type: ControlType.Array,
                    title: "Col 1 Items",
                    maxCount: 8,
                    hidden: (props: any) => !props.hasDropdown,
                    control: {
                        type: ControlType.Object,
                        controls: {
                            title: {
                                type: ControlType.String,
                                title: "Title",
                                defaultValue: "Item",
                            },
                            description: {
                                type: ControlType.String,
                                title: "Description",
                                defaultValue: "Item description.",
                                displayTextArea: true,
                            },
                            url: {
                                type: ControlType.String,
                                title: "URL",
                                defaultValue: "#",
                            },
                        },
                    },
                },
                // --- Column 2 ---
                col2Label: {
                    type: ControlType.String,
                    title: "Col 2 Label",
                    defaultValue: "",
                    hidden: (props: any) => !props.hasDropdown,
                },
                col2Items: {
                    type: ControlType.Array,
                    title: "Col 2 Items",
                    maxCount: 8,
                    hidden: (props: any) => !props.hasDropdown,
                    control: {
                        type: ControlType.Object,
                        controls: {
                            title: {
                                type: ControlType.String,
                                title: "Title",
                                defaultValue: "Item",
                            },
                            description: {
                                type: ControlType.String,
                                title: "Description",
                                defaultValue: "Item description.",
                                displayTextArea: true,
                            },
                            url: {
                                type: ControlType.String,
                                title: "URL",
                                defaultValue: "#",
                            },
                        },
                    },
                },
                // --- Featured Card ---
                showFeatured: {
                    type: ControlType.Boolean,
                    title: "Show Featured",
                    defaultValue: false,
                    hidden: (props: any) => !props.hasDropdown,
                },
                featuredBadge: {
                    type: ControlType.String,
                    title: "Featured Badge",
                    defaultValue: "FEATURED",
                    hidden: (props: any) =>
                        !props.hasDropdown || !props.showFeatured,
                },
                featuredTitle: {
                    type: ControlType.String,
                    title: "Featured Title",
                    defaultValue: "Featured item title",
                    hidden: (props: any) =>
                        !props.hasDropdown || !props.showFeatured,
                },
                featuredLinkText: {
                    type: ControlType.String,
                    title: "Featured Link",
                    defaultValue: "Learn More",
                    hidden: (props: any) =>
                        !props.hasDropdown || !props.showFeatured,
                },
                featuredLinkUrl: {
                    type: ControlType.String,
                    title: "Featured URL",
                    defaultValue: "#",
                    hidden: (props: any) =>
                        !props.hasDropdown || !props.showFeatured,
                },
                featuredImage: {
                    type: ControlType.Image,
                    title: "Featured Image",
                    hidden: (props: any) =>
                        !props.hasDropdown || !props.showFeatured,
                },
            },
        },
        defaultValue: [
            {
                label: "Solutions",
                url: "#solutions",
                hasDropdown: true,
                col1Label: "INDUSTRIES",
                col1Items: [
                    {
                        title: "Media & Entertainment",
                        description:
                            "Cut CDN & storage costs 30-50% while keeping broadcast quality.",
                        url: "#media",
                    },
                    {
                        title: "AI / Machine Learning",
                        description:
                            "Smarter vision AI pipelines with guaranteed compression.",
                        url: "#ai",
                    },
                    {
                        title: "Autonomous Vehicles",
                        description:
                            "50% storage reduction with ML-safe compression for training data.",
                        url: "#automotive",
                    },
                    {
                        title: "Sports Streaming",
                        description:
                            "720p to 4K Super Resolution without doubling file size.",
                        url: "#sports",
                    },
                ],
                col2Label: "USE CASES",
                col2Items: [
                    {
                        title: "Reduce CDN Costs",
                        description:
                            "Deliver same visual quality at significantly lower bitrates.",
                        url: "#cdn",
                    },
                    {
                        title: "Improve Quality",
                        description:
                            "Enhance visual quality while maintaining or reducing file size.",
                        url: "#quality",
                    },
                    {
                        title: "Optimize Storage",
                        description:
                            "Reduce storage requirements by up to 50% without quality loss.",
                        url: "#storage",
                    },
                    {
                        title: "4K Upscaling",
                        description:
                            "Upscale legacy content to 4K resolution efficiently.",
                        url: "#upscaling",
                    },
                ],
                showFeatured: true,
                featuredBadge: "CASE STUDY",
                featuredTitle:
                    "Netflix Achieves 40% CDN Savings with CABR Technology",
                featuredLinkText: "Read Case Study",
                featuredLinkUrl: "#case-study",
                featuredImage: "",
            },
            {
                label: "Products",
                url: "#products",
                hasDropdown: true,
                col1Label: "PRODUCTS",
                col1Items: [],
                col2Label: "",
                col2Items: [],
                showFeatured: false,
                featuredBadge: "",
                featuredTitle: "",
                featuredLinkText: "",
                featuredLinkUrl: "",
                featuredImage: "",
            },
            {
                label: "Technology",
                url: "#technology",
                hasDropdown: false,
            },
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

    // --- Overlay Mode ---
    overlayMode: {
        type: ControlType.Boolean,
        title: "Overlay Mode",
        defaultValue: true,
        description:
            "Transparent on hero, solid after scroll. Use with HeroScroll.",
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
