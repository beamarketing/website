// Beamr Homepage - The Science Behind CABR Section
// Framer Code Component – premium centered layout with pixel particles

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState, useMemo } from "react"

interface StatItem {
    value: string
    label: string
}

interface Props {
    sectionLabel: string
    heading: string
    headingSize: number
    description: string
    linkText: string
    linkUrl: string
    buttonScale: number
    stats: StatItem[]
    mediaImage: string
    mediaVideo: string
    useVideo: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
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

function CABRScience(props: Props) {
    const {
        sectionLabel = "TECHNOLOGY",
        heading = "The Science Behind CABR",
        headingSize = 44,
        description = "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters. The result: dramatically smaller files with mathematically proven quality preservation.",
        linkText = "Learn More About CABR",
        linkUrl = "#cabr",
        buttonScale = 1,
        stats = [
            { value: "50%", label: "Smaller Files" },
            { value: "4K+", label: "Resolution Support" },
            { value: "100%", label: "Quality Preserved" },
        ],
        mediaImage = "",
        mediaVideo = "",
        useVideo = false,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        pixelCount = 40,
        pixelColor = "#4a5abb",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const sectionTopRef = useRef(0)

    // Generate deterministic pixel particles
    const particles = useMemo(() => {
        const rand = seededRandom(77)
        return Array.from({ length: pixelCount }, (_, i) => ({
            id: i,
            x: rand() * 100,
            y: rand() * 100,
            size: 6 + rand() * 6,
            opacity: 0.1 + rand() * 0.25,
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
            { threshold: 0.1 }
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

    // Inject CSS
    useEffect(() => {
        const id = "__cabr-science-css"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            @keyframes cabr-pixel-float {
                0% { transform: translateY(0); }
                100% { transform: translateY(-120vh); }
            }
            @keyframes cabr-echo-ring {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(2.2); opacity: 0; }
            }
            @keyframes cabr-arrow-nudge {
                0%, 100% { transform: translateX(0); }
                40% { transform: translateX(3px); }
                60% { transform: translateX(1px); }
                80% { transform: translateX(2px); }
            }
            @keyframes cabr-glow-pulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.7; }
            }
            .cabr-media-wrap {
                position: relative;
            }
            .cabr-media-wrap::before {
                content: '';
                position: absolute;
                inset: -1px;
                border-radius: 17px;
                padding: 1px;
                background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.08) 100%);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                pointer-events: none;
            }
            .cabr-stat-card {
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .cabr-stat-card:hover {
                transform: translateY(-2px);
                border-color: rgba(255,255,255,0.12) !important;
            }
            .cabr-cta-link {
                transition: border-color 0.25s ease, background 0.25s ease;
            }
            .cabr-cta-link:hover {
                border-color: currentColor;
                background: rgba(255,255,255,0.06);
            }
            .cabr-arrow-wrap {
                position: relative;
            }
            .cabr-arrow-wrap .cabr-echo-1,
            .cabr-arrow-wrap .cabr-echo-2,
            .cabr-arrow-wrap .cabr-echo-3 {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 1.5px solid currentColor;
                opacity: 0;
                pointer-events: none;
            }
            .cabr-cta-link:hover .cabr-arrow-wrap .cabr-echo-1 {
                animation: cabr-echo-ring 1s ease-out 0s infinite;
            }
            .cabr-cta-link:hover .cabr-arrow-wrap .cabr-echo-2 {
                animation: cabr-echo-ring 1s ease-out 0.25s infinite;
            }
            .cabr-cta-link:hover .cabr-arrow-wrap .cabr-echo-3 {
                animation: cabr-echo-ring 1s ease-out 0.5s infinite;
            }
            .cabr-cta-link:hover .cabr-arrow-svg {
                animation: cabr-arrow-nudge 0.8s ease-in-out infinite;
            }
        `
        document.head.appendChild(s)
    }, [])

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
                            animation: `cabr-pixel-float ${20 / p.speed}s linear ${p.delay}s infinite`,
                            transform: `translateY(${-parallaxOffset * p.speed}px)`,
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    maxWidth: 1080,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Centered Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 48,
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
                            display: "block",
                            marginBottom: 16,
                        }}
                    >
                        {sectionLabel}
                    </span>
                    <h2
                        style={{
                            fontSize: headingSize,
                            fontWeight: 700,
                            color: textColor,
                            margin: "0 0 16px",
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: 16,
                            color: secondaryTextColor,
                            margin: "0 auto",
                            maxWidth: 640,
                            lineHeight: 1.7,
                            fontFamily,
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* Media Area with glow */}
                <div
                    style={{
                        position: "relative",
                        marginBottom: 48,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(50px)",
                        transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
                    }}
                >
                    {/* Accent glow behind media */}
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "70%",
                            height: "60%",
                            transform: "translate(-50%, -50%)",
                            background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 70%)`,
                            animation: "cabr-glow-pulse 4s ease-in-out infinite",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />

                    <div
                        className="cabr-media-wrap"
                        style={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            aspectRatio: "16/9",
                            borderRadius: 16,
                            overflow: "hidden",
                            backgroundColor: cardBgColor,
                        }}
                    >
                        {useVideo && mediaVideo ? (
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                src={mediaVideo}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : mediaImage ? (
                            <img
                                src={mediaImage}
                                alt={heading}
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
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: `linear-gradient(135deg, ${cardBgColor} 0%, rgba(255,255,255,0.03) 100%)`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: "50%",
                                            border: `2px solid ${accentColor}40`,
                                            background: `${accentColor}10`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 28,
                                                color: accentColor,
                                                marginLeft: 3,
                                            }}
                                        >
                                            &#9654;
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        Add video or image
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 20,
                        marginBottom: 40,
                    }}
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="cabr-stat-card"
                            style={{
                                flex: "0 1 200px",
                                padding: "24px 20px",
                                borderRadius: 14,
                                backgroundColor: `${cardBgColor}cc`,
                                border: "1px solid rgba(255,255,255,0.06)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(40px)",
                                transition: `opacity 0.5s ease ${0.35 + i * 0.12}s, transform 0.5s ease ${0.35 + i * 0.12}s, border-color 0.3s ease`,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 30,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1,
                                }}
                            >
                                {stat.value}
                            </span>
                            <span
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    fontFamily,
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div
                    style={{
                        textAlign: "center",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(30px)",
                        transition: "opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s",
                    }}
                >
                    <a
                        href={linkUrl}
                        className="cabr-cta-link"
                        style={{
                            fontSize: Math.round(14 * buttonScale),
                            fontWeight: 600,
                            color: accentColor,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: Math.round(10 * buttonScale),
                            fontFamily,
                            padding: `${Math.round(10 * buttonScale)}px ${Math.round(8 * buttonScale)}px ${Math.round(10 * buttonScale)}px ${Math.round(20 * buttonScale)}px`,
                            borderRadius: 100,
                            border: `1px solid ${accentColor}30`,
                            background: `${accentColor}08`,
                            letterSpacing: "0.02em",
                        }}
                    >
                        {linkText}
                        <span
                            className="cabr-arrow-wrap"
                            style={{
                                width: Math.round(28 * buttonScale),
                                height: Math.round(28 * buttonScale),
                                position: "relative",
                                flexShrink: 0,
                                color: accentColor,
                            }}
                        >
                            <span className="cabr-echo-1" />
                            <span className="cabr-echo-2" />
                            <span className="cabr-echo-3" />
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
                                <svg className="cabr-arrow-svg" width={Math.round(12 * buttonScale)} height={Math.round(12 * buttonScale)} viewBox="0 0 12 12" fill="none">
                                    <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke={cardBgColor === "#0f1029" ? "#0f1029" : "#ffffff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(CABRScience, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "TECHNOLOGY",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The Science Behind CABR",
    },
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 44,
        min: 28,
        max: 64,
        step: 2,
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters. The result: dramatically smaller files with mathematically proven quality preservation.",
        displayTextArea: true,
    },
    linkText: {
        type: ControlType.String,
        title: "Link Text",
        defaultValue: "Learn More About CABR",
    },
    linkUrl: {
        type: ControlType.String,
        title: "Link URL",
        defaultValue: "#cabr",
    },
    buttonScale: {
        type: ControlType.Number,
        title: "Button Scale",
        defaultValue: 1,
        min: 0.75,
        max: 2,
        step: 0.05,
    },
    stats: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                value: {
                    type: ControlType.String,
                    title: "Value",
                    defaultValue: "50%",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Metric",
                },
            },
        },
        defaultValue: [
            { value: "50%", label: "Smaller Files" },
            { value: "4K+", label: "Resolution Support" },
            { value: "100%", label: "Quality Preserved" },
        ],
    },
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: false,
    },
    mediaVideo: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    mediaImage: {
        type: ControlType.Image,
        title: "Image",
        hidden: (props) => props.useVideo,
    },
    pixelCount: {
        type: ControlType.Number,
        title: "Pixel Count",
        defaultValue: 40,
        min: 0,
        max: 120,
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

export default CABRScience
