import { addPropertyControls, ControlType } from "framer"

interface StepItem {
    number: string
    label: string
}

interface Props {
    heading: string
    steps: StepItem[]
    showSteps: boolean
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    contactName: string
    contactEmail: string
    contactUrl: string
    showContact: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    showGlow: boolean
    style?: React.CSSProperties
}

function AVADASCTA(props: Props) {
    const {
        heading = "Bring the one question your team needs answered.\nThat's where Pre-Discovery starts.",
        steps = [
            { number: "1", label: "Short questionnaire" },
            { number: "2", label: "Pre-Discovery session" },
            { number: "3", label: "Tailored SOW" },
        ],
        showSteps = true,
        ctaPrimaryText = "Request a demo",
        ctaPrimaryUrl = "#demo",
        ctaSecondaryText = "Book a Pre-Discovery call",
        ctaSecondaryUrl = "#pre-discovery",
        showSecondaryButton = true,
        contactName = "Michael Becker",
        contactEmail = "mbecker@beamr.com",
        contactUrl = "beamr.com/autonomous",
        showContact = true,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        showGlow = true,
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
                    maxWidth: 900,
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {showGlow && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            height: 400,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />
                )}

                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        backgroundColor: cardBgColor,
                        borderRadius: 24,
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "72px 64px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 32,
                    }}
                >
                    <h2
                        style={{
                            fontSize: 36,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.2,
                            fontFamily,
                            letterSpacing: "-0.02em",
                            whiteSpace: "pre-line",
                            maxWidth: 640,
                        }}
                    >
                        {heading}
                    </h2>

                    {showSteps && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    {i > 0 && (
                                        <span
                                            style={{
                                                fontSize: 16,
                                                color: secondaryTextColor,
                                                opacity: 0.4,
                                            }}
                                        >
                                            →
                                        </span>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "8px 16px",
                                            borderRadius: 8,
                                            backgroundColor: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: "50%",
                                                backgroundColor: `${accentColor}20`,
                                                color: accentColor,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontFamily,
                                            }}
                                        >
                                            {step.number}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: textColor,
                                                fontFamily,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginTop: 8,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        <a
                            href={ctaPrimaryUrl}
                            style={{
                                backgroundColor: accentColor,
                                color: bgColor,
                                padding: "14px 32px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            {ctaPrimaryText}
                            <span style={{ fontSize: 18 }}>&#8594;</span>
                        </a>

                        {showSecondaryButton && (
                            <a
                                href={ctaSecondaryUrl}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    color: textColor,
                                    padding: "14px 32px",
                                    borderRadius: 10,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    fontFamily,
                                }}
                            >
                                {ctaSecondaryText}
                            </a>
                        )}
                    </div>

                    {showContact && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                marginTop: 8,
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    fontFamily,
                                }}
                            >
                                {contactName}
                            </span>
                            <span
                                style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    backgroundColor: secondaryTextColor,
                                    opacity: 0.4,
                                }}
                            />
                            <a
                                href={`mailto:${contactEmail}`}
                                style={{
                                    fontSize: 14,
                                    color: accentColor,
                                    textDecoration: "none",
                                    fontFamily,
                                }}
                            >
                                {contactEmail}
                            </a>
                            <span
                                style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    backgroundColor: secondaryTextColor,
                                    opacity: 0.4,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    fontFamily,
                                }}
                            >
                                {contactUrl}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(AVADASCTA, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Bring the one question your team needs answered.\nThat's where Pre-Discovery starts.",
        displayTextArea: true,
    },
    showSteps: {
        type: ControlType.Boolean,
        title: "Show Steps",
        defaultValue: true,
    },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        maxCount: 5,
        hidden: (props) => !props.showSteps,
        control: {
            type: ControlType.Object,
            controls: {
                number: {
                    type: ControlType.String,
                    title: "Number",
                    defaultValue: "1",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Step label",
                },
            },
        },
        defaultValue: [
            { number: "1", label: "Short questionnaire" },
            { number: "2", label: "Pre-Discovery session" },
            { number: "3", label: "Tailored SOW" },
        ],
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Request a demo",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#demo",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Book a Pre-Discovery call",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#pre-discovery",
        hidden: (props) => !props.showSecondaryButton,
    },
    showContact: {
        type: ControlType.Boolean,
        title: "Show Contact",
        defaultValue: true,
    },
    contactName: {
        type: ControlType.String,
        title: "Contact Name",
        defaultValue: "Michael Becker",
        hidden: (props) => !props.showContact,
    },
    contactEmail: {
        type: ControlType.String,
        title: "Contact Email",
        defaultValue: "mbecker@beamr.com",
        hidden: (props) => !props.showContact,
    },
    contactUrl: {
        type: ControlType.String,
        title: "Contact URL",
        defaultValue: "beamr.com/autonomous",
        hidden: (props) => !props.showContact,
    },
    showGlow: {
        type: ControlType.Boolean,
        title: "Show Glow",
        defaultValue: true,
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

export default AVADASCTA
