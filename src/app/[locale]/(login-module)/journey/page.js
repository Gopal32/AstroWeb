"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

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
  3: { label: "Moderate", desc: "Noticeably affecting daily life\nand emotional well-being." },
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
  "Other / Divine Calling ✨",
];

const STEPS = [
  { id: 1, title: "Life Issue", subtitle: "Select your concern" },
  { id: 2, title: "Intensity", subtitle: "Rate how deeply it affects you" },
  { id: 3, title: "Discovery", subtitle: "How did you find us?" },
  { id: 4, title: "Your Match", subtitle: "AI recommendation" },
];

/* ─────────────────────────────────────────────
   SIDEBAR STEP INDICATOR
───────────────────────────────────────────── */
function Sidebar({ currentStep, selections }) {
  return (
    <aside style={styles.sidebar}>
      <p style={styles.sidebarHeading}>Your journey begins here</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div
                style={{
                  ...styles.stepCircle,
                  background: isActive ? "#F59E0B" : isDone ? "#5B21B6" : "#1e1b4b",
                  border: isActive ? "none" : isDone ? "none" : "2px solid #4338CA",
                  color: isActive ? "#1a1035" : "#fff",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "13px",
                }}
              >
                {isDone ? <Check size={13} strokeWidth={3} /> : step.id}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#F59E0B" : isDone ? "#a78bfa" : "#94a3b8",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  {isDone && step.id === 1 && selections.issue
                    ? selections.issue
                    : isDone && step.id === 2 && selections.intensity !== null
                    ? `Rated ${selections.intensity} of 5`
                    : step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote */}
      <div style={styles.quoteBox}>
        <p style={{ margin: 0, fontSize: "12px", fontStyle: "italic", color: "#e2e8f0", lineHeight: 1.6 }}>
          &ldquo;The stars illuminate the path — you walk it.&rdquo;
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#94a3b8" }}>— Vedic Wisdom</p>
      </div>

      <p style={styles.screenLabel}>SCREEN {currentStep} — {
        currentStep === 1 ? "ISSUE SELECTION" : currentStep === 2 ? "INTENSITY RATING" : "DISCOVERY SOURCE"
      }</p>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — ISSUE SELECTION
───────────────────────────────────────────── */
function StepIssue({ selected, onSelect }) {
  return (
    <div style={styles.mainContent}>
      <div style={styles.stepTag}>Issue Selection</div>
      <p style={styles.stepMeta}>Step 1 of 4</p>
      <h1 style={styles.heading}>
        What&apos;s weighing on{" "}
        <em style={styles.headingItalic}>your soul?</em>
      </h1>
      <p style={styles.subtext}>
        Select the area of life where you seek divine guidance. You may select multiple.
      </p>

      <div style={styles.issueGrid}>
        {LIFE_ISSUES.map((issue) => {
          const isSel = selected.includes(issue);
          return (
            <button
              key={issue}
              onClick={() => onSelect(issue)}
              style={{
                ...styles.issueCard,
                border: isSel ? "2px solid #F59E0B" : "2px solid #2d2760",
                background: isSel ? "rgba(245,158,11,0.12)" : "#130f30",
              }}
            >
              {isSel && (
                <span style={styles.issueCheckBadge}>
                  <ChevronRight size={12} color="#F59E0B" />
                </span>
              )}
              <span style={{ fontSize: "14px", fontWeight: 500, color: isSel ? "#F59E0B" : "#c4b5fd" }}>
                {issue}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — INTENSITY RATING
───────────────────────────────────────────── */
function StepIntensity({ value, onChange }) {
  const info = INTENSITY_LABELS[value];
  return (
    <div style={styles.mainContent}>
      <div style={styles.stepTag}>Intensity Rating</div>
      <p style={styles.stepMeta}>Step 2 of 4</p>
      <h1 style={styles.heading}>
        How deeply does this{" "}
        <em style={styles.headingItalic}>affect you?</em>
      </h1>
      <p style={styles.subtext}>Rate from 0 (no impact) to 5 (severe). This guides our recommendation.</p>

      {/* Big number + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "24px 0 28px" }}>
        <span style={{ fontSize: "72px", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{value}</span>
        <div>
          <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>{info.label}</p>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8", whiteSpace: "pre-line" }}>{info.desc}</p>
        </div>
      </div>

      {/* Selector buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[0, 1, 2, 3, 4, 5].map((n) => {
          const isActive = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              style={{
                ...styles.intensityBtn,
                background: isActive ? "#F59E0B" : "#1e1b4b",
                color: isActive ? "#1a1035" : "#e2e8f0",
                boxShadow: isActive ? "0 0 16px rgba(245,158,11,0.4)" : "none",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: 700, display: "block" }}>{n}</span>
              <span style={{ fontSize: "9px", display: "block", marginTop: "2px", color: isActive ? "#1a1035" : "#64748b" }}>
                {INTENSITY_LABELS[n].label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Impact bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {INTENSITY_BARS.map((bar) => {
          const pct = bar.values[value];
          return (
            <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", width: "150px", flexShrink: 0 }}>{bar.label}</span>
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#1e1b4b", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: bar.color,
                    borderRadius: "4px",
                    transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
              <span style={{ fontSize: "13px", color: "#94a3b8", width: "36px", textAlign: "right" }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — DISCOVERY SOURCE
───────────────────────────────────────────── */
function StepDiscovery({ selected, onSelect }) {
  return (
    <div style={styles.mainContent}>
      <div style={styles.stepTag}>How You Found Us</div>
      <p style={styles.stepMeta}>Step 3 of 4</p>
      <h1 style={{ ...styles.heading, fontSize: "32px", lineHeight: 1.2, marginBottom: "28px" }}>
        How did you discover{" "}
        <em style={styles.headingItalic}>Jyotish Seva?</em>
      </h1>

      <div style={styles.discoveryGrid}>
        {DISCOVERY_OPTIONS.map((opt) => {
          const isSel = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                ...styles.discoveryCard,
                border: isSel ? "2px solid #F59E0B" : "2px solid #2d2760",
                background: isSel ? "rgba(245,158,11,0.1)" : "#130f30",
              }}
            >
              <span
                style={{
                  ...styles.radioCircle,
                  border: isSel ? "none" : "2px solid #4338CA",
                  background: isSel ? "#F59E0B" : "transparent",
                }}
              >
                {isSel && <span style={styles.radioDot} />}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: isSel ? "#F59E0B" : "#c4b5fd" }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function ProgressBar({ step }) {
  return (
    <div style={{ height: "3px", background: "#1e1b4b", borderRadius: "2px", marginBottom: "28px" }}>
      <div
        style={{
          height: "100%",
          width: `${((step - 1) / 3) * 100}%`,
          background: "linear-gradient(90deg, #F59E0B, #D97706)",
          borderRadius: "2px",
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function JourneyPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    issue: "",
    intensity: 3,
    discovery: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── handlers ── */
  const handleIssueSelect = (issue) => {
    setSelections((prev) => ({ ...prev, issue }));
  };

  const handleIntensityChange = (val) => {
    setSelections((prev) => ({ ...prev, intensity: val }));
  };

  const handleDiscoverySelect = (opt) => {
    setSelections((prev) => ({ ...prev, discovery: opt }));
  };

  const canContinue = useCallback(() => {
    if (currentStep === 1) return !!selections.issue;
    if (currentStep === 2) return true; // always has a default
    if (currentStep === 3) return !!selections.discovery;
    return false;
  }, [currentStep, selections]);

  /* ── API submit ── */
  const submitOnboarding = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const response = await fetch("/api/user/journey", 'POST', {
        ques1: selections.issue,
        ques2: selections.intensity,
        ques3: selections.discovery,
        token,
      }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Success → navigate to dashboard / your-match
      router.push("/user-dashboard");
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
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      await submitOnboarding();
    }
  };

  const handleSkip = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    }
  };

  /* ──────────────────────────────────────────
     RENDER
  ─────────────────────────────────────────── */
  // Theme-aware color tokens
  const t = {
    pageBg:        isDark ? "#0d0a1e"           : "#ffffff",
    sidebarBg:     isDark ? "#100d25"           : "#f8f6ff",
    sidebarBorder: isDark ? "#1e1b4b"           : "#e5e7eb",
    mainBg:        isDark ? "transparent"       : "transparent",
    cardBg:        isDark ? "#130f30"           : "#f3f4f6",
    cardBorder:    isDark ? "#2d2760"           : "#d1d5db",
    progressTrack: isDark ? "#1e1b4b"           : "#e5e7eb",
    stepCircleOff: isDark ? "#1e1b4b"           : "#e5e7eb",
    text:          isDark ? "#f1f5f9"           : "#0f172a",
    textMuted:     isDark ? "#94a3b8"           : "#64748b",
    textFaint:     isDark ? "#64748b"           : "#9ca3af",
    stepTagBg:     isDark ? "#1e1b4b"           : "#ede9fe",
    cardText:      isDark ? "#c4b5fd"           : "#4b5563",
    intensityBtnOff: isDark ? "#1e1b4b"         : "#e5e7eb",
    intensityBarTrack: isDark ? "#1e1b4b"       : "#e5e7eb",
    quoteText:     isDark ? "#e2e8f0"           : "#374151",
  };

  return (
    <div style={{ ...styles.page, background: t.pageBg, color: t.text }}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}` }}>
        <p style={{ ...styles.sidebarHeading, color: t.textFaint }}>Your journey begins here</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    ...styles.stepCircle,
                    background: isActive ? "#F59E0B" : isDone ? "#5B21B6" : t.stepCircleOff,
                    border: isActive ? "none" : isDone ? "none" : `2px solid ${isDark ? "#4338CA" : "#a78bfa"}`,
                    color: isActive ? "#1a1035" : isDark ? "#fff" : "#374151",
                    fontWeight: isActive ? 700 : 600,
                    fontSize: "13px",
                  }}
                >
                  {isDone ? <Check size={13} strokeWidth={3} /> : step.id}
                </div>
                <div style={{ paddingTop: "2px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#F59E0B" : isDone ? "#a78bfa" : t.textMuted,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: t.textFaint, marginTop: "2px" }}>
                    {isDone && step.id === 1 && selections.issue
                      ? selections.issue
                      : isDone && step.id === 2 && selections.intensity !== null
                      ? `Rated ${selections.intensity} of 5`
                      : step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div style={styles.quoteBox}>
          <p style={{ margin: 0, fontSize: "12px", fontStyle: "italic", color: t.quoteText, lineHeight: 1.6 }}>
            &ldquo;The stars illuminate the path — you walk it.&rdquo;
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: t.textMuted }}>— Vedic Wisdom</p>
        </div>

        <p style={styles.screenLabel}>
          SCREEN {currentStep} —{" "}
          {currentStep === 1 ? "ISSUE SELECTION" : currentStep === 2 ? "INTENSITY RATING" : "DISCOVERY SOURCE"}
        </p>
      </aside>

      {/* Main panel */}
      <main style={styles.main}>
        {/* Progress bar */}
        <div style={{ height: "3px", background: t.progressTrack, borderRadius: "2px", marginBottom: "28px" }}>
          <div
            style={{
              height: "100%",
              width: `${((currentStep - 1) / 3) * 100}%`,
              background: "linear-gradient(90deg, #F59E0B, #D97706)",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {currentStep === 1 && (
          <div style={styles.mainContent}>
            <div style={{ ...styles.stepTag, background: t.stepTagBg }}>Issue Selection</div>
            <p style={{ ...styles.stepMeta, color: t.textFaint }}>Step 1 of 4</p>
            <h1 style={{ ...styles.heading, color: t.text }}>
              What&apos;s weighing on <em style={styles.headingItalic}>your soul?</em>
            </h1>
            <p style={{ ...styles.subtext, color: t.textMuted }}>
              Select the area of life where you seek divine guidance. You may select multiple.
            </p>
            <div style={styles.issueGrid}>
              {LIFE_ISSUES.map((issue) => {
                const isSel = selections.issue === issue;
                return (
                  <button
                    key={issue}
                    onClick={() => handleIssueSelect(issue)}
                    style={{
                      ...styles.issueCard,
                      border: isSel ? "2px solid #F59E0B" : `2px solid ${t.cardBorder}`,
                      background: isSel ? "rgba(245,158,11,0.12)" : t.cardBg,
                    }}
                  >
                    {isSel && (
                      <span style={styles.issueCheckBadge}>
                        <ChevronRight size={12} color="#F59E0B" />
                      </span>
                    )}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: isSel ? "#F59E0B" : t.cardText }}>
                      {issue}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={styles.mainContent}>
            <div style={{ ...styles.stepTag, background: t.stepTagBg }}>Intensity Rating</div>
            <p style={{ ...styles.stepMeta, color: t.textFaint }}>Step 2 of 4</p>
            <h1 style={{ ...styles.heading, color: t.text }}>
              How deeply does this <em style={styles.headingItalic}>affect you?</em>
            </h1>
            <p style={{ ...styles.subtext, color: t.textMuted }}>Rate from 0 (no impact) to 5 (severe). This guides our recommendation.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "24px 0 28px" }}>
              <span style={{ fontSize: "72px", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{selections.intensity}</span>
              <div>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: t.text }}>{INTENSITY_LABELS[selections.intensity].label}</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: t.textMuted, whiteSpace: "pre-line" }}>{INTENSITY_LABELS[selections.intensity].desc}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
              {[0, 1, 2, 3, 4, 5].map((n) => {
                const isActive = selections.intensity === n;
                return (
                  <button
                    key={n}
                    onClick={() => handleIntensityChange(n)}
                    style={{
                      ...styles.intensityBtn,
                      background: isActive ? "#F59E0B" : t.intensityBtnOff,
                      color: isActive ? "#1a1035" : t.text,
                      boxShadow: isActive ? "0 0 16px rgba(245,158,11,0.4)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "20px", fontWeight: 700, display: "block" }}>{n}</span>
                    <span style={{ fontSize: "9px", display: "block", marginTop: "2px", color: isActive ? "#1a1035" : t.textFaint }}>
                      {INTENSITY_LABELS[n].label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {INTENSITY_BARS.map((bar) => {
                const pct = bar.values[selections.intensity];
                return (
                  <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: t.textMuted, width: "150px", flexShrink: 0 }}>{bar.label}</span>
                    <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: t.intensityBarTrack, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: bar.color,
                          borderRadius: "4px",
                          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "13px", color: t.textMuted, width: "36px", textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={styles.mainContent}>
            <div style={{ ...styles.stepTag, background: t.stepTagBg }}>How You Found Us</div>
            <p style={{ ...styles.stepMeta, color: t.textFaint }}>Step 3 of 4</p>
            <h1 style={{ ...styles.heading, fontSize: "32px", lineHeight: 1.2, marginBottom: "28px", color: t.text }}>
              How did you discover <em style={styles.headingItalic}>Jyotish Seva?</em>
            </h1>
            <div style={styles.discoveryGrid}>
              {DISCOVERY_OPTIONS.map((opt) => {
                const isSel = selections.discovery === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleDiscoverySelect(opt)}
                    style={{
                      ...styles.discoveryCard,
                      border: isSel ? "2px solid #F59E0B" : `2px solid ${t.cardBorder}`,
                      background: isSel ? "rgba(245,158,11,0.1)" : t.cardBg,
                    }}
                  >
                    <span
                      style={{
                        ...styles.radioCircle,
                        border: isSel ? "none" : `2px solid ${isDark ? "#4338CA" : "#a78bfa"}`,
                        background: isSel ? "#F59E0B" : "transparent",
                      }}
                    >
                      {isSel && <span style={styles.radioDot} />}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: isSel ? "#F59E0B" : t.cardText }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} color="#f87171" />
            <span style={{ fontSize: "13px", color: "#f87171" }}>{error}</span>
          </div>
        )}

        {/* Action buttons */}
        <div style={styles.actions}>
          <button
            onClick={handleContinue}
            disabled={!canContinue() || isLoading}
            style={{
              ...styles.continueBtn,
              opacity: canContinue() && !isLoading ? 1 : 0.5,
              cursor: canContinue() && !isLoading ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>

          {currentStep < 3 && (
            <button onClick={handleSkip} style={{ ...styles.skipBtn, color: t.textMuted }}>
              Skip this step
            </button>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "260px",
    flexShrink: 0,
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    position: "relative",
  },
  sidebarHeading: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  stepCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  quoteBox: {
    marginTop: "auto",
    borderLeft: "3px solid #F59E0B",
    paddingLeft: "12px",
    paddingTop: "4px",
    paddingBottom: "4px",
  },
  screenLabel: {
    margin: 0,
    fontSize: "10px",
    letterSpacing: "0.1em",
    color: "#475569",
    textTransform: "uppercase",
  },
  main: {
    flex: 1,
    padding: "32px 48px",
    overflowY: "auto",
  },
  mainContent: {
    maxWidth: "780px",
  },
  stepTag: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "20px",
    background: "#1e1b4b",
    border: "1px solid #F59E0B",
    fontSize: "12px",
    color: "#F59E0B",
    fontWeight: 600,
    marginBottom: "6px",
  },
  stepMeta: {
    margin: "0 0 4px",
    fontSize: "13px",
    color: "#64748b",
  },
  heading: {
    fontSize: "36px",
    fontWeight: 800,
    lineHeight: 1.2,
    margin: "0 0 8px",
    color: "#f1f5f9",
  },
  headingItalic: {
    fontStyle: "italic",
    color: "#F59E0B",
    fontWeight: 800,
  },
  subtext: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  issueGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "32px",
  },
  issueCard: {
    position: "relative",
    padding: "24px 14px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "flex-end",
    minHeight: "80px",
  },
  issueCheckBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#F59E0B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  intensityBtn: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  discoveryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "32px",
    maxWidth: "640px",
  },
  discoveryCard: {
    padding: "18px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    transition: "all 0.2s ease",
    border: "none",
  },
  radioCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#1a1035",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginTop: "8px",
  },
  continueBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 32px",
    borderRadius: "10px",
    background: "#F59E0B",
    color: "#1a1035",
    fontSize: "15px",
    fontWeight: 700,
    border: "none",
    transition: "all 0.2s ease",
  },
  skipBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "8px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    marginBottom: "16px",
    marginTop: "8px",
  },
};
