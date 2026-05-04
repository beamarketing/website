// Beamr - Thank You Header + Confirmation Message
// Framer Code Component with full property controls
//
// Faithful port of the layout used on ces.tech/thank-you/:
//   - top "header" with a small breadcrumb pill
//   - then a very large display "Thank You" headline (left-aligned, ~7/12 cols)
//   - below: a slightly lighter "layer" section with the confirmation copy
//     (h2 + paragraphs + inline support link)
//
// Rendered in Beamr's dark palette so it sits naturally next to the rest of
// the site, but the structure / type-scale / left alignment matches CES.

import { addPropertyControls, ControlType } from "framer"

interface Props {
    showBreadcrumb: boolean
    breadcrumbLabel: string
    breadcrumbUrl: string
    heading: string
    headingFontSize: number
    confirmationHeading: string
    confirmationLine1: string
    confirmationLine2: string
    supportLeadingText: string
    supportLinkText: string
    supportLinkUrl: string
    supportTrailingText: string
    bgColor: string
    layerBgColor: string
    breadcrumbBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function ThankYou(props: Props) {
    const {
        showBreadcrumb = true,
        breadcrumbLabel = "Form Submission",
        breadcrumbUrl = "#",
        heading = "Thank You",
        headingFontSize = 112,
        confirmationHeading = "The form was submitted successfully.",
        confirmationLine1 = "Thank you for submitting your form.",
        confirmationLine2 =
            "Your submission will be reviewed promptly. Should we require any additional details, we will reach out to you.",
        supportLeadingText = "Please review our",
        supportLinkText = "customer support page",
        supportLinkUrl = "#support",
        supportTrailingText =
            "if you have any questions or need further assistance.",
        bgColor = "#07071c",
        layerBgColor = "#0a0b1e",
        breadcrumbBgColor = "rgba(255,255,255,0.06)",
        textColor = "#ffffff",
        secondaryTextColor = "#c2c2d6",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                fontFamily,
                backgroundColor: bgColor,
            }}
        >
            {/* Header band */}
            <div
                style={{
                    width: "100%",
                    backgroundColor: bgColor,
                    padding: "120px 48px 80px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "58.33%",
                            minWidth: 280,
                        }}
                    >
                        {/* Breadcrumb pill */}
                        {showBreadcrumb && (
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    minHeight: 48,
                                    padding: "0 20px",
                                    backgroundColor: breadcrumbBgColor,
                                    borderRadius: 8,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <a
                                    href={breadcrumbUrl}
                                    style={{
                                        color: textColor,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        textDecoration: "none",
                                        whiteSpace: "nowrap",
                                        fontFamily,
                                    }}
                                >
                                    {breadcrumbLabel}
                                </a>
                            </div>
                        )}

                        {/* Display heading */}
                        <h1
                            style={{
                                marginTop: 96,
                                marginBottom: 0,
                                fontSize: headingFontSize,
                                fontWeight: 600,
                                lineHeight: 1.0,
                                letterSpacing: "-0.03em",
                                color: textColor,
                                fontFamily,
                            }}
                        >
                            {heading}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Message band (slightly lighter layer) */}
            <div
                style={{
                    width: "100%",
                    backgroundColor: layerBgColor,
                    padding: "80px 48px 120px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 760,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 32,
                                fontWeight: 600,
                                lineHeight: 1.25,
                                letterSpacing: "-0.01em",
                                color: textColor,
                                margin: "0 0 24px",
                                fontFamily,
                            }}
                        >
                            {confirmationHeading}
                        </h2>
                        <p
                            style={{
                                fontSize: 18,
                                lineHeight: 1.7,
                                color: secondaryTextColor,
                                margin: "0 0 16px",
                                fontFamily,
                            }}
                        >
                            {confirmationLine1}
                        </p>
                        <p
                            style={{
                                fontSize: 18,
                                lineHeight: 1.7,
                                color: secondaryTextColor,
                                margin: "0 0 16px",
                                fontFamily,
                            }}
                        >
                            {confirmationLine2}
                        </p>
                        <p
                            style={{
                                fontSize: 18,
                                lineHeight: 1.7,
                                color: secondaryTextColor,
                                margin: 0,
                                fontFamily,
                            }}
                        >
                            {supportLeadingText}{" "}
                            <a
                                href={supportLinkUrl}
                                style={{
                                    color: accentColor,
                                    textDecoration: "underline",
                                    textUnderlineOffset: 4,
                                }}
                            >
                                {supportLinkText}
                            </a>{" "}
                            {supportTrailingText}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ThankYou, {
    showBreadcrumb: {
        type: ControlType.Boolean,
        title: "Breadcrumb",
        defaultValue: true,
    },
    breadcrumbLabel: {
        type: ControlType.String,
        title: "Crumb Label",
        defaultValue: "Form Submission",
        hidden: (props) => !props.showBreadcrumb,
    },
    breadcrumbUrl: {
        type: ControlType.String,
        title: "Crumb URL",
        defaultValue: "#",
        hidden: (props) => !props.showBreadcrumb,
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Thank You",
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 112,
        min: 48,
        max: 200,
        step: 2,
    },
    confirmationHeading: {
        type: ControlType.String,
        title: "Confirm H2",
        defaultValue: "The form was submitted successfully.",
        displayTextArea: true,
    },
    confirmationLine1: {
        type: ControlType.String,
        title: "Line 1",
        defaultValue: "Thank you for submitting your form.",
        displayTextArea: true,
    },
    confirmationLine2: {
        type: ControlType.String,
        title: "Line 2",
        defaultValue:
            "Your submission will be reviewed promptly. Should we require any additional details, we will reach out to you.",
        displayTextArea: true,
    },
    supportLeadingText: {
        type: ControlType.String,
        title: "Support Lead",
        defaultValue: "Please review our",
    },
    supportLinkText: {
        type: ControlType.String,
        title: "Support Link",
        defaultValue: "customer support page",
    },
    supportLinkUrl: {
        type: ControlType.String,
        title: "Support URL",
        defaultValue: "#support",
    },
    supportTrailingText: {
        type: ControlType.String,
        title: "Support Trail",
        defaultValue:
            "if you have any questions or need further assistance.",
        displayTextArea: true,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Header BG",
        defaultValue: "#07071c",
    },
    layerBgColor: {
        type: ControlType.Color,
        title: "Layer BG",
        defaultValue: "#0a0b1e",
    },
    breadcrumbBgColor: {
        type: ControlType.Color,
        title: "Crumb BG",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#c2c2d6",
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

export default ThankYou
