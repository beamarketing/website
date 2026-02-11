// Beamr Homepage - Full Page Composition
// This component assembles all sections into a complete homepage.
// You can also use each section individually in Framer by dragging them onto the canvas.
//
// Framer Code Component with global property controls

import { addPropertyControls, ControlType } from "framer"
import Navigation from "./Navigation"
import Hero from "./Hero"
import LogoBar from "./LogoBar"
import Solutions from "./Solutions"
import CompanyUsage from "./CompanyUsage"
import CABRScience from "./CABRScience"
import TrustSection from "./TrustSection"
import PartnerSection from "./PartnerSection"
import NewsSection from "./NewsSection"
import FAQSection from "./FAQSection"
import CTASection from "./CTASection"
import Footer from "./Footer"

interface Props {
    accentColor: string
    bgColor: string
    fontFamily: string
    showNavigation: boolean
    showHero: boolean
    showLogoBar: boolean
    showSolutions: boolean
    showCompanyUsage: boolean
    showCABR: boolean
    showTrust: boolean
    showPartner: boolean
    showNews: boolean
    showFAQ: boolean
    showCTA: boolean
    showFooter: boolean
    style?: React.CSSProperties
}

function Homepage(props: Props) {
    const {
        accentColor = "#00d46a",
        bgColor = "#07071c",
        fontFamily = "'Inter', sans-serif",
        showNavigation = true,
        showHero = true,
        showLogoBar = true,
        showSolutions = true,
        showCompanyUsage = true,
        showCABR = true,
        showTrust = true,
        showPartner = true,
        showNews = true,
        showFAQ = true,
        showCTA = true,
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
                    {...sharedProps}
                    bgColor="rgba(7, 7, 28, 0.9)"
                    textColor="#ffffff"
                    logoText="BEAMR"
                    logoFontSize={24}
                    ctaText="Let's Talk"
                    ctaUrl="#contact"
                    sticky={true}
                    useLogoImage={false}
                    logoImage=""
                    navLinks={[
                        { label: "Solutions", url: "#solutions" },
                        { label: "Products", url: "#products" },
                        { label: "Technology", url: "#technology" },
                        { label: "Blog", url: "#blog" },
                        { label: "Company", url: "#company" },
                    ]}
                />
            )}

            {showHero && (
                <Hero
                    {...sharedProps}
                    bgColor={bgColor}
                    textColor="#ffffff"
                    heading={"Break the Video\nQuality-Cost-Time\nTrade-Off"}
                    subheading="Beamr's AI-powered content-adaptive encoding optimizes your video quality while cutting costs by up to 50%. No compromises."
                    badge="Trusted by 1,000+ companies worldwide"
                    showBadge={true}
                    ctaPrimaryText="Get Started"
                    ctaPrimaryUrl="#contact"
                    ctaSecondaryText="Watch Demo"
                    ctaSecondaryUrl="#demo"
                    showSecondaryButton={true}
                    backgroundImage=""
                    backgroundVideo=""
                    useBackgroundVideo={false}
                    overlayOpacity={0.7}
                    headingFontSize={64}
                    minHeight={720}
                />
            )}

            {showLogoBar && (
                <LogoBar
                    {...sharedProps}
                    bgColor={bgColor}
                    textColor="#8b8ba3"
                    title="Trusted by industry leaders worldwide"
                    showTitle={true}
                    logos={[
                        { name: "NVIDIA", image: "" },
                        { name: "Netflix", image: "" },
                        { name: "Meta", image: "" },
                        { name: "Samsung", image: "" },
                        { name: "Microsoft", image: "" },
                        { name: "Comcast", image: "" },
                    ]}
                    logoHeight={32}
                    paddingY={60}
                    logoOpacity={0.5}
                />
            )}

            {showSolutions && (
                <Solutions
                    {...sharedProps}
                    bgColor={bgColor}
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="SOLUTIONS"
                    heading="Solutions for Your Industry"
                    subheading="Tailored video optimization across industries — from streaming to autonomous vehicles."
                    cardBorderRadius={16}
                    cards={[
                        {
                            icon: "🎬",
                            title: "Media & Entertainment",
                            description: "Reduce CDN and storage costs while maintaining pristine visual quality for streaming content.",
                            linkText: "Explore",
                            linkUrl: "#media",
                            image: "",
                        },
                        {
                            icon: "🚗",
                            title: "Autonomous Vehicles",
                            description: "Compress video from vehicle cameras without losing critical visual details for AI training.",
                            linkText: "Explore",
                            linkUrl: "#automotive",
                            image: "",
                        },
                        {
                            icon: "🧠",
                            title: "AI / Machine Learning",
                            description: "Optimize training data pipelines with smaller video files that preserve every detail AI needs.",
                            linkText: "Explore",
                            linkUrl: "#ai",
                            image: "",
                        },
                    ]}
                />
            )}

            {showCompanyUsage && (
                <CompanyUsage
                    {...sharedProps}
                    bgColor="#0a0b1e"
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="USE CASES"
                    heading="How Companies Use Beamr"
                    subheading="Real results from real customers using content-adaptive encoding."
                    columns={4}
                    cardBorderRadius={16}
                    cards={[
                        { icon: "📡", metric: "50%", title: "Cut CDN Costs", description: "Reduce bandwidth expenses by up to 50% without any perceptible quality loss." },
                        { icon: "💾", metric: "40%", title: "Reduce Storage", description: "Shrink video storage footprint by up to 40% with intelligent encoding." },
                        { icon: "✨", metric: "100%", title: "Improved Visual Quality", description: "Maintain or improve perceived quality with mathematically optimized encoding." },
                        { icon: "🤖", metric: "2x", title: "Train AI Without Sacrificing", description: "Double your training data throughput without sacrificing visual details." },
                    ]}
                />
            )}

            {showCABR && (
                <CABRScience
                    {...sharedProps}
                    bgColor={bgColor}
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="TECHNOLOGY"
                    heading="The Science Behind CABR"
                    description="Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters. The result: dramatically smaller files with mathematically proven quality preservation."
                    linkText="Learn More About CABR"
                    linkUrl="#cabr"
                    layoutDirection="left"
                    useVideo={false}
                    mediaImage=""
                    mediaVideo=""
                    stats={[
                        { value: "50%", label: "Smaller Files" },
                        { value: "4K+", label: "Resolution Support" },
                        { value: "100%", label: "Quality Preserved" },
                    ]}
                />
            )}

            {showTrust && (
                <TrustSection
                    {...sharedProps}
                    bgColor="#0a0b1e"
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="RECOGNITION"
                    heading="Why Industry Leaders Trust Us"
                    subheading="Award-winning technology trusted by the world's leading media companies."
                    showAwards={true}
                    awards={[
                        { name: "Emmy Award", image: "" },
                        { name: "NAB Show", image: "" },
                        { name: "Streaming Media", image: "" },
                        { name: "CSI Award", image: "" },
                    ]}
                    testimonials={[
                        {
                            quote: "Beamr's CABR technology has reduced our CDN costs by 42% while maintaining the visual quality our viewers expect. It's been a game-changer for our streaming infrastructure.",
                            author: "Sarah Chen",
                            role: "VP of Engineering",
                            company: "Major Streaming Platform",
                            avatar: "",
                        },
                    ]}
                />
            )}

            {showPartner && (
                <PartnerSection
                    {...sharedProps}
                    bgColor={bgColor}
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="PARTNERSHIP"
                    heading="Your Video Efficiency Partner"
                    description="Whether you're a streaming giant or an AI startup, Beamr delivers measurable results with seamless integration into your existing workflow."
                    layoutDirection="right"
                    showCta={true}
                    ctaText="Start Free Trial"
                    ctaUrl="#trial"
                    useVideo={false}
                    mediaImage=""
                    mediaVideo=""
                    features={[
                        { icon: "⚡", title: "Easy Integration", description: "Drop-in compatibility with all major encoders and CDNs." },
                        { icon: "📊", title: "Real-Time Analytics", description: "Monitor encoding performance and savings in real-time." },
                        { icon: "🔒", title: "Enterprise Security", description: "SOC 2 compliant with end-to-end encryption for all content." },
                    ]}
                />
            )}

            {showNews && (
                <NewsSection
                    {...sharedProps}
                    bgColor="#0a0b1e"
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="INSIGHTS"
                    heading="News and Stories"
                    subheading="Stay up to date with the latest in video optimization technology."
                    showViewAll={true}
                    viewAllText="View All Articles"
                    viewAllUrl="/blog"
                    columns={3}
                    cardBorderRadius={16}
                    posts={[
                        { image: "", category: "Technology", date: "Jan 15, 2026", title: "How CABR Reduces CDN Costs by 50% Without Quality Loss", excerpt: "Discover the science behind content-adaptive bitrate encoding and how it's transforming video delivery.", url: "#" },
                        { image: "", category: "Case Study", date: "Jan 10, 2026", title: "Netflix Partner Saves $2M in Annual Bandwidth Costs", excerpt: "Learn how a major streaming partner leveraged Beamr to dramatically cut infrastructure spending.", url: "#" },
                        { image: "", category: "Industry", date: "Jan 5, 2026", title: "The Future of Autonomous Vehicle Video Processing", excerpt: "Exploring how efficient video encoding is critical for next-generation self-driving technology.", url: "#" },
                    ]}
                />
            )}

            {showFAQ && (
                <FAQSection
                    {...sharedProps}
                    bgColor={bgColor}
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    sectionLabel="FAQ"
                    heading="Frequently Asked Questions"
                    subheading="Everything you need to know about Beamr's video optimization technology."
                    allowMultipleOpen={false}
                    faqs={[
                        { question: "What is Content-Adaptive Bitrate (CABR)?", answer: "CABR is Beamr's patented technology that analyzes video content frame-by-frame and optimizes encoding parameters in real-time." },
                        { question: "How does Beamr maintain video quality?", answer: "Beamr uses perceptual quality metrics and a unique quality-assured encoding approach." },
                        { question: "What video formats and codecs are supported?", answer: "Beamr supports all major codecs including H.264/AVC, H.265/HEVC, AV1, and VP9." },
                        { question: "How long does integration take?", answer: "Most customers are up and running within days with dedicated integration support." },
                        { question: "What kind of cost savings can I expect?", answer: "Typical customers see 30-50% reduction in CDN bandwidth costs and 20-40% storage savings." },
                    ]}
                />
            )}

            {showCTA && (
                <CTASection
                    {...sharedProps}
                    bgColor={bgColor}
                    cardBgColor="#0f1029"
                    textColor="#ffffff"
                    secondaryTextColor="#8b8ba3"
                    heading={"Ready to Optimize\nYour Video?"}
                    subheading="Join 1,000+ companies already saving millions on video delivery with Beamr's content-adaptive encoding."
                    ctaPrimaryText="Get Started Free"
                    ctaPrimaryUrl="#contact"
                    ctaSecondaryText="Talk to Sales"
                    ctaSecondaryUrl="#sales"
                    showSecondaryButton={true}
                    showGlow={true}
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

addPropertyControls(Homepage, {
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
    showHero: {
        type: ControlType.Boolean,
        title: "Hero",
        defaultValue: true,
    },
    showLogoBar: {
        type: ControlType.Boolean,
        title: "Logo Bar",
        defaultValue: true,
    },
    showSolutions: {
        type: ControlType.Boolean,
        title: "Solutions",
        defaultValue: true,
    },
    showCompanyUsage: {
        type: ControlType.Boolean,
        title: "Company Usage",
        defaultValue: true,
    },
    showCABR: {
        type: ControlType.Boolean,
        title: "CABR Science",
        defaultValue: true,
    },
    showTrust: {
        type: ControlType.Boolean,
        title: "Trust Section",
        defaultValue: true,
    },
    showPartner: {
        type: ControlType.Boolean,
        title: "Partner Section",
        defaultValue: true,
    },
    showNews: {
        type: ControlType.Boolean,
        title: "News Section",
        defaultValue: true,
    },
    showFAQ: {
        type: ControlType.Boolean,
        title: "FAQ",
        defaultValue: true,
    },
    showCTA: {
        type: ControlType.Boolean,
        title: "CTA Section",
        defaultValue: true,
    },
    showFooter: {
        type: ControlType.Boolean,
        title: "Footer",
        defaultValue: true,
    },
})

export default Homepage
