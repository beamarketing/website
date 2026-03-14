// Career Open Roles Section — filterable role list with detail modal
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef, useCallback } from "react"

const COLORS = {
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    lightLavender: "#EAEBFF",
    white: "#FFFFFF",
    muted: "#8896AB",
    darkText: "#1E293B",
    darkNavy: "#000737",
    overlay: "rgba(0,0,0,0.5)",
    success: "#10B981",
    error: "#EF4444",
}

interface Role {
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements: string[]
    niceToHave: string[]
}

// Framer property control shape — requirements/niceToHave as newline-separated strings
interface RoleInput {
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements: string
    niceToHave: string
}

function parseRole(input: RoleInput): Role {
    return {
        ...input,
        requirements: input.requirements ? input.requirements.split("\n").filter(Boolean) : [],
        niceToHave: input.niceToHave ? input.niceToHave.split("\n").filter(Boolean) : [],
    }
}

const DEFAULT_ROLES: Role[] = [
    {
        title: "Senior Video Codec Engineer",
        department: "Engineering",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Design and optimize next-generation video codecs that push the boundaries of compression efficiency. You'll work on H.266/VVC, AV1, and proprietary algorithms that process billions of frames daily across our global CDN.",
        requirements: [
            "5+ years in video codec development (H.264/H.265/AV1/VVC)",
            "Deep understanding of transform coding, motion estimation, and rate-distortion optimization",
            "Proficiency in C/C++ with SIMD/NEON optimization experience",
            "Experience with FFmpeg, GStreamer, or similar multimedia frameworks",
        ],
        niceToHave: [
            "Published research in video compression",
            "GPU compute experience (CUDA/OpenCL)",
        ],
    },
    {
        title: "GPU Systems Engineer",
        department: "Engineering",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Build and optimize GPU-accelerated video processing pipelines that handle massive scale. You'll work directly with GPU drivers, CUDA kernels, and low-level system interfaces to squeeze every bit of performance.",
        requirements: [
            "4+ years of GPU programming (CUDA, OpenCL, or Vulkan Compute)",
            "Systems-level C/C++ expertise",
            "Understanding of GPU architectures and memory hierarchies",
            "Experience profiling and optimizing GPU workloads",
        ],
        niceToHave: [
            "Video processing or computer vision background",
            "Linux kernel / driver development experience",
        ],
    },
    {
        title: "Perceptual Quality Researcher",
        department: "Research",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Research and develop perceptual quality metrics that define how humans experience compressed video. Your work directly shapes our encoding decisions across billions of streams.",
        requirements: [
            "PhD or equivalent experience in image/video quality assessment",
            "Strong background in psychophysics or computational neuroscience",
            "Publication track record in top-tier venues (ICIP, CVPR, ACM MM)",
            "Proficiency in Python and deep learning frameworks",
        ],
        niceToHave: [
            "Experience building production ML models",
            "Familiarity with video codecs",
        ],
    },
    {
        title: "Full-Stack Engineer",
        department: "Engineering",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Build the dashboard, APIs, and tooling that our customers and internal teams use daily. You'll own features end-to-end — from database schema to pixel-perfect UI.",
        requirements: [
            "3+ years full-stack development experience",
            "Strong TypeScript/React skills",
            "Backend experience with Node.js or Python",
            "Database design (PostgreSQL, Redis)",
        ],
        niceToHave: [
            "Experience with video/media platforms",
            "Infrastructure as code (Terraform, Pulumi)",
        ],
    },
    {
        title: "Algorithm Developer — Video",
        department: "Engineering",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Develop novel algorithms for content-adaptive encoding, scene detection, and bitrate optimization. You'll translate research ideas into production-grade solutions.",
        requirements: [
            "MSc/PhD in CS, EE, or related field",
            "Strong algorithm design and optimization skills",
            "Experience with signal processing or video analysis",
            "C/C++ and Python proficiency",
        ],
        niceToHave: [
            "Machine learning for video understanding",
            "Real-time processing experience",
        ],
    },
    {
        title: "Data Engineer",
        department: "Engineering",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Build the data infrastructure that powers our analytics, ML pipelines, and business intelligence. Process petabytes of video encoding telemetry to surface actionable insights.",
        requirements: [
            "3+ years data engineering experience",
            "Strong SQL and Python skills",
            "Experience with Spark, Airflow, or similar tools",
            "Cloud data platforms (AWS/GCP)",
        ],
        niceToHave: [
            "Streaming data experience (Kafka, Kinesis)",
            "ML pipeline orchestration",
        ],
    },
    {
        title: "Director of Product",
        department: "Product",
        location: "Tel Aviv",
        type: "Full-time",
        description: "Lead product strategy for our core encoding platform. You'll define the roadmap, work closely with engineering and research, and shape how the world's largest media companies optimize their video.",
        requirements: [
            "8+ years in product management, 3+ in leadership roles",
            "Deep understanding of video/media technology",
            "Track record of shipping B2B SaaS products",
            "Strong analytical and communication skills",
        ],
        niceToHave: [
            "Background in video streaming or CDN",
            "Technical degree",
        ],
    },
    {
        title: "Product Manager — AV & ML",
        department: "Product",
        location: "Remote",
        type: "Full-time",
        description: "Own the product vision for our ML-powered encoding features. You'll bridge research breakthroughs and customer needs, turning cutting-edge AI into products people rely on.",
        requirements: [
            "5+ years product management experience",
            "Understanding of ML/AI product lifecycle",
            "Experience working with research teams",
            "Strong data-driven decision making",
        ],
        niceToHave: [
            "Audio/video technology background",
            "Technical PM experience",
        ],
    },
    {
        title: "VidOps Engineer",
        department: "Operations",
        location: "Remote",
        type: "Full-time",
        description: "Manage and optimize our video encoding infrastructure at scale. You'll ensure uptime, performance, and efficiency across thousands of encoding jobs running 24/7.",
        requirements: [
            "3+ years in DevOps/SRE",
            "Strong Linux systems administration",
            "Container orchestration (Kubernetes)",
            "Monitoring and alerting (Prometheus, Grafana)",
        ],
        niceToHave: [
            "Video transcoding pipeline experience",
            "Cost optimization in cloud environments",
        ],
    },
    {
        title: "Technical Account Manager",
        department: "Operations",
        location: "Remote",
        type: "Full-time",
        description: "Be the trusted technical advisor for our enterprise customers. You'll help media companies integrate our encoding solutions, troubleshoot complex issues, and drive adoption.",
        requirements: [
            "3+ years in technical account management or solutions engineering",
            "Understanding of video workflows and streaming",
            "Strong communication and presentation skills",
            "Ability to translate technical concepts for business audiences",
        ],
        niceToHave: [
            "Experience with media & entertainment clients",
            "Scripting/automation skills",
        ],
    },
]

