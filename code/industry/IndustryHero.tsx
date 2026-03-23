// ============================================
// FRAMER CODE COMPONENT — IndustryHero
// ============================================
// Hero section for a Beamr industry page (e.g. M&E).
// Left: label + title + subtitle + two CTA buttons.
// Right: decorative visual with stat cards and badge pills.
// Responsive: stacks vertically on narrow viewports.
// Self-contained with sensible defaults.
import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"
const HEADING_FONT =
    "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const BODY_FONT =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
// Original composition dimensions
const VISUAL_W = 902
const VISUAL_H = 523
export default function IndustryHero(props) {
    // ── Refs & responsive state ──────────────
    const sectionRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0.72)
    const [sectionWidth, setSectionWidth] = useState(1200)
    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0].contentRect.width
            setScale(Math.min(w / VISUAL_W, 1))
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])
    useEffect(() => {
        if (!sectionRef.current) return
        const ro = new ResizeObserver((entries) => {
            setSectionWidth(entries[0].contentRect.width)
        })
        ro.observe(sectionRef.current)
        return () => ro.disconnect()
    }, [])
    const isMobile = sectionWidth < 640
    const isStacked = sectionWidth < 900
    // ── Layout ──────────────────────────────
    var sectionWidthMode = props.sectionWidthMode || "fill"
    var sectionMaxWidth = props.sectionMaxWidth || 1440
    // ── Content visibility ──────────────────
    var showLabel = props.showLabel !== false
    var showTitle = props.showTitle !== false
    var showSubtitle = props.showSubtitle !== false
    var showButtons = props.showButtons !== false
    var showRightVisual = props.showRightVisual !== false
    // ── Props with defaults ──────────────────
    var label = props.label || "BEAMR FOR"
    var title = props.title || "Video optimization\nfor M&E"
    var subtitle =
        props.subtitle ||
        "Reduce CDN and storage costs by 30-50% while maintaining broadcast quality. Trusted by Netflix, Paramount, and tier-1 platforms."
    var button1Text = props.button1Text || "See it in Action"
    var button1Url = props.button1Url || ""
    var showButton1 = props.showButton1 !== false
    var button2Text = props.button2Text || "Request a Demo"
    var button2Url = props.button2Url || ""
    var showButton2 = props.showButton2 !== false
    var vmafScore = props.vmafScore || "97.2"
    var vmafLabel = props.vmafLabel || "VMAF Score"
    var vmafSubtext = props.vmafSubtext || "Quality preserved"
    var bitrateReduction = props.bitrateReduction || "50%"
    var bitrateLabel = props.bitrateLabel || "Bitrate Reduction"
    var bitrateSubtext = props.bitrateSubtext || "vs. standard encoding"
    var badgeText = props.badgeText || "4K HDR"
    var frameAnalysisText = props.frameAnalysisText || "Frame Analysis"
    var codecText = props.codecText || "Codec: HEVC"
    var cabrText = props.cabrText || "CABR™ Active"
    var background = props.background || "#FFFFFF"
    var labelColor = props.labelColor || "#3751FF"
    var titleColor = props.titleColor || "#171717"
    var subtitleColor = props.subtitleColor || "#666666"
    var button1Bg = props.button1Bg || "#3751FF"
    var button2Bg = props.button2Bg || "#333333"
    var accentColor = props.accentColor || "#3751FF"
    // ── Media ────────────────────────────────
    var mainVideoImage = props.mainVideoImage || ""
    var mainVideoSrc = props.mainVideoSrc || ""
    var smallVideoImage = props.smallVideoImage || ""
    var smallVideoSrc = props.smallVideoSrc || ""
    var videoAutoplay = props.videoAutoplay !== false
    var videoLoop = props.videoLoop !== false
    var videoMuted = props.videoMuted !== false
    // ── Logo Bar ─────────────────────────────
    var showLogoBar = props.showLogoBar !== false
    var logoBarLabel = props.logoBarLabel || "Trusted by"
    var logo1 = props.logo1 || ""
    var logo2 = props.logo2 || ""
    var logo3 = props.logo3 || ""
    var logo4 = props.logo4 || ""
    var logo5 = props.logo5 || ""
    var logos = [logo1, logo2, logo3, logo4, logo5].filter(Boolean)
    // ── Typography ───────────────────────────
    var headingFont = props.headingFont || "Poppins"
    var headingWeight = Number(props.headingWeight || 500)
    var bodyFont = props.bodyFont || "Inter"
    var bodyWeight = Number(props.bodyWeight || 500)
    var hFont = `'${headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    var bFont = `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    var baseTitleFS = props.titleFontSize || 72
    var titleFS = isMobile ? Math.round(baseTitleFS * 0.56) : isStacked ? Math.round(baseTitleFS * 0.78) : baseTitleFS
    // ── Visual element toggles (default all ON) ──
    var showGrid = props.showGrid !== false
    var showAccentRect = props.showAccentRect !== false
    var showPurpleRect = props.showPurpleRect !== false
    var showMainVideo = props.showMainVideo !== false
    var show4kBadge = props.show4kBadge !== false
    var showVmafCard = props.showVmafCard !== false
    var showFrameAnalysis = props.showFrameAnalysis !== false
    var showSmallVideo = props.showSmallVideo !== false
    var showCodecPill = props.showCodecPill !== false
    var showCabrPill = props.showCabrPill !== false
    var showBitrateCard = props.showBitrateCard !== false
    // ── CTA Button ─────────────────────────────
    function CTAButton({ text, bg, url }: { text: string; bg: string; url?: string }) {
        var btnStyle: React.CSSProperties = {
            fontFamily: bFont,
            fontSize: isMobile ? 14 : 16,
            fontWeight: 500,
            color: "#FFFFFF",
            background: bg,
            border: "none",
            borderRadius: 8,
            padding: isMobile ? "12px 20px" : "14px 28px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap" as any,
            textDecoration: "none",
        }
        var inner = (
            <>
                {text}
                <span style={{ fontSize: 18, lineHeight: 1 }}>{"\u203A"}</span>
            </>
        )
        if (url) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" style={btnStyle}>
                    {inner}
                </a>
            )
        }
        return <button style={btnStyle}>{inner}</button>
    }
    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                maxWidth: sectionWidthMode === "fixed" ? sectionMaxWidth : undefined,
                margin: sectionWidthMode === "fixed" ? "0 auto" : undefined,
                background: background,
                padding: isMobile
                    ? "40px 20px"
                    : isStacked
                      ? "48px 40px"
                      : "64px 150px",
                boxSizing: "border-box" as any,
                ...props.style,
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: isStacked ? "column" : "row",
                    alignItems: isStacked ? "stretch" : "center",
                    gap: isStacked ? 40 : 64,
                }}
            >
                {/* ── Left: Text Content ─────────────── */}
                <div
                    style={{
                        flex: isStacked ? "none" : "0 0 " + (props.leftColumnWidth || 40) + "%",
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? 16 : 24,
                    }}
                >
                    {/* Label */}
                    {showLabel && (
                        <span
                            style={{
                                fontFamily: hFont,
                                fontSize: 12,
                                fontWeight: 600,
                                color: labelColor,
                                textTransform: "uppercase" as any,
                                letterSpacing: "0.1em",
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {/* Title */}
                    {showTitle && (
                        <h1
                            style={{
                                fontFamily: hFont,
                                fontSize: titleFS,
                                fontWeight: headingWeight,
                                lineHeight: 1.04,
                                color: titleColor,
                                margin: 0,
                                whiteSpace: "pre-line" as any,
                            }}
                        >
                            {title}
                        </h1>
                    )}
                    {/* Subtitle */}
                    {showSubtitle && (
                        <p
                            style={{
                                fontFamily: bFont,
                                fontSize: isMobile ? 15 : 18,
                                fontWeight: bodyWeight,
                                lineHeight: "28px",
                                color: subtitleColor,
                                margin: 0,
                                maxWidth: 560,
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                    {/* CTA Buttons */}
                    {showButtons && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap" as any,
                                gap: 12,
                                marginTop: 8,
                            }}
                        >
                            {showButton1 && <CTAButton text={button1Text} bg={button1Bg} url={button1Url} />}
                            {showButton2 && <CTAButton text={button2Text} bg={button2Bg} url={button2Url} />}
                        </div>
                    )}
                    {/* Logo Bar */}
                    {showLogoBar && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 16 : 24,
                                marginTop: 8,
                                flexWrap: "wrap" as any,
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: bFont,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "#999999",
                                    whiteSpace: "nowrap" as any,
                                }}
                            >
                                {logoBarLabel}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: isMobile ? 20 : 32,
                                    flexWrap: "wrap" as any,
                                }}
                            >
                                {logos.length > 0
                                    ? logos.map((src, i) => (
                                          <img
                                              key={i}
                                              src={src}
                                              alt=""
                                              style={{
                                                  height: isMobile ? 20 : 24,
                                                  width: "auto",
                                                  objectFit: "contain" as any,
                                                  opacity: 0.6,
                                              }}
                                          />
                                      ))
                                    : /* Placeholder logos when none uploaded */
                                      [1, 2, 3, 4].map((_, i) => (
                                          <div
                                              key={i}
                                              style={{
                                                  width: isMobile ? 60 : 80,
                                                  height: isMobile ? 20 : 24,
                                                  borderRadius: 4,
                                                  background: "#E8E8E8",
                                              }}
                                          />
                                      ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* ── Right: Floating Cards Visual ────────── */}
                {showRightVisual && <div
                    ref={containerRef}
                    style={{
                        flex: isStacked ? "none" : "0 0 " + (props.rightColumnWidth || 55) + "%",
                        width: isStacked ? "100%" : undefined,
                        height: VISUAL_H * scale,
                        position: "relative" as any,
                        overflow: "hidden" as any,
                    }}
                >
                    <div
                        style={{
                            width: VISUAL_W,
                            height: VISUAL_H,
                            position: "absolute" as any,
                            top: 0,
                            left: 0,
                            transformOrigin: "top left",
                            transform: `scale(${scale})`,
                        }}
                    >
                        {/* Full-area grid background */}
                        {showGrid && (
                            <div
                                style={{
                                    position: "absolute" as any,
                                    inset: 0,
                                    backgroundImage:
                                        "linear-gradient(rgba(55,81,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(55,81,255,0.12) 1px, transparent 1px)",
                                    backgroundSize: "44px 44px",
                                }}
                            />
                        )}
                        {/* Left fade-out so grid blends into page */}
                        {showGrid && !isStacked && (
                            <div
                                style={{
                                    position: "absolute" as any,
                                    top: 0,
                                    left: 0,
                                    width: 160,
                                    height: "100%",
                                    background:
                                        "linear-gradient(90deg, white 0%, rgba(255,255,255,0) 100%)",
                                    zIndex: 1,
                                }}
                            />
                        )}
                        {/* Blue accent rectangle (bottom-right) */}
                        {showAccentRect && (
                            <div
                                style={{
                                    width: 106,
                                    height: 63,
                                    left: 764,
                                    top: 314.5,
                                    position: "absolute" as any,
                                    background: accentColor,
                                    boxShadow:
                                        "0px 4px 24px rgba(0,0,0,0.08)",
                                    borderRadius: 8,
                                }}
                            />
                        )}
                        {/* Main content area */}
                        <div
                            style={{
                                width: 801,
                                height: 450,
                                left: 50,
                                top: 36.5,
                                position: "absolute" as any,
                            }}
                        >
                            {/* Light purple decorative rect */}
                            {showPurpleRect && (
                                <div
                                    style={{
                                        width: 120,
                                        height: 112,
                                        left: 428,
                                        top: -3,
                                        position: "absolute" as any,
                                        background: "#EAEBFF",
                                        borderRadius: 13.17,
                                    }}
                                />
                            )}
                            {/* Video preview placeholder (main image) */}
                            {showMainVideo && (
                                <div
                                    style={{
                                        width: 392.93,
                                        height: 221.71,
                                        left: 135.52,
                                        top: 61.46,
                                        position: "absolute" as any,
                                        boxShadow:
                                            "0px 4.39px 26.34px rgba(0,0,0,0.08)",
                                        borderRadius: 13.17,
                                        background: "#8B93C4",
                                        overflow: "hidden" as any,
                                    }}
                                >
                                    {mainVideoSrc ? (
                                        <video
                                            src={mainVideoSrc}
                                            poster={mainVideoImage || undefined}
                                            autoPlay={videoAutoplay}
                                            loop={videoLoop}
                                            muted={videoMuted}
                                            playsInline
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    ) : mainVideoImage ? (
                                        <img
                                            src={mainVideoImage}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
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
                                                fontFamily: bFont,
                                                fontSize: 11,
                                                color: "rgba(255,255,255,0.6)",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            VIDEO PREVIEW
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* 4K HDR badge (top, over image) */}
                            {show4kBadge && (
                                <div
                                    style={{
                                        paddingLeft: 13.17,
                                        paddingRight: 13.17,
                                        paddingTop: 5.49,
                                        paddingBottom: 5.49,
                                        left: 308.41,
                                        top: 13.17,
                                        position: "absolute" as any,
                                        opacity: 0.75,
                                        background: "#F5F5F5",
                                        borderRadius: 54.88,
                                        outline: "1.1px #CCCCCC solid",
                                        outlineOffset: -1.1,
                                        backdropFilter: "blur(8.78px)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5.49,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 600,
                                            letterSpacing: "0.33px",
                                            color: "#666666",
                                        }}
                                    >
                                        {badgeText}
                                    </span>
                                </div>
                            )}
                            {/* VMAF Score card (dark, top-right) */}
                            {showVmafCard && (
                                <div
                                    style={{
                                        padding: "15.37px 19.76px",
                                        left: 643.37,
                                        top: 0,
                                        position: "absolute" as any,
                                        background: "#010314",
                                        borderRadius: 13.17,
                                        outline: "1.65px #3751FF solid",
                                        outlineOffset: -1.65,
                                        backdropFilter: "blur(8.78px)",
                                        display: "inline-flex",
                                        flexDirection: "column" as any,
                                        alignItems: "flex-start",
                                        gap: 4.39,
                                        zIndex: 2,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: hFont,
                                            fontSize: 9.88,
                                            fontWeight: 600,
                                            textTransform: "uppercase" as any,
                                            letterSpacing: "0.88px",
                                            color: "white",
                                        }}
                                    >
                                        {vmafLabel}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: hFont,
                                            fontSize: 39.51,
                                            fontWeight: 500,
                                            lineHeight: "48.29px",
                                            color: "white",
                                        }}
                                    >
                                        {vmafScore}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 500,
                                            color: "white",
                                        }}
                                    >
                                        {vmafSubtext}
                                    </span>
                                </div>
                            )}
                            {/* Frame Analysis pill */}
                            {showFrameAnalysis && (
                                <div
                                    style={{
                                        height: 26.34,
                                        padding: "5.49px 13.17px",
                                        left: 571.63,
                                        top: 183.29,
                                        position: "absolute" as any,
                                        background: "#1A2FDB",
                                        borderRadius: 54.88,
                                        backdropFilter: "blur(21.95px)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 600,
                                            letterSpacing: "0.33px",
                                            color: "#F5F5F5",
                                        }}
                                    >
                                        {frameAnalysisText}
                                    </span>
                                </div>
                            )}
                            {/* Small video thumbnail with dark overlay (bottom-right) */}
                            {showSmallVideo && (
                                <div
                                    style={{
                                        width: 235.98,
                                        height: 133.15,
                                        left: 529.02,
                                        top: 305.12,
                                        position: "absolute" as any,
                                        boxShadow:
                                            "0px 2.64px 15.82px rgba(0,0,0,0.08)",
                                        overflow: "hidden" as any,
                                        borderRadius: 8.78,
                                        background: "#5A6080",
                                    }}
                                >
                                    {smallVideoSrc ? (
                                        <video
                                            src={smallVideoSrc}
                                            poster={smallVideoImage || undefined}
                                            autoPlay={videoAutoplay}
                                            loop={videoLoop}
                                            muted={videoMuted}
                                            playsInline
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    ) : smallVideoImage ? (
                                        <img
                                            src={smallVideoImage}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
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
                                                fontFamily: bFont,
                                                fontSize: 9,
                                                color: "rgba(255,255,255,0.5)",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            THUMBNAIL
                                        </div>
                                    )}
                                    {/* Dark overlay */}
                                    <div
                                        style={{
                                            position: "absolute" as any,
                                            inset: 0,
                                            background: "rgba(0,0,0,0.36)",
                                        }}
                                    />
                                </div>
                            )}
                            {/* Codec: HEVC pill */}
                            {showCodecPill && (
                                <div
                                    style={{
                                        height: 26.34,
                                        padding: "5.49px 13.17px",
                                        left: 226.03,
                                        top: 332.56,
                                        position: "absolute" as any,
                                        background: "#000737",
                                        borderRadius: 54.88,
                                        backdropFilter: "blur(21.95px)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 600,
                                            letterSpacing: "0.33px",
                                            color: "#F5F5F5",
                                        }}
                                    >
                                        {codecText}
                                    </span>
                                </div>
                            )}
                            {/* CABR™ Active pill */}
                            {showCabrPill && (
                                <div
                                    style={{
                                        height: 26.34,
                                        padding: "5.49px 13.17px",
                                        left: 169.89,
                                        top: 372.07,
                                        position: "absolute" as any,
                                        background: "#162272",
                                        borderRadius: 54.88,
                                        backdropFilter: "blur(21.95px)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 600,
                                            letterSpacing: "0.33px",
                                            color: "#F5F5F5",
                                        }}
                                    >
                                        {cabrText}
                                    </span>
                                </div>
                            )}
                            {/* Bitrate Reduction card (light, left side) */}
                            {showBitrateCard && (
                                <div
                                    style={{
                                        padding: "15.37px 19.76px",
                                        left: 21.63,
                                        top: 151.18,
                                        position: "absolute" as any,
                                        background: "#F2F3FF",
                                        borderRadius: 13.17,
                                        outline: "1.65px #3751FF solid",
                                        outlineOffset: -1.65,
                                        backdropFilter: "blur(8.78px)",
                                        display: "inline-flex",
                                        flexDirection: "column" as any,
                                        alignItems: "flex-start",
                                        gap: 4.39,
                                        zIndex: 2,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: hFont,
                                            fontSize: 9.88,
                                            fontWeight: 600,
                                            textTransform: "uppercase" as any,
                                            letterSpacing: "0.88px",
                                            color: "#010314",
                                        }}
                                    >
                                        {bitrateLabel}
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: hFont,
                                                fontSize: 39.51,
                                                fontWeight: 500,
                                                lineHeight: "48.29px",
                                                color: "#010314",
                                            }}
                                        >
                                            {bitrateReduction.replace("%", "")}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: hFont,
                                                fontSize: 19.76,
                                                fontWeight: 500,
                                                lineHeight: "26.34px",
                                                color: "#010314",
                                            }}
                                        >
                                            %
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontFamily: bFont,
                                            fontSize: 10.98,
                                            fontWeight: 500,
                                            color: "#010314",
                                        }}
                                    >
                                        {bitrateSubtext}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>}
            </div>
        </section>
    )
}
addPropertyControls(IndustryHero, {
    // ── Content (top-level, always visible) ───────
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "BEAMR FOR",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Video optimization\nfor M&E",
        displayTextArea: true,
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue:
            "Reduce CDN and storage costs by 30-50% while maintaining broadcast quality. Trusted by Netflix, Paramount, and tier-1 platforms.",
        displayTextArea: true,
    },
    // ── Buttons ──────────────────────────────────
    showButton1: {
        type: ControlType.Boolean,
        title: "Show Button 1",
        defaultValue: true,
        section: "Buttons",
    },
    button1Text: {
        type: ControlType.String,
        title: "Button 1 Text",
        defaultValue: "See it in Action",
        section: "Buttons",
        hidden: (props) => props.showButton1 === false,
    },
    button1Url: {
        type: ControlType.String,
        title: "Button 1 URL",
        defaultValue: "",
        section: "Buttons",
        hidden: (props) => props.showButton1 === false,
    },
    button1Bg: {
        type: ControlType.Color,
        title: "Button 1 Color",
        defaultValue: "#3751FF",
        section: "Buttons",
        hidden: (props) => props.showButton1 === false,
    },
    showButton2: {
        type: ControlType.Boolean,
        title: "Show Button 2",
        defaultValue: true,
        section: "Buttons",
    },
    button2Text: {
        type: ControlType.String,
        title: "Button 2 Text",
        defaultValue: "Request a Demo",
        section: "Buttons",
        hidden: (props) => props.showButton2 === false,
    },
    button2Url: {
        type: ControlType.String,
        title: "Button 2 URL",
        defaultValue: "",
        section: "Buttons",
        hidden: (props) => props.showButton2 === false,
    },
    button2Bg: {
        type: ControlType.Color,
        title: "Button 2 Color",
        defaultValue: "#333333",
        section: "Buttons",
        hidden: (props) => props.showButton2 === false,
    },
    // ── Logo Bar ────────────────────────────────
    showLogoBar: {
        type: ControlType.Boolean,
        title: "Show Logo Bar",
        defaultValue: true,
        section: "Logo Bar",
    },
    logoBarLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Trusted by",
        section: "Logo Bar",
    },
    logo1: {
        type: ControlType.Image,
        title: "Logo 1",
        section: "Logo Bar",
    },
    logo2: {
        type: ControlType.Image,
        title: "Logo 2",
        section: "Logo Bar",
    },
    logo3: {
        type: ControlType.Image,
        title: "Logo 3",
        section: "Logo Bar",
    },
    logo4: {
        type: ControlType.Image,
        title: "Logo 4",
        section: "Logo Bar",
    },
    logo5: {
        type: ControlType.Image,
        title: "Logo 5",
        section: "Logo Bar",
    },
    // ── Right Visual Text ────────────────────────
    badgeText: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "4K HDR",
        section: "Right Visual Text",
    },
    vmafLabel: {
        type: ControlType.String,
        title: "VMAF Label",
        defaultValue: "VMAF Score",
        section: "Right Visual Text",
    },
    vmafScore: {
        type: ControlType.String,
        title: "VMAF Value",
        defaultValue: "97.2",
        section: "Right Visual Text",
    },
    vmafSubtext: {
        type: ControlType.String,
        title: "VMAF Subtext",
        defaultValue: "Quality preserved",
        section: "Right Visual Text",
    },
    frameAnalysisText: {
        type: ControlType.String,
        title: "Frame Analysis",
        defaultValue: "Frame Analysis",
        section: "Right Visual Text",
    },
    codecText: {
        type: ControlType.String,
        title: "Codec Pill",
        defaultValue: "Codec: HEVC",
        section: "Right Visual Text",
    },
    cabrText: {
        type: ControlType.String,
        title: "CABR Pill",
        defaultValue: "CABR™ Active",
        section: "Right Visual Text",
    },
    bitrateLabel: {
        type: ControlType.String,
        title: "Bitrate Label",
        defaultValue: "Bitrate Reduction",
        section: "Right Visual Text",
    },
    bitrateReduction: {
        type: ControlType.String,
        title: "Bitrate Value",
        defaultValue: "50%",
        section: "Right Visual Text",
    },
    bitrateSubtext: {
        type: ControlType.String,
        title: "Bitrate Subtext",
        defaultValue: "vs. standard encoding",
        section: "Right Visual Text",
    },
    // ── Media ────────────────────────────────────
    mainVideoSrc: {
        type: ControlType.File,
        title: "Main Video (mp4)",
        allowedFileTypes: ["mp4", "webm", "mov"],
        section: "Media",
    },
    mainVideoImage: {
        type: ControlType.Image,
        title: "Main Poster / Image",
        section: "Media",
    },
    smallVideoSrc: {
        type: ControlType.File,
        title: "Small Video (mp4)",
        allowedFileTypes: ["mp4", "webm", "mov"],
        section: "Media",
    },
    smallVideoImage: {
        type: ControlType.Image,
        title: "Small Poster / Image",
        section: "Media",
    },
    videoAutoplay: {
        type: ControlType.Boolean,
        title: "Autoplay",
        defaultValue: true,
        section: "Media",
    },
    videoLoop: {
        type: ControlType.Boolean,
        title: "Loop",
        defaultValue: true,
        section: "Media",
    },
    videoMuted: {
        type: ControlType.Boolean,
        title: "Muted",
        defaultValue: true,
        section: "Media",
    },
    // ── Typography ──────────────────────────────
    titleFontSize: {
        type: ControlType.Number,
        title: "Title Font Size",
        defaultValue: 72,
        min: 20,
        max: 120,
        step: 1,
        section: "Typography",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "Poppins",
        section: "Typography",
    },
    headingWeight: {
        type: ControlType.Enum,
        title: "Heading Weight",
        options: ["300", "400", "500", "600", "700", "800"],
        optionTitles: ["Light", "Regular", "Medium", "Semi Bold", "Bold", "Extra Bold"],
        defaultValue: "500",
        section: "Typography",
    },
    bodyFont: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "Inter",
        section: "Typography",
    },
    bodyWeight: {
        type: ControlType.Enum,
        title: "Body Weight",
        options: ["300", "400", "500", "600", "700"],
        optionTitles: ["Light", "Regular", "Medium", "Semi Bold", "Bold"],
        defaultValue: "500",
        section: "Typography",
    },
    // ── Colors ───────────────────────────────────
    background: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
        section: "Colors",
    },
    labelColor: {
        type: ControlType.Color,
        title: "Label",
        defaultValue: "#3751FF",
        section: "Colors",
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title",
        defaultValue: "#171717",
        section: "Colors",
    },
    subtitleColor: {
        type: ControlType.Color,
        title: "Subtitle",
        defaultValue: "#666666",
        section: "Colors",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#3751FF",
        section: "Colors",
    },
    // ── Layout ──────────────────────────────────
    sectionWidthMode: {
        type: ControlType.Enum,
        title: "Section Width",
        options: ["fill", "fixed"],
        optionTitles: ["Fill", "Fixed"],
        defaultValue: "fill",
        section: "Layout",
    },
    sectionMaxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 1440,
        min: 600,
        max: 2400,
        step: 10,
        section: "Layout",
        hidden: (props) => props.sectionWidthMode !== "fixed",
    },
    leftColumnWidth: {
        type: ControlType.Number,
        title: "Left Column %",
        defaultValue: 40,
        min: 20,
        max: 70,
        step: 1,
        section: "Layout",
    },
    rightColumnWidth: {
        type: ControlType.Number,
        title: "Right Column %",
        defaultValue: 55,
        min: 20,
        max: 70,
        step: 1,
        section: "Layout",
    },
    // ── Visibility ──────────────────────────────
    showLabel: {
        type: ControlType.Boolean,
        title: "Label",
        defaultValue: true,
        section: "Visibility",
    },
    showTitle: {
        type: ControlType.Boolean,
        title: "Title",
        defaultValue: true,
        section: "Visibility",
    },
    showSubtitle: {
        type: ControlType.Boolean,
        title: "Subtitle",
        defaultValue: true,
        section: "Visibility",
    },
    showButtons: {
        type: ControlType.Boolean,
        title: "CTA Buttons",
        defaultValue: true,
        section: "Visibility",
    },
    showRightVisual: {
        type: ControlType.Boolean,
        title: "Right Visual",
        defaultValue: true,
        section: "Visibility",
    },
    // ── Visual Elements ──────────────────────────
    showGrid: {
        type: ControlType.Boolean,
        title: "Grid Background",
        defaultValue: true,
        section: "Visual Elements",
    },
    showAccentRect: {
        type: ControlType.Boolean,
        title: "Blue Accent Rect",
        defaultValue: true,
        section: "Visual Elements",
    },
    showPurpleRect: {
        type: ControlType.Boolean,
        title: "Purple Deco Rect",
        defaultValue: true,
        section: "Visual Elements",
    },
    showMainVideo: {
        type: ControlType.Boolean,
        title: "Main Video",
        defaultValue: true,
        section: "Visual Elements",
    },
    show4kBadge: {
        type: ControlType.Boolean,
        title: "4K HDR Badge",
        defaultValue: true,
        section: "Visual Elements",
    },
    showVmafCard: {
        type: ControlType.Boolean,
        title: "VMAF Card",
        defaultValue: true,
        section: "Visual Elements",
    },
    showFrameAnalysis: {
        type: ControlType.Boolean,
        title: "Frame Analysis Pill",
        defaultValue: true,
        section: "Visual Elements",
    },
    showSmallVideo: {
        type: ControlType.Boolean,
        title: "Small Video",
        defaultValue: true,
        section: "Visual Elements",
    },
    showCodecPill: {
        type: ControlType.Boolean,
        title: "Codec: HEVC Pill",
        defaultValue: true,
        section: "Visual Elements",
    },
    showCabrPill: {
        type: ControlType.Boolean,
        title: "CABR™ Active Pill",
        defaultValue: true,
        section: "Visual Elements",
    },
    showBitrateCard: {
        type: ControlType.Boolean,
        title: "Bitrate Card",
        defaultValue: true,
        section: "Visual Elements",
    },
})
