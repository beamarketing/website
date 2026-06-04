import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

export default function CABRShowcase(props) {
    var sectionTitle =
        props.sectionTitle !== undefined ? props.sectionTitle : "What We Do"
    var sectionSubheader =
        props.sectionSubheader !== undefined ? props.sectionSubheader : ""
    var sectionSubheaderFont =
        props.sectionSubheaderFont !== undefined
            ? props.sectionSubheaderFont
            : "Inter, sans-serif"
    var sectionSubheaderSize =
        props.sectionSubheaderSize !== undefined
            ? props.sectionSubheaderSize
            : 18
    var sectionSubheaderWeight =
        props.sectionSubheaderWeight !== undefined
            ? props.sectionSubheaderWeight
            : 400
    var sectionSubheaderColor = props.sectionSubheaderColor || "#666666"
    var sectionTitleFont =
        props.sectionTitleFont !== undefined
            ? props.sectionTitleFont
            : "Poppins, sans-serif"
    var sectionTitleSize =
        props.sectionTitleSize !== undefined ? props.sectionTitleSize : 48
    var sectionTitleWeight =
        props.sectionTitleWeight !== undefined ? props.sectionTitleWeight : 600
    var sectionTitleColor = props.sectionTitleColor || "#171717"
    var sectionTitleAlign = props.sectionTitleAlign || "center"

    var items =
        props.items && props.items.length > 0
            ? props.items
            : [
                  {
                      cat: "",
                      title: "Content-Adaptive Encoding",
                      desc: "Our CABR technology analyzes each frame to find the optimal balance between quality and file size, delivering up to <b>50% bitrate reduction</b> without visible quality loss.",
                      image: "",
                      video: "",
                  },
                  {
                      cat: "",
                      title: "Perceptual Quality Metrics",
                      desc: "Built on decades of image science research, our quality metrics go beyond PSNR and SSIM to measure what the human eye actually perceives.",
                      image: "",
                      video: "",
                  },
                  {
                      cat: "",
                      title: "Scalable Cloud Processing",
                      desc: "Process thousands of hours of video content with our cloud-native architecture. Seamlessly integrate into existing workflows via <a href='#' target='_blank'>API or plugin</a>.",
                      image: "",
                      video: "",
                  },
              ]

    var catFont =
        props.catFont !== undefined ? props.catFont : "Inter, sans-serif"
    var catSize = props.catSize !== undefined ? props.catSize : 13
    var catWeight = props.catWeight !== undefined ? props.catWeight : 600
    var catColor = props.catColor || "#3751FF"
    var catSpacing = props.catSpacing !== undefined ? props.catSpacing : 2

    var titleFont =
        props.titleFont !== undefined ? props.titleFont : "Poppins, sans-serif"
    var titleSize = props.titleSize !== undefined ? props.titleSize : 32
    var titleWeight = props.titleWeight !== undefined ? props.titleWeight : 600
    var descFont =
        props.descFont !== undefined ? props.descFont : "Inter, sans-serif"
    var descSize = props.descSize !== undefined ? props.descSize : 16
    var descWeight = props.descWeight !== undefined ? props.descWeight : 400

    var background = props.background || "#FFFFFF"
    var titleColor = props.titleColor || "#171717"
    var descColor = props.descColor || "#666666"
    var linkColor = props.linkColor || "#3751FF"
    var visualBg = props.visualBg || "#F3F5FF"
    var visualHeight =
        props.visualHeight !== undefined ? props.visualHeight : 360
    var itemGap = props.itemGap !== undefined ? props.itemGap : 96
    var pv = props.paddingV !== undefined ? props.paddingV : 96
    var ph = props.paddingH !== undefined ? props.paddingH : 64
    var mobileBreakpoint =
        props.mobileBreakpoint !== undefined ? props.mobileBreakpoint : 768

    var containerRef = useRef(null)
    var _w = useState(1200)
    var width = _w[0]
    var setWidth = _w[1]

    useEffect(function () {
        if (!containerRef.current) return
        var ro = new ResizeObserver(function (entries) {
            setWidth(entries[0].contentRect.width)
        })
        ro.observe(containerRef.current)
        return function () {
            ro.disconnect()
        }
    }, [])

    var isMobile = width < mobileBreakpoint

    var allItems = items.map(function (item) {
        return {
            cat: item.cat || "",
            title: item.title || "Item Title",
            desc: item.desc || "",
            img: item.image || "",
            video: item.video || "",
        }
    })

    var mSectionTitleSize = isMobile
        ? Math.round(sectionTitleSize * 0.65)
        : sectionTitleSize
    var mTitleSize = isMobile ? Math.round(titleSize * 0.8) : titleSize
    var mDescSize = isMobile ? Math.max(14, descSize) : descSize
    var mVisualHeight = isMobile ? Math.round(visualHeight * 0.6) : visualHeight
    var mItemGap = isMobile ? Math.round(itemGap * 0.6) : itemGap
    var mPh = isMobile ? 20 : ph

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                padding: pv + "px " + mPh + "px",
                background: background,
                display: "flex",
                justifyContent: "center",
                boxSizing: "border-box",
                ...props.style,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 1248,
                    display: "flex",
                    flexDirection: "column",
                    gap: mItemGap,
                }}
            >
                {/* Section Title */}
                {(sectionTitle || sectionSubheader) && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            textAlign: sectionTitleAlign,
                        }}
                    >
                        {sectionTitle && (
                            <div
                                style={{
                                    fontFamily: sectionTitleFont,
                                    fontSize: mSectionTitleSize,
                                    fontWeight: sectionTitleWeight,
                                    lineHeight: mSectionTitleSize * 1.17 + "px",
                                    color: sectionTitleColor,
                                    margin: 0,
                                }}
                            >
                                {sectionTitle}
                            </div>
                        )}
                        {sectionSubheader && (
                            <div
                                style={{
                                    fontFamily: sectionSubheaderFont,
                                    fontSize: isMobile
                                        ? Math.round(
                                              sectionSubheaderSize * 0.85
                                          )
                                        : sectionSubheaderSize,
                                    fontWeight: sectionSubheaderWeight,
                                    lineHeight:
                                        sectionSubheaderSize * 1.5 + "px",
                                    color: sectionSubheaderColor,
                                    margin: 0,
                                    maxWidth: 700,
                                    marginLeft:
                                        sectionTitleAlign === "center"
                                            ? "auto"
                                            : 0,
                                    marginRight:
                                        sectionTitleAlign === "center"
                                            ? "auto"
                                            : 0,
                                }}
                            >
                                {sectionSubheader}
                            </div>
                        )}
                    </div>
                )}

                {/* Items */}
                {allItems.map(function (item, i) {
                    var reversed = i % 2 === 1

                    return (
                        <div
                            key={i}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: isMobile ? "stretch" : "center",
                                gap: isMobile ? 24 : 80,
                                flexDirection: isMobile
                                    ? "column"
                                    : reversed
                                      ? "row-reverse"
                                      : "row",
                            }}
                        >
                            {/* Text */}
                            <div
                                style={{
                                    flex: isMobile ? "none" : 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                    minWidth: 0,
                                }}
                            >
                                {item.cat && (
                                    <div
                                        style={{
                                            fontFamily: catFont,
                                            fontSize: catSize,
                                            fontWeight: catWeight,
                                            color: catColor,
                                            textTransform: "uppercase",
                                            letterSpacing: catSpacing,
                                            lineHeight: catSize * 1.4 + "px",
                                            margin: 0,
                                        }}
                                    >
                                        {item.cat}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontFamily: titleFont,
                                        fontSize: mTitleSize,
                                        fontWeight: titleWeight,
                                        lineHeight: mTitleSize * 1.22 + "px",
                                        color: titleColor,
                                        margin: 0,
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: descFont,
                                        fontSize: mDescSize,
                                        fontWeight: descWeight,
                                        lineHeight: mDescSize * 1.5 + "px",
                                        color: descColor,
                                        margin: 0,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: item.desc }}
                                />
                            </div>

                            {/* Visual */}
                            <div
                                style={{
                                    flex: isMobile ? "none" : 1,
                                    width: isMobile ? "100%" : "auto",
                                    minWidth: 0,
                                }}
                            >
                                {item.video ? (
                                    <video
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        style={{
                                            width: "100%",
                                            display: "block",
                                        }}
                                    />
                                ) : item.img ? (
                                    <img
                                        src={item.img}
                                        style={{
                                            width: "100%",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: mVisualHeight,
                                            background: visualBg,
                                            borderRadius: 12,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: 14,
                                                color: "#999",
                                            }}
                                        >
                                            Visual {i + 1}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Scoped link styles for HTML descriptions */}
            <style>{`
                div[dangerouslysetinnerhtml] a,
                div a {
                    color: ${linkColor};
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                div a:hover {
                    opacity: 0.75;
                }
            `}</style>
        </div>
    )
}

addPropertyControls(CABRShowcase, {
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "What We Do",
    },
    sectionTitleFont: {
        type: ControlType.String,
        title: "Section Title Font",
        defaultValue: "Poppins, sans-serif",
        section: "Section Title",
    },
    sectionTitleSize: {
        type: ControlType.Number,
        title: "Section Title Size",
        defaultValue: 48,
        min: 16,
        max: 96,
        section: "Section Title",
    },
    sectionTitleWeight: {
        type: ControlType.Number,
        title: "Section Title Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
        section: "Section Title",
    },
    sectionTitleColor: {
        type: ControlType.Color,
        title: "Section Title Color",
        defaultValue: "#171717",
        section: "Section Title",
    },
    sectionTitleAlign: {
        type: ControlType.Enum,
        title: "Section Title Align",
        defaultValue: "center",
        options: ["left", "center", "right"],
        section: "Section Title",
    },
    sectionSubheader: {
        type: ControlType.String,
        title: "Subheader",
        defaultValue: "",
        displayTextArea: true,
        section: "Section Title",
    },
    sectionSubheaderFont: {
        type: ControlType.String,
        title: "Subheader Font",
        defaultValue: "Inter, sans-serif",
        section: "Section Title",
    },
    sectionSubheaderSize: {
        type: ControlType.Number,
        title: "Subheader Size",
        defaultValue: 18,
        min: 10,
        max: 36,
        section: "Section Title",
    },
    sectionSubheaderWeight: {
        type: ControlType.Number,
        title: "Subheader Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
        section: "Section Title",
    },
    sectionSubheaderColor: {
        type: ControlType.Color,
        title: "Subheader Color",
        defaultValue: "#666666",
        section: "Section Title",
    },
    items: {
        type: ControlType.Array,
        title: "Items",
        maxCount: 10,
        defaultValue: [
            {
                cat: "",
                title: "Content-Adaptive Encoding",
                desc: "Our CABR technology analyzes each frame to find the optimal balance between quality and file size, delivering up to <b>50% bitrate reduction</b> without visible quality loss.",
            },
            {
                cat: "",
                title: "Perceptual Quality Metrics",
                desc: "Built on decades of image science research, our quality metrics go beyond PSNR and SSIM to measure what the human eye actually perceives.",
            },
            {
                cat: "",
                title: "Scalable Cloud Processing",
                desc: "Process thousands of hours of video content with our cloud-native architecture. Seamlessly integrate into existing workflows via <a href='#' target='_blank'>API or plugin</a>.",
            },
        ],
        control: {
            type: ControlType.Object,
            controls: {
                cat: {
                    type: ControlType.String,
                    title: "Category",
                    defaultValue: "",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Item Title",
                },
                desc: {
                    type: ControlType.String,
                    title: "Description (HTML)",
                    defaultValue: "Item description. Supports <a>, <br>, <b>, etc.",
                    displayTextArea: true,
                },
                image: { type: ControlType.Image, title: "Image" },
                video: {
                    type: ControlType.File,
                    title: "Video",
                    allowedFileTypes: ["mp4", "webm", "mov"],
                },
            },
        },
    },
    catFont: {
        type: ControlType.String,
        title: "Category Font",
        defaultValue: "Inter, sans-serif",
        section: "Typography",
    },
    catSize: {
        type: ControlType.Number,
        title: "Category Size",
        defaultValue: 13,
        min: 8,
        max: 24,
        section: "Typography",
    },
    catWeight: {
        type: ControlType.Number,
        title: "Category Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
        section: "Typography",
    },
    catColor: {
        type: ControlType.Color,
        title: "Category Color",
        defaultValue: "#3751FF",
        section: "Typography",
    },
    catSpacing: {
        type: ControlType.Number,
        title: "Category Spacing",
        defaultValue: 2,
        min: 0,
        max: 8,
        step: 0.5,
        section: "Typography",
    },
    titleFont: {
        type: ControlType.String,
        title: "Title Font",
        defaultValue: "Poppins, sans-serif",
        section: "Typography",
    },
    titleSize: {
        type: ControlType.Number,
        title: "Title Size",
        defaultValue: 32,
        min: 12,
        max: 72,
        section: "Typography",
    },
    titleWeight: {
        type: ControlType.Number,
        title: "Title Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
        section: "Typography",
    },
    descFont: {
        type: ControlType.String,
        title: "Desc Font",
        defaultValue: "Inter, sans-serif",
        section: "Typography",
    },
    descSize: {
        type: ControlType.Number,
        title: "Desc Size",
        defaultValue: 16,
        min: 10,
        max: 36,
        section: "Typography",
    },
    descWeight: {
        type: ControlType.Number,
        title: "Desc Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
        section: "Typography",
    },
    background: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
        section: "Style",
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: "#171717",
        section: "Style",
    },
    descColor: {
        type: ControlType.Color,
        title: "Desc Color",
        defaultValue: "#666666",
        section: "Style",
    },
    linkColor: {
        type: ControlType.Color,
        title: "Link Color",
        defaultValue: "#3751FF",
        section: "Style",
    },
    visualBg: {
        type: ControlType.Color,
        title: "Visual Placeholder Bg",
        defaultValue: "#F3F5FF",
        section: "Style",
    },
    visualHeight: {
        type: ControlType.Number,
        title: "Visual Height",
        defaultValue: 360,
        min: 150,
        max: 600,
        section: "Style",
    },
    itemGap: {
        type: ControlType.Number,
        title: "Item Gap",
        defaultValue: 96,
        min: 24,
        max: 200,
        section: "Style",
    },
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile Breakpoint",
        defaultValue: 768,
        min: 320,
        max: 1024,
        section: "Style",
    },
    paddingV: {
        type: ControlType.Number,
        title: "Padding V",
        defaultValue: 96,
        min: 0,
        max: 200,
        section: "Style",
    },
    paddingH: {
        type: ControlType.Number,
        title: "Padding H",
        defaultValue: 64,
        min: 0,
        max: 500,
        section: "Style",
    },
})
