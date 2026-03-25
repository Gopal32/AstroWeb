"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  Sparkles,
  Star,
  Heart,
  Moon,
  Sun,
  Compass,
  Calendar,
  BookOpen,
  Gem,
  Zap,
  Trophy,
  Coffee,
  Globe,
  Lock,
  Telescope,
  Infinity,
  Feather,
  Cpu,
  Brain,
  Eye,
  Leaf,
  Wind,
  Droplet,
  Flame,
  Mountain,
  Cloud,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import AppIcon from "@/components/icons/app-icon";
import LocaleSwitcher from "@/components/lang-switcher";
import ModeToggle from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

/* ASTRO utils */
import {
  getAstroToken,
  getAstroId,
  clearAstroAuthData,
  fetchAstroOnboardingInfo,
  AUTH_EVENT as ASTRO_AUTH_EVENT,
} from "@/utils/astroUtils";

/* USER utils */
import {
  getUserToken,
  clearUserAuthData,
  fetchUserProfileFromAPI,
  USER_AUTH_EVENT,
} from "@/utils/userUtils";
import Image from "next/image";

// ===== Beautiful Mega Menu Content =====

const topicsContent = [
  {
    category: "Love & Relationships",
    items: [
      {
        name: "Love Reading",
        icon: Heart,
        description: "Find your true love path",
        color: "text-rose-500",
        href: "/topics/love-reading",
      },
      {
        name: "Soulmate Reading",
        icon: Sparkles,
        description: "Discover your cosmic match",
        color: "text-purple-500",
        href: "/topics/soulmate-reading",
      },
      {
        name: "Fertility Reading",
        icon: Star,
        description: "Family planning guidance",
        color: "text-pink-500",
        href: "/topics/fertility-reading",
      },
      {
        name: "Romance Forecast",
        icon: Feather,
        description: "Love predictions ahead",
        color: "text-red-400",
        href: "/topics/romance-forecast",
      },
    ],
  },
  {
    category: "Life & Career",
    items: [
      {
        name: "Career Reading",
        icon: Trophy,
        description: "Professional path insights",
        color: "text-amber-500",
        href: "/topics/career-reading",
      },
      {
        name: "Fortune Reading",
        icon: Gem,
        description: "Wealth and prosperity",
        color: "text-emerald-500",
        href: "/topics/fortune-reading",
      },
      {
        name: "Past Life Reading",
        icon: Compass,
        description: "Karmic connections",
        color: "text-indigo-500",
        href: "/topics/past-life-reading",
      },
      {
        name: "Success Path",
        icon: Crown,
        description: "Achievement guidance",
        color: "text-yellow-500",
        href: "/topics/success-path",
      },
    ],
  },
  {
    category: "Specialized Readings",
    items: [
      {
        name: "Lost Objects Reading",
        icon: Zap,
        description: "Find what's missing",
        color: "text-blue-500",
        href: "/topics/lost-objects",
      },
      {
        name: "Dream Analysis",
        icon: Moon,
        description: "Understand your dreams",
        color: "text-indigo-400",
        href: "/topics/dream-analysis",
      },
      {
        name: "Karma Reading",
        icon: Infinity,
        description: "Karmic patterns",
        color: "text-purple-400",
        href: "/topics/karma-reading",
      },
      {
        name: "Spiritual Guidance",
        icon: Brain,
        description: "Inner wisdom",
        color: "text-violet-500",
        href: "/topics/spiritual-guidance",
      },
    ],
  },
];