const DEFAULTS = {
    headingFont: "'Poppins', 'Inter', sans-serif",
    bodyFont: "'Inter', 'Poppins', sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    sectionHeadlineSize: 28,
    roleTitleSize: 16,
    bodySize: 14,
}

// ─── File Drop Zone ─────────────────────────────────────────
function FileDropZone({ bodyFont, onFile }: {
    bodyFont: string
    onFile: (file: File) => void
}) {
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) onFile(file)
    }, [onFile])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) onFile(file)
    }, [onFile])

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
                border: `2px dashed ${dragging ? COLORS.accentBlue : "rgba(0,0,0,0.12)"}`,
                borderRadius: 12,
                padding: "32px 24px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragging ? "rgba(0,153,255,0.04)" : "rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                style={{ display: "none" }}
            />
            <div style={{ fontSize: 28, marginBottom: 8 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>
            <p style={{
                fontFamily: bodyFont, fontSize: 14, fontWeight: 500,
                color: COLORS.darkText, margin: "0 0 4px 0",
            }}>
                Drop your CV here or <span style={{ color: COLORS.accentBlue }}>browse</span>
            </p>
            <p style={{
                fontFamily: bodyFont, fontSize: 12,
                color: COLORS.muted, margin: 0,
            }}>
                PDF, DOC, DOCX — max 10 MB
            </p>
        </div>
    )
}

