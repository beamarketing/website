// Beamr Homepage - Hero with Scroll-Driven Video Transition
// Full-screen video on load with transparent nav overlay →
// contracts to rounded container on scroll, regular sticky nav takes over
//
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"

// --- Types ---

interface NavLink {
    label: string
    url: string
    hasDropdown: boolean
}

interface FloatingCard {
    label: string
    image: string
    position: string
}

interface LogoItem {
    name: string
    image: string
}

interface Props {
    // Content
    heading: string
    headingFontSize: number
    videoSrc: string
    posterImage: string
    useVideo: boolean

    // Overlay Navigation
    showOverlayNav: boolean
    navLogoText: string
    navLogoImage: string
    navUseLogoImage: boolean
    navLogoIconColor: string
    navLinks: NavLink[]
    navCtaText: string
    navCtaUrl: string

    // Floating cards
    cards: FloatingCard[]
    cardWidth: number

    // Logos
    logos: LogoItem[]
    showLogos: boolean

    // Scroll behavior
    scrollDistance: number
    transitionStart: number
    transitionEnd: number

    // Colors & style
    accentColor: string
    cardBgColor: string
    pageBgLight: string
    overlayOpacity: number
    fontFamily: string
    videoContainedInset: number
    videoContainedRadius: number
    videoContainedBottom: number

    style?: React.CSSProperties
}