const zodiacContent = {
  featured: [
    {
      name: "Today's Horoscope",
      icon: Sun,
      description: "Your daily cosmic guide",
      href: "/zodiac/today",
    },
    {
      name: "Compatibility",
      icon: Heart,
      description: "Find your perfect match",
      href: "/zodiac/compatibility",
    },
    {
      name: "Birth Chart",
      icon: Globe,
      description: "Your celestial blueprint",
      href: "/zodiac/birth-chart",
    },
    {
      name: "Element Guide",
      icon: Wind,
      description: "Fire, Earth, Air, Water",
      href: "/zodiac/elements",
    },
  ],
  signs: [
    {
      name: "Aries",
      icon: Flame,
      element: "Fire",
      date: "Mar 21 - Apr 19",
      href: "/zodiac/aries",
    },
    {
      name: "Taurus",
      icon: Mountain,
      element: "Earth",
      date: "Apr 20 - May 20",
      href: "/zodiac/taurus",
    },
    {
      name: "Gemini",
      icon: Wind,
      element: "Air",
      date: "May 21 - Jun 20",
      href: "/zodiac/gemini",
    },
    {
      name: "Cancer",
      icon: Droplet,
      element: "Water",
      date: "Jun 21 - Jul 22",
      href: "/zodiac/cancer",
    },
    {
      name: "Leo",
      icon: Flame,
      element: "Fire",
      date: "Jul 23 - Aug 22",
      href: "/zodiac/leo",
    },
    {
      name: "Virgo",
      icon: Mountain,
      element: "Earth",
      date: "Aug 23 - Sep 22",
      href: "/zodiac/virgo",
    },
    {
      name: "Libra",
      icon: Wind,
      element: "Air",
      date: "Sep 23 - Oct 22",
      href: "/zodiac/libra",
    },
    {
      name: "Scorpio",
      icon: Droplet,
      element: "Water",
      date: "Oct 23 - Nov 21",
      href: "/zodiac/scorpio",
    },
    {
      name: "Sagittarius",
      icon: Flame,
      element: "Fire",
      date: "Nov 22 - Dec 21",
      href: "/zodiac/sagittarius",
    },
    {
      name: "Capricorn",
      icon: Mountain,
      element: "Earth",
      date: "Dec 22 - Jan 19",
      href: "/zodiac/capricorn",
    },
    {
      name: "Aquarius",
      icon: Wind,
      element: "Air",
      date: "Jan 20 - Feb 18",
      href: "/zodiac/aquarius",
    },
    {
      name: "Pisces",
      icon: Droplet,
      element: "Water",
      date: "Feb 19 - Mar 20",
      href: "/zodiac/pisces",
    },
  ],
};

const horoscopeContent = {
  daily: [
    {
      name: "Daily Horoscope",
      icon: Sun,
      description: "Your forecast for today",
      href: "/horoscope/daily",
    },
    {
      name: "Weekly Horoscope",
      icon: Calendar,
      description: "Week ahead preview",
      href: "/horoscope/weekly",
    },
    {
      name: "Monthly Horoscope",
      icon: Moon,
      description: "Monthly predictions",
      href: "/horoscope/monthly",
    },
    {
      name: "Yearly Horoscope",
      icon: Star,
      description: "Annual cosmic guide",
      href: "/horoscope/yearly",
    },
  ],
  signs: zodiacContent.signs.map((sign) => ({
    name: sign.name,
    icon: sign.icon,
    href: `/horoscope/${sign.name.toLowerCase()}`,
  })),
};

const chartContent = [
  {
    category: "Calculators & Tools",
    items: [
      {
        name: "Life Path Calculator",
        icon: Compass,
        description: "Discover your life's purpose",
        color: "text-blue-500",
        href: "/charts/life-path",
      },
      {
        name: "Birth Chart",
        icon: Globe,
        description: "Your complete natal chart",
        color: "text-purple-500",
        href: "/charts/birth-chart",
      },
      {
        name: "Rising Sign Calculator",
        icon: Sun,
        description: "Find your ascendant",
        color: "text-amber-500",
        href: "/charts/rising-sign",
      },
      {
        name: "Palm Reading Scanner",
        icon: Sparkles,
        description: "AI-powered palm analysis",
        color: "text-rose-500",
        href: "/charts/palm-reading",
      },
      {
        name: "Numerology Chart",
        icon: Gem,
        description: "Your numbers decoded",
        color: "text-emerald-500",
        href: "/charts/numerology",
      },
      {
        name: "Chinese Zodiac",
        icon: Star,
        description: "Eastern astrology",
        color: "text-red-500",
        href: "/charts/chinese-zodiac",
      },
    ],
  },
];

