"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, Wallet, CheckCircle, ArrowLeft, Zap, Sparkles } from "lucide-react";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

const amountsMockData = [
    { value: 25 },
    { value: 50 },
    { value: 100, recommended: true },
    { value: 200 },
    { value: 500 },
    { value: 1000 },
    { value: 2000 },
    { value: 5000 },
];

export default function RechargePage() {
    const router = useRouter();
    const { apiCall } = useApi();
    const { user, isAuthenticated } = useAuth();
    const name = user?.fullName || "";
    const email = user?.email || "";

    const phone = user?.phoneNo?.startsWith(user?.code)
        ? user?.phoneNo.slice(user?.code.length)
        : user?.phoneNo || "";
    const [amount, setAmount] = useState(amountsMockData[2].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        // Simulate data sync/hydration delay for an elegant skeleton reveal
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let timer;
        if (isSuccess && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isSuccess && timeLeft === 0) {
            router.back();
        }
        return () => clearTimeout(timer);
    }, [isSuccess, timeLeft, router]);

    const handleRecharge = async (e) => {
        e.preventDefault();
        setError("");

        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (!isAuthenticated) {
            setError(
                "Start your session by logging in or signing up. Redirecting to register..."
            );

            setTimeout(() => {
                router.push("/register");
            }, 2500);

            return;
        }

        setIsSuccess(false);
        setTimeLeft(5);

        setIsLoading(true);
        try {

            // 1. Call order-creation API

            const orderRes = await apiCall("/api/payment/order-creation", "POST", { amount: numAmount });
            const orderData = orderRes?.data || orderRes;

            if (!orderData?.id && !orderData?.orderId) {
                throw new Error(orderData?.message || "Failed to create order");
            }

            const rzpOrderId = orderData.id;
            const rzpAmount = orderData.amount;

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
                amount: rzpAmount,
                currency: "INR",
                name: "Astrosway",
                description: "Wallet Recharge",
                order_id: rzpOrderId,
                prefill: {
                    name,
                    email,
                    contact: phone,
                },
                theme: {
                    color: "#F37254",
                },
                handler: async function (response) {
                    console.log("Razorpay Response:", response);
                    try {
                        setIsLoading(true);
                        // 3. Call order-verification API
                        const verifyRes = await apiCall("/api/payment/order-verification", "POST", {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        if (verifyRes?.statusCode === 200 || verifyRes?.success || verifyRes?.data || verifyRes?.status === "success" || !verifyRes?.error) {
                            setIsSuccess(true);
                        } else {
                            setError(verifyRes?.message || "Payment verification failed.");
                            setIsLoading(false);
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        setError("Payment verification failed. Please contact support.");
                        setIsLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false);
                        setError("Payment cancelled");
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response) {
                setError(response.error.description || "Payment failed");
                setIsLoading(false);
            });

            rzp.open();

        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-green-50 dark:bg-green-950/20 flex flex-col items-center justify-center p-4 transition-colors duration-300 font-sans relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/20 dark:bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="bg-card/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-green-200 dark:border-green-900/50 flex flex-col items-center text-center max-w-md w-full animate-in zoom-in-95 duration-500 relative z-10">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Payment Successful!</h2>
                    <p className="text-muted-foreground mb-8 text-sm">
                        Your stellar wallet has been securely credited with <span className="font-bold text-foreground">₹{amount}</span>.
                    </p>
                    <div className="w-full bg-muted/50 rounded-2xl p-6 border border-border mt-2">
                        <div className="flex flex-col items-center justify-center space-y-4 text-sm font-medium text-foreground">
                            <div className="flex items-center space-x-3 text-lg font-semibold text-primary">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span>Redirecting in {timeLeft}s</span>
                            </div>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Taking you back to your journey</span>
                        </div>
                        <div className="w-full bg-background mt-6 h-2 rounded-full overflow-hidden border border-border">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                                style={{ width: `${(timeLeft / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-[#FAF6ED] dark:bg-background pb-16 relative overflow-hidden flex flex-col items-center pt-10 md:pt-20">
                <div className="max-w-3xl w-full mx-auto px-4 md:px-8">
                    <div className="w-24 h-6 bg-muted/60 rounded-md animate-pulse mb-8" />

                    <div className="bg-card/40 rounded-[2rem] p-6 md:p-10 border border-border shadow-sm flex flex-col">
                        <div className="flex flex-col md:flex-row gap-6 mb-10">
                            <div className="w-20 h-20 bg-muted/60 rounded-3xl animate-pulse shrink-0" />
                            <div className="flex-1 space-y-3 pt-2">
                                <div className="w-2/3 h-10 bg-muted/60 rounded-xl animate-pulse" />
                                <div className="w-1/2 h-5 bg-muted/40 rounded-md animate-pulse" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-7 space-y-5">
                                <div className="w-1/3 h-4 bg-muted/50 rounded animate-pulse" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="w-full h-24 bg-muted/40 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center lg:mt-4">
                                <div className="space-y-3">
                                    <div className="w-1/2 h-4 bg-muted/50 rounded animate-pulse" />
                                    <div className="w-full h-[72px] bg-muted/60 rounded-2xl animate-pulse" />
                                </div>
                                <div className="w-full h-16 bg-muted/80 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF6ED] dark:bg-background text-foreground transition-colors duration-300 font-sans pb-16 selection:bg-primary/30 font-medium relative overflow-hidden">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

            {/* Header Margin */}
            <div className="h-10 md:h-20"></div>

            <div className="max-w-3xl mx-auto px-4 md:px-8 relative z-10">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors mb-8 group uppercase tracking-widest bg-card/50 backdrop-blur-sm px-4 py-2 border border-border rounded-full hover:bg-card hover:shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Portal
                </button>

                <div className="bg-card/40 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 border border-white/20 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">

                    {isLoading && (
                        <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <div className="bg-card p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-primary/20 text-center animate-in zoom-in-95 duration-500 max-w-[80%]">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold font-serif text-foreground">Securely Processing</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[220px]">
                                    Connecting to localized payment gateway...
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="relative z-10 mb-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-primary/20 w-full h-full rotate-45 scale-[2] translate-y-[100%] transition-transform duration-700 ease-out group-hover:translate-y-[-100%]" />
                            <Wallet className="w-10 h-10 text-primary relative z-10 drop-shadow-md" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 flex items-center justify-center md:justify-start gap-3">
                                Recharge Wallet
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                            </h1>
                            <p className="text-base text-muted-foreground/80 max-w-sm mx-auto md:mx-0">
                                Seamlessly add funds to your cosmic wallet for uninterrupted planetary insights.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center mb-8 relative z-10 animate-in slide-in-from-top-2">
                            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRecharge} className="relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Left Side: Amount Grid */}
                            <div className="lg:col-span-7 order-2 lg:order-1">
                                <div className="flex items-center justify-between mb-5">
                                    <p className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground">
                                        Select Quick Top-Up
                                    </p>
                                    <Zap className="w-4 h-4 text-primary/70" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                                    {amountsMockData.map((item) => {
                                        const isSelected = amount === item.value.toString();
                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => setAmount(item.value.toString())}
                                                className={cn(
                                                    "relative px-2 py-4 rounded-2xl border text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_15px_rgba(250,204,21,0.4)] scale-[1.03]"
                                                        : "bg-card/50 border-border text-foreground hover:bg-card hover:border-primary/40 hover:shadow-md"
                                                )}
                                            >
                                                {item.recommended && (
                                                    <span className={cn(
                                                        "absolute -top-px left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-b-md font-extrabold shadow-sm transition-colors",
                                                        isSelected
                                                            ? "bg-background/20 text-primary-foreground"
                                                            : "bg-primary text-primary-foreground"
                                                    )}>
                                                        Popular
                                                    </span>
                                                )}
                                                <span className={cn("text-[10px] opacity-70 mb-0.5 mt-1", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>₹</span>
                                                <span className={cn("text-xl md:text-2xl", item.recommended ? "font-black" : "font-bold")}>{item.value}</span>

                                                {/* Button inner glow on hover */}
                                                {!isSelected && (
                                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Side: Custom Form & Submit */}
                            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 flex flex-col justify-center">

                                <div className="space-y-3">
                                    <label className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground ml-1">
                                        Selected Amount :
                                    </label>

                                    <div
                                        className="
      relative group
      bg-background/80 backdrop-blur-sm
      border-2 border-border
      rounded-2xl px-5 py-5
      text-3xl font-black text-foreground
      shadow-sm flex items-center justify-center

      transition-all duration-300 ease-out
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-primary/50
    "
                                    >
                                        {/* ✨ shimmer hover layer */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                        {/* 💰 content */}
                                        <span className="text-muted-foreground mr-2">₹</span>

                                        <span className="text-primary group-hover:scale-110 transition-transform duration-300">
                                            {amount || 0}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !amount || Number(amount) <= 0}
                                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground font-extrabold px-8 py-5 rounded-2xl text-base uppercase tracking-wider shadow-[0_8px_30px_rgba(250,204,21,0.3)] transition-all hover:shadow-[0_8px_40px_rgba(250,204,21,0.5)] hover:-translate-y-1 flex flex-col items-center justify-center disabled:opacity-50 disabled:pointer-events-none group overflow-hidden relative"
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />

                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 relative z-10">
                                            <span>Proceed to Pay</span>
                                            {amount && Number(amount) > 0 && (
                                                <span className="bg-primary-foreground/20 px-2 py-0.5 rounded-lg text-sm">
                                                    ₹{Number(amount).toLocaleString('en-IN')}
                                                </span>
                                            )}
                                            <svg className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    )}
                                </button>

                            </div>
                        </div>
                    </form>

                    {/* Bottom Security Note */}
                    <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-center text-xs text-muted-foreground font-medium text-center">
                        <svg className="w-4 h-4 mr-1.5 text-primary/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        Secured securely with Razorpay 128-bit encryption
                    </div>
                </div>
            </div>
        </div>
    );
}