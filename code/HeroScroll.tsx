// Beamr Homepage - Hero with Scroll-Driven Video Transition
// Full-screen video on load → contracts to rounded container on scroll
// Pair with Navigation (overlayMode: true) for transparent-to-solid nav
//
// Uses position:fixed overlay to bypass Framer's parent height/overflow constraints.
// Animation driven by window.scrollY directly.

import { addPropertyControls, ControlType } from "framer"
import {
    motion,
    useTransform,
    useSpring,
    useMotionValue,
} from "framer-motion"
import { useRef, useEffect, useState } from "react"

// --- Types ---

interface FloatingCard {
    label: string
    image: string
    position: string
    linkUrl: string
}

interface LogoItem {
    name: string
    image: string
    height: number
}

interface Props {
    // Content
    heading: string
    headingFontSize: number
    headingFontWeight: number
    headingLineHeight: number
    headingBottomPadding: number
    headingHighlightColor: string
    mobileBreakpoint: number
    mobileHeadingFontSize: number
    mobileHeadingLineHeight: number
    videoSrc: string
    posterImage: string
    useVideo: boolean

    // Floating cards
    cards: FloatingCard[]
    cardWidth: number

    // Logos
    logos: LogoItem[]
    showLogos: boolean

    // Navigation overlap (pulls hero behind sticky nav)
    navOverlap: number

    // Scroll behavior
    scrollDistance: number
    transitionStart: number
    transitionEnd: number

    // Colors & style
    accentColor: string
    cardBgColor: string
    pageBgLight: string
    overlayOpacity: number
    overlayStyle: "solid" | "pixels" | "noise"
    fontFamily: string
    videoContainedInset: number
    videoContainedTop: number
    videoContainedRadius: number
    videoContainedBottom: number

    style?: React.CSSProperties
}

