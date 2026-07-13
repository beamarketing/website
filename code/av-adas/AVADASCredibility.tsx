import { addPropertyControls, ControlType } from "framer"

interface ProofItem {
    title: string
    description: string
}

interface LogoItem {
    name: string
    image: string
}

interface Props {
    heading: string
    proofItems: ProofItem[]
    showLogos: boolean
    clientLabel: string
    clientLogos: LogoItem[]
    partnerLabel: string
    partnerLogos: LogoItem[]
    logoHeight: number
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function AVADASCredibility(props: Props) {
    const {
        heading = "15 years of video and image compression.\nBeamr (Nasdaq: BMR)",
        proofItems = [
            {
                title: "Beamr 4 & 5",
                description: "Encoders built and maintained in-house.",
            },
            {
                title: "CABR",
                description: "Patented content-adaptive compression, invented here.",
            },
            {
                title: "ML-safety measurement",
                description: "Published studies on detection, captioning, depth — including joint testing with the NVIDIA AV team.",
            },
            {
                title: "In-house expertise",
                description: "Video engineers, VidOps, and an ML team.",
            },
            {
                title: "Quality measurement, built in-house",
                description: "BQM (our quality measure), VISTA (subjective testing), and more.",
            },
        ],
        showLogos = true,
        clientLabel = "Clients",
        clientLogos = [
            { name: "Netflix", image: "" },
            { name: "JioHotstar", image: "" },
            { name: "Paramount", image: "" },
        ],
        partnerLabel = "Partners",
        partnerLogos = [
            { name: "NVIDIA", image: "" },
            { name: "AWS Partner Network", image: "" },
        ],
        logoHeight = 24,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 56,
                }}
            >
                <h2
                    style={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        fontFamily,
                        textAlign: "center",
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 20,
                        width: "100%",
                        maxWidth: 960,
                    }}
                >
                    {proofItems.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "28px 24px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 16,
                                gridColumn: i === proofItems.length - 1 && proofItems.length % 2 !== 0 ? "span 2" : undefined,
                            }}
                        >
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: accentColor,
                                    marginTop: 7,
                                    flexShrink: 0,
                                }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <h3
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.3,
                                        fontFamily,
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.6,
                                        fontFamily,
                                    }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {showLogos && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 32,
                            alignItems: "center",
                            width: "100%",
                            padding: "40px 0 0",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 48,
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: secondaryTextColor,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    fontFamily,
                                }}
                            >
                                {clientLabel}
                            </span>
                            {clientLogos.map((logo, i) =>
                                logo.image ? (
                                    <img
                                        key={i}
                                        src={logo.image}
                                        alt={logo.name}
                                        style={{
                                            height: logoHeight,
                                            objectFit: "contain",
                                            filter: "brightness(0) invert(1)",
                                            opacity: 0.5,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: textColor,
                                            opacity: 0.5,
                                            fontFamily,
                                        }}
                                    >
                                        {logo.name}
                                    </span>
                                )
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 48,
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: secondaryTextColor,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    fontFamily,
                                }}
                            >
                                {partnerLabel}
                            </span>
                            {partnerLogos.map((logo, i) =>
                                logo.image ? (
                                    <img
                                        key={i}
                                        src={logo.image}
                                        alt={logo.name}
                                        style={{
                                            height: logoHeight,
                                            objectFit: "contain",
                                            filter: "brightness(0) invert(1)",
                                            opacity: 0.5,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: textColor,
                                            opacity: 0.5,
                                            fontFamily,
                                        }}
                                    >
                                        {logo.name}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(AVADASCredibility, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "15 years of video and image compression.\nBeamr (Nasdaq: BMR)",
        displayTextArea: true,
    },
    proofItems: {
        type: ControlType.Array,
        title: "Proof Items",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Proof title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Proof description",
                },
            },
        },
        defaultValue: [
            { title: "Beamr 4 & 5", description: "Encoders built and maintained in-house." },
            { title: "CABR", description: "Patented content-adaptive compression, invented here." },
            { title: "ML-safety measurement", description: "Published studies on detection, captioning, depth — including joint testing with the NVIDIA AV team." },
            { title: "In-house expertise", description: "Video engineers, VidOps, and an ML team." },
            { title: "Quality measurement, built in-house", description: "BQM (our quality measure), VISTA (subjective testing), and more." },
        ],
    },
    showLogos: {
        type: ControlType.Boolean,
        title: "Show Logos",
        defaultValue: true,
    },
    clientLabel: {
        type: ControlType.String,
        title: "Client Label",
        defaultValue: "Clients",
        hidden: (props) => !props.showLogos,
    },
    clientLogos: {
        type: ControlType.Array,
        title: "Client Logos",
        maxCount: 8,
        hidden: (props) => !props.showLogos,
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
                    title: "Logo",
                },
            },
        },
        defaultValue: [
            { name: "Netflix", image: "" },
            { name: "JioHotstar", image: "" },
            { name: "Paramount", image: "" },
        ],
    },
    partnerLabel: {
        type: ControlType.String,
        title: "Partner Label",
        defaultValue: "Partners",
        hidden: (props) => !props.showLogos,
    },
    partnerLogos: {
        type: ControlType.Array,
        title: "Partner Logos",
        maxCount: 8,
        hidden: (props) => !props.showLogos,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Partner",
                },
                image: {
                    type: ControlType.Image,
                    title: "Logo",
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "" },
            { name: "AWS Partner Network", image: "" },
        ],
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 24,
        min: 12,
        max: 60,
        step: 2,
        hidden: (props) => !props.showLogos,
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

export default AVADASCredibility
