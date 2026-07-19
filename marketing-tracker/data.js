/*
 * Beamr Marketing Objectives — seed data
 * Parsed from the Q3/Q4 marketing plan.
 *
 * Each objective:
 *   id       unique string
 *   pillar   one of the 4 strategic pillars
 *   title    short objective name
 *   detail   extra context (optional)
 *   owner    person / area responsible (editable in the tool)
 *   due      ISO date "YYYY-MM-DD" for deadline tracking, or "" if none
 *   dueLabel human-friendly deadline label
 *   quarter  "Q3" | "Q4" | "" (ongoing)
 *   type     "task" (done/not-done) or "metric" (numeric target)
 *   target   number  (metrics only)
 *   unit     string  (metrics only, e.g. "MQLs")
 *
 * User-editable state (status/progress/current/notes) is stored separately
 * in localStorage so re-seeding never wipes progress.
 */
window.BEAMR_SEED = [
  /* ── Pillar 1: Must-have Solution Provider ───────────────────────── */
  { id: "sp-mlsafe",      pillar: "Solution Provider", title: "ML-Safe page live", detail: "+ whitepaper if delivered", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "task" },
  { id: "sp-avdemo",      pillar: "Solution Provider", title: "Define AV/VSR demo tools & calculators for website", detail: "", owner: "", due: "2026-07-15", dueLabel: "Jul 15", quarter: "Q3", type: "task" },
  { id: "sp-funnels",     pillar: "Solution Provider", title: "Map & build funnels for different ICPs", detail: "", owner: "", due: "2026-08-31", dueLabel: "End of Aug", quarter: "Q3", type: "task" },
  { id: "sp-cited",       pillar: "Solution Provider", title: "Term cited on 3 non-Beamr places (PR)", detail: "", owner: "", due: "", dueLabel: "—", quarter: "", type: "metric", target: 3, unit: "citations" },
  { id: "sp-meetup-q3",   pillar: "Solution Provider", title: "1 video TLV community meetup hosted by Beamr", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "task" },
  { id: "sp-blog-q3",     pillar: "Solution Provider", title: "+2 expert blog posts", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 2, unit: "posts" },
  { id: "sp-podcast-q4a", pillar: "Solution Provider", title: "Secure +1 AV/ML podcast/interview (PR)", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 1, unit: "podcasts" },
  { id: "sp-webinar-q3",  pillar: "Solution Provider", title: "+1 webinar for AV/ML audience", detail: "", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "metric", target: 1, unit: "webinars" },
  { id: "sp-media-q3",    pillar: "Solution Provider", title: "+3 AV/ML media mentions / earned articles (PR)", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 3, unit: "mentions" },
  { id: "sp-talks-q4",    pillar: "Solution Provider", title: "+3 talks submitted to priority events", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 3, unit: "talks" },
  { id: "sp-podcast-q4b", pillar: "Solution Provider", title: "Secure +2 AV/ML podcast/interview (PR)", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 2, unit: "podcasts" },
  { id: "sp-meetup-q4",   pillar: "Solution Provider", title: "1 video TLV community meetup hosted by Beamr", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "task" },
  { id: "sp-media-q4",    pillar: "Solution Provider", title: "+3 AV/ML media mentions / earned articles (PR)", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 3, unit: "mentions" },
  { id: "sp-webinar-q4",  pillar: "Solution Provider", title: "+2 webinars for AV/ML audience", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 2, unit: "webinars" },
  { id: "sp-devhub-v1",   pillar: "Solution Provider", title: "Developers Hub v1 live (existing content)", detail: "Benchmarks, tech docs, integrations guide", owner: "", due: "2026-09-09", dueLabel: "Sep 9", quarter: "Q3", type: "task" },
  { id: "sp-hf",          pillar: "Solution Provider", title: "Hugging Face profile updated with all benchmarks", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "task" },
  { id: "sp-devhub-v2",   pillar: "Solution Provider", title: "Developers Hub v2 live with new content", detail: "Based on Product & AI deliverables", owner: "", due: "2026-12-31", dueLabel: "During Q4", quarter: "Q4", type: "task" },
  { id: "sp-inquiries",   pillar: "Solution Provider", title: "+10 inquiries from hub", detail: "", owner: "", due: "", dueLabel: "—", quarter: "", type: "metric", target: 10, unit: "inquiries" },
  { id: "sp-bp-lp",       pillar: "Solution Provider", title: "Blueprint LP published", detail: "", owner: "", due: "2026-07-15", dueLabel: "Mid-July", quarter: "Q3", type: "task" },
  { id: "sp-bp-camp",     pillar: "Solution Provider", title: "Blueprint campaign launched", detail: "", owner: "", due: "2026-07-15", dueLabel: "Mid-July", quarter: "Q3", type: "task" },
  { id: "sp-bp-sql",      pillar: "Solution Provider", title: "+5 Blueprint SQL", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 5, unit: "SQLs" },

  /* ── Pillar 2: Revenue ───────────────────────────────────────────── */
  { id: "rev-map-packs",  pillar: "Revenue", title: "Map active deal needs + define forwardable pack per deal", detail: "", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "task" },
  { id: "rev-all-packs",  pillar: "Revenue", title: "Every active deal has its pack", detail: "", owner: "", due: "2026-10-01", dueLabel: "Oct 1", quarter: "Q4", type: "task" },
  { id: "rev-bp-kit",     pillar: "Revenue", title: "Blueprint V1 sales kit (deck + one-pager, AV & SR)", detail: "", owner: "", due: "2026-07-02", dueLabel: "Jul 2", quarter: "Q3", type: "task" },
  { id: "rev-bp-av-lp",   pillar: "Revenue", title: "Blueprint AV LP", detail: "", owner: "", due: "2026-07-15", dueLabel: "Jul 15", quarter: "Q3", type: "task" },
  { id: "rev-bp-vsr-lp",  pillar: "Revenue", title: "Blueprint VSR LP", detail: "", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "task" },
  { id: "rev-legacy",     pillar: "Revenue", title: "Verify legacy marketing material up to date (quarterly)", detail: "Starting mid-July", owner: "", due: "2026-07-15", dueLabel: "Mid-July (quarterly)", quarter: "", type: "task" },
  { id: "rev-renewals",   pillar: "Revenue", title: "Re-engage renewals (Netflix / Paramount / JioStar) with fresh proof", detail: "", owner: "", due: "2026-08-31", dueLabel: "End of Aug", quarter: "Q3", type: "task" },
  { id: "rev-newsletter", pillar: "Revenue", title: "Monthly newsletter (features & releases)", detail: "Starting Aug 1", owner: "", due: "2026-08-01", dueLabel: "Aug 1 (monthly)", quarter: "", type: "task" },
  { id: "rev-mql-q3",     pillar: "Revenue", title: "MQLs — Q3", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 300, unit: "MQLs" },
  { id: "rev-sql-q3",     pillar: "Revenue", title: "SQLs — Q3", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 30, unit: "SQLs" },
  { id: "rev-opp-q3",     pillar: "Revenue", title: "Opportunities — Q3", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 4, unit: "opps" },
  { id: "rev-mql-q4",     pillar: "Revenue", title: "MQLs — Q4", detail: "May adjust based on Q3 results", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 400, unit: "MQLs" },
  { id: "rev-sql-q4",     pillar: "Revenue", title: "SQLs — Q4", detail: "May adjust based on Q3 results", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 40, unit: "SQLs" },
  { id: "rev-opp-q4",     pillar: "Revenue", title: "Opportunities — Q4", detail: "May adjust based on Q3 results", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 6, unit: "opps" },

  /* ── Pillar 3: Solidify Market Position in M&E ───────────────────── */
  { id: "me-ibc-launch",  pillar: "Market Position M&E", title: "SR launched live at IBC + booth design & planning", detail: "IBC Sep 11. Side event + speaking opportunity submission", owner: "", due: "2026-07-15", dueLabel: "Jul 15 (planning)", quarter: "Q3", type: "task" },
  { id: "me-target-list", pillar: "Market Position M&E", title: "Target-accounts list for IBC + SR campaign", detail: "", owner: "", due: "2026-07-05", dueLabel: "Jul 5", quarter: "Q3", type: "task" },
  { id: "me-presence",    pillar: "Market Position M&E", title: "Finalize presence + announcement", detail: "With NVIDIA + 1 partner, or alone", owner: "", due: "2026-08-10", dueLabel: "Aug 10", quarter: "Q3", type: "task" },
  { id: "me-launchkit",   pillar: "Market Position M&E", title: "Launch kit ready (PR + blog + social)", detail: "", owner: "", due: "2026-08-10", dueLabel: "Aug 10", quarter: "Q3", type: "task" },
  { id: "me-media-q3",    pillar: "Market Position M&E", title: "+5 media mentions", detail: "", owner: "", due: "2026-09-30", dueLabel: "End of Q3", quarter: "Q3", type: "metric", target: 5, unit: "mentions" },
  { id: "me-media-q4",    pillar: "Market Position M&E", title: "Post-IBC story: +3 media mentions / earned articles", detail: "", owner: "", due: "2026-12-31", dueLabel: "During Q4", quarter: "Q4", type: "metric", target: 3, unit: "mentions" },
  { id: "me-recap",       pillar: "Market Position M&E", title: "Recap content published (highlight video + post-event blog)", detail: "", owner: "", due: "2026-10-15", dueLabel: "Mid Oct", quarter: "Q4", type: "task" },
  { id: "me-casestudy",   pillar: "Market Position M&E", title: "Partner case study (+ testimonial video?)", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "task" },
  { id: "me-sr-kit",      pillar: "Market Position M&E", title: "Blueprint SR sales kit (deck + one-pager)", detail: "", owner: "", due: "2026-07-02", dueLabel: "Jul 2", quarter: "Q3", type: "task" },
  { id: "me-devhub-v1",   pillar: "Market Position M&E", title: "Developers Hub v1 — tech docs + VSR/VISTA benchmarks", detail: "", owner: "", due: "2026-09-09", dueLabel: "Sep 9", quarter: "Q3", type: "task" },
  { id: "me-devhub-v2",   pillar: "Market Position M&E", title: "Developers Hub v2 — new benchmarks (AI/Product assets)", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "task" },
  { id: "me-inquiries",   pillar: "Market Position M&E", title: "+10 inquiries from hub", detail: "", owner: "", due: "2026-12-31", dueLabel: "End of Q4", quarter: "Q4", type: "metric", target: 10, unit: "inquiries" },
  { id: "me-sr-offer",    pillar: "Market Position M&E", title: "SR offer packaged & messaged before IBC", detail: "Positioning, pricing story, one-pager/pitch, SR LP, sales kit all live", owner: "", due: "2026-08-15", dueLabel: "Aug 15", quarter: "Q3", type: "task" },
  { id: "me-sr-funnel",   pillar: "Market Position M&E", title: "SR marketing funnel for target-account list before IBC", detail: "Campaign + lead journey", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "task" },
  { id: "me-sr-deals-q3", pillar: "Market Position M&E", title: "2 SR-qualified deals (opportunities)", detail: "", owner: "", due: "2026-09-30", dueLabel: "Pre-IBC", quarter: "Q3", type: "metric", target: 2, unit: "deals" },
  { id: "me-sports-push", pillar: "Market Position M&E", title: "Sports-tech market push", detail: "Industry events list, focused materials, target account list", owner: "", due: "", dueLabel: "—", quarter: "", type: "task" },
  { id: "me-sports-op",   pillar: "Market Position M&E", title: "Sports-tech one-pager", detail: "", owner: "", due: "2026-08-01", dueLabel: "Aug 1", quarter: "Q3", type: "task" },
  { id: "me-optimize",    pillar: "Market Position M&E", title: "Optimize SR funnel based on IBC insights", detail: "", owner: "", due: "2026-12-31", dueLabel: "Post-IBC", quarter: "Q4", type: "task" },
  { id: "me-sr-deals-q4", pillar: "Market Position M&E", title: "2 SR-qualified deals", detail: "", owner: "", due: "2026-12-31", dueLabel: "Post-IBC", quarter: "Q4", type: "metric", target: 2, unit: "deals" },
  { id: "me-postibc",     pillar: "Market Position M&E", title: "Post-IBC funnel for IBC leads", detail: "", owner: "", due: "2026-12-31", dueLabel: "Post-IBC", quarter: "Q4", type: "task" },

  /* ── Pillar 4: Improve Decision Making ───────────────────────────── */
  { id: "dm-plan",        pillar: "Decision Making", title: "Upload major marketing items to the plan", detail: "", owner: "", due: "2026-07-15", dueLabel: "Mid-July", quarter: "Q3", type: "task" },
  { id: "dm-dashboard",   pillar: "Decision Making", title: "Marketing dashboard ready (leads, conversion)", detail: "Checked monthly, exposed to everyone", owner: "", due: "2026-08-31", dueLabel: "End of Aug", quarter: "Q3", type: "task" },
  { id: "dm-funnel",      pillar: "Decision Making", title: "Full-funnel tracking live (MQL→SQL→opp→close)", detail: "Reviewed monthly", owner: "", due: "2026-09-30", dueLabel: "End of Sep", quarter: "Q3", type: "task" },
  { id: "dm-hubspot",     pillar: "Decision Making", title: "HubSpot single source of truth — full sync", detail: "Same workflows for every rep: inbox sync, status updates, notes", owner: "", due: "2026-07-15", dueLabel: "Mid-July", quarter: "Q3", type: "task" },
];
