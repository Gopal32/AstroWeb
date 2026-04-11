"use client";

import { useEffect, useRef, useState } from "react";
import {
  Clock3,
  MapPin,
  Sparkles,
  TimerReset,
  UserRound,
  X,
} from "lucide-react";
import { useSession } from "@/context/SessionProvider";

const DEFAULT_QUEUE_TIME = "00:00:00";

const detailRows = (formData) => [
  { label: "Name", value: formData?.fullName || "N/A", icon: UserRound },
  { label: "Gender", value: formData?.gender || "N/A", icon: Sparkles },
  { label: "Birth Date", value: formData?.dateOfBirth || "N/A", icon: Clock3 },
  { label: "Birth Time", value: formData?.timeOfBirth || "N/A", icon: TimerReset },
  { label: "Birth Place", value: formData?.placeOfBirth || "N/A", icon: MapPin },
];

const WaitingQueueModal = ({ isOpen, serviceData, formData, onCancel }) => {
  const { isSocketConnected } = useSession();
  const [queueTime, setQueueTime] = useState(DEFAULT_QUEUE_TIME);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!serviceData?.astro?.astroId) return undefined;

    const startCountdown = (timeStr) => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const [h = 0, m = 0, s = 0] = String(timeStr).split(":").map(Number);
      let totalSeconds = h * 3600 + m * 60 + s;

      setQueueTime(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
          s
        ).padStart(2, "0")}`
      );

      intervalRef.current = setInterval(() => {
        totalSeconds -= 1;

        if (totalSeconds <= 0) {
          clearInterval(intervalRef.current);
          setQueueTime(DEFAULT_QUEUE_TIME);
          return;
        }

        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
          2,
          "0"
        );
        const secs = String(totalSeconds % 60).padStart(2, "0");

        setQueueTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    };

    const fetchQueueTime = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/user/queueTime/${serviceData.astro.astroId}`
        );
        const data = await res.json();

        if (data?.statusCode === 200 && data?.data) {
          startCountdown(data.data);
        } else {
          setQueueTime(DEFAULT_QUEUE_TIME);
        }
      } catch (err) {
        console.error("Queue error:", err);
        setQueueTime(DEFAULT_QUEUE_TIME);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueTime();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [serviceData]);

  useEffect(() => {
    if (isSocketConnected && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isSocketConnected]);

  if (!isOpen || !serviceData || isSocketConnected) return null;

  const astroName = serviceData?.astro?.name || "Astro Guide";
  const astroImage = serviceData?.astro?.photo;
  const serviceType = serviceData?.serviceType || "chat";
  const sessionDuration = serviceData?.timeSlot || serviceData?.slotTime || "N/A";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md sm:py-10">
      <div className="flex min-h-full items-start justify-center">
        <div className="relative mt-4 w-full max-w-xl overflow-hidden rounded-[32px] border border-border/60 bg-[#FAF6ED] text-foreground shadow-[0_30px_80px_rgba(15,23,42,0.28)] dark:bg-card sm:mt-6">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/10" />

          <div className="relative p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 overflow-hidden rounded-3xl border border-border bg-background shadow-lg sm:h-24 sm:w-24">
                    {astroImage ? (
                      <img
                        src={astroImage}
                        alt={astroName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                        {astroName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#FAF6ED] bg-emerald-500 dark:border-card">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    {serviceType} session
                  </p>
                  <h2 className="mt-1 truncate text-2xl font-bold text-foreground">
                    {astroName}
                  </h2>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Waiting in queue...
                  </div>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close waiting modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-[28px] border border-border/70 bg-background/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em]">
                    Estimated Wait
                  </span>
                </div>

                <div className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {loading ? "..." : queueTime}
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  We&apos;re holding your place in the queue. This timer updates
                  automatically while we connect you to the astrologer.
                </p>
              </div>

              <div className="rounded-[28px] border border-border/70 bg-card p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  Session Snapshot
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-semibold text-foreground">
                      {sessionDuration} mins
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Ready to connect
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-border/70 bg-background/80 p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  Submitted Details
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {detailRows(formData).map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border/60 bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <p className="mt-2 break-words text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onCancel}
                className="w-full rounded-2xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingQueueModal;
