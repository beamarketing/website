// Beamr — Event Page (IBC 2026)
// Full-page composition of the event sections. Framer Code Component.
// Import all sibling files into your Framer project, then drop this on the
// page and toggle sections from the left panel.

import { addPropertyControls, ControlType } from "framer"
import EventHero from "./EventHero"
import EventBooth from "./EventBooth"
import EventWhyMeet from "./EventWhyMeet"
import EventScheduleCTA from "./EventScheduleCTA"

interface Props {
    fontFamily: string
    showHero: boolean
    showBooth: boolean
    showWhyMeet: boolean
    showSchedule: boolean
    style?: React.CSSProperties
}

function EventPage(props: Props) {
    const {
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        showHero = true,
        showBooth = true,
        showWhyMeet = true,
        showSchedule = true,
        style,
    } = props

    return (
        <div style={{ ...style, width: "100%", backgroundColor: "#ffffff", fontFamily }}>
            {showHero && <EventHero fontFamily={fontFamily} />}
            {showBooth && <EventBooth fontFamily={fontFamily} />}
            {showWhyMeet && <EventWhyMeet fontFamily={fontFamily} />}
            {showSchedule && <EventScheduleCTA fontFamily={fontFamily} />}
        </div>
    )
}

addPropertyControls(EventPage, {
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    showHero: { type: ControlType.Boolean, title: "Hero", defaultValue: true },
    showBooth: { type: ControlType.Boolean, title: "On the Booth", defaultValue: true },
    showWhyMeet: { type: ControlType.Boolean, title: "Why Meet Us", defaultValue: true },
    showSchedule: { type: ControlType.Boolean, title: "Schedule CTA", defaultValue: true },
})

export default EventPage
