"use client";

import { useState, useEffect, Suspense, use, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Clock, CalendarIcon, Loader2, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/context/AuthProvider";
import { useSession } from "@/context/SessionProvider";
import { se } from "date-fns/locale";

function UserProfileContent({ searchParams }) {
    const router = useRouter();
    const astroId = searchParams?.astroId || null;
    const sessionType = searchParams?.sessionType || "regular";
    const serviceType = searchParams?.serviceType || "chat";
    const { apiCall } = useApi();
    const [astro, setAstro] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const userId = user?.userId || null;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [date, setDate] = useState();
    const [time, setTime] = useState("");

    const [suggestions, setSuggestions] = useState([]);
    const [placesLoading, setPlacesLoading] = useState(false);
    const [astroLoading, setAstroLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        placeOfBirth: "",
        gender: "",
        dateOfBirth: "",
        timeOfBirth: "",
    });

    const [durationList, setDurationList] = useState([]);
    const anyPlanTrue = durationList.some((dur) => dur.isActive);
    const [slotsLoading, setSlotsLoading] = useState(true);
    const [queueTime, setQueueTime] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [step, setStep] = useState(1);
    const astrologerRate = useMemo(() => {
        return astro?.chatNormalPrice ?? astro?.callNormalPrice ?? 10;
    }, [astro]);
    const { setUserServiceData, setShowQueueModal, setUserData } = useSession();

    const durations = useMemo(() => {
        return [
            { label: "INSTANT", mins: 5, price: astrologerRate * 5 },
            { label: "BRIEF", mins: 10, price: astrologerRate * 10 },
            { label: "DEEP DIVE", mins: 15, price: astrologerRate * 15 },
            { label: "EXPANSION", mins: 20, price: astrologerRate * 20 },
            { label: "INSIGHT", mins: 25, price: astrologerRate * 25 },
            { label: "INFINITE", mins: 30, price: astrologerRate * 30 }
        ];
    }, [astrologerRate]);

    useEffect(() => {
        async function fetchAstro() {
            if (!astroId) return;
            try {
                setAstroLoading(true);
                const res = await apiCall(`/api/astrologer/astro/${astroId}`,
                    "GET");
                const astroData = res?.data?.data || res?.data || res;
                if (astroData && !astroData?.statusCode) {
                    setAstro(astroData);
                }

                setSlotsLoading(true);

                const timeAccessRes = await apiCall('/api/user/available-slots', 'POST', {
                    astroId,
                    sessionType,
                    serviceType,
                    userId
                });

                const slots = timeAccessRes?.data || [];

                const updatedDurations = durations.map((duration) => {
                    const match = slots.find(
                        (slot) => slot.timeSlot === duration.mins
                    );

                    return {
                        ...duration,
                        isActive: match?.isActive || false,
                    };
                });

                setDurationList(updatedDurations);
                setSlotsLoading(false);

            } catch (err) {
                console.error("Astro fetch error:", err);
            } finally {
                setAstroLoading(false);
            }
        }
        fetchAstro();
    }, [astroId, userId, durations]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (formData.placeOfBirth.length >= 3) {
                fetchPlaces(formData.placeOfBirth).then(setSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [formData.placeOfBirth]);


    const fetchPlaces = async (input) => {
        try {
            setPlacesLoading(true);

            const res = await fetch(`/api/location?input=${input}`);
            const data = await res.json();

            return data?.data || [];
        } catch (err) {
            console.error(err);
            return [];
        } finally {
            setPlacesLoading(false);
        }
    };


    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        if (selectedDate) {
            const formatted = format(selectedDate, "dd/MM/yyyy");
            handleInputChange("dateOfBirth", formatted);
        }
    };

    const handleTimeChange = (e) => {
        const value = e.target.value; // "HH:mm"
        setTime(value);
        handleInputChange("timeOfBirth", value);
    };

    const hasEmptyField = () =>
        Object.values(formData).some((v) => v === "" || v == null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validation
        if (hasEmptyField()) {
            setError("Please fill all the birth coordinate fields.");
            return;
        }

        if (date && date > new Date()) {
            setError("Date of Birth cannot be in the future.");
            return;
        }

        setIsLoading(true);

        // 🔥 CHECK ASTRO STATUS
        if (astro?.status !== "online") {
            setError("Astrologer is currently offline. Please try again later.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                sessionType,
                serviceType,
                astroId,
                message: formData,
                category: "none",
                timeSlot: selectedDuration,
            };

            //  1. CALL SERVICE API
            const res = await apiCall("/api/user/user-details", "POST", payload);
            const result = res;

            if (result?.statusCode === 200) {

                //  2. STORE SERVICE DATA
                const service = result.data;

                //passing the data into context to be used in queue modal and other places if needed
                setUserServiceData(service);
                setUserData(payload.message);
                setShowQueueModal(true);
                if (result?.data?.serviceType === "chat") {
                    console.log("Chat service selected", result?.data?.roomId);
                    router.push(`/user-chat-service/${result?.data?.roomId}`);
                } else {
                    router.push(`/user-call-service/${result?.data?.roomId}`);
                }

            } else {
                setError("Something went wrong");
            }

        } catch (err) {
            setError(err?.message || "Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!queueTime) return;

        const interval = setInterval(() => {
            setQueueTime((prev) => {
                if (!prev) return prev;

                const [h, m, s] = prev.split(":").map(Number);

                let total = h * 3600 + m * 60 + s - 1;

                if (total <= 0) {
                    clearInterval(interval);
                    return "00:00:00";
                }

                const hh = String(Math.floor(total / 3600)).padStart(2, "0");
                const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
                const ss = String(total % 60).padStart(2, "0");

                return `${hh}:${mm}:${ss}`;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [queueTime]);

    // Derive Dynamic Data
    const astrologerName = astro?.name || "Dr. Elena Vora";
    const astrologerBio = astro?.expertise?.[0] || "VEDIC ASTROLOGY EXPERT";
    const astrologerImage = astro?.photo || "/assets/images/astrologers/1.jpg";
    const currentDurationConfig = durations.find(d => d.mins === selectedDuration) || null;
    const consultationsTotal = astro?.order?.totalChat || astro?.order?.totalCall || 0;
    const formattedConsultations = consultationsTotal > 0 ? `${consultationsTotal}+` : "1.4k+";
    const consultationPrice = currentDurationConfig?.price || 0;

    return (
        <div className="min-h-screen bg-[#FAF6ED] dark:bg-background text-foreground transition-colors duration-300 font-sans pb-16 selection:bg-primary/30 font-medium">

            {/* Header Margin */}
            <div className="h-10 md:h-16"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8">

                {/* TOP STEPPER */}
                <div className="mb-12 flex justify-center w-full">
                    <div className="flex items-center w-full max-w-3xl space-x-4 px-4 text-xs font-bold tracking-widest uppercase">
                        {/* Step 1 */}
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex flex-col items-center flex-1 focus:outline-none"
                        >
                            <span className={cn("mb-2 whitespace-nowrap transition-colors", step >= 1 ? "text-primary bg-transparent" : "text-muted-foreground")}>Duration</span>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm border-2 transition-all shadow-sm",
                                step >= 1 ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "bg-muted text-muted-foreground border-transparent"
                            )}>
                                1
                            </div>
                        </button>
                        {/* Line */}
                        <div className={cn("h-px flex-[2] transition-colors duration-500", step >= 2 ? "bg-primary/80" : "bg-primary/20")} />

                        {/* Step 2 */}
                        <button
                            type="button"
                            disabled={!selectedDuration}
                            onClick={() => setStep(2)}
                            className="flex flex-col items-center flex-1 z-10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className={cn("mb-2 whitespace-nowrap transition-colors", step >= 2 ? "text-primary" : "text-muted-foreground")}>Birth Details</span>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm border-2 transition-all",
                                step >= 2 ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "bg-muted text-muted-foreground border-transparent"
                            )}>
                                2
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

                    {/* LEFT COLUMN - ASTROLOGER CARD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-2xl relative overflow-hidden flex flex-col items-center text-center group">
                            {/* Top Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-0"></div>

                            {astroLoading ? (
                                <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : (
                                <>
                                    <div className="absolute top-4 right-4">
                                        {astro?.status === "online" && (
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center" title="Online">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                        )}
                                        {astro?.status === "busy" && (
                                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center" title="Busy">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            </div>
                                        )}
                                        {astro?.status === "offline" && (
                                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center" title="Offline">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden mb-5 border border-border shadow-lg relative z-10 p-1 bg-gradient-to-br from-primary/5 to-transparent">
                                        <Image src={astrologerImage} alt={astrologerName} width={112} height={112} className="rounded-xl object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground font-serif mb-1.5 z-10">{astrologerName}</h2>
                                    <p className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-muted-foreground mb-10 z-10 px-4">{astrologerBio}</p>

                                    <div className="w-full space-y-5 text-sm z-10">
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">Rate</span>
                                            <span className="text-primary font-bold">₹{astrologerRate.toFixed(2)} / min</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">Selected Time</span>
                                            <span className="text-foreground font-medium">
                                                {selectedDuration ? `${selectedDuration} Minutes` : "Not selected"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 mt-2">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total Consultations</span>
                                            <span className="text-3xl font-extrabold text-foreground">{formattedConsultations}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SELECTION & FORM */}
                    <div className="lg:col-span-8">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                                {step === 1 ? "Align with your destiny." : "Complete your details."}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {step === 1
                                    ? "Choose the length of your celestial consultation to proceed."
                                    : "Provide your birth coordinates for an accurate reading."}
                            </p>
                        </div>

                        {/* STEP 1: Session Duration */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-base font-bold text-foreground flex items-center mb-5">
                                    <Clock className="w-5 h-5 mr-3 text-muted-foreground" /> Choose Session Duration
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                    {/* 🔹 Loading Skeleton */}
                                    {slotsLoading &&
                                        durations.map((dur) => (
                                            <div
                                                key={dur.mins}
                                                className="p-5 rounded-2xl border bg-card/50 animate-pulse space-y-3"
                                            >
                                                <div className="h-3 w-16 bg-muted rounded" />
                                                <div className="h-6 w-20 bg-muted rounded" />
                                                <div className="h-3 w-12 bg-muted rounded" />
                                            </div>
                                        ))}

                                    {/* 🔹 Actual Data */}
                                    {!slotsLoading &&
                                        durationList.map((dur) => (
                                            <button
                                                key={dur.mins}
                                                type="button"
                                                disabled={!dur.isActive}
                                                onClick={() => {
                                                    if (dur.isActive) {
                                                        setSelectedDuration(dur.mins);
                                                        // Auto move to step 2 after a short delay for smooth UX
                                                        setTimeout(() => {
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                            setStep(2);
                                                        }, 400);
                                                    }
                                                }}
                                                className={cn(
                                                    "flex flex-col flex-1 items-start p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden",
                                                    !dur.isActive && "opacity-40 cursor-not-allowed",
                                                    selectedDuration === dur.mins && dur.isActive
                                                        ? "bg-card border-primary/80 shadow-[0_0_15px_rgba(250,204,21,0.15)] ring-1 ring-primary/50"
                                                        : "bg-card/60 border-border hover:bg-card"
                                                )}
                                            >
                                                {/* Selected Icon */}
                                                {selectedDuration === dur.mins && dur.isActive && (
                                                    <Star className="absolute top-4 right-4 w-4 h-4 fill-primary text-primary animate-in zoom-in duration-300" />
                                                )}

                                                <span
                                                    className={cn(
                                                        "text-[9px] md:text-[10px] tracking-widest uppercase font-bold mb-1.5",
                                                        selectedDuration === dur.mins ? "text-primary/80" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {dur.label}
                                                </span>

                                                <div className="text-xl md:text-2xl font-bold text-foreground mb-1.5">
                                                    {dur.mins} mins
                                                </div>

                                                <div className="text-xs font-semibold text-muted-foreground">
                                                    ₹{dur.price.toFixed(2)}
                                                </div>

                                                {!dur.isActive && (
                                                    <span className="text-[10px] text-red-400 mt-1">
                                                        Not Available
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 gap-4 border-t border-border mt-8">

                                    {/*  BACK BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted transition-colors flex items-center justify-center shrink-0"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Go Back
                                    </button>

                                    {/* CONDITIONAL BUTTON */}
                                    {anyPlanTrue ? (
                                        <button
                                            type="button"
                                            disabled={!selectedDuration || slotsLoading}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                setStep(2);
                                            }}
                                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition-all hover:shadow-[0_4px_25px_rgba(250,204,21,0.4)] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none shrink-0"
                                        >
                                            Continue to Details
                                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push("/recharge")}
                                            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold px-8 py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center shrink-0"
                                        >
                                            Recharge & Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Cosmic Birth Coordinates Form */}
                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="p-4 bg-muted/30 border border-border rounded-xl mb-6 flex justify-between items-center group cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStep(1)}>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground">Selected Duration</p>
                                            <p className="font-semibold text-foreground">{selectedDuration} Minutes Reading</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-primary group-hover:underline flex items-center">
                                        Change <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-foreground flex items-center mb-5">
                                    <Star className="w-5 h-5 mr-3 text-muted-foreground" /> Cosmic Birth Coordinates
                                </h3>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {success}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">Full Name</label>
                                        <input
                                            className="w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow disabled:opacity-50"
                                            placeholder="Rahul Prajapati"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 relative flex flex-col">
                                            <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">Date of Birth</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "w-full bg-background border border-border rounded-xl px-5 py-4 text-left transition-shadow flex items-center justify-between",
                                                            !date ? "text-muted-foreground" : "text-foreground"
                                                        )}
                                                    >
                                                        {date ? format(date, "MM/dd/yyyy") : "mm/dd/yyyy"}
                                                        <CalendarIcon className="h-5 w-5 text-muted-foreground/70" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 border border-border bg-card text-foreground shadow-2xl rounded-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={handleDateSelect}
                                                        initialFocus
                                                        captionLayout="dropdown-buttons"
                                                        fromYear={1950}
                                                        toYear={new Date().getFullYear()}
                                                        className="bg-card text-foreground rounded-2xl p-3"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">Time of Birth</label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    className="w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow appearance-none"
                                                    value={time}
                                                    onChange={handleTimeChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">
                                                Place of Birth
                                            </label>

                                            <div className="relative">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />

                                                <input
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                                                    placeholder="Search City, Country..."
                                                    value={formData.placeOfBirth}
                                                    onChange={(e) =>
                                                        handleInputChange("placeOfBirth", e.target.value)
                                                    }
                                                    required
                                                />

                                                {/* 🔽 Suggestions Dropdown */}
                                                {suggestions.length > 0 && (
                                                    <div className="absolute z-50 bg-card border border-border rounded-xl mt-2 w-full shadow-lg max-h-60 overflow-y-auto">

                                                        {placesLoading && (
                                                            <div className="p-3 text-sm text-muted-foreground">
                                                                Loading...
                                                            </div>
                                                        )}

                                                        {!placesLoading &&
                                                            suggestions.map((item) => (
                                                                <div
                                                                    key={item.place_id}
                                                                    onClick={() => {
                                                                        handleInputChange("placeOfBirth", item.description);
                                                                        setSuggestions([]);
                                                                    }}
                                                                    className="px-4 py-3 hover:bg-muted cursor-pointer text-sm transition-colors"
                                                                >
                                                                    {item.description}
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 flex flex-col">
                                            <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">Gender Identification</label>
                                            <div className="relative flex-grow">
                                                <select
                                                    className="w-full h-full bg-background border border-border rounded-xl px-5 py-4 text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow disabled:opacity-50"
                                                    value={formData.gender}
                                                    onChange={(e) => handleInputChange("gender", e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled hidden className="text-muted-foreground">Select gender</option>
                                                    <option value="male" className="bg-background text-foreground py-2 border-none">Male</option>
                                                    <option value="female" className="bg-background text-foreground py-2 border-none">Female</option>
                                                    <option value="Prefer-Not-To-Say" className="bg-background text-foreground py-2 border-none">Prefer Not to Say</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-12 pt-8 gap-4 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                            setStep(1);
                                        }}
                                        className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted transition-colors flex items-center justify-center shrink-0"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Duration
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !selectedDuration}
                                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition-all hover:shadow-[0_4px_25px_rgba(250,204,21,0.4)] flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none shrink-0"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                        ) : (
                                            <>Proceed to Payment <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function UserProfilePage({ searchParams }) {
    const params = use(searchParams);
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF6ED] dark:bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <UserProfileContent searchParams={params} />
        </Suspense>
    );
}
