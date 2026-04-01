"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Star,
  Users,
  Award,
  Calendar,
  ChevronRight,
  MessageCircle,
  Phone,
  Video,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  UserPlus,
  MessageSquare,
  Sparkles as SparklesIcon,
  Compass as CompassIcon,
  Stars,
  Sparkle as SparkleIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HomeSkeleton, AstrologerSkeleton } from "@/components/HomeSkeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Light Mode (now JSX)
import CareerLight from "@/svg/category/lightmode/career";
import EducationLight from "@/svg/category/lightmode/education";
import HealthLight from "@/svg/category/lightmode/health";
import KidsLight from "@/svg/category/lightmode/kids";
import LegalLight from "@/svg/category/lightmode/legal";
import MarriageLight from "@/svg/category/lightmode/marriage";
import WealthLight from "@/svg/category/lightmode/wealth";

// Dark Mode (now JSX)
import CareerDark from "@/svg/category/darkmode/career";
import EducationDark from "@/svg/category/darkmode/education";
import HealthDark from "@/svg/category/darkmode/health";
import KidsDark from "@/svg/category/darkmode/kids";
import LegalDark from "@/svg/category/darkmode/legal";
import MarriageDark from "@/svg/category/darkmode/marriage";
import WealthDark from "@/svg/category/darkmode/wealth";
import { Link } from "@/i18n/routing";
import useApi from "@/hooks/useApi";
import { se } from "date-fns/locale";
import { set } from "date-fns";

