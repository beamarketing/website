// Beamr - Thank You Page Composition
// Stacks Navigation + ThankYou + ThankYouResources + Footer.
// Mirrors the structure of ces.tech/thank-you/ in Beamr's design language.
//
// Use it the same way as Homepage: drag onto a Framer page, toggle sections.

import { addPropertyControls, ControlType } from "framer"
import Navigation from "./Navigation"
import ThankYou from "./ThankYou"
import ThankYouResources from "./ThankYouResources"
import Footer from "./Footer"

interface Props {
    accentColor: string
    bgColor: string
    fontFamily: string
    showNavigation: boolean
    showThankYou: boolean
    showResources: boolean
    showFooter: boolean
    style?: React.CSSProperties
}

function ThankYouPage(props: Props) {
    const {
        accentColor = "#00d46a",
        bgColor = "#07071c",
        fontFamily = "'Inter', sans-serif",
        showNavigation = true,
        showThankYou = true,
        showResources = true,
        showFooter = true,
        style,
    } = props

    const sharedProps = {
        accentColor,
        fontFamily,
    }

    return (
        <div
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                display: "flex",
                flexDirection: "column" as const,
                minHeight: "100vh",
            }}
        >
            {showNavigation && (
                <Navigation
                    fontFamily={fontFamily}
                    bgColor="#ffffff"
                    textColor="#1a1a2e"
                    textHoverColor="#6C5CE7"
                    accentColor="#6C5CE7"
                    logoText="beamr"
                    logoFontSize={22}
                    showLogoIcon={true}
                    logoIconColor="#6C5CE7"
                    ctaText="Let's Talk"
                    ctaUrl="#contact"
                    ctaBgColor="#111111"
                    ctaTextColor="#ffffff"
                    sticky={true}
                    overlayMode={false}
                    overlayBgColor="rgba(0,0,0,0.05)"
                    overlayTextColor="#ffffff"
                    scrollThreshold={400}
                    useLogoImage={false}
                    logoImage=""
                    borderColor="#f0f0f0"
                    dropdownBgColor="#ffffff"
                    dropdownCardBgColor="#111827"
                    dropdownTextColor="#1a1a2e"
                    dropdownSecondaryTextColor="#6b7280"
                    industriesLabel="INDUSTRIES"
                    useCasesLabel="USE CASES"
                    navLinks={[
                        { label: "Solutions", url: "/#solutions", hasDropdown: true },
                        { label: "Products", url: "/#products", hasDropdown: true },
                        { label: "Technology", url: "/#technology", hasDropdown: false },
                        { label: "Blog", url: "/#blog", hasDropdown: false },
                        { label: "Company", url: "/#company", hasDropdown: false },
                    ]}
                    industries={[
                        { icon: "🎬", title: "Media & Entertainment", description: "Cut CDN & storage costs 30-50% while keeping broadcast quality.", url: "/#media" },
                        { icon: "🧠", title: "AI / Machine Learning", description: "Smarter vision AI pipelines with guaranteed compression.", url: "/#ai" },
                        { icon: "🚗", title: "Autonomous Vehicles", description: "50% storage reduction with ML-safe compression for training data.", url: "/#automotive" },
                        { icon: "🏟️", title: "Sports Streaming", description: "720p→4K Super Resolution without doubling file size.", url: "/#sports" },
                    ]}
                    useCases={[
                        { icon: "📡", title: "Reduce CDN Costs", description: "Deliver same visual quality at significantly lower bitrates.", url: "/#cdn" },
                        { icon: "✨", title: "Improve Quality", description: "Enhance visual quality while maintaining or reducing file size.", url: "/#quality" },
                        { icon: "💾", title: "Optimize Storage", description: "Reduce storage requirements by up to 50% without quality loss.", url: "/#storage" },
                        { icon: "📺", title: "4K Upscaling", description: "Upscale legacy content to 4K resolution efficiently.", url: "/#upscaling" },
                    ]}
                    featured={{
                        badge: "CASE STUDY",
                        title: "Netflix Achieves 40% CDN Savings with CABR Technology",
                        linkText: "Read Case Study",
                        linkUrl: "/#case-study",
                        image: "",
                    }}
                />
            )}

            {showThankYou && (
                <ThankYou
                    {...sharedProps}
                    bgColor={bgColor}
                    layerBgColor="#0a0b1e"
                    breadcrumbBgColor="rgba(255,255,255,0.06)"
                    textColor="#ffffff"
                    secondaryTextColor="#c2c2d6"
                    showBreadcrumb={true}
                    breadcrumbLabel="Form Submission"
                    breadcrumbUrl="#"
                    heading="Thank You"
                    headingFontSize={112}
                    confirmationHeading="The form was submitted successfully."
                    confirmationLine1="Thank you for submitting your form."
                    confirmationLine2="Your submission will be reviewed promptly. Should we require any additional details, we will reach out to you."
                    supportLeadingText="Please review our"
                    supportLinkText="customer support page"
                    supportLinkUrl="#support"
                    supportTrailingText="if you have any questions or need further assistance."
                />
            )}

            {showResources && (
                <ThankYouResources
                    {...sharedProps}
                    bgColor="#07071c"
                    cardBgColor="#0f1029"
                    chipBgColor="rgba(255,255,255,0.06)"
                    chipHoverBgColor="rgba(255,255,255,0.1)"
                    durationBgColor="rgba(0,0,0,0.55)"
                    textColor="#ffffff"
                    secondaryTextColor="#c2c2d6"
                    tertiaryTextColor="#8b8ba3"
                    borderColor="rgba(255,255,255,0.08)"
                    heading="More From Beamr"
                    columns={3}
                    cardBorderRadius={12}
                    showFooterButton={true}
                    footerButtonText="See all content"
                    footerButtonUrl="#"
                    resources={[
                        {
                            image: "",
                            duration: "40:40",
                            type: "Podcast",
                            title: "A Smarter Vehicle Is a Safer Vehicle",
                            url: "#",
                            topics: "Vehicle Tech and Advanced Mobility",
                        },
                        {
                            image: "",
                            duration: "11:31",
                            type: "Video",
                            title: "Inside the C-Space Studio with Beamr Partners",
                            url: "#",
                            topics: "Sports, Content and Entertainment, Marketing and Advertising",
                        },
                        {
                            image: "",
                            duration: "41:05",
                            type: "Video",
                            title: "Vehicle Payments — The Road Ahead",
                            url: "#",
                            topics: "Vehicle Tech and Advanced Mobility",
                        },
                    ]}
                />
            )}

            {showFooter && (
                <Footer
                    {...sharedProps}
                    bgColor="#050516"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    borderColor="rgba(255,255,255,0.06)"
                    logoText="BEAMR"
                    useLogoImage={false}
                    logoImage=""
                    tagline="AI-powered video optimization for the modern enterprise."
                    showNewsletter={true}
                    newsletterHeading="Stay Updated"
                    newsletterPlaceholder="Enter your email"
                    newsletterButtonText="Subscribe"
                    copyrightText="2026 Beamr Imaging Ltd. All rights reserved."
                    columns={[
                        { title: "Solutions", links: [{ label: "Media & Entertainment", url: "#" }, { label: "Autonomous Vehicles", url: "#" }, { label: "AI / Machine Learning", url: "#" }] },
                        { title: "Company", links: [{ label: "About Us", url: "#" }, { label: "Careers", url: "#" }, { label: "Press", url: "#" }, { label: "Contact", url: "#" }] },
                        { title: "Resources", links: [{ label: "Blog", url: "#" }, { label: "Documentation", url: "#" }, { label: "Case Studies", url: "#" }] },
                    ]}
                    socialLinks={[
                        { platform: "LinkedIn", url: "#" },
                        { platform: "Twitter", url: "#" },
                        { platform: "YouTube", url: "#" },
                    ]}
                />
            )}
        </div>
    )
}

addPropertyControls(ThankYouPage, {
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    showNavigation: {
        type: ControlType.Boolean,
        title: "Navigation",
        defaultValue: true,
    },
    showThankYou: {
        type: ControlType.Boolean,
        title: "Thank You",
        defaultValue: true,
    },
    showResources: {
        type: ControlType.Boolean,
        title: "Resources",
        defaultValue: true,
    },
    showFooter: {
        type: ControlType.Boolean,
        title: "Footer",
        defaultValue: true,
    },
})

export default ThankYouPage
