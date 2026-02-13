// Beamr Homepage - Logo Bar / Trusted By Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LogoItem {
    image: string
    name: string
    height: number
}

interface Props {
    title: string
    showTitle: boolean
    logos: LogoItem[]
    logoHeight: number
    bgColor: string
    textColor: string
    fontFamily: string
    paddingY: number
    logoOpacity: number
    style?: React.CSSProperties
}

function LogoBar(props: Props) {
    const {
        title = "Trusted by industry leaders worldwide",
        showTitle = true,
        logos = [],
        logoHeight = 32,
        bgColor = "#07071c",
        textColor = "#8b8ba3",
        fontFamily = "'Inter', sans-serif",
        paddingY = 60,
        logoOpacity = 0.5,
        style,
    } = props

    // Placeholder logos when none provided
    const placeholderNames = [
        "NVIDIA",
        "Netflix",
        "Meta",
        "Samsung",
        "Microsoft",
        "Comcast",
    ]

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: `${paddingY}px 48px`,
                boxSizing: "border-box",
                fontFamily,
                borderTop: "1px solid rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 32,
                }}
            >
                {showTitle && (
                    <p
                        style={{
                            fontSize: 14,
                            color: textColor,
                            margin: 0,
                            fontFamily,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </p>
                )}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 56,
                        flexWrap: "wrap",
                        width: "100%",
                    }}
                >
                    {logos.length > 0
                        ? logos.map((logo, i) => (
                              <div
                                  key={i}
                                  style={{
                                      opacity: logoOpacity,
                                      transition: "opacity 0.3s",
                                      display: "flex",
                                      alignItems: "center",
                                  }}
                              >
                                  {logo.image ? (
                                      <img
                                          src={logo.image}
                                          alt={logo.name}
                                          style={{
                                              height: logo.height || logoHeight,
                                              objectFit: "contain",
                                              filter: "brightness(0) invert(1)",
                                          }}
                                      />
                                  ) : (
                                      <span
                                          style={{
                                              fontSize: (logo.height || logoHeight) * 0.55,
                                              fontWeight: 600,
                                              color: "#ffffff",
                                              opacity: logoOpacity,
                                              fontFamily,
                                              letterSpacing: "0.02em",
                                          }}
                                      >
                                          {logo.name}
                                      </span>
                                  )}
                              </div>
                          ))
                        : placeholderNames.map((name, i) => (
                              <span
                                  key={i}
                                  style={{
                                      fontSize: 18,
                                      fontWeight: 600,
                                      color: "#ffffff",
                                      opacity: logoOpacity,
                                      fontFamily,
                                      letterSpacing: "0.02em",
                                  }}
                              >
                                  {name}
                              </span>
                          ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(LogoBar, {
    showTitle: {
        type: ControlType.Boolean,
        title: "Show Title",
        defaultValue: true,
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Trusted by industry leaders worldwide",
        hidden: (props) => !props.showTitle,
    },
    logos: {
        type: ControlType.Array,
        title: "Logos",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Company",
                },
                image: {
                    type: ControlType.Image,
                    title: "Logo Image",
                },
                height: {
                    type: ControlType.Number,
                    title: "Height (px)",
                    defaultValue: 32,
                    min: 8,
                    max: 80,
                    step: 1,
                    description: "Per-logo height override (0 = use global)",
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "", height: 32 },
            { name: "Netflix", image: "", height: 32 },
            { name: "Meta", image: "", height: 32 },
            { name: "Samsung", image: "", height: 32 },
            { name: "Microsoft", image: "", height: 32 },
            { name: "Comcast", image: "", height: 32 },
        ],
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 32,
        min: 16,
        max: 80,
        step: 2,
    },
    logoOpacity: {
        type: ControlType.Number,
        title: "Logo Opacity",
        defaultValue: 0.5,
        min: 0.1,
        max: 1,
        step: 0.05,
    },
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        defaultValue: 60,
        min: 20,
        max: 120,
        step: 4,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#8b8ba3",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default LogoBar
