"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Loader2, AlertCircle, Sparkles, Star, MessageCircle, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import useApi from "@/hooks/useApi";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const LIFE_ISSUES = [
  "Marriage & Union",
  "Relationship & Love",
  "Health & Hypertension",
  "Career & Job",
  "Pregnancy & Fertility",
  "Past Trauma",
  "Self Confidence",
  "Finance & Wealth",
  "Anxiety & Stress",
  "Property & Legal",
  "Family Harmony",
  "Education & Study",
];

const INTENSITY_LABELS = {
  0: { label: "No Impact", desc: "Not affecting your life at all." },
  1: { label: "Very Mild", desc: "Barely noticeable in daily life." },
  2: { label: "Mild", desc: "Sometimes affects your routine." },
  3: { label: "Moderate", desc: "Noticeably affecting daily life and emotional well-being." },
  4: { label: "High", desc: "Significantly disrupting your daily life." },
  5: { label: "Severe", desc: "Overwhelmingly impacting everything." },
};

const INTENSITY_BARS = [
  { label: "Emotional Impact", color: "#F59E0B", values: [0, 10, 25, 60, 80, 100] },
  { label: "Daily Disruption", color: "#F59E0B", values: [0, 10, 20, 50, 75, 100] },
  { label: "Relationship Strain", color: "#8B5CF6", values: [0, 5, 15, 45, 70, 95] },
  { label: "Duration of Issue", color: "#06B6D4", values: [0, 5, 15, 35, 60, 90] },
];

const DISCOVERY_OPTIONS = [
  "Instagram / Facebook",
  "Google Search",
  "YouTube",
  "Friend or Family",
  "News Article / Blog",
  "Other / Divine Calling",
];

