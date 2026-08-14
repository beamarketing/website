// Beamr — Pipeline Overload (the AV data pressure test)
// Framer Code Component that embeds the single-file HTML game in a
// responsive, self-contained iframe.
//
// HOW TO USE IN FRAMER
//   1. Host the single file `pipeline-overload.html` at a public URL
//      (see options below) and paste that URL into the "Game URL" control.
//   2. Drop this component on the page; it keeps a 16:9 frame and scales
//      to the width you give it. Click the frame once to give it keyboard
//      focus, then Arrow keys / WASD drive.
//
// WHERE TO HOST pipeline-overload.html
//   - GitHub Pages on beamarketing/website (enable Pages, then the file is
//     at https://beamarketing.github.io/website/pipeline-overload.html), or
//   - any static host / CDN / your own site, or
//   - Framer: the built-in Embed element also accepts the raw HTML directly
//     (Insert > Embed > HTML) if you'd rather not host a file at all.
//
// The game is fully client-side. Lead capture posts straight to HubSpot when
// HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID are set inside the HTML file.

import { addPropertyControls, ControlType } from "framer"

interface Props {
    src: string
    maxWidth: number
    radius: number
    showGlow: boolean
    style?: React.CSSProperties
}

export default function PipelineOverloadGame(props: Props) {
    const {
        src = "https://beamarketing.github.io/website/pipeline-overload.html",
        maxWidth = 1280,
        radius = 8,
        showGlow = true,
        style,
    } = props

    const hasSrc = typeof src === "string" && src.trim().length > 0

    return (
        <div
            style={{
                width: "100%",
                maxWidth,
                margin: "0 auto",
                ...style,
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: radius,
                    overflow: "hidden",
                    background: "#05060c",
                    boxShadow: showGlow
                        ? "0 0 0 2px #1d2440, 0 0 60px rgba(120,90,255,.22), 0 24px 60px rgba(0,0,0,.6)"
                        : "none",
                }}
            >
                {hasSrc ? (
                    <iframe
                        src={src}
                        title="Pipeline Overload"
                        loading="lazy"
                        allow="autoplay; fullscreen"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            border: "0",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: 24,
                            color: "#7c86ad",
                            font: "12px/1.7 ui-monospace, Menlo, Consolas, monospace",
                        }}
                    >
                        Set the “Game URL” to your hosted pipeline-overload.html
                    </div>
                )}
            </div>
        </div>
    )
}

addPropertyControls(PipelineOverloadGame, {
    src: {
        type: ControlType.String,
        title: "Game URL",
        defaultValue:
            "https://beamarketing.github.io/website/pipeline-overload.html",
        placeholder: "https://…/pipeline-overload.html",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 1280,
        min: 480,
        max: 1920,
        step: 10,
        unit: "px",
    },
    radius: {
        type: ControlType.Number,
        title: "Corner Radius",
        defaultValue: 8,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
    },
    showGlow: {
        type: ControlType.Boolean,
        title: "Glow / Shadow",
        defaultValue: true,
    },
})