// ─── Role Detail Modal ──────────────────────────────────────
function RoleDetailModal({ role, headingFont, bodyFont, monoFont, onClose }: {
    role: Role
    headingFont: string
    bodyFont: string
    monoFont: string
    onClose: () => void
}) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [message, setMessage] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    const handleShare = useCallback(() => {
        const url = `${window.location.origin}${window.location.pathname}?role=${encodeURIComponent(role.title)}`
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [role.title])

    const handleSubmit = useCallback(() => {
        if (!name.trim() || !email.trim() || !uploadedFile) return
        setSubmitted(true)
    }, [name, email, uploadedFile])

    const inputStyle: React.CSSProperties = {
        fontFamily: bodyFont, fontSize: 14,
        padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid rgba(0,0,0,0.1)",
        outline: "none", width: "100%", boxSizing: "border-box",
        transition: "border-color 0.2s ease",
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: COLORS.overlay, zIndex: 9999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 24,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: COLORS.white, borderRadius: 16,
                    maxWidth: 680, width: "100%", maxHeight: "90vh",
                    overflow: "auto", position: "relative",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "32px 32px 0", position: "sticky", top: 0,
                    backgroundColor: COLORS.white, zIndex: 1,
                    borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 24,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontFamily: headingFont, fontSize: 24, fontWeight: 700,
                                color: COLORS.darkText, margin: "0 0 8px 0", lineHeight: 1.2,
                            }}>
                                {role.title}
                            </h2>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[role.department, role.location, role.type].map((tag) => (
                                    <span key={tag} style={{
                                        fontFamily: monoFont, fontSize: 10, fontWeight: 500,
                                        textTransform: "uppercase", letterSpacing: "1px",
                                        color: COLORS.fullBlue, backgroundColor: COLORS.lightLavender,
                                        padding: "4px 10px", borderRadius: 4,
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                            <button
                                onClick={handleShare}
                                style={{
                                    background: "none", border: "1.5px solid rgba(0,0,0,0.1)",
                                    borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                                    fontFamily: monoFont, fontSize: 11, color: COLORS.muted,
                                    display: "flex", alignItems: "center", gap: 6,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                                {copied ? "Copied!" : "Share"}
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    padding: 8, color: COLORS.muted, fontSize: 20, lineHeight: 1,
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: 32 }}>
                    {submitted ? (
                        <div style={{ textAlign: "center", padding: "48px 24px" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "50%",
                                backgroundColor: "rgba(16,185,129,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 16px",
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{
                                fontFamily: headingFont, fontSize: 20, fontWeight: 700,
                                color: COLORS.darkText, margin: "0 0 8px 0",
                            }}>
                                Application Submitted
                            </h3>
                            <p style={{
                                fontFamily: bodyFont, fontSize: 14,
                                color: COLORS.muted, margin: "0 0 24px 0", lineHeight: 1.6,
                            }}>
                                Thanks, {name.split(" ")[0]}! We'll review your application and get back to you within a few days.
                            </p>
                            <button
                                onClick={onClose}
                                style={{
                                    fontFamily: headingFont, fontSize: 14, fontWeight: 600,
                                    backgroundColor: COLORS.fullBlue, color: COLORS.white,
                                    border: "none", borderRadius: 8, padding: "12px 32px",
                                    cursor: "pointer",
                                }}
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Description */}
                            <div style={{ marginBottom: 28 }}>
                                <h3 style={{
                                    fontFamily: headingFont, fontSize: 14, fontWeight: 700,
                                    textTransform: "uppercase", letterSpacing: "1px",
                                    color: COLORS.muted, margin: "0 0 12px 0",
                                }}>
                                    About the Role
                                </h3>
                                <p style={{
                                    fontFamily: bodyFont, fontSize: 15,
                                    color: COLORS.darkText, lineHeight: 1.7, margin: 0,
                                }}>
                                    {role.description}
                                </p>
                            </div>

                            {/* Requirements */}
                            {role.requirements.length > 0 && (
                                <div style={{ marginBottom: 28 }}>
                                    <h3 style={{
                                        fontFamily: headingFont, fontSize: 14, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "1px",
                                        color: COLORS.muted, margin: "0 0 12px 0",
                                    }}>
                                        What You Bring
                                    </h3>
                                    <ul style={{
                                        fontFamily: bodyFont, fontSize: 14,
                                        color: COLORS.darkText, lineHeight: 1.8,
                                        margin: 0, paddingLeft: 20,
                                    }}>
                                        {role.requirements.map((req, i) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Nice to Have */}
                            {role.niceToHave.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{
                                        fontFamily: headingFont, fontSize: 14, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "1px",
                                        color: COLORS.muted, margin: "0 0 12px 0",
                                    }}>
                                        Nice to Have
                                    </h3>
                                    <ul style={{
                                        fontFamily: bodyFont, fontSize: 14,
                                        color: COLORS.darkText, lineHeight: 1.8,
                                        margin: 0, paddingLeft: 20,
                                    }}>
                                        {role.niceToHave.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Divider */}
                            <div style={{
                                height: 1, backgroundColor: "rgba(0,0,0,0.06)",
                                margin: "0 0 28px 0",
                            }} />

                            {/* Application Form */}
                            <h3 style={{
                                fontFamily: headingFont, fontSize: 14, fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: "1px",
                                color: COLORS.muted, margin: "0 0 20px 0",
                            }}>
                                Apply for This Role
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <label style={{
                                            fontFamily: bodyFont, fontSize: 12, fontWeight: 600,
                                            color: COLORS.darkText, display: "block", marginBottom: 6,
                                        }}>
                                            Full Name <span style={{ color: COLORS.error }}>*</span>
                                        </label>
                                        <input
                                            style={inputStyle}
                                            placeholder="Jane Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <label style={{
                                            fontFamily: bodyFont, fontSize: 12, fontWeight: 600,
                                            color: COLORS.darkText, display: "block", marginBottom: 6,
                                        }}>
                                            Email <span style={{ color: COLORS.error }}>*</span>
                                        </label>
                                        <input
                                            style={inputStyle}
                                            type="email"
                                            placeholder="jane@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        fontFamily: bodyFont, fontSize: 12, fontWeight: 600,
                                        color: COLORS.darkText, display: "block", marginBottom: 6,
                                    }}>
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        style={inputStyle}
                                        placeholder="https://linkedin.com/in/..."
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        fontFamily: bodyFont, fontSize: 12, fontWeight: 600,
                                        color: COLORS.darkText, display: "block", marginBottom: 6,
                                    }}>
                                        Resume / CV <span style={{ color: COLORS.error }}>*</span>
                                    </label>
                                    {uploadedFile ? (
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            padding: "12px 16px", borderRadius: 8,
                                            backgroundColor: "rgba(16,185,129,0.06)",
                                            border: `1.5px solid ${COLORS.success}`,
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <span style={{
                                                fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
                                                color: COLORS.darkText, flex: 1,
                                            }}>
                                                {uploadedFile.name}
                                            </span>
                                            <button
                                                onClick={() => setUploadedFile(null)}
                                                style={{
                                                    background: "none", border: "none",
                                                    cursor: "pointer", color: COLORS.muted,
                                                    fontSize: 16, padding: 4,
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ) : (
                                        <FileDropZone bodyFont={bodyFont} onFile={setUploadedFile} />
                                    )}
                                </div>

                                <div>
                                    <label style={{
                                        fontFamily: bodyFont, fontSize: 12, fontWeight: 600,
                                        color: COLORS.darkText, display: "block", marginBottom: 6,
                                    }}>
                                        Anything else?
                                    </label>
                                    <textarea
                                        style={{
                                            ...inputStyle,
                                            resize: "vertical" as const,
                                            minHeight: 80,
                                        }}
                                        placeholder="Cover letter, portfolio link, or anything you'd like us to know..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!name.trim() || !email.trim() || !uploadedFile}
                                    style={{
                                        fontFamily: headingFont, fontSize: 15, fontWeight: 600,
                                        backgroundColor: (!name.trim() || !email.trim() || !uploadedFile)
                                            ? "rgba(55,81,255,0.4)" : COLORS.fullBlue,
                                        color: COLORS.white,
                                        border: "none", borderRadius: 10, padding: "14px 32px",
                                        cursor: (!name.trim() || !email.trim() || !uploadedFile) ? "not-allowed" : "pointer",
                                        transition: "all 0.2s ease",
                                        alignSelf: "flex-start",
                                        marginTop: 8,
                                    }}
                                >
                                    Submit Application
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Role Row ──────────────────────────────────────────────────
function RoleRow({ role, headingFont, monoFont, bodyFont, roleTitleSize, onClick }: {
    role: Role
    headingFont: string
    monoFont: string
    bodyFont: string
    roleTitleSize: number
    onClick: () => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: hovered ? "16px 16px 16px 28px" : "16px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                textDecoration: "none", position: "relative",
                transition: "all 0.25s ease", cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 3, height: hovered ? 28 : 0,
                background: `linear-gradient(${COLORS.accentBlue}, ${COLORS.fullBlue})`,
                borderRadius: 2, transition: "height 0.25s ease",
            }} />

            <div style={{ flex: 1 }}>
                <span style={{
                    fontFamily: headingFont, fontSize: roleTitleSize, fontWeight: 600,
                    color: hovered ? COLORS.fullBlue : COLORS.darkText,
                    transition: "color 0.2s ease",
                }}>
                    {role.title}
                </span>
                <span style={{
                    fontFamily: bodyFont, fontSize: 13,
                    color: COLORS.muted, marginLeft: 12,
                }}>
                    {role.type}
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                    fontFamily: monoFont, fontSize: 8, fontWeight: 500,
                    textTransform: "uppercase" as const, letterSpacing: "1.2px",
                    color: COLORS.fullBlue, backgroundColor: COLORS.lightLavender,
                    padding: "4px 8px", borderRadius: 4,
                    opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease",
                }}>
                    {role.department}
                </span>
                <span style={{
                    fontFamily: bodyFont, fontSize: 14, color: COLORS.muted,
                    transition: "transform 0.2s ease",
                    transform: hovered ? "translateX(4px)" : "translateX(0)",
                    display: "inline-block",
                }}>
                    &rarr;
                </span>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// CAREER OPEN ROLES — main export
// ═══════════════════════════════════════════════════════════════
interface CareerOpenRolesProps {
    // Fonts
    headingFont: string
    bodyFont: string
    monoFont: string
    sectionHeadlineSize: number
    roleTitleSize: number
    bodySize: number
    // Copy
    headline: string
    filterLocationLabel: string
    filterDeptLabel: string
    emptyText: string
    // Data
    roles: RoleInput[]
    // Style
    style?: React.CSSProperties
}

function CareerOpenRoles(props: CareerOpenRolesProps) {
    const {
        headingFont = DEFAULTS.headingFont,
        bodyFont = DEFAULTS.bodyFont,
        monoFont = DEFAULTS.monoFont,
        sectionHeadlineSize = DEFAULTS.sectionHeadlineSize,
        roleTitleSize = DEFAULTS.roleTitleSize,
        bodySize = DEFAULTS.bodySize,
        headline = "Find Your Next Career Opportunity",
        filterLocationLabel = "Location",
        filterDeptLabel = "Department",
        emptyText = "No roles match your filters. Try broadening your search.",
        roles: roleInputs = [],
        style,
    } = props

    // Convert Framer inputs to Role objects, fall back to defaults
    const roles: Role[] = roleInputs.length > 0
        ? roleInputs.map(parseRole)
        : DEFAULT_ROLES

    const [locationFilter, setLocationFilter] = useState("all")
    const [deptFilter, setDeptFilter] = useState("all")
    const [isMobile, setIsMobile] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)

    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Deep-link: open role from URL param on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const roleParam = params.get("role")
        if (roleParam) {
            const match = roles.find((r) => r.title === roleParam)
            if (match) setSelectedRole(match)
        }
    }, [])

    const locations = Array.from(new Set(roles.map((r) => r.location)))
    const departments = Array.from(new Set(roles.map((r) => r.department)))

    const filtered = roles.filter((r) => {
        if (locationFilter !== "all" && r.location !== locationFilter) return false
        if (deptFilter !== "all" && r.department !== deptFilter) return false
        return true
    })

    const grouped: Record<string, Role[]> = {}
    for (const r of filtered) {
        if (!grouped[r.location]) grouped[r.location] = []
        grouped[r.location].push(r)
    }

    const selectStyle: React.CSSProperties = {
        fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
        padding: "10px 36px 10px 14px",
        border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 8,
        backgroundColor: COLORS.white, color: COLORS.darkText,
        appearance: "none" as const, cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896AB' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        outline: "none", minWidth: 160,
    }

    const labelStyle: React.CSSProperties = {
        fontFamily: monoFont, fontSize: 9, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "1.5px",
        color: COLORS.muted, opacity: 0.5, marginBottom: 6,
    }

    return (
        <>
            <section id="open-roles" style={{
                ...style,
                width: "100%", backgroundColor: COLORS.white,
                padding: isMobile ? "64px 24px" : "80px 48px", boxSizing: "border-box",
            }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 style={{
                        fontFamily: headingFont, fontSize: sectionHeadlineSize,
                        fontWeight: 700, color: COLORS.darkText,
                        letterSpacing: "-0.5px", margin: "0 0 32px 0",
                    }}>
                        {headline}
                    </h2>

                    <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" as const }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={labelStyle}>{filterLocationLabel}</span>
                            <select style={selectStyle} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                                <option value="all">All Locations</option>
                                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={labelStyle}>{filterDeptLabel}</span>
                            <select style={selectStyle} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                                <option value="all">All Departments</option>
                                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", marginBottom: 8 }} />

                    {Object.entries(grouped).map(([location, locationRoles]) => (
                        <div key={location} style={{ marginBottom: 24 }}>
                            <div style={{
                                fontFamily: headingFont, fontSize: 12, fontWeight: 700,
                                textTransform: "uppercase" as const, letterSpacing: "1.5px",
                                color: COLORS.muted, opacity: 0.5, padding: "16px 0 8px",
                            }}>
                                {location}
                            </div>
                            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }} />
                            {locationRoles.map((role, i) => (
                                <RoleRow
                                    key={i}
                                    role={role}
                                    headingFont={headingFont}
                                    monoFont={monoFont}
                                    bodyFont={bodyFont}
                                    roleTitleSize={roleTitleSize}
                                    onClick={() => setSelectedRole(role)}
                                />
                            ))}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <p style={{
                            fontFamily: bodyFont, fontSize: bodySize,
                            color: COLORS.muted, padding: "32px 0", textAlign: "center",
                        }}>
                            {emptyText}
                        </p>
                    )}
                </div>
            </section>

            {selectedRole && (
                <RoleDetailModal
                    role={selectedRole}
                    headingFont={headingFont}
                    bodyFont={bodyFont}
                    monoFont={monoFont}
                    onClose={() => setSelectedRole(null)}
                />
            )}
        </>
    )
}