export default function HomePage() {
  const t = useTranslations("Home");
  const { resolvedTheme } = useTheme();
  const { apiCall } = useApi();
  const [activeTab, setActiveTab] = useState("daily");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      try {
        const endpoints = [
          "/api/astrologer/offer",
          "/api/astrologer/free",
          "/api/astrologer/normal",
        ];

        for (const url of endpoints) {
          const res = await apiCall(url, "GET");

          if (res?.data?.details?.length) {
            setAstrologers(res.data.details);
            return;
          }
        }

        // fallback if nothing found
        setAstrologers([]);
      } catch (err) {
        console.error(err);
      } finally { 
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  // Responsive slider settings
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const astrologerSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const blogSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const zodiacSigns = [
    { name: "Aries", image: "/assets/images/zoodiac/Aries.jpg" },
    { name: "Taurus", image: "/assets/images/zoodiac/Taurus.jpg" },
    { name: "Gemini", image: "/assets/images/zoodiac/Gemini.jpg" },
    { name: "Cancer", image: "/assets/images/zoodiac/Cancer.jpg" },
    { name: "Leo", image: "/assets/images/zoodiac/Leo.jpg" },
    { name: "Virgo", image: "/assets/images/zoodiac/Virgo.jpg" },
    { name: "Libra", image: "/assets/images/zoodiac/Libra.jpg" },
    { name: "Scorpio", image: "/assets/images/zoodiac/Scorpio.jpg" },
    { name: "Sagittarius", image: "/assets/images/zoodiac/Sagittarius.jpg" },
    { name: "Capricorn", image: "/assets/images/zoodiac/Capricorn.jpg" },
    { name: "Aquarius", image: "/assets/images/zoodiac/Aquarius.jpg" },
    { name: "Pisces", image: "/assets/images/zoodiac/Pisces.jpg" },
  ];

  const freeReadings = [
    {
      title: "Compatibility Match",
      image: "/assets/images/freereadings/1.jpg",
    },
    {
      title: "Birth Chart (Kundli)",
      image: "/assets/images/freereadings/2.jpg",
    },
    { title: "Planetary Transits", image: "/assets/images/freereadings/3.jpg" },
    { title: "Spiritual Remedies", image: "/assets/images/freereadings/4.jpg" },
    {
      title: "Love & Relationship Insights",
      image: "/assets/images/freereadings/5.jpg",
    },
    { title: "Daily Panchang", image: "/assets/images/freereadings/6.jpg" },
    {
      title: "Tarot Card Guidance",
      image: "/assets/images/freereadings/7.jpg",
    },
    { title: "Numerology Reading", image: "/assets/images/freereadings/8.jpg" },
    {
      title: "Vastu & Home Energy",
      image: "/assets/images/freereadings/9.jpg",
    },
    {
      title: "Zodiac Sign Overview",
      image: "/assets/images/freereadings/10.jpg",
    },
    {
      title: "Festivals & Sacred Dates",
      image: "/assets/images/freereadings/11.jpg",
    },
    {
      title: "Spiritual Growth & Meditation",
      image: "/assets/images/freereadings/12.jpg",
    },
  ];

  const scheduleItems = [
    { name: "Love & Relationships", image: "/assets/images/schedule/1.jpg" },
    { name: "Marriage Guidance", image: "/assets/images/schedule/2.jpg" },
    { name: "Education & Career", image: "/assets/images/schedule/3.jpg" },
    { name: "Star Predictions", image: "/assets/images/schedule/4.jpg" },
    { name: "Life Path Insights", image: "/assets/images/schedule/5.jpg" },
  ];

  const consultCategories = [
    { name: "Career", Light: CareerLight, Dark: CareerDark },
    { name: "Education", Light: EducationLight, Dark: EducationDark },
    { name: "Health", Light: HealthLight, Dark: HealthDark },
    { name: "Kids", Light: KidsLight, Dark: KidsDark },
    { name: "Legal", Light: LegalLight, Dark: LegalDark },
    { name: "Marriage", Light: MarriageLight, Dark: MarriageDark },
    { name: "Wealth", Light: WealthLight, Dark: WealthDark },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya S.",
      rating: 5,
      text: "The best astrologer I've spoken with. She not only showed the path but also added the motivation and reason why that path has been chosen. Thank you mam!",
      date: "2 weeks ago",
      service: "Kundli Reading",
      initial: "P",
    },
    {
      id: 2,
      name: "Rahul M.",
      rating: 5,
      text: "He is very thoughtful and patient. Listens to concerns carefully and is prompt with valuable suggestions. Had a wonderful experience!",
      date: "1 week ago",
      service: "Career Consultation",
      initial: "R",
    },
    {
      id: 3,
      name: "Neha K.",
      rating: 5,
      text: "Such a wonderful session! It felt like a conversation about growing in life and becoming a better version of ourselves. Never felt so at ease.",
      date: "3 days ago",
      service: "Love Reading",
      initial: "N",
    },
    {
      id: 4,
      name: "Vikram J.",
      rating: 5,
      text: "The psychic reading was exactly what I needed. I felt more confident after our session. The predictions were spot-on!",
      date: "5 days ago",
      service: "Psychic Reading",
      initial: "V",
    },
    {
      id: 5,
      name: "Anjali P.",
      rating: 5,
      text: "This horoscope was quite spot-on, which I didn't expect! I rarely leave reviews, but I couldn't not do it here. Loved the experience!",
      date: "1 day ago",
      service: "Daily Horoscope",
      initial: "A",
    },
  ];

  const blogs = [
    {
      id: 1,
      title: "Why Your Birth Chart Matters More Than Your Zodiac Sign",
      excerpt:
        "Your sun sign is only one piece of the puzzle. Discover how your full birth chart reveals deeper insights about personality, relationships, and life direction.",
      category: "Birth Chart",
      date: "Mar 10, 2026",
      author: "Astrosway Editorial",
      image: "/assets/images/astrologers/c.jpg",
      readTime: "6 min read",
      href: "#",
    },
    {
      id: 2,
      title: "Mercury Retrograde Explained: Myth vs Reality",
      excerpt:
        "Is Mercury retrograde really responsible for communication chaos? Learn what actually happens during retrogrades and how to navigate them wisely.",
      category: "Planetary Movements",
      date: "Mar 5, 2026",
      author: "Astrosway Insights",
      image: "/assets/images/astrologers/b.jpg",
      readTime: "5 min read",
      href: "#",
    },
    {
      id: 3,
      title: "Using Astrology to Make Smarter Career Decisions",
      excerpt:
        "Your planetary placements can influence ambition, strengths, and timing. Discover how astrology supports confident career planning.",
      category: "Career Astrology",
      date: "Feb 28, 2026",
      author: "Astrosway Editorial",
      image: "/assets/images/astrologers/a.jpg",
      readTime: "7 min read",
      href: "#",
    },
  ];

  const stats = [
    { label: "Satisfied Clients", value: "60M+", icon: Users },
    { label: "Astrologers", value: "500+", icon: Award },
    { label: "Accuracy Rate", value: "93.4%", icon: TrendingUp },
    { label: "Star Rating", value: "4.8/5", icon: Star },
    { label: "Consultations", value: "10M+", icon: MessageCircle },
    { label: "Years of Trust", value: "15+", icon: ShieldCheck },
  ];

  const gettingStartedSteps = [
    {
      step: "1",
      title: "Sign Up",
      description:
        "Our quiz suggests advisors whose styles might be a good fit for you. Answer a few questions, and find a psychic who might fit in with what you're looking for. Or skip it and hop onto exploring!",
      icon: UserPlus,
    },
    {
      step: "2",
      title: "Choose the Payment Option",
      description:
        "You'll be asked for payment information to begin a session. Please review all pricing and subscription details carefully before purchase. Some offers include trial periods that may convert to paid plans if not canceled.",
      icon: CreditCard,
    },
    {
      step: "3",
      title: "Select a Psychic Reader",
      description:
        "Pick an online psychic from one of the matches we offer, or choose one of the psychics online available on our site.",
      icon: Users,
    },
    {
      step: "4",
      title: "Start Chatting",
      description:
        "You're all set! Start a conversation with a spiritual reader of your choice and get your first psychic reading online.",
      icon: MessageSquare,
    },
  ];

  // Helper function to get theme-based icon
  const getThemeIcon = (Light, Dark) => {
    if (!mounted) return Light; // avoid hydration issue
    return resolvedTheme === "dark" ? Dark : Light;
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex items-center bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Cosmic Path
                <br />
                <span className="text-primary">
                  with Expert Online Astrologers
                </span>
              </h1>

              <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0 text-base sm:text-lg">
                Get accurate astrology predictions, daily horoscope guidance,
                and personalized birth chart insights. Connect instantly with
                verified astrologers through chat, call, or video.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="https://play.google.com/store/apps/details?id=com.astrowayuser">
                  <Button
                    size="lg"
                    className="px-6 sm:px-8 py-5 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto"
                  >
                    Talk to Astrologer
                  </Button>{" "}
                </Link>
                <Link href="#">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 sm:px-8 py-5 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto"
                  >
                    Get Free Horoscope
                  </Button>{" "}
                </Link>
              </div>
            </div>

            {/* RIGHT VIDEO SECTION */}
            <div className="relative flex justify-center items-center mt-8 lg:mt-0">
              <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full overflow-hidden earth-float">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute w-full h-full object-cover"
                >
                  <source src="/video/abcd.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#010827]/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className="bg-[#FAF6ED] border-y border-border dark:bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                <div className="text-base sm:text-xl font-bold">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCHEDULE APPOINTMENT SECTION ===== */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              Schedule a Session
            </h2>
            <Link
              // href="/sessions"
              href="#"
            >
              <Button
                variant="outline"
                className="rounded-full px-6 w-full sm:w-auto"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {scheduleItems.map((item, index) => (
              <Link
                key={index}
                href="#"
                // href={`/session/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* IMAGE CARD */}
                  <div className="rounded-2xl overflow-hidden bg-muted shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-[160px] sm:h-[180px] lg:h-[200px] object-cover"
                    />
                  </div>

                  {/* TITLE BELOW IMAGE */}
                  <p className="text-center font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TODAY'S ASTROLOGY PREDICTION ===== */}
      <section className="py-20 sm:py-20 lg:py-24 bg-[#FAF6ED] dark:bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Today's Astrology Prediction
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {zodiacSigns.map((sign, index) => (
              <Link
                key={index}
                href="#"
                // href={`/horoscope/${sign.name.toLowerCase()}`}
                className="group"
              >
                <div className="space-y-3">
                  {/* IMAGE CARD */}
                  <div className="rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src={sign.image}
                      alt={sign.name}
                      width={300}
                      height={200}
                      className="w-full h-[120px] object-cover"
                    />
                  </div>

                  {/* TITLE */}
                  <p className="text-center font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                    {sign.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FREE ASTROLOGY READINGS SECTION ===== */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
              Free Astrology Readings
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {freeReadings.map((item, index) => (
              <Link
                key={index}
                href="#"
                // href={`/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <div className="space-y-2 sm:space-y-4">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-square bg-muted transition-all group-hover:scale-105">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-center font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONSULT THE RIGHT ASTROLOGER SECTION ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF6ED] dark:bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Consult The Right <span className="text-primary">Astrologer</span>
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Choose guidance tailored to your life goals and challenges
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-8">
            {consultCategories.map((category, idx) => {
              const Icon = getThemeIcon(category.Light, category.Dark);

              return (
                <Link key={idx} href="#" className="group block">

                  <div
                    className="
                flex items-center justify-center
                h-[120px] sm:h-[150px] lg:h-[190px]
                rounded-2xl sm:rounded-3xl
                overflow-hidden

                bg-card text-card-foreground
                border border-border

                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
              "
                  >
                    <Icon className="w-14 h-14" />
                  </div>

                  <p className="text-center mt-2 text-xs sm:text-sm font-medium">
                    {category.name}
                  </p>

                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===== TOP ASTROLOGERS SECTION ===== */}
      {loading ? (
  <HomeSkeleton count={4} CardComponent={AstrologerSkeleton} />
) : (
  <section className="bg-muted/30 py-12 sm:py-16 dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Top <span className="text-primary">Astrologers</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Chat with expert astrologers online
              </p>
            </div>
          </div>

          <div className="slider-container -mx-2">
            <Slider {...astrologerSettings}>
              {astrologers.map((astro) => (
                <div key={astro.astroId} className="px-2">
                  <Link href={`/astro-profile/${astro.astroId}`}>
                    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-0 cursor-pointer group">

                      {/* IMAGE */}
                      <div className="relative w-full h-[190px]">
                        <img
                          src={astro.photo}
                          alt={astro.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        {/* ONLINE */}
                        {astro.status === "online" && (
                          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium shadow-sm">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-green-600">Online</span>
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="p-5">

                        {/* NAME */}
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {astro.name}
                        </h3>

                        {/* RATING + EXPERIENCE */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{astro.rating || 4.5}</span>
                          <span>•</span>
                          <span>{astro.experience} yrs</span>
                        </div>

                        {/* 🔥 EXPERTISE */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {astro.expertise?.slice(0, 2).map((exp, i) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>

                        {/* 🌐 LANGUAGES */}
                        <div className="text-xs text-muted-foreground mt-1">
                          {astro.language?.slice(0, 2).join(", ")}
                        </div>

                        {/* 🔥 SERVICES */}
                        <div className="flex gap-2 mt-3 flex-wrap">

                          {astro.chatService === 1 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> Chat
                            </span>
                          )}

                          {astro.callService === 1 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Call
                            </span>
                          )}

                          {astro.videoService === 1 && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <Video className="h-3 w-3" /> Video
                            </span>
                          )}

                        </div>

                        {/* DIVIDER */}
                        <div className="border-t border-border my-4"></div>

                        {/* PRICE + CTA */}
                        <div className="flex justify-between items-center">

                          <span className="text-lg font-bold text-primary">
                            ₹{astro.chatNormalPrice}/min
                          </span>

                          {/* BUTTON */}
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // prevent Link override
                              e.stopPropagation();
                              // optionally trigger chat modal
                            }}
                          >
                            <Button size="sm" className="gap-1">
                              Chat <MessageCircle className="h-3 w-3" />
                            </Button>
                          </button>

                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
)}

      {/* ===== CONSULTATION OPTIONS ===== */}
      <section className="py-16 sm:py-20 bg-[#F9F5EC] dark:bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Connect With Our Astrologers
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Choose how you'd like to receive your personalized guidance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* CHAT */}
            <div className="group bg-white dark:bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Live Chat
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Instant text consultation
              </p>
              <Link
                // href="/chat"
                href="#"
              >
                <Button
                  size="sm"
                  className="w-full rounded-full text-xs sm:text-sm"
                >
                  Start
                </Button>
              </Link>
            </div>

            {/* CALL */}
            <div className="group bg-white dark:bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Voice Call
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Personal phone session
              </p>
              <Link
                // href="/call"
                href="#"
              >
                <Button
                  size="sm"
                  className="w-full rounded-full text-xs sm:text-sm"
                >
                  Start
                </Button>
              </Link>
            </div>

            {/* VIDEO CALL */}
            <div className="group bg-white dark:bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Video Call
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Face-to-face guidance
              </p>
              <Link
                // href="/video"
                href="#"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full text-xs sm:text-sm"
                >
                  Start
                </Button>
              </Link>
            </div>

            {/* SCHEDULE SESSION */}
            <div className="group bg-white dark:bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Schedule Session
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Book a time slot
              </p>
              <Link
                // href="/schedule"
                href="#"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full text-xs sm:text-sm"
                >
                  Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ASTROSWAY INSIGHTS SECTION ===== */}
      <section className="py-16 sm:py-20 lg:py-24 dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Cosmic Insights by Astrosway
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Discover powerful knowledge, planetary wisdom and spiritual
              clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={blog.href} className="group">
                <div className="bg-white dark:bg-primary/5 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* IMAGE SECTION */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* CATEGORY BADGE */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-primary shadow">
                      {blog.category}
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{blog.date}</span>
                      <span>{blog.readTime}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="text-primary text-xs sm:text-sm font-medium flex items-center gap-2">
                      Read More
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="bg-[#FAF6ED] py-12 sm:py-16 dark:bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              What Our <span className="text-primary">Clients Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Real stories from real people who found guidance
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="slider-container -mx-3">
              <Slider {...testimonialSettings}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-3">
                    <Card className="hover:shadow-lg transition-all h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                            />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                          "{testimonial.text}"
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                              {testimonial.initial}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">
                              {testimonial.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {testimonial.service} • {testimonial.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GETTING STARTED SECTION ===== */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Getting Started is <span className="text-primary">Simple</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Begin your spiritual journey in just a few easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {gettingStartedSteps.map((step) => (
            <Card
              key={step.step}
              className="relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-4xl sm:text-6xl font-bold text-muted-foreground/10 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link href="https://play.google.com/store/apps/details?id=com.astrowayuser">
            <Button
              size="lg"
              className="gap-2 text-base sm:text-lg px-6 sm:px-8"
            >
              Get Started! <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF6ED] dark:bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            Align Your Life With{" "}
            <span className="text-primary">Cosmic Wisdom</span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 sm:mb-12">
            Connect with verified astrologers and receive personalized insights
            designed to bring clarity, confidence, and direction to your
            journey.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/register">
              <Button
                size="lg"
                className="px-6 sm:px-8 py-5 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto"
              >
                Create Account
              </Button>
            </Link>

            <Link
              // href="/astrologers"
              href="#"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 py-5 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto"
              >
                Explore Astrologers
              </Button>
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground flex flex-wrap justify-center gap-4 sm:gap-6">
            <span>✓ Secure & Private</span>
            <span>✓ Verified Experts</span>
            <span>✓ Flexible Consultation Options</span>
          </div>
        </div>
      </section>
    </div>
  );
}