const articlesContent = [
  {
    category: "Astrology Basics",
    items: [
      {
        name: "Blog",
        icon: BookOpen,
        description: "Latest articles and insights",
        color: "text-blue-500",
        href: "/articles/blog",
      },
      {
        name: "Birth Charts Guide",
        icon: Star,
        description: "Understanding your chart",
        color: "text-purple-500",
        href: "/articles/birth-charts",
      },
      {
        name: "Planets & Houses",
        icon: Globe,
        description: "Celestial bodies guide",
        color: "text-indigo-500",
        href: "/articles/planets-houses",
      },
      {
        name: "Aspects Explained",
        icon: Telescope,
        description: "Planetary relationships",
        color: "text-cyan-500",
        href: "/articles/aspects",
      },
    ],
  },
  {
    category: "Meanings & Interpretations",
    items: [
      {
        name: "Tarot Cards Meaning",
        icon: Gem,
        description: "Complete tarot guide",
        color: "text-amber-500",
        href: "/articles/tarot-meanings",
      },
      {
        name: "Angel Numbers",
        icon: Zap,
        description: "Divine number messages",
        color: "text-yellow-500",
        href: "/articles/angel-numbers",
      },
      {
        name: "Dream Meanings",
        icon: Moon,
        description: "Interpret your dreams",
        color: "text-indigo-400",
        href: "/articles/dream-meanings",
      },
      {
        name: "Synastry Guide",
        icon: Heart,
        description: "Relationship astrology",
        color: "text-rose-500",
        href: "/articles/synastry",
      },
    ],
  },
  {
    category: "Spiritual & Healing",
    items: [
      {
        name: "Crystal Meanings",
        icon: Gem,
        description: "Healing crystal guide",
        color: "text-emerald-500",
        href: "/articles/crystal-meanings",
      },
      {
        name: "Aura Colors",
        icon: Sun,
        description: "Understand your aura",
        color: "text-pink-500",
        href: "/articles/aura-colors",
      },
      {
        name: "Spiritual Meanings",
        icon: Feather,
        description: "Deep spiritual insights",
        color: "text-violet-500",
        href: "/articles/spiritual-meanings",
      },
      {
        name: "Meditation Guide",
        icon: Brain,
        description: "Cosmic meditation",
        color: "text-purple-400",
        href: "/articles/meditation",
      },
    ],
  },
];

// Navigation items configuration
const navItems = [
  { label: "Home", href: "/", hasDropdown: false },
  {
    label: "Topics",
    href: "/topics",
    hasDropdown: true,
    content: topicsContent,
    type: "topics",
  },
  {
    label: "Zodiac",
    href: "/zodiac",
    hasDropdown: true,
    content: zodiacContent,
    type: "zodiac",
  },
  {
    label: "Horoscope",
    href: "/horoscope",
    hasDropdown: true,
    content: horoscopeContent,
    type: "horoscope",
  },
  {
    label: "Charts",
    href: "/charts",
    hasDropdown: true,
    content: chartContent,
    type: "charts",
  },
  {
    label: "Articles",
    href: "/articles",
    hasDropdown: true,
    content: articlesContent,
    type: "articles",
  },
];

