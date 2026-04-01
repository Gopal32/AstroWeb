"use client";

import { Card, CardContent } from "@/components/ui/card";

/* =========================
   ✨ MODERN SHIMMER
========================= */
const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:skew-x-[-20deg]";

/* =========================
   🧱 BASE SKELETON
========================= */
function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-muted/70 dark:bg-muted/40
        backdrop-blur-sm
        skeleton-shimmer
        ${className}
      `}
    />
  );
}

/* =========================
   🔮 ASTROLOGER CARD
========================= */
export function AstrologerSkeleton() {
  return (
    <Card className="rounded-2xl overflow-hidden border border-border/50">
      <Skeleton className="h-[190px] w-full" />

      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />

        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================
   📰 BLOG CARD
========================= */
export function BlogSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50">
      <Skeleton className="h-48 w-full" />

      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
    </div>
  );
}

/* =========================
   ♈ ZODIAC CARD
========================= */
export function ZodiacSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[120px] w-full rounded-2xl" />
      <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
    </div>
  );
}

/* =========================
   📂 CATEGORY CARD
========================= */
export function CategorySkeleton() {
  return (
    <div className="text-center space-y-2">
      <Skeleton className="h-[120px] rounded-2xl" />
      <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
    </div>
  );
}

/* =========================
   📅 SCHEDULE CARD
========================= */
export function ScheduleSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[180px] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
    </div>
  );
}

/* =========================
   💬 TESTIMONIAL
========================= */
export function TestimonialSkeleton() {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-5 space-y-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-sm" />
          ))}
        </div>

        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />

        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="space-y-1">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================
   🔥 MODERN ROW SKELETON
========================= */
export function HomeSkeleton({ count = 6, CardComponent }) {
  return (
    <div className="relative">
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-5 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="min-w-[260px] sm:min-w-[280px] lg:min-w-[300px] flex-shrink-0"
          >
            <CardComponent />
          </div>
        ))}
      </div>
    </div>
  );
}