const STEPS = [
  { id: 1, title: "Life Issue", subtitle: "Select your concern", tag: "Issue Selection" },
  { id: 2, title: "Intensity", subtitle: "Rate how deeply it affects you", tag: "Intensity Rating" },
  { id: 3, title: "Discovery", subtitle: "How did you find us?", tag: "How You Found Us" },
  { id: 4, title: "Your Match", subtitle: "AI recommendation", tag: "Your Match" },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function JourneyPage() {
  const router = useRouter();
  const { apiCall } = useApi();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({ issue: "", intensity: 3, discovery: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendedAstros, setRecommendedAstros] = useState([]);

  /* handlers */
  const handleIssueSelect = (v) => setSelections((p) => ({ ...p, issue: v }));
  const handleIntensityChange = (v) => setSelections((p) => ({ ...p, intensity: v }));
  const handleDiscoverySelect = (v) => setSelections((p) => ({ ...p, discovery: v }));

  const canContinue = useCallback(() => {
    if (currentStep === 1) return !!selections.issue;
    if (currentStep === 2) return true;
    if (currentStep === 3) return !!selections.discovery;
    return false;
  }, [currentStep, selections]);

  const submitOnboarding = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Step 1: Submit journey answers
      const response = await apiCall("/api/user/journey", "POST", {
        ques1: selections.issue,
        ques2: selections.intensity,
        ques3: selections.discovery,
      });

      if (response?.statusCode !== 200) {
        throw new Error(response?.message || `Server responded with status ${response?.statusCode}`);
      }

      // Step 2: Fetch recommended astrologers
      const recommendationResponse = await apiCall("/api/astrologer/recommended-astro", "GET");

      if (recommendationResponse?.statusCode === 200 && Array.isArray(recommendationResponse?.data)) {
        setRecommendedAstros(recommendationResponse.data);
      }

      // Step 3: Advance to Step 4 to show matches (do NOT navigate to dashboard yet)
      setCurrentStep(4);
    } catch (err) {
      console.error("Journey submission error:", err);
      setError(
        err.message?.includes("Failed to fetch")
          ? "Unable to connect to the server. Please try again."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!canContinue()) return;
    if (currentStep < 3) setCurrentStep((s) => s + 1);
    else await submitOnboarding();
  };

  const handleSkip = () => { if (currentStep < 3) setCurrentStep((s) => s + 1); };

  /* ── theme tokens ── */
  const t = {
    pageBg: isDark ? "#0f0c1d" : "#f5f3ff",
    sidebarBg: isDark ? "#13102a" : "#ffffff",
    sidebarBorder: isDark ? "#1e1a3a" : "#e9e6f8",
    cardBg: isDark ? "#1a1635" : "#ffffff",
    cardBorder: isDark ? "#2a2560" : "#ede9fe",
    cardShadow: isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(139,92,246,0.08)",
    progressTrack: isDark ? "#1e1a3a" : "#ede9fe",
    text: isDark ? "#f1f5f9" : "#1a1035",
    textMuted: isDark ? "#94a3b8" : "#6b7280",
    textFaint: isDark ? "#64748b" : "#9ca3af",
    stepTagBg: isDark ? "#1e1a3a" : "#fffbeb",
    stepTagBorder: "#F59E0B",
    stepTagColor: "#F59E0B",
    issueCardBg: isDark ? "#13102a" : "#fafafa",
    issueCardBdr: isDark ? "#2a2560" : "#e5e7eb",
    intensityOff: isDark ? "#1e1a3a" : "#f3f4f6",
    intensityTrack: isDark ? "#1e1a3a" : "#e5e7eb",
    discoCardBg: isDark ? "#13102a" : "#fafafa",
    discoCardBdr: isDark ? "#2a2560" : "#e5e7eb",
    quoteText: isDark ? "#e2e8f0" : "#374151",
    connectorColor: isDark ? "#1e1a3a" : "#ede9fe",
    circleOff: isDark ? "#1e1a3a" : "#ede9fe",
    circleDone: "#7C3AED",
    circleActive: "#F59E0B",
    astroBg: isDark ? "#13102a" : "#fafafa",
    astroBorder: isDark ? "#2a2560" : "#e9e6f8",
    tagBg: isDark ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
    tagColor: isDark ? "#a78bfa" : "#7C3AED",
  };

  /* sub-label in sidebar */
  const stepSubtitle = (step) => {
    const done = currentStep > step.id;
    if (done && step.id === 1 && selections.issue) return selections.issue;
    if (done && step.id === 2 && selections.intensity !== null) return `Rated ${selections.intensity} of 5`;
    if (done && step.id === 3 && selections.discovery) return selections.discovery;
    return step.subtitle;
  };

  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  /* ─── render ─── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", background: t.pageBg, color: t.text }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: "240px", flexShrink: 0,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.sidebarBorder}`,
        padding: "40px 24px",
        display: "flex", flexDirection: "column", gap: "0",
      }}>
        <p style={{ margin: "0 0 28px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textFaint }}>
          Your Journey Begins Here
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.id} style={{ display: "flex", gap: "14px" }}>
                {/* Circle + connector */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700,
                    background: isActive ? t.circleActive : isDone ? t.circleDone : t.circleOff,
                    border: !isActive && !isDone ? `2px solid ${isDark ? "#4338CA" : "#a78bfa"}` : "none",
                    color: isActive ? "#1a1035" : isDone ? "#fff" : (isDark ? "#6b7280" : "#9ca3af"),
                    transition: "all 0.3s ease",
                  }}>
                    {isDone ? <Check size={13} strokeWidth={3} /> : step.id}
                  </div>
                  {!isLast && (
                    <div style={{ width: "2px", flex: 1, minHeight: "24px", background: isDone ? t.circleDone : t.connectorColor, margin: "4px 0", transition: "background 0.4s ease" }} />
                  )}
                </div>

                {/* Text */}
                <div style={{ paddingTop: "4px", paddingBottom: isLast ? 0 : "24px" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? t.circleActive : isDone ? (isDark ? "#a78bfa" : "#7C3AED") : t.textMuted, lineHeight: 1.3 }}>
                    {step.title}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: "11px", color: t.textFaint }}>
                    {stepSubtitle(step)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div style={{ marginTop: "auto", borderLeft: "3px solid #F59E0B", paddingLeft: "12px" }}>
          <p style={{ margin: 0, fontSize: "12px", fontStyle: "italic", color: t.quoteText, lineHeight: 1.7 }}>
            &ldquo;The stars illuminate the path — you shine.&rdquo;
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#F59E0B" }}>✦</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "740px" }}>

          {/* Card */}
          <div style={{
            background: t.cardBg,
            border: `1.5px solid ${t.cardBorder}`,
            borderRadius: "20px",
            boxShadow: t.cardShadow,
            padding: "36px 40px 32px",
          }}>

            {/* ── TOP PROGRESS BAR ── */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{
                  display: "inline-block", padding: "5px 16px", borderRadius: "20px",
                  background: t.stepTagBg, border: `1px solid ${t.stepTagBorder}`,
                  fontSize: "12px", color: t.stepTagColor, fontWeight: 700,
                }}>
                  {STEPS[currentStep - 1]?.tag}
                </span>
                <span style={{ fontSize: "13px", color: t.textMuted, fontWeight: 500 }}>
                  Step {currentStep} of {STEPS.length}
                </span>
              </div>
              <div style={{ height: "6px", borderRadius: "3px", background: t.progressTrack, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #F59E0B, #D97706)",
                  borderRadius: "3px",
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </div>
            </div>

            {/* Step meta */}
            <p style={{ margin: "0 0 2px", fontSize: "13px", color: t.textMuted }}>Step {currentStep} of {STEPS.length}</p>

            {/* ── STEP 1: ISSUE SELECTION ── */}
            {currentStep === 1 && (
              <>
                <h1 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "4px 0 6px", color: t.text }}>
                  What&apos;s weighing on{" "}
                  <em style={{ fontStyle: "italic", color: "#F59E0B" }}>your soul?</em>
                </h1>
                <p style={{ margin: "0 0 24px", fontSize: "14px", color: t.textMuted, lineHeight: 1.5 }}>
                  Select the area of life where you seek divine guidance.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "28px" }}>
                  {LIFE_ISSUES.map((issue) => {
                    const sel = selections.issue === issue;
                    return (
                      <button
                        key={issue}
                        onClick={() => handleIssueSelect(issue)}
                        style={{
                          position: "relative", padding: "18px 12px 14px", borderRadius: "10px",
                          cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                          border: sel ? "2px solid #F59E0B" : `2px solid ${t.issueCardBdr}`,
                          background: sel ? (isDark ? "rgba(245,158,11,0.13)" : "#fffbeb") : t.issueCardBg,
                          minHeight: "72px", display: "flex", alignItems: "flex-end",
                        }}
                      >
                        {sel && (
                          <span style={{
                            position: "absolute", top: "9px", right: "9px",
                            width: "18px", height: "18px", borderRadius: "50%", background: "#F59E0B",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1a1035" }} />
                          </span>
                        )}
                        <span style={{ fontSize: "13px", fontWeight: 500, color: sel ? "#F59E0B" : t.textMuted, lineHeight: 1.3 }}>
                          {issue}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── STEP 2: INTENSITY RATING ── */}
            {currentStep === 2 && (
              <>
                <h1 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "4px 0 6px", color: t.text }}>
                  How deeply does this{" "}
                  <em style={{ fontStyle: "italic", color: "#F59E0B" }}>affect you?</em>
                </h1>
                <p style={{ margin: "0 0 20px", fontSize: "14px", color: t.textMuted }}>
                  Rate from 0 (no impact) to 5 (severe). This guides our recommendation.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" }}>
                  <span style={{ fontSize: "68px", fontWeight: 800, color: "#F59E0B", lineHeight: 1 }}>
                    {selections.intensity}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: t.text }}>
                      {INTENSITY_LABELS[selections.intensity].label}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "13px", color: t.textMuted }}>
                      {INTENSITY_LABELS[selections.intensity].desc}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
                  {[0, 1, 2, 3, 4, 5].map((n) => {
                    const active = selections.intensity === n;
                    return (
                      <button
                        key={n}
                        onClick={() => handleIntensityChange(n)}
                        style={{
                          width: "62px", height: "62px", borderRadius: "50%", border: "none",
                          cursor: "pointer", display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", transition: "all 0.2s ease",
                          background: active ? "#F59E0B" : t.intensityOff,
                          color: active ? "#1a1035" : t.text,
                          boxShadow: active ? "0 0 16px rgba(245,158,11,0.4)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "20px", fontWeight: 700 }}>{n}</span>
                        <span style={{ fontSize: "8px", marginTop: "2px", color: active ? "#1a1035" : t.textFaint }}>
                          {INTENSITY_LABELS[n].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  {INTENSITY_BARS.map((bar) => {
                    const pct = bar.values[selections.intensity];
                    return (
                      <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", color: t.textMuted, width: "150px", flexShrink: 0 }}>{bar.label}</span>
                        <div style={{ flex: 1, height: "7px", borderRadius: "4px", background: t.intensityTrack, overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`, height: "100%", background: bar.color,
                            borderRadius: "4px", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                          }} />
                        </div>
                        <span style={{ fontSize: "13px", color: t.textMuted, width: "38px", textAlign: "right" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── STEP 3: DISCOVERY ── */}
            {currentStep === 3 && (
              <>
                <h1 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "4px 0 24px", color: t.text }}>
                  How did you discover{" "}
                  <em style={{ fontStyle: "italic", color: "#F59E0B" }}>Jyotish Seva?</em>
                </h1>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px", maxWidth: "620px" }}>
                  {DISCOVERY_OPTIONS.map((opt) => {
                    const sel = selections.discovery === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleDiscoverySelect(opt)}
                        style={{
                          padding: "16px 18px", borderRadius: "10px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "12px",
                          transition: "all 0.2s ease",
                          border: sel ? `2px solid #F59E0B` : `2px solid ${t.discoCardBdr}`,
                          background: sel ? (isDark ? "rgba(245,158,11,0.1)" : "#fffbeb") : t.discoCardBg,
                        }}
                      >
                        <span style={{
                          width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: sel ? "#F59E0B" : "transparent",
                          border: sel ? "none" : `2px solid ${isDark ? "#4338CA" : "#a78bfa"}`,
                        }}>
                          {sel && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1a1035" }} />}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: sel ? "#F59E0B" : t.textMuted }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── STEP 4: YOUR MATCH ── */}
            {currentStep === 4 && (
              <>
                <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, lineHeight: 1.2, margin: "4px 0 6px", color: t.text, display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={26} color="#F59E0B" />
                  <span>Your{" "}<em style={{ fontStyle: "italic", color: "#F59E0B" }}>cosmic matches</em></span>
                </h1>
                <p style={{ margin: "0 0 24px", fontSize: "14px", color: t.textMuted, lineHeight: 1.5 }}>
                  Based on your journey, our AI has handpicked these astrologers for you.
                </p>

                {recommendedAstros.length === 0 ? (
                  <div style={{
                    padding: "24px", borderRadius: "12px", textAlign: "center",
                    background: t.astroBg, border: `1px solid ${t.astroBorder}`, marginBottom: "28px",
                  }}>
                    <p style={{ margin: 0, fontSize: "15px", color: t.textMuted }}>
                      No specific recommendations at this moment. Explore all astrologers on the dashboard.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
                    {recommendedAstros.map((astro) => {
                      const totalOrders =
                        (astro.order?.totalChat || 0) +
                        (astro.order?.totalCall || 0) +
                        (astro.order?.totalVideo || 0);
                      const starCount = Math.round(astro.rating || 0);

                      return (
                        <div
                          key={astro.astroId}
                          style={{
                            display: "flex", gap: "16px", alignItems: "flex-start",
                            padding: "18px 20px", borderRadius: "14px",
                            background: t.astroBg, border: `1.5px solid ${t.astroBorder}`,
                          }}
                        >
                          {/* Photo + online dot */}
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <img
                              src={astro.photo}
                              alt={astro.name}
                              style={{
                                width: "70px", height: "70px", borderRadius: "50%",
                                objectFit: "cover", border: "2px solid #F59E0B",
                              }}
                            />
                            <span style={{
                              position: "absolute", bottom: "2px", right: "2px",
                              width: "12px", height: "12px", borderRadius: "50%",
                              background: astro.status === "online" ? "#22c55e" : "#94a3b8",
                              border: `2px solid ${t.astroBg}`,
                            }} />
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Name + status badge */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: t.text }}>
                                {astro.name.trim()}
                              </p>
                              <span style={{
                                fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                                background: astro.status === "online" ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.15)",
                                color: astro.status === "online" ? "#22c55e" : "#94a3b8",
                              }}>
                                {astro.status}
                              </span>
                            </div>

                            {/* Rating + sessions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", margin: "3px 0 6px" }}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  fill={i < starCount ? "#F59E0B" : "none"}
                                  color={i < starCount ? "#F59E0B" : t.textFaint}
                                />
                              ))}
                              <span style={{ color: t.textFaint, fontSize: "11px", marginLeft: "4px" }}>{totalOrders} sessions</span>
                            </div>

                            {/* Description (2-line clamp) */}
                            <p style={{
                              margin: "0 0 8px", fontSize: "12px", color: t.textMuted, lineHeight: 1.5,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                            }}>
                              {astro.description}
                            </p>

                            {/* Expertise tags */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                              {astro.expertise.map((e) => (
                                <span key={e} style={{
                                  fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px",
                                  background: t.tagBg, color: t.tagColor, textTransform: "capitalize",
                                }}>
                                  {e}
                                </span>
                              ))}
                            </div>

                            {/* Pricing + experience */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: t.textMuted }}>
                                <MessageCircle size={12} /> ₹{astro.chatNormalPrice}/min
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: t.textMuted }}>
                                <Phone size={12} /> ₹{astro.ivrNormalPrice}/min
                              </span>
                              <span style={{ fontSize: "12px", color: t.textFaint }}>
                                {astro.experience} yrs exp
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Go to Dashboard */}
                <button
                  onClick={() => router.push("/")}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "10px",
                    background: "#F59E0B", color: "#1a1035",
                    fontSize: "15px", fontWeight: 700, border: "none",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Error banner */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 16px", borderRadius: "8px", marginBottom: "16px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              }}>
                <AlertCircle size={16} color="#f87171" />
                <span style={{ fontSize: "13px", color: "#f87171" }}>{error}</span>
              </div>
            )}

            {/* Actions (steps 1–3 only) */}
            {currentStep < 4 && (
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "4px" }}>
                <button
                  onClick={handleContinue}
                  disabled={!canContinue() || isLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "10px",
                    background: "#F59E0B", color: "#1a1035",
                    fontSize: "15px", fontWeight: 700, border: "none",
                    cursor: canContinue() && !isLoading ? "pointer" : "not-allowed",
                    opacity: canContinue() && !isLoading ? 1 : 0.5,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={18} className="animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <><span>Continue</span><ChevronRight size={18} /></>
                  )}
                </button>

                {currentStep < 3 && (
                  <button
                    onClick={handleSkip}
                    style={{ background: "none", border: "none", color: t.textMuted, fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Skip this step
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button:hover { filter: brightness(1.06); }
      `}</style>
    </div>
  );
}