const ListItem = ({
  className,
  title,
  href,
  children,
  icon: Icon,
  description,
  color,
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className,
          )}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {Icon && <Icon className={cn("h-4 w-4", color)} />}
            <span>{title}</span>
          </div>
          {description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-foreground/80">
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);

  const readJson = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const deriveInitials = (name) =>
    name && name.trim().length ? name.trim().slice(0, 1).toUpperCase() : "U";

  const hydrateFromStorageOrAPI = useCallback(async () => {
    const astroToken = getAstroToken();
    const astroId = getAstroId();
    const userToken = getUserToken();

    let currentRole = null;
    if (astroToken && astroId) currentRole = "astro";
    else if (userToken) currentRole = "user";

    setRole(currentRole);

    if (!currentRole) {
      setIsLoggedIn(false);
      setUserData(null);
      return;
    }

    setIsLoggedIn(true);

    if (currentRole === "astro") {
      let profile = readJson("astroProfile");
      if (!profile) {
        const apiProfile = await fetchAstroOnboardingInfo();
        if (apiProfile) {
          profile = {
            name: apiProfile.fullName || apiProfile.name || "Astrologer",
            profilePic: apiProfile.profilePic || "",
          };
          try {
            localStorage.setItem("astroProfile", JSON.stringify(profile));
          } catch {}
        }
      } else {
        profile = {
          name: profile.fullName || profile.name || "Astrologer",
          profilePic: profile.profilePic || "",
        };
      }
      setUserData(profile || { name: "Astrologer", profilePic: "" });
      return;
    }

    if (currentRole === "user") {
      let profile = readJson("userProfile") || readJson("userDetails");

      if (!profile?.fullName && userToken) {
        const api = await fetchUserProfileFromAPI();
        if (api) {
          profile = {
            fullName: api.fullName || api.name || "User",
            profilePic: api.profilePic || "",
          };
          try {
            localStorage.setItem("userProfile", JSON.stringify(profile));
          } catch {}
        }
      } else if (profile) {
        profile = {
          fullName: profile.fullName || profile.name || "User",
          profilePic: profile.profilePic || "",
        };
      }

      setUserData(
        profile
          ? { name: profile.fullName, profilePic: profile.profilePic }
          : { name: "User", profilePic: "" },
      );
    }
  }, []);

  useEffect(() => {
    hydrateFromStorageOrAPI();
  }, [hydrateFromStorageOrAPI]);

  useEffect(() => {
    const handler = () => hydrateFromStorageOrAPI();
    window.addEventListener("astroAuthChange", handler);
    window.addEventListener("userAuthChange", handler);
    return () => {
      window.removeEventListener("astroAuthChange", handler);
      window.removeEventListener("userAuthChange", handler);
    };
  }, [hydrateFromStorageOrAPI]);

  useEffect(() => {
    hydrateFromStorageOrAPI();
  }, [pathname, hydrateFromStorageOrAPI]);

  const handleLogout = () => {
    if (role === "astro") {
      clearAstroAuthData();
    } else if (role === "user") {
      clearUserAuthData();
    }
    setIsLoggedIn(false);
    setUserData(null);
    setRole(null);
    router.push("/");
  };

  const homeHref = role === "user" ? "/profile" : "/home";
  const settingsHref = role === "user" ? "/user-settings" : "/astro-settings";
  const subtitle =
    role === "user" ? "Astroway Member" : "Professional Astrologer";
  const displayName =
    userData?.name || (role === "user" ? "User" : "Astrologer");

  return (
    <header className="w-full bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl md:text-2xl text-foreground tracking-wide">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Astrosway Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
              <span className="hover:text-primary transition-colors duration-200">
                Astrosway
              </span>
            </Link>
          </div>

          {/* Desktop Navigation with Beautiful Mega Menus */}
          <div className="hidden lg:block flex-1">
            <NavigationMenu className="flex justify-center">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {item.hasDropdown ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent text-foreground">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {/* Topics Mega Menu - 3 Columns */}
                          {item.type === "topics" && (
                            <div className="grid grid-cols-3 gap-4 p-6 w-[800px]">
                              {item.content.map((column, idx) => (
                                <div key={idx} className="space-y-3">
                                  <h3 className="text-sm font-semibold text-foreground/90 border-b pb-1">
                                    {column.category}
                                  </h3>
                                  <ul className="space-y-2">
                                    {column.items.map((subItem) => (
                                      <ListItem
                                        key={subItem.name}
                                        title={subItem.name}
                                        href={subItem.href}
                                        icon={subItem.icon}
                                        description={subItem.description}
                                        color={subItem.color}
                                      />
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Articles Mega Menu - 3 Columns */}
                          {item.type === "articles" && (
                            <div className="grid grid-cols-3 gap-4 p-6 w-[800px]">
                              {item.content.map((column, idx) => (
                                <div key={idx} className="space-y-3">
                                  <h3 className="text-sm font-semibold text-foreground/90 border-b pb-1">
                                    {column.category}
                                  </h3>
                                  <ul className="space-y-2">
                                    {column.items.map((subItem) => (
                                      <ListItem
                                        key={subItem.name}
                                        title={subItem.name}
                                        href={subItem.href}
                                        icon={subItem.icon}
                                        description={subItem.description}
                                        color={subItem.color}
                                      />
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Charts Mega Menu - Single Column Grid */}
                          {item.type === "charts" && (
                            <div className="p-6 w-[600px]">
                              {item.content.map((column, idx) => (
                                <div key={idx} className="space-y-3">
                                  <h3 className="text-sm font-semibold text-foreground/90 border-b pb-1">
                                    {column.category}
                                  </h3>
                                  <ul className="grid grid-cols-2 gap-2">
                                    {column.items.map((subItem) => (
                                      <ListItem
                                        key={subItem.name}
                                        title={subItem.name}
                                        href={subItem.href}
                                        icon={subItem.icon}
                                        description={subItem.description}
                                        color={subItem.color}
                                      />
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Zodiac Mega Menu */}
                          {item.type === "zodiac" && (
                            <div className="w-[800px] p-6">
                              <div className="grid grid-cols-4 gap-3 mb-6">
                                {item.content.featured.map((featured) => (
                                  <ListItem
                                    key={featured.name}
                                    title={featured.name}
                                    href={featured.href}
                                    icon={featured.icon}
                                    description={featured.description}
                                  />
                                ))}
                              </div>
                              <div className="border-t pt-4">
                                <h3 className="text-sm font-semibold text-foreground/90 mb-3">
                                  All Zodiac Signs
                                </h3>
                                <div className="grid grid-cols-4 gap-3">
                                  {item.content.signs.map((sign) => (
                                    <Link
                                      key={sign.name}
                                      href={sign.href}
                                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors group"
                                    >
                                      <sign.icon className="h-4 w-4 text-primary" />
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                          {sign.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {sign.element} • {sign.date}
                                        </span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Horoscope Mega Menu */}
                          {item.type === "horoscope" && (
                            <div className="w-[700px] p-6">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                {item.content.daily.map((daily) => (
                                  <ListItem
                                    key={daily.name}
                                    title={daily.name}
                                    href={daily.href}
                                    icon={daily.icon}
                                    description={daily.description}
                                  />
                                ))}
                              </div>
                              <div className="border-t pt-4">
                                <h3 className="text-sm font-semibold text-foreground/90 mb-3">
                                  Daily Horoscopes by Sign
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                  {item.content.signs.map((sign) => (
                                    <Link
                                      key={sign.name}
                                      href={sign.href}
                                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                                    >
                                      <sign.icon className="h-4 w-4 text-primary" />
                                      <span className="text-sm">
                                        {sign.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden sm:block">
              <LocaleSwitcher />
            </div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData?.profilePic || ""}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                        {deriveInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={homeHref}
                      className="flex items-center cursor-pointer"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={settingsHref}
                      className="flex items-center cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/register">
                  <Button size="default" className="cursor-pointer">
                    Register
                  </Button>
                </Link>

                <Link href="/login">
                  <Button size="default" className="cursor-pointer">
                    Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.label} className="space-y-2">
                    {item.hasDropdown ? (
                      <>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {item.label}
                        </div>
                        <div className="pl-4 space-y-3">
                          {/* Topics Mobile */}
                          {item.type === "topics" && (
                            <div className="space-y-4">
                              {item.content.map((column, idx) => (
                                <div key={idx}>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {column.category}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {column.items.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <subItem.icon
                                          className={cn(
                                            "h-4 w-4",
                                            subItem.color,
                                          )}
                                        />
                                        <span className="text-sm">
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Articles Mobile */}
                          {item.type === "articles" && (
                            <div className="space-y-4">
                              {item.content.map((column, idx) => (
                                <div key={idx}>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {column.category}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {column.items.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <subItem.icon
                                          className={cn(
                                            "h-4 w-4",
                                            subItem.color,
                                          )}
                                        />
                                        <span className="text-sm">
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Charts Mobile */}
                          {item.type === "charts" && (
                            <div className="space-y-4">
                              {item.content.map((column, idx) => (
                                <div key={idx}>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {column.category}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {column.items.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <subItem.icon
                                          className={cn(
                                            "h-4 w-4",
                                            subItem.color,
                                          )}
                                        />
                                        <span className="text-sm">
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Zodiac Mobile */}
                          {item.type === "zodiac" && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                {item.content.featured.map((featured) => (
                                  <Link
                                    key={featured.name}
                                    href={featured.href}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <featured.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm">
                                      {featured.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                              <div className="border-t pt-2">
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                  All Signs
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {item.content.signs.map((sign) => (
                                    <Link
                                      key={sign.name}
                                      href={sign.href}
                                      className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent text-center"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      <sign.icon className="h-4 w-4 text-primary" />
                                      <span className="text-xs">
                                        {sign.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Horoscope Mobile */}
                          {item.type === "horoscope" && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                {item.content.daily.map((daily) => (
                                  <Link
                                    key={daily.name}
                                    href={daily.href}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <daily.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm">
                                      {daily.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                              <div className="border-t pt-2">
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                  Daily by Sign
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {item.content.signs.map((sign) => (
                                    <Link
                                      key={sign.name}
                                      href={sign.href}
                                      className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent text-center"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      <sign.icon className="h-4 w-4 text-primary" />
                                      <span className="text-xs">
                                        {sign.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="pt-4 border-t border-border">
                <LocaleSwitcher />
              </div>

              {!isLoggedIn && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full cursor-pointer">Register</Button>
                  </Link>
                </div>
              )}

              {isLoggedIn && (
                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    href={homeHref}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href={settingsHref}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