addPropertyControls(CareerOpenRoles, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULTS.headingFont },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULTS.bodyFont },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: DEFAULTS.monoFont },
    sectionHeadlineSize: { type: ControlType.Number, title: "Headline Size", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    roleTitleSize: { type: ControlType.Number, title: "Role Title Size", defaultValue: 16, min: 12, max: 24, step: 1, unit: "px" },
    bodySize: { type: ControlType.Number, title: "Body Size", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Find Your Next Career Opportunity" },
    filterLocationLabel: { type: ControlType.String, title: "Location Label", defaultValue: "Location" },
    filterDeptLabel: { type: ControlType.String, title: "Dept Label", defaultValue: "Department" },
    emptyText: { type: ControlType.String, title: "Empty Text", defaultValue: "No roles match your filters. Try broadening your search." },
    roles: {
        type: ControlType.Array,
        title: "Roles",
        description: "Add, edit, or remove roles. Leave empty to use built-in defaults.",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "New Role" },
                department: {
                    type: ControlType.Enum,
                    title: "Department",
                    options: ["Engineering", "Research", "Product", "Operations", "Design", "Marketing", "Sales", "HR"],
                    defaultValue: "Engineering",
                },
                location: { type: ControlType.String, title: "Location", defaultValue: "Tel Aviv" },
                type: {
                    type: ControlType.Enum,
                    title: "Type",
                    options: ["Full-time", "Part-time", "Contract", "Internship"],
                    defaultValue: "Full-time",
                },
                description: { type: ControlType.String, title: "Description", defaultValue: "Describe the role..." },
                requirements: { type: ControlType.String, title: "Requirements", defaultValue: "", description: "One requirement per line" },
                niceToHave: { type: ControlType.String, title: "Nice to Have", defaultValue: "", description: "One item per line" },
            },
        },
        defaultValue: [],
    },
})

export default CareerOpenRoles