function HeroScroll(props: Props) {
    const {
        heading = "Break the Video\nQuality-Cost-Time\nTrade-Off",
        headingFontSize = 52,
        videoSrc = "",
        posterImage = "",
        useVideo = true,

        // Overlay Nav
        showOverlayNav = true,
        navLogoText = "beamr",
        navLogoImage = "",
        navUseLogoImage = false,
        navLogoIconColor = "#6C5CE7",
        navLinks = [
            { label: "Solutions", url: "#solutions", hasDropdown: true },
            { label: "Products", url: "#products", hasDropdown: true },
            { label: "Technology", url: "#technology", hasDropdown: false },
            { label: "Blog", url: "#blog", hasDropdown: false },
            { label: "Company", url: "#company", hasDropdown: false },
        ],
        navCtaText = "Let's Talk",
        navCtaUrl = "#contact",

        cards = [
            { label: "M&E", image: "", position: "top-left" },
            { label: "AV", image: "", position: "right" },
            { label: "CABR", image: "", position: "bottom-left" },
        ],
        cardWidth = 220,

        logos = [
            { name: "NVIDIA", image: "" },
            { name: "deluxe", image: "" },
            { name: "NETFLIX", image: "" },
            { name: "Paramount", image: "" },
            { name: "JioHotstar", image: "" },
            { name: "TAG", image: "" },
        ],
        showLogos = true,

        scrollDistance = 800,
        transitionStart = 0.0,
        transitionEnd = 0.5,

        accentColor = "#4F6BED",
        cardBgColor = "#ffffff",
        pageBgLight = "#eef0f5",
        overlayOpacity = 0.35,
        fontFamily = "'Inter', sans-serif",
        videoContainedInset = 64,
        videoContainedRadius = 20,
        videoContainedBottom = 48,

        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    const smooth = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001,
    })

    const t0 = transitionStart
    const t1 = transitionEnd

    // --- Video container ---
    const videoInsetLeft = useTransform(smooth, [t0, t1], [0, videoContainedInset])
    const videoInsetRight = useTransform(smooth, [t0, t1], [0, videoContainedInset])
    const videoInsetTop = useTransform(smooth, [t0, t1], [0, 40])
    const videoInsetBottom = useTransform(smooth, [t0, t1], [0, videoContainedBottom])
    const videoBorderRadius = useTransform(smooth, [t0, t1], [0, videoContainedRadius])

    // --- Page background ---
    const pageBg = useTransform(
        smooth,
        [t0, t0 + (t1 - t0) * 0.6, t1],
        ["#0f1117", "#0f1117", pageBgLight]
    )

    // --- Overlay nav ---
    const navOpacity = useTransform(smooth, [t0, t0 + (t1 - t0) * 0.35], [1, 0])

    // --- Heading: bottom-left → center (cross-fade) ---
    const headingBottomOpacity = useTransform(smooth, [t0, t0 + (t1 - t0) * 0.5], [1, 0])
    const headingCenterOpacity = useTransform(smooth, [t0 + (t1 - t0) * 0.4, t1], [0, 1])

    // --- Logo bar ---
    const logosOpacity = useTransform(smooth, [t0, t0 + (t1 - t0) * 0.4], [1, 0])
    const logosY = useTransform(smooth, [t0, t0 + (t1 - t0) * 0.4], [0, 20])

    // --- Floating cards ---
    const cardsOpacity = useTransform(smooth, [t0 + (t1 - t0) * 0.5, t1], [0, 1])
    const cardsScale = useTransform(smooth, [t0 + (t1 - t0) * 0.5, t1], [0.9, 1])
    const cardsY = useTransform(smooth, [t0 + (t1 - t0) * 0.5, t1], [40, 0])

    const getCardStyle = (position: string, index: number): React.CSSProperties => {
        const base: React.CSSProperties = {
            position: "absolute",
            width: cardWidth,
            zIndex: 10,
        }
        switch (position) {
            case "top-left":
                return { ...base, top: "10%", left: "2%" }
            case "right":
                return { ...base, top: "30%", right: "1%" }
            case "bottom-left":
                return { ...base, bottom: "8%", left: "0%" }
            case "top-right":
                return { ...base, top: "10%", right: "2%" }
            case "bottom-right":
                return { ...base, bottom: "8%", right: "2%" }
            default:
                return { ...base, top: `${15 + index * 25}%`, left: "2%" }
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                height: scrollDistance,
                position: "relative",
                width: "100%",
            }}
        >
            {/* Sticky viewport — exactly 100vh */}
            <motion.div
                style={{
                    position: "sticky",
                    top: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    backgroundColor: pageBg,
                    fontFamily,
                    zIndex: showOverlayNav ? 1001 : "auto",
                }}
            >
                {/* ================================
                    TRANSPARENT OVERLAY NAVIGATION
                    ================================ */}
                {showOverlayNav && (
                    <motion.nav
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1001,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 48px",
                            opacity: navOpacity,
                            boxSizing: "border-box",
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
                            {navUseLogoImage && navLogoImage ? (
                                <img
                                    src={navLogoImage}
                                    alt={navLogoText}
                                    style={{
                                        height: 30,
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <>
                                    <div
                                        style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: 6,
                                            backgroundColor: navLogoIconColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
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
                                    <span
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: "#ffffff",
                                            letterSpacing: "-0.01em",
                                            fontFamily,
                                        }}
                                    >
                                        {navLogoText}
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
                                <a
                                    key={i}
                                    href={link.hasDropdown ? undefined : link.url}
                                    style={{
                                        color: "rgba(255,255,255,0.9)",
                                        textDecoration: "none",
                                        fontSize: 15,
                                        fontWeight: 500,
                                        fontFamily,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "color 0.2s",
                                    }}
                                >
                                    {link.label}
                                    {link.hasDropdown && (
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 4.5L6 7.5L9 4.5"
                                                stroke="rgba(255,255,255,0.7)"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>

                        {/* CTA */}
                        <a
                            href={navCtaUrl}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(8px)",
                                color: "#ffffff",
                                padding: "10px 24px",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily,
                                whiteSpace: "nowrap",
                                border: "1px solid rgba(255,255,255,0.2)",
                                transition: "background 0.2s",
                                flexShrink: 0,
                            }}
                        >
                            {navCtaText}
                        </a>
                    </motion.nav>
                )}

                {/* ================================
                    VIDEO CONTAINER
                    ================================ */}
                <motion.div
                    style={{
                        position: "absolute",
                        top: videoInsetTop,
                        left: videoInsetLeft,
                        right: videoInsetRight,
                        bottom: videoInsetBottom,
                        borderRadius: videoBorderRadius,
                        overflow: "hidden",
                        zIndex: 1,
                    }}
                >
                    {/* Video / Image */}
                    {useVideo && videoSrc ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            src={videoSrc}
                            poster={posterImage || undefined}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        />
                    ) : posterImage ? (
                        <img
                            src={posterImage}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                background:
                                    "linear-gradient(135deg, #1a1b35 0%, #2d2d6a 50%, #1a2a4a 100%)",
                            }}
                        />
                    )}

                    {/* Dark overlay gradient */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity + 0.3}) 0%, rgba(0,0,0,${overlayOpacity * 0.2}) 50%, rgba(0,0,0,${overlayOpacity * 0.15}) 100%)`,
                            zIndex: 2,
                        }}
                    />

                    {/* Heading — State 1: bottom-left */}
                    <motion.div
                        style={{
                            position: "absolute",
                            bottom: "12%",
                            left: "5%",
                            zIndex: 3,
                            opacity: headingBottomOpacity,
                            maxWidth: "55%",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: headingFontSize,
                                fontWeight: 700,
                                color: "#ffffff",
                                lineHeight: 1.05,
                                margin: 0,
                                fontFamily,
                                letterSpacing: "-0.03em",
                                whiteSpace: "pre-line",
                                textShadow: "0 2px 40px rgba(0,0,0,0.3)",
                            }}
                        >
                            {heading}
                        </h1>
                    </motion.div>

                    {/* Heading — State 2: centered */}
                    <motion.div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                            zIndex: 3,
                            opacity: headingCenterOpacity,
                            width: "80%",
                            textAlign: "center",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: headingFontSize * 0.9,
                                fontWeight: 700,
                                color: "#ffffff",
                                lineHeight: 1.05,
                                margin: 0,
                                fontFamily,
                                letterSpacing: "-0.03em",
                                whiteSpace: "pre-line",
                                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
                            }}
                        >
                            {heading}
                        </h1>
                    </motion.div>

                    {/* Logo bar — State 1 only */}
                    {showLogos && (
                        <motion.div
                            style={{
                                position: "absolute",
                                bottom: 28,
                                left: 0,
                                right: 0,
                                zIndex: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 48,
                                opacity: logosOpacity,
                                y: logosY,
                            }}
                        >
                            {logos.map((logo, i) =>
                                logo.image ? (
                                    <img
                                        key={i}
                                        src={logo.image}
                                        alt={logo.name}
                                        style={{
                                            height: 20,
                                            objectFit: "contain",
                                            filter: "brightness(0) invert(1)",
                                            opacity: 0.8,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "rgba(255,255,255,0.7)",
                                            letterSpacing: "0.04em",
                                            fontFamily,
                                        }}
                                    >
                                        {logo.name}
                                    </span>
                                )
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* ================================
                    FLOATING CARDS — State 2
                    ================================ */}
                <motion.div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                        opacity: cardsOpacity,
                        scale: cardsScale,
                        y: cardsY,
                        pointerEvents: "none",
                    }}
                >
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            style={{
                                ...getCardStyle(card.position, i),
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                boxShadow:
                                    "0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                                overflow: "hidden",
                                pointerEvents: "auto",
                            }}
                            initial={false}
                        >
                            {/* Card image */}
                            <div
                                style={{
                                    width: "100%",
                                    height: cardWidth * 0.55,
                                    backgroundColor: "#f3f4f6",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.label}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "#9ca3af",
                                            fontFamily,
                                        }}
                                    >
                                        Blog Post Image
                                    </span>
                                )}
                            </div>

                            {/* Card footer */}
                            <div
                                style={{
                                    padding: "12px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#1a1a2e",
                                        fontFamily,
                                    }}
                                >
                                    {card.label}
                                </span>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        backgroundColor: accentColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M3 1.5L10 6L3 10.5V1.5Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Pill placeholder */}
                            <div style={{ padding: "0 16px 14px" }}>
                                <div
                                    style={{
                                        width: "70%",
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: "#e5e7eb",
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}

addPropertyControls(HeroScroll, {
    // --- Content ---
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Break the Video\nQuality-Cost-Time\nTrade-Off",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 52,
        min: 28,
        max: 80,
        step: 2,
    },

    // --- Media ---
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: true,
    },
    videoSrc: {
        type: ControlType.File,
        title: "Video File",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    posterImage: {
        type: ControlType.Image,
        title: "Poster / Image",
    },
    overlayOpacity: {
        type: ControlType.Number,
        title: "Overlay",
        defaultValue: 0.35,
        min: 0,
        max: 0.8,
        step: 0.05,
    },

    // --- Overlay Navigation ---
    showOverlayNav: {
        type: ControlType.Boolean,
        title: "Overlay Nav",
        defaultValue: true,
    },
    navLogoText: {
        type: ControlType.String,
        title: "Nav Logo Text",
        defaultValue: "beamr",
        hidden: (props) => !props.showOverlayNav,
    },
    navUseLogoImage: {
        type: ControlType.Boolean,
        title: "Nav Logo Image",
        defaultValue: false,
        hidden: (props) => !props.showOverlayNav,
    },
    navLogoImage: {
        type: ControlType.Image,
        title: "Nav Logo File",
        hidden: (props) => !props.showOverlayNav || !props.navUseLogoImage,
    },
    navLogoIconColor: {
        type: ControlType.Color,
        title: "Nav Icon Color",
        defaultValue: "#6C5CE7",
        hidden: (props) => !props.showOverlayNav || props.navUseLogoImage,
    },
    navLinks: {
        type: ControlType.Array,
        title: "Nav Links",
        maxCount: 8,
        hidden: (props) => !props.showOverlayNav,
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
                    title: "Dropdown",
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
    navCtaText: {
        type: ControlType.String,
        title: "Nav CTA Text",
        defaultValue: "Let's Talk",
        hidden: (props) => !props.showOverlayNav,
    },
    navCtaUrl: {
        type: ControlType.String,
        title: "Nav CTA URL",
        defaultValue: "#contact",
        hidden: (props) => !props.showOverlayNav,
    },
    // --- Floating Cards ---
    cards: {
        type: ControlType.Array,
        title: "Floating Cards",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Card",
                },
                image: {
                    type: ControlType.Image,
                    title: "Card Image",
                },
                position: {
                    type: ControlType.Enum,
                    title: "Position",
                    options: [
                        "top-left",
                        "top-right",
                        "right",
                        "bottom-left",
                        "bottom-right",
                    ],
                    optionTitles: [
                        "Top Left",
                        "Top Right",
                        "Right",
                        "Bottom Left",
                        "Bottom Right",
                    ],
                    defaultValue: "top-left",
                },
            },
        },
        defaultValue: [
            { label: "M&E", image: "", position: "top-left" },
            { label: "AV", image: "", position: "right" },
            { label: "CABR", image: "", position: "bottom-left" },
        ],
    },
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        defaultValue: 220,
        min: 140,
        max: 320,
        step: 10,
    },

    // --- Logos ---
    showLogos: {
        type: ControlType.Boolean,
        title: "Show Logos",
        defaultValue: true,
    },
    logos: {
        type: ControlType.Array,
        title: "Logo Bar",
        maxCount: 10,
        hidden: (props) => !props.showLogos,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Brand",
                },
                image: {
                    type: ControlType.Image,
                    title: "Logo Image",
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "" },
            { name: "deluxe", image: "" },
            { name: "NETFLIX", image: "" },
            { name: "Paramount", image: "" },
            { name: "JioHotstar", image: "" },
            { name: "TAG", image: "" },
        ],
    },

    // --- Scroll Behavior ---
    scrollDistance: {
        type: ControlType.Number,
        title: "Scroll Height",
        defaultValue: 800,
        min: 400,
        max: 2000,
        step: 50,
    },
    transitionStart: {
        type: ControlType.Number,
        title: "Transition Start",
        defaultValue: 0.0,
        min: 0,
        max: 0.5,
        step: 0.05,
    },
    transitionEnd: {
        type: ControlType.Number,
        title: "Transition End",
        defaultValue: 0.5,
        min: 0.2,
        max: 1.0,
        step: 0.05,
    },

    // --- Styling ---
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4F6BED",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#ffffff",
    },
    pageBgLight: {
        type: ControlType.Color,
        title: "Page BG (scrolled)",
        defaultValue: "#eef0f5",
    },
    videoContainedInset: {
        type: ControlType.Number,
        title: "Video Inset",
        defaultValue: 64,
        min: 0,
        max: 200,
        step: 4,
    },
    videoContainedBottom: {
        type: ControlType.Number,
        title: "Video Bottom",
        defaultValue: 48,
        min: 0,
        max: 200,
        step: 4,
    },
    videoContainedRadius: {
        type: ControlType.Number,
        title: "Video Radius",
        defaultValue: 20,
        min: 0,
        max: 48,
        step: 2,
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default HeroScroll
