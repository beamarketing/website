// Beamr Homepage - Solutions Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState, useMemo } from "react"

interface SolutionCard {
    icon: string
    title: string
    description: string
    linkText: string
    linkUrl: string
    image: string
}

interface Props {
    sectionLabel: string
    heading: string
    headingSize: number
    subheading: string
    subheadingSize: number
    cardTitleSize: number
    cardDescSize: number
    buttonScale: number
    cardAspectRatio: number
    cards: SolutionCard[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    cardBorderRadius: number
    pixelCount: number
    pixelColor: string
    style?: React.CSSProperties
}

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
    let s = seed
    return () => {
        s = (s * 16807 + 0) % 2147483647
        return (s - 1) / 2147483646
    }
}

function Solutions(props: Props) {
    const {
        sectionLabel = "SOLUTIONS",
        heading = "Solutions for Your Industry",
        headingSize = 44,
        subheading = "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        subheadingSize = 17,
        cardTitleSize = 20,
        cardDescSize = 15,
        buttonScale = 1,
        cardAspectRatio = 0.72,
        cards = [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Reduce CDN and storage costs while maintaining pristine visual quality for streaming content.",
                linkText: "Explore",
                linkUrl: "#media",
                image: "",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "Compress video from vehicle cameras without losing critical visual details for AI training.",
                linkText: "Explore",
                linkUrl: "#automotive",
                image: "",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Optimize training data pipelines with smaller video files that preserve every detail AI needs.",
                linkText: "Explore",
                linkUrl: "#ai",
                image: "",
            },
        ],
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        cardBorderRadius = 16,
        pixelCount = 50,
        pixelColor = "#4a5abb",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const sectionTopRef = useRef(0)

    // Generate deterministic pixel particles
    const particles = useMemo(() => {
        const rand = seededRandom(42)
        return Array.from({ length: pixelCount }, (_, i) => ({
            id: i,
            x: rand() * 100,
            y: rand() * 100,
            size: 2 + rand() * 4,
            opacity: 0.12 + rand() * 0.28,
            speed: 0.3 + rand() * 0.7,
            delay: rand() * 20,
        }))
    }, [pixelCount])

    // Intersection observer for entrance animation
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.12 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Scroll listener for parallax pixels
    useEffect(() => {
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            sectionTopRef.current = rect.top
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Inject hover + animation CSS
    useEffect(() => {
        const id = "__solutions-hover-css"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            @keyframes sol-echo-ring {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(2.2); opacity: 0; }
            }
            @keyframes sol-arrow-nudge {
                0%, 100% { transform: translateX(0); }
                40% { transform: translateX(3px); }
                60% { transform: translateX(1px); }
                80% { transform: translateX(2px); }
            }
            @keyframes sol-pixel-float {
                0% { transform: translateY(0); }
                100% { transform: translateY(-120vh); }
            }
            .sol-card {
                transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .sol-card:hover {
                transform: translateY(-4px) scale(1.015);
                border-color: rgba(255,255,255,0.14) !important;
                box-shadow: 0 12px 32px rgba(0,0,0,0.25);
            }
            .sol-arrow-wrap {
                position: relative;
            }
            .sol-arrow-wrap .sol-echo-1,
            .sol-arrow-wrap .sol-echo-2,
            .sol-arrow-wrap .sol-echo-3 {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 1.5px solid currentColor;
                opacity: 0;
                pointer-events: none;
            }
            .sol-card:hover .sol-arrow-wrap .sol-echo-1 {
                animation: sol-echo-ring 1s ease-out 0s infinite;
            }
            .sol-card:hover .sol-arrow-wrap .sol-echo-2 {
                animation: sol-echo-ring 1s ease-out 0.25s infinite;
            }
            .sol-card:hover .sol-arrow-wrap .sol-echo-3 {
                animation: sol-echo-ring 1s ease-out 0.5s infinite;
            }
            .sol-card:hover .sol-arrow-svg {
                animation: sol-arrow-nudge 0.8s ease-in-out infinite;
            }
            .sol-card .sol-link {
                transition: border-color 0.25s ease, background 0.25s ease;
            }
            .sol-card:hover .sol-link {
                border-color: currentColor;
                background: rgba(255,255,255,0.06);
            }
        `
        document.head.appendChild(s)
    }, [])

    // Parallax offset for pixels based on scroll
    const parallaxOffset = sectionRef.current
        ? (scrollY - (scrollY + sectionTopRef.current)) * 0.15
        : 0

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Floating pixel particle background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                {particles.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: pixelColor,
                            opacity: p.opacity,
                            borderRadius: 1,
                            animation: `sol-pixel-float ${20 / p.speed}s linear ${p.delay}s infinite`,
                            transform: `translateY(${-parallaxOffset * p.speed}px)`,
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Section Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 56,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(40px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily,
                        }}
                    >
                        {sectionLabel}
                    </span>
                    <h2
                        style={{
                            fontSize: headingSize,
                            fontWeight: 700,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: subheadingSize,
                            color: secondaryTextColor,
                            margin: "16px auto 0",
                            maxWidth: 560,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Cards Grid */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 24,
                        flexWrap: "wrap",
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="sol-card"
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: cardBorderRadius,
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                aspectRatio: `${cardAspectRatio}`,
                                width: "auto",
                                flex: `0 0 auto`,
                                maxWidth: `calc((100% - ${(Math.min(cards.length, 3) - 1) * 24}px) / ${Math.min(cards.length, 3)})`,
                                opacity: visible ? 1 : 0,
                                transform: visible
                                    ? "translateY(0)"
                                    : "translateY(60px)",
                                transition: `opacity 0.6s ease ${0.15 + i * 0.15}s, transform 0.6s ease ${0.15 + i * 0.15}s, border-color 0.3s ease, box-shadow 0.3s ease`,
                            }}
                        >
                            {/* Card Image */}
                            <div
                                style={{
                                    width: "100%",
                                    flex: 1,
                                    minHeight: 0,
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            padding: 12,
                                            boxSizing: "border-box",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: `linear-gradient(135deg, ${cardBgColor} 0%, rgba(255,255,255,0.05) 100%)`,
                                        }}
                                    >
                                        <span style={{ fontSize: 48 }}>
                                            {card.icon}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div
                                style={{
                                    padding: "28px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    flexShrink: 0,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: cardTitleSize,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        fontFamily,
                                    }}
                                >
                                    {card.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: cardDescSize,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.6,
                                        fontFamily,
                                    }}
                                >
                                    {card.description}
                                </p>
                                <a
                                    href={card.linkUrl}
                                    className="sol-link"
                                    style={{
                                        fontSize: Math.round(14 * buttonScale),
                                        fontWeight: 600,
                                        color: accentColor,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: Math.round(10 * buttonScale),
                                        fontFamily,
                                        marginTop: 8,
                                        padding: `${Math.round(8 * buttonScale)}px ${Math.round(6 * buttonScale)}px ${Math.round(8 * buttonScale)}px ${Math.round(16 * buttonScale)}px`,
                                        borderRadius: 100,
                                        border: `1px solid ${accentColor}30`,
                                        background: `${accentColor}08`,
                                        letterSpacing: "0.02em",
                                        width: "fit-content",
                                    }}
                                >
                                    {card.linkText}
                                    <span
                                        className="sol-arrow-wrap"
                                        style={{
                                            width: Math.round(28 * buttonScale),
                                            height: Math.round(28 * buttonScale),
                                            position: "relative",
                                            flexShrink: 0,
                                            color: accentColor,
                                        }}
                                    >
                                        {/* Echo rings */}
                                        <span className="sol-echo-1" />
                                        <span className="sol-echo-2" />
                                        <span className="sol-echo-3" />
                                        {/* Arrow circle */}
                                        <span
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "50%",
                                                backgroundColor: accentColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "relative",
                                                zIndex: 1,
                                            }}
                                        >
                                            <svg className="sol-arrow-svg" width={Math.round(12 * buttonScale)} height={Math.round(12 * buttonScale)} viewBox="0 0 12 12" fill="none">
                                                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke={cardBgColor === "#0f1029" ? "#0f1029" : "#ffffff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Solutions, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "SOLUTIONS",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Solutions for Your Industry",
    },
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 44,
        min: 24,
        max: 72,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        displayTextArea: true,
    },
    subheadingSize: {
        type: ControlType.Number,
        title: "Subheading Size",
        defaultValue: 17,
        min: 12,
        max: 28,
        step: 1,
    },
    cardTitleSize: {
        type: ControlType.Number,
        title: "Card Title Size",
        defaultValue: 20,
        min: 14,
        max: 32,
        step: 1,
    },
    cardDescSize: {
        type: ControlType.Number,
        title: "Card Desc Size",
        defaultValue: 15,
        min: 12,
        max: 22,
        step: 1,
    },
    buttonScale: {
        type: ControlType.Number,
        title: "Button Scale",
        defaultValue: 1,
        min: 0.75,
        max: 2,
        step: 0.05,
    },
    cardAspectRatio: {
        type: ControlType.Number,
        title: "Card Ratio (W/H)",
        defaultValue: 0.72,
        min: 0.4,
        max: 1.5,
        step: 0.02,
    },
    cards: {
        type: ControlType.Array,
        title: "Solution Cards",
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
                    defaultValue: "Solution Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description of this solution.",
                    displayTextArea: true,
                },
                linkText: {
                    type: ControlType.String,
                    title: "Link Text",
                    defaultValue: "Explore",
                },
                linkUrl: {
                    type: ControlType.String,
                    title: "Link URL",
                    defaultValue: "#",
                },
                image: {
                    type: ControlType.Image,
                    title: "Card Image",
                },
            },
        },
        defaultValue: [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Reduce CDN and storage costs while maintaining pristine visual quality for streaming content.",
                linkText: "Explore",
                linkUrl: "#media",
                image: "",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "Compress video from vehicle cameras without losing critical visual details for AI training.",
                linkText: "Explore",
                linkUrl: "#automotive",
                image: "",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Optimize training data pipelines with smaller video files that preserve every detail AI needs.",
                linkText: "Explore",
                linkUrl: "#ai",
                image: "",
            },
        ],
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 32,
        step: 2,
    },
    pixelCount: {
        type: ControlType.Number,
        title: "Pixel Count",
        defaultValue: 50,
        min: 0,
        max: 150,
        step: 5,
    },
    pixelColor: {
        type: ControlType.Color,
        title: "Pixel Color",
        defaultValue: "#4a5abb",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#0f1029",
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
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Solutions
