"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { Star, CheckCircle, MessageCircle, Phone, Video, FileText, Clock, ThumbsUp, GraduationCap, Languages, BookOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import useApi from "@/hooks/useApi";
import Link from "next/link";

function AstroProfileContent() {
    const { id } = useParams();
    const { apiCall } = useApi();

    const [astro, setAstro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAstro() {
            if (!id) {
                setLoading(false);
                setError("No Astrologer ID provided.");
                return;
            }
            try {
                setLoading(true);
                // Using the API route provided
                const res = await apiCall(
                    `/api/astrologer/astro/${id}`,
                    "GET"
                );

                // Handle varying response envelopes safely
                const astroData = res?.data?.data || res?.data || res;

                if (!astroData || astroData.statusCode === 400 || astroData.statusCode === 500) {
                    throw new Error(astroData.message || "Failed to load Astrologer data.");
                }

                setAstro(astroData);
            } catch (err) {
                console.error("Astro profile fetch error:", err);
                setError("Failed to load astrologer details.");
            } finally {
                setLoading(false);
            }
        }

        fetchAstro();
    }, [id, apiCall]);

    if (loading) {
        return (
            <div className="min-h-[80vh] bg-[#FAF6ED] dark:bg-background flex flex-col items-center justify-center pb-16">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Consulting the stars...</p>
            </div>
        );
    }

    if (error || !astro) {
        return (
            <div className="min-h-[80vh] bg-[#FAF6ED] dark:bg-background flex flex-col items-center justify-center pb-16 px-4 text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Cosmic Interruption</h2>
                <p className="text-muted-foreground">{error || "Astrologer not found in this realm."}</p>
            </div>
        );
    }

    // Derive dynamic properties with safe fallbacks
    const starCount = astro.rating ? astro.rating.toFixed(1) : "4.9";
    const consults = (astro.order?.totalChat || 0) + (astro.order?.totalCall || 0) + (astro.order?.totalVideo || 0);
    const formattedConsults = consults > 0 ? `${consults}+` : "1.4k+";

    const expertiseList = astro.expertise && astro.expertise.length > 0
        ? astro.expertise
        : ['Career & Vocation', 'Marriage & Love', 'Karmic Debt', 'Health & Wellness', 'Financial Prosperity', 'Spiritual Awakening'];

    // Languages fallback
    let languagesList = ["English", "Hindi"];
    if (Array.isArray(astro.language) && astro.language.length > 0) {
        languagesList = astro.language;
    } else if (typeof astro.language === "string") {
        languagesList = astro.language.split(",").map(s => s.trim());
    }

    return (
        <div className="min-h-screen bg-[#FAF6ED] dark:bg-background transition-colors duration-300 pb-16">
            {/* Banner area / Top margin */}
            <div className="h-10 md:h-16"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8">

                {/* TOP HERO SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                    {/* Image & Quick Stats Overlay */}
                    <div className="md:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl border border-border group bg-card">
                        <div className="aspect-[4/5] md:aspect-[3/4] relative bg-muted/30">
                            <Image
                                src={astro.photo || "/assets/images/astrologers/1.jpg"}
                                alt={astro.name || "Astrologer"}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {/* Rating Overlay */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] bg-background/80 dark:bg-card/85 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg flex items-center justify-between">
                            <div>
                                <div className="flex items-center text-yellow-500 font-bold text-xl md:text-2xl">
                                    <Star className="fill-yellow-500 text-yellow-500 w-5 h-5 md:w-6 md:h-6 mr-1" /> {starCount}
                                </div>
                                <div className="text-xs md:text-sm text-foreground/80 font-medium">{formattedConsults} Consultations</div>
                            </div>
                            {astro.status === "online" && (
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center" title="Online">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                            )}
                            {astro.status === "busy" && (
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center" title="Busy">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Profile Info & Booking Actions */}
                    <div className="md:col-span-7 flex flex-col justify-center">

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-primary/20">
                                {expertiseList[0] || "Vedic Master"}
                            </span>
                            <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-yellow-500/20">
                                <CheckCircle className="w-3 h-3 mr-1" /> Verified Expert
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 font-serif tracking-tight">
                            {astro.name || "Astrosway Expert"}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground italic mb-8 font-medium">
                            Specializing in {expertiseList.slice(0, 2).join(' & ') || 'Karmic Alignment'}
                        </p>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-card/60 p-5 rounded-2xl border border-border flex flex-col justify-center shadow-sm">
                                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Consultation Fee</span>
                                <div className="text-2xl md:text-3xl font-bold text-foreground flex items-baseline">
                                    ₹{astro.chatNormalPrice || 45}<span className="text-sm font-semibold text-muted-foreground ml-1">/min</span>
                                </div>
                            </div>
                            <div className="bg-card/60 p-5 rounded-2xl border border-border flex flex-col justify-center shadow-sm">
                                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Experience</span>
                                <div className="text-2xl md:text-3xl font-bold text-foreground flex items-baseline">
                                    {astro.experience || "15+"} <span className="text-sm font-semibold text-muted-foreground ml-1">Years</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-auto">

                            {astro.chatService == 1 && (
                                <Link
                                    href={{
                                        pathname: "/user-details",
                                        query: {
                                            astroId: id,
                                            type: "chat",
                                            service: astro.sessionType,
                                        },
                                    }}
                                >
                                    <button className="bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-4 px-4 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 group">
                                        <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Chat Now
                                    </button>
                                </Link>
                            )}

                            {astro.callService == 1 && (
                                <Link
                                    href={{
                                        pathname: "/user-details",
                                        query: {
                                            astroId: id,
                                            type: "call",
                                            service: astro.sessionType,
                                        },
                                    }}
                                >
                                    <button className="bg-card hover:bg-accent border border-border text-foreground font-semibold py-4 px-4 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95 group">
                                        <Phone className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        Voice Call
                                    </button>
                                </Link>
                            )}

                            {astro.videoService == 1 && (
                                <Link
                                    href={{
                                        pathname: "/user-details",
                                        query: {
                                            astroId: id,
                                            type: "video",
                                            service: astro.sessionType,
                                        },
                                    }}
                                >
                                    <button className="bg-card hover:bg-accent border border-border text-foreground font-semibold py-4 px-4 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95 group">
                                        <Video className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        Video Call
                                    </button>
                                </Link>
                            )}

                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION - TWO COLUMNS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* MAIN CONTENT (LEFT 2 COLS) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About / The Celestial Journey */}
                        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center font-serif">
                                <BookOpen className="w-6 h-6 mr-3 text-primary" /> The Celestial Journey
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed md:text-lg whitespace-pre-line">
                                {astro.longBio || astro.description || `With over ${astro.experience || "15"} years of deep meditative practice and scholarly study of the Vedas, ${astro.name || "this astrologer"} has guided thousands of souls through the intricate cosmic web of life. Their approach blends traditional Vedic principles with modern psychological insights, providing clarity that is both spiritually grounded and practically applicable.\n\nThey specialize in deep life path mapping, empowering clients to make conscious choices aligned with their dharma.`}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-border">
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center">
                                        <GraduationCap className="w-4 h-4 mr-2" /> Education
                                    </h3>
                                    <p className="text-sm md:text-base font-semibold text-foreground">{astro.education || "Master of Astrology, Vedic Institute"}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center">
                                        <Languages className="w-4 h-4 mr-2" /> Languages
                                    </h3>
                                    <p className="text-sm md:text-base font-semibold text-foreground capitalize">{languagesList.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Expertise Realms */}
                        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">Expertise Realms</h2>
                            <div className="flex flex-wrap gap-3">
                                {expertiseList.map((tag, idx) => (
                                    <span key={idx} className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors hover:shadow-sm capitalize ${idx === 2 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-background text-foreground border-border hover:border-primary/50'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Voices from the Cosmos</h2>
                                <button className="text-xs font-bold text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 uppercase tracking-widest self-start sm:self-auto transition-colors">View All {formattedConsults} Reviews</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Review 1 */}
                                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">A</div>
                                        <div>
                                            <div className="font-bold text-sm text-foreground">Amit Sharma</div>
                                            <div className="flex text-yellow-500 mt-0.5"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed flex-grow">"Prediction about my career transition was accurate down to the week. Truly enlightened soul."</p>
                                </div>
                                {/* Review 2 */}
                                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border border-blue-500/20 shrink-0">P</div>
                                        <div>
                                            <div className="font-bold text-sm text-foreground">Priya K.</div>
                                            <div className="flex text-yellow-500 mt-0.5"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed flex-grow">"Calming presence. They didn't just give answers; they gave me peace of mind about my relationship."</p>
                                </div>
                                {/* Review 3 */}
                                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg border border-purple-500/20 shrink-0">R</div>
                                        <div>
                                            <div className="font-bold text-sm text-foreground">Rahul T.</div>
                                            <div className="flex text-yellow-500 mt-0.5"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 text-muted-foreground" /></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed flex-grow">"Highly professional and deep analysis of my birth chart. Recommended for serious guidance."</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* SIDEBAR (RIGHT 1 COL) */}
                    <div className="space-y-6">

                        {/* Pricing Box */}
                        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                            <h2 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border font-serif relative z-10">Celestial Exchange</h2>

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center justify-between group">
                                    <span className="text-muted-foreground flex items-center text-sm font-medium"><MessageCircle className="w-5 h-5 mr-3 text-primary/70 group-hover:text-primary transition-colors" /> Chat Consultation</span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-500">₹{astro.chatNormalPrice || 45}/min</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <span className="text-muted-foreground flex items-center text-sm font-medium"><Phone className="w-5 h-5 mr-3 text-primary/70 group-hover:text-primary transition-colors" /> Voice Call</span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-500">₹{astro.ivrNormalPrice || 60}/min</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <span className="text-muted-foreground flex items-center text-sm font-medium"><Video className="w-5 h-5 mr-3 text-primary/70 group-hover:text-primary transition-colors" /> Video Call</span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-500">₹{astro.videoNormalPrice || 90}/min</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-border pt-5 mt-2 group">
                                    <span className="text-foreground flex items-center text-sm font-bold"><FileText className="w-5 h-5 mr-3 text-primary" /> Detailed PDF Report</span>
                                    <span className="font-bold text-foreground">₹1,499</span>
                                </div>
                            </div>

                            <button className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-4 px-4 rounded-xl shadow-md transition-all active:scale-95 text-base relative z-10">
                                Recharge & Connect
                            </button>
                            <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-4 uppercase tracking-widest font-semibold relative z-10">Prices inclusive of all spiritual taxes</p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card rounded-3xl p-6 border border-border flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-3">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">AVG Wait</span>
                                <span className="text-lg md:text-xl font-bold text-foreground mt-1">2-5 Mins</span>
                            </div>
                            <div className="bg-card rounded-3xl p-6 border border-border flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-3">
                                    <ThumbsUp className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Success Rate</span>
                                <span className="text-lg md:text-xl font-bold text-foreground mt-1">98.4%</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default function AstroProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF6ED] dark:bg-background flex flex-col items-center justify-center pb-16">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading journey...</p>
            </div>
        }>
            <AstroProfileContent />
        </Suspense>
    );
}