function HeroScroll(props: Props) {
    const {
        heading = "Break the Video\nQuality-Cost-Time\nTrade-Off",
        headingFontSize = 52,
        headingFontWeight = 700,
        headingLineHeight = 85,
        headingBottomPadding = 12,
        headingHighlightColor = "#4F6BED",
        mobileBreakpoint = 768,
        mobileHeadingFontSize = 32,
        mobileHeadingLineHeight = 42,
        videoSrc = "",
        posterImage = "",
        useVideo = true,

        cards = [
            { label: "M&E", image: "", position: "top-left", linkUrl: "#" },
            { label: "AV", image: "", position: "right", linkUrl: "#" },
            { label: "CABR", image: "", position: "bottom-left", linkUrl: "#" },
        ],
        cardWidth = 220,

        logos = [
            { name: "NVIDIA", image: "", height: 20 },
            { name: "deluxe", image: "", height: 20 },
            { name: "NETFLIX", image: "", height: 20 },
            { name: "Paramount", image: "", height: 20 },
            { name: "JioHotstar", image: "", height: 20 },
            { name: "TAG", image: "", height: 20 },
        ],
        showLogos = true,

        navOverlap = 58,

        scrollDistance = 1200,
        transitionStart = 0.0,
        transitionEnd = 0.55,

        accentColor = "#4F6BED",
        cardBgColor = "#ffffff",
        pageBgLight = "#eef0f5",
        overlayOpacity = 0.35,
        overlayStyle = "solid" as const,
        fontFamily = "'Inter', sans-serif",
        videoContainedInset = 64,
        videoContainedTop = 80,
        videoContainedRadius = 20,
        videoContainedBottom = 80,

        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const scrollYProgress = useMotionValue(0)

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < mobileBreakpoint)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [mobileBreakpoint])

    // Track whether the hero overlay should be visible
    // (hidden once the component's layout space has scrolled fully out of view)
    const [heroVisible, setHeroVisible] = useState(true)

    // Inject minimal CSS reset
    useEffect(() => {
        const id = "__hero-reset-css"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
            }
        `
        document.head.appendChild(s)
    }, [])

    // Zero padding/margin/width constraints on Framer parent wrappers
    // Also clear transform/will-change/filter so position:fixed works correctly
    // and all elements share the root stacking context (nav z-index visible above hero)
    useEffect(() => {
        if (!containerRef.current) return
        const zeroParents = () => {
            let el = containerRef.current?.parentElement
            while (el && el !== document.body) {
                el.style.setProperty("padding-top", "0px", "important")
                el.style.setProperty("margin-top", "0px", "important")
                el.style.setProperty("gap", "0px", "important")
                el.style.setProperty("row-gap", "0px", "important")
                // Ensure Framer wrappers don't constrain width on mobile
                el.style.setProperty("width", "100%", "important")
                el.style.setProperty("max-width", "none", "important")
                // Clear properties that create stacking contexts, so
                // position:fixed works relative to viewport and z-index
                // competes in the root stacking context (nav stays visible)
                el.style.setProperty("transform", "none", "important")
                el.style.setProperty("will-change", "auto", "important")
                el.style.setProperty("filter", "none", "important")
                el.style.setProperty("contain", "none", "important")
                el = el.parentElement
            }
        }
        zeroParents()
        const raf1 = requestAnimationFrame(zeroParents)
        const raf2 = requestAnimationFrame(() =>
            requestAnimationFrame(zeroParents)
        )
        const observer = new MutationObserver(zeroParents)
        let el = containerRef.current.parentElement
        while (el && el !== document.body) {
            observer.observe(el, {
                attributes: true,
                attributeFilter: ["style"],
            })
            el = el.parentElement
        }
        return () => {
            cancelAnimationFrame(raf1)
            cancelAnimationFrame(raf2)
            observer.disconnect()
        }
    }, [])

    // Scroll-driven animation using window.scrollY directly.
    // The animation distance = scrollDistance * transitionEnd (e.g. 4000 * 0.15 = 600px).
    // Progress goes from 0→1 over the full scrollDistance.
    // The hero stays visible until the component's layout element scrolls out of view.
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        if (isMobile) return

        const update = () => {
            // Get scroll position from any scroll ancestor or window
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0

            // Calculate how far past the hero's starting position we've scrolled
            const elRect = el.getBoundingClientRect()
            const elTopInPage = scrollY + elRect.top
            const scrolled = scrollY - elTopInPage
            const totalTravel = scrollDistance - window.innerHeight
            if (totalTravel <= 0) {
                scrollYProgress.set(0)
                return
            }
            const progress = Math.min(Math.max(scrolled / totalTravel, 0), 1)
            scrollYProgress.set(progress)

            // Hide the fixed hero once the spacer scrolls out of view
            const componentBottom = elRect.bottom
            setHeroVisible(componentBottom > -20)
        }

        // Listen on window scroll + any Framer scroll containers
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update, { passive: true })

        // Also listen on Framer's scroll container if it exists
        const scrollContainers: HTMLElement[] = []
        let node: HTMLElement | null = el.parentElement
        while (node) {
            const s = getComputedStyle(node)
            if (/(auto|scroll)/.test(s.overflow + s.overflowY)) {
                scrollContainers.push(node)
                node.addEventListener("scroll", update, { passive: true })
            }
            node = node.parentElement
        }

        update()
        const raf1 = requestAnimationFrame(update)
        const raf2 = requestAnimationFrame(() =>
            requestAnimationFrame(update)
        )

        return () => {
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
            scrollContainers.forEach((c) =>
                c.removeEventListener("scroll", update)
            )
            cancelAnimationFrame(raf1)
            cancelAnimationFrame(raf2)
        }
    }, [scrollYProgress, scrollDistance, navOverlap, isMobile])

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
    const videoInsetTop = useTransform(smooth, [t0, t1], [0, videoContainedTop])
    const videoInsetBottom = useTransform(smooth, [t0, t1], [0, videoContainedBottom])
    const videoBorderRadius = useTransform(smooth, [t0, t1], [0, videoContainedRadius])

    // --- Page background ---
    const pageBg = useTransform(
        smooth,
        [t0, t0 + (t1 - t0) * 0.6, t1],
        ["#0f1117", "#0f1117", pageBgLight]
    )

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


    // Render heading with last two words in highlight color
    const renderHeading = () => {
        const words = heading.split(/(\s+)/)
        const wordIndices: number[] = []
        words.forEach((w, i) => {
            if (w.trim()) wordIndices.push(i)
        })
        if (wordIndices.length <= 2) {
            return <span style={{ color: headingHighlightColor }}>{heading}</span>
        }
        const splitAt = wordIndices[wordIndices.length - 2]
        const before = words.slice(0, splitAt).join("")
        const after = words.slice(splitAt).join("")
        return (
            <>
                {before}
                <span style={{ color: headingHighlightColor }}>{after}</span>
            </>
        )
    }

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

    // ========================
    // Shared video/overlay/heading renderer
    // ========================
    const renderVideoContainer = (insetProps?: {
        top: any; left: any; right: any; bottom: any; borderRadius: any
    }) => (
        <motion.div
            style={{
                position: "absolute",
                top: insetProps?.top ?? 0,
                left: insetProps?.left ?? 0,
                right: insetProps?.right ?? 0,
                bottom: insetProps?.bottom ?? 0,
                borderRadius: insetProps?.borderRadius ?? 0,
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

            {/* Dark overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity + 0.3}) 0%, rgba(0,0,0,${overlayOpacity * 0.2}) 50%, rgba(0,0,0,${overlayOpacity * 0.15}) 100%)`,
                    zIndex: 2,
                }}
            />
            {/* Pixel / noise texture overlay */}
            {overlayStyle !== "solid" && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        opacity: overlayOpacity,
                        mixBlendMode: "multiply",
                        ...(overlayStyle === "pixels"
                            ? {
                                  backgroundImage:
                                      "linear-gradient(0deg, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)",
                                  backgroundSize: "4px 4px",
                              }
                            : {
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                                  backgroundSize: "128px 128px",
                              }),
                    }}
                />
            )}

            {/* Heading — State 1: bottom-left */}
            <motion.div
                style={{
                    position: "absolute",
                    bottom: `${headingBottomPadding}%`,
                    left: "5%",
                    zIndex: 3,
                    opacity: headingBottomOpacity,
                    maxWidth: "55%",
                }}
            >
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: headingFontWeight,
                        color: "#ffffff",
                        lineHeight: `${headingLineHeight}px`,
                        margin: 0,
                        fontFamily,
                        letterSpacing: "-5px",
                        whiteSpace: "pre-line",
                        textShadow: "0 2px 40px rgba(0,0,0,0.3)",
                    }}
                >
                    {renderHeading()}
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
                        fontWeight: headingFontWeight,
                        color: "#ffffff",
                        lineHeight: `${headingLineHeight}px`,
                        margin: 0,
                        fontFamily,
                        letterSpacing: "-5px",
                        whiteSpace: "pre-line",
                        textShadow: "0 4px 40px rgba(0,0,0,0.4)",
                    }}
                >
                    {renderHeading()}
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
                                    height: logo.height || 20,
                                    objectFit: "contain",
                                    filter: "brightness(0) invert(1)",
                                    opacity: 0.8,
                                }}
                            />
                        ) : (
                            <span
                                key={i}
                                style={{
                                    fontSize: logo.height ? logo.height * 0.65 : 13,
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
    )

    // ========================
    // MOBILE — static hero, no scroll transition
    // ========================
    if (isMobile) {
        return (
            <div
                ref={containerRef}
                style={{
                    ...style,
                    position: "relative",
                    width: "100%",
                    height: "100vh",
                    marginTop: -navOverlap,
                    overflow: "hidden",
                    fontFamily,
                }}
            >
                {/* Video / Image background */}
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

                {/* Dark overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity + 0.3}) 0%, rgba(0,0,0,${overlayOpacity * 0.2}) 50%, rgba(0,0,0,${overlayOpacity * 0.15}) 100%)`,
                        zIndex: 2,
                    }}
                />
                {overlayStyle !== "solid" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            opacity: overlayOpacity,
                            mixBlendMode: "multiply",
                            ...(overlayStyle === "pixels"
                                ? {
                                      backgroundImage:
                                          "linear-gradient(0deg, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)",
                                      backgroundSize: "4px 4px",
                                  }
                                : {
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                                      backgroundSize: "128px 128px",
                                  }),
                        }}
                    />
                )}

                {/* Centered heading */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 24px",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: mobileHeadingFontSize,
                            fontWeight: headingFontWeight,
                            color: "#ffffff",
                            lineHeight: `${mobileHeadingLineHeight}px`,
                            margin: 0,
                            fontFamily,
                            letterSpacing: "-2px",
                            whiteSpace: "pre-line",
                            textShadow: "0 2px 40px rgba(0,0,0,0.3)",
                        }}
                    >
                        {renderHeading()}
                    </h1>
                </div>

                {/* Logo bar */}
                {showLogos && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 24,
                            left: 0,
                            right: 0,
                            zIndex: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 24,
                            flexWrap: "wrap",
                            padding: "0 16px",
                        }}
                    >
                        {logos.map((logo, i) =>
                            logo.image ? (
                                <img
                                    key={i}
                                    src={logo.image}
                                    alt={logo.name}
                                    style={{
                                        height: Math.min(logo.height || 20, 16),
                                        objectFit: "contain",
                                        filter: "brightness(0) invert(1)",
                                        opacity: 0.8,
                                    }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: 11,
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
                    </div>
                )}
            </div>
        )
    }

    // ========================
    // DESKTOP — scroll-driven transition using position:fixed overlay
    // ========================
    return (
        <>
            {/* Layout spacer — just tall enough for the scroll transition,
                keeps the gap to the next section minimal */}
            <div
                ref={containerRef}
                style={{
                    ...style,
                    width: "100%",
                    height: "15vh",
                    marginTop: -navOverlap,
                }}
            />

            {/* Fixed hero overlay — position:fixed bypasses Framer layout.
                Parent transforms cleared in zeroParents so z-index works
                globally and nav (z-index 1100) stays above hero (z-index 40). */}
            {heroVisible && (
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 40,
                        overflow: "hidden",
                        backgroundColor: pageBg,
                        fontFamily,
                        pointerEvents: "auto",
                    }}
                >
                    {/* VIDEO CONTAINER */}
                    {renderVideoContainer({
                        top: videoInsetTop,
                        left: videoInsetLeft,
                        right: videoInsetRight,
                        bottom: videoInsetBottom,
                        borderRadius: videoBorderRadius,
                    })}

                    {/* FLOATING CARDS — State 2 */}
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
                            <motion.a
                                key={i}
                                href={card.linkUrl || "#"}
                                style={{
                                    ...getCardStyle(card.position, i),
                                    display: "block",
                                    backgroundColor: cardBgColor,
                                    borderRadius: 16,
                                    boxShadow:
                                        "0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                                    overflow: "hidden",
                                    pointerEvents: "auto",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                }}
                                initial={false}
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
                                }}
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

                                {/* Card label */}
                                <div
                                    style={{
                                        padding: "12px 16px 14px",
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
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </>
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
    headingFontWeight: {
        type: ControlType.Enum,
        title: "Font Weight",
        options: [300, 400, 500, 600, 700, 800, 900],
        optionTitles: [
            "300 Light",
            "400 Regular",
            "500 Medium",
            "600 Semi-Bold",
            "700 Bold",
            "800 Extra-Bold",
            "900 Black",
        ],
        defaultValue: 700,
    },
    headingLineHeight: {
        type: ControlType.Number,
        title: "Line Height (px)",
        defaultValue: 85,
        min: 20,
        max: 200,
        step: 1,
    },
    headingBottomPadding: {
        type: ControlType.Number,
        title: "Title Bottom %",
        defaultValue: 12,
        min: 0,
        max: 40,
        step: 1,
        description: "Title distance from bottom as percentage",
    },
    headingHighlightColor: {
        type: ControlType.Color,
        title: "Title Highlight",
        defaultValue: "#4F6BED",
        description: "Color for the last two words of the heading",
    },

    // --- Mobile ---
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile Breakpoint",
        defaultValue: 768,
        min: 320,
        max: 1024,
        step: 8,
        description: "Width below which mobile layout activates",
    },
    mobileHeadingFontSize: {
        type: ControlType.Number,
        title: "Mobile Font Size",
        defaultValue: 32,
        min: 18,
        max: 60,
        step: 1,
    },
    mobileHeadingLineHeight: {
        type: ControlType.Number,
        title: "Mobile Line Height",
        defaultValue: 42,
        min: 16,
        max: 120,
        step: 1,
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
        title: "Overlay Opacity",
        defaultValue: 0.35,
        min: 0,
        max: 0.8,
        step: 0.05,
    },
    overlayStyle: {
        type: ControlType.Enum,
        title: "Overlay Style",
        options: ["solid", "pixels", "noise"],
        optionTitles: ["Solid Black", "Pixel Grid", "Noise / Grain"],
        defaultValue: "solid",
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
                linkUrl: {
                    type: ControlType.String,
                    title: "Link URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { label: "M&E", image: "", position: "top-left", linkUrl: "#" },
            { label: "AV", image: "", position: "right", linkUrl: "#" },
            { label: "CABR", image: "", position: "bottom-left", linkUrl: "#" },
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
                height: {
                    type: ControlType.Number,
                    title: "Height (px)",
                    defaultValue: 20,
                    min: 8,
                    max: 60,
                    step: 1,
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "", height: 20 },
            { name: "deluxe", image: "", height: 20 },
            { name: "NETFLIX", image: "", height: 20 },
            { name: "Paramount", image: "", height: 20 },
            { name: "JioHotstar", image: "", height: 20 },
            { name: "TAG", image: "", height: 20 },
        ],
    },

    // --- Nav Overlap ---
    navOverlap: {
        type: ControlType.Number,
        title: "Nav Overlap",
        defaultValue: 58,
        min: 0,
        max: 120,
        step: 2,
        description: "Pulls hero up behind the sticky Navigation (px)",
    },

    // --- Scroll Behavior ---
    scrollDistance: {
        type: ControlType.Number,
        title: "Scroll Height",
        defaultValue: 1200,
        min: 400,
        max: 8000,
        step: 50,
        description: "Total scroll length — increase for more hold time after transition",
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
        defaultValue: 0.55,
        min: 0.05,
        max: 1.0,
        step: 0.05,
        description: "Lower = transition finishes sooner, more hold time after",
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
        title: "Video Inset L/R",
        defaultValue: 64,
        min: 0,
        max: 200,
        step: 4,
    },
    videoContainedTop: {
        type: ControlType.Number,
        title: "Video Top",
        defaultValue: 80,
        min: 0,
        max: 200,
        step: 4,
        description: "Top padding when video contracts (clear the nav)",
    },
    videoContainedBottom: {
        type: ControlType.Number,
        title: "Video Bottom",
        defaultValue: 80,
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
