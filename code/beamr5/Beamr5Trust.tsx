// Beamr 5 HEVC Page - Trust / Logo Bar Section
// Light section with heading and a strip of streaming-brand logos
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LogoItem {
    name: string
    image: string
    height: number
}

interface Props {
    heading: string
    logos: LogoItem[]
    logoOpacity: number
    useColorOverlay: boolean
    logoColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    borderColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

function Beamr5Trust(props: Props) {
    const {
        heading = "Beamr 5 is trusted by top video streaming brands",
        logos = [
            { name: "NETFLIX", image: "", height: 22 },
            { name: "PARAMOUNT", image: "", height: 22 },
            { name: "DOLBY", image: "", height: 22 },
            { name: "NVIDIA", image: "", height: 22 },
            { name: "TAG", image: "", height: 22 },
        ],
        logoOpacity = 0.55,
        useColorOverlay = false,
        logoColor = "#0d0d0d",
        bgColor = "#ffffff",
        textColor = "#0d0d0d",
        secondaryTextColor = "#6b6b76",
        borderColor = "#e8eaf0",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "72px 48px",
                boxSizing: "border-box",
                fontFamily,
                borderBottom: `1px solid ${borderColor}`,
            }}
        >
            <div
                style={{
                    maxWidth: 1080,
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: secondaryTextColor,
                        margin: "0 0 40px",
                        letterSpacing: "0.01em",
                        fontFamily,
                    }}
                >
                    {heading}
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 56,
                        flexWrap: "wrap",
                    }}
                >
                    {logos.map((logo, i) => (
                        <div
                            key={i}
                            style={{
                                opacity: logoOpacity,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {logo.image ? (
                                useColorOverlay ? (
                                    <div
                                        style={{
                                            height: logo.height || 22,
                                            width: (logo.height || 22) * 4,
                                            backgroundColor: logoColor,
                                            WebkitMaskImage: `url(${logo.image})`,
                                            maskImage: `url(${logo.image})`,
                                            WebkitMaskSize: "contain",
                                            maskSize: "contain",
                                            WebkitMaskRepeat: "no-repeat",
                                            maskRepeat: "no-repeat",
                                            WebkitMaskPosition: "center",
                                            maskPosition: "center",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={logo.image}
                                        alt={logo.name}
                                        style={{
                                            height: logo.height || 22,
                                            objectFit: "contain",
                                        }}
                                    />
                                )
                            ) : (
                                <span
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: textColor,
                                        fontFamily: headingFont,
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    {logo.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Beamr5Trust, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Beamr 5 is trusted by top video streaming brands",
        displayTextArea: true,
    },
    logos: {
        type: ControlType.Array,
        title: "Logos",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "BRAND",
                },
                image: {
                    type: ControlType.Image,
                    title: "Logo Image",
                },
                height: {
                    type: ControlType.Number,
                    title: "Height",
                    defaultValue: 22,
                    min: 12,
                    max: 60,
                },
            },
        },
        defaultValue: [
            { name: "NETFLIX", image: "", height: 22 },
            { name: "PARAMOUNT", image: "", height: 22 },
            { name: "DOLBY", image: "", height: 22 },
            { name: "NVIDIA", image: "", height: 22 },
            { name: "TAG", image: "", height: 22 },
        ],
    },
    logoOpacity: {
        type: ControlType.Number,
        title: "Logo Opacity",
        defaultValue: 0.55,
        min: 0.1,
        max: 1,
        step: 0.05,
    },
    useColorOverlay: {
        type: ControlType.Boolean,
        title: "Logo Color Overlay",
        defaultValue: false,
    },
    logoColor: {
        type: ControlType.Color,
        title: "Logo Color",
        defaultValue: "#0d0d0d",
        hidden: (props) => !props.useColorOverlay,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#0d0d0d",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#6b6b76",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#e8eaf0",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Trust
