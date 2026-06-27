"use client";

import { useState, Suspense, lazy } from "react";
import {
  type LucideIcon,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardCheck,
  Coins,
  Crown,
  Dumbbell,
  Flame,
  Flag,
  Gamepad2,
  Gift,
  GraduationCap,
  Home,
  Layers,
  MapPin,
  Monitor,
  Network,
  Ruler,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Module card icon map (module-level icons are not gated by iconRegistry,
// which only validates tools.cards). Keeps each card grid visually distinct.
const MODULE_ICONS: Record<string, LucideIcon> = {
  Calendar,
  CalendarClock,
  Rocket,
  Gamepad2,
  Monitor,
  SlidersHorizontal,
  Target,
  Dumbbell,
  Ruler,
  Brain,
  GraduationCap,
  Award,
  Crown,
  Layers,
  Gift,
  Wrench,
  Coins,
  Sparkles,
  Trophy,
  BarChart3,
  ClipboardCheck,
  Users,
  Home,
  MapPin,
  Network,
  Flag,
};

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.easportscollegefootball27.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "College Football 27 Wiki",
        description:
          "Complete College Football 27 Wiki covering player ratings, team ratings, Dynasty, Road to Glory, Mascot Mashup, Team Builder, release dates, platforms, and PC setup guides.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "EA Sports College Football 27 - Modern College Football Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "College Football 27 Wiki",
        alternateName: "CFB 27 Wiki",
        url: siteUrl,
        description:
          "Complete College Football 27 Wiki resource hub for player ratings, team ratings, Dynasty, Road to Glory, Mascot Mashup, Team Builder, and release information",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "College Football 27 Wiki - EA Sports College Football 27",
        },
        sameAs: [
          "https://linktr.ee/easportscollege",
          "https://forums.ea.com/",
          "https://www.reddit.com/r/NCAAFBseries/",
          "https://www.youtube.com/@easportscollege",
        ],
      },
      {
        "@type": "VideoGame",
        name: "EA Sports College Football 27",
        gamePlatform: ["PlayStation 5", "Xbox Series X|S", "PC"],
        applicationCategory: "Game",
        genre: ["Sports", "American Football", "Simulation"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 2,
        },
        datePublished: "2026-07-09",
        publisher: {
          "@type": "Organization",
          name: "EA Sports",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://www.ea.com/games/college-football/college-football-27",
        },
      },
      {
        "@type": "VideoObject",
        name: "College Football 27 | Official Reveal Trailer | EA SPORTS",
        description:
          "Official EA Sports College Football 27 reveal trailer showcasing gameplay, presentation, and new features.",
        uploadDate: "2026-06-18",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/a-JpwwMa5aM",
        url: "https://www.youtube.com/watch?v=a-JpwwMa5aM",
      },
    ],
  };

  // Module accordion state (gameplay controls + online details)
  const [gameplayExpanded, setGameplayExpanded] = useState<number | null>(null);
  const [onlineExpanded, setOnlineExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid cards → module section anchors (1:1 with the 8 modules below)
  const toolsSectionIds = [
    "release-date-early-access",
    "editions-pre-order",
    "team-ratings",
    "dynasty-team-builder",
    "road-to-glory",
    "ultimate-team",
    "gameplay-controls",
    "online-modes",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://www.ea.com/ea-sports-college-football/ratings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Star className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.ea.com/games/college-football/college-football-27"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，桌面端 max-w-5xl 避免挤压广告展示空间 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="a-JpwwMa5aM"
              title="College Football 27 | Official Reveal Trailer | EA SPORTS"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区（视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolsSectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date, Early Access, and Platforms (info-cards) */}
      <section
        id="release-date-early-access"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Rocket className="w-4 h-4" />
              {t.modules.cfb27ReleaseDateEarlyAccess.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27ReleaseDateEarlyAccess.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27ReleaseDateEarlyAccess.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal">
            {t.modules.cfb27ReleaseDateEarlyAccess.items.map(
              (item: any, index: number) => {
                const Icon = MODULE_ICONS[item.icon] ?? Sparkles;
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                      {item.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Editions and Pre-Order Bonuses (comparison-table) */}
      <section
        id="editions-pre-order"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Tag className="w-4 h-4" />
              {t.modules.cfb27EditionsPreOrder.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27EditionsPreOrder.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27EditionsPreOrder.intro}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border scroll-reveal">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  {t.modules.cfb27EditionsPreOrder.tableHeaders.map(
                    (h: string, i: number) => (
                      <th key={i} className="p-3 md:p-4 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.cfb27EditionsPreOrder.rows.map(
                  (row: any, index: number) => (
                    <tr key={index} className="border-t border-border align-top">
                      <td className="p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                        {row.edition}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">{row.price}</td>
                      <td className="p-3 md:p-4 whitespace-nowrap">{row.access}</td>
                      <td className="p-3 md:p-4 text-muted-foreground">
                        {row.highlights}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground scroll-reveal">
            {t.modules.cfb27EditionsPreOrder.bestForNote}
          </p>
        </div>
      </section>

      {/* Module 3: Team Ratings and Best Teams (rating-table) */}
      <section id="team-ratings" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <TrendingUp className="w-4 h-4" />
              {t.modules.cfb27TeamRatings.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27TeamRatings.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27TeamRatings.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-reveal">
            {/* Top Team Ratings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-base md:text-lg">
                  Official Top Team Ratings
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                      {t.modules.cfb27TeamRatings.ratingHeaders.map(
                        (h: string, i: number) => (
                          <th key={i} className="p-2 md:p-3 font-semibold">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {t.modules.cfb27TeamRatings.topTeams.map(
                      (team: any, index: number) => (
                        <tr key={index} className="border-t border-border">
                          <td className="p-2 md:p-3 font-medium">{team.team}</td>
                          <td className="p-2 md:p-3 text-muted-foreground">{team.off}</td>
                          <td className="p-2 md:p-3 text-muted-foreground">{team.def}</td>
                          <td className="p-2 md:p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                            {team.ovr}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hardest Places to Play */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-base md:text-lg">
                  Hardest Places to Play
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                      {t.modules.cfb27TeamRatings.stadiumHeaders.map(
                        (h: string, i: number) => (
                          <th key={i} className="p-2 md:p-3 font-semibold">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {t.modules.cfb27TeamRatings.hardestStadiums.map(
                      (s: any, index: number) => (
                        <tr key={index} className="border-t border-border">
                          <td className="p-2 md:p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                            {s.rank}
                          </td>
                          <td className="p-2 md:p-3">{s.stadium}</td>
                          <td className="p-2 md:p-3 text-muted-foreground">{s.team}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground scroll-reveal">
            {t.modules.cfb27TeamRatings.stadiumNote}
          </p>
        </div>
      </section>

      {/* Module 4: Dynasty and Team Builder Guide (step-by-step) */}
      <section
        id="dynasty-team-builder"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Award className="w-4 h-4" />
              {t.modules.cfb27DynastyTeamBuilder.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27DynastyTeamBuilder.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27DynastyTeamBuilder.intro}
            </p>
          </div>

          <div className="space-y-3 md:space-y-4 scroll-reveal">
            {t.modules.cfb27DynastyTeamBuilder.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-lg md:text-xl font-bold">{step.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {step.focus}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <ul className="space-y-1.5">
                      {step.keyPoints.map((kp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Road to Glory Builds and Positions (build-cards) */}
      <section id="road-to-glory" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Target className="w-4 h-4" />
              {t.modules.cfb27RoadToGlory.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27RoadToGlory.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27RoadToGlory.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-reveal">
            {t.modules.cfb27RoadToGlory.builds.map((build: any, index: number) => {
              const Icon = MODULE_ICONS[build.icon] ?? Target;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                      {build.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{build.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{build.summary}</p>
                  <ul className="space-y-1.5">
                    {build.keyDetails.map((kd: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{kd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 6: Ultimate Team Rewards and Starter Guide (reward-cards) */}
      <section
        id="ultimate-team"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Crown className="w-4 h-4" />
              {t.modules.cfb27UltimateTeam.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27UltimateTeam.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27UltimateTeam.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal">
            {t.modules.cfb27UltimateTeam.rewards.map((reward: any, index: number) => {
              const Icon = MODULE_ICONS[reward.icon] ?? Crown;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                      {reward.badge}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{reward.title}</h3>
                  <ul className="space-y-1.5 mb-3">
                    {reward.rewardDetails.map((rd: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{rd}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto text-xs text-muted-foreground italic">
                    {reward.starterUse}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Gameplay Controls and Playbooks (accordion) */}
      <section id="gameplay-controls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Gamepad2 className="w-4 h-4" />
              {t.modules.cfb27GameplayControls.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27GameplayControls.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27GameplayControls.intro}
            </p>
          </div>

          <div className="space-y-2 scroll-reveal">
            {t.modules.cfb27GameplayControls.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setGameplayExpanded(gameplayExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${gameplayExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {gameplayExpanded === index && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <p className="text-muted-foreground text-sm mb-3">
                      {item.summary}
                    </p>
                    <ul className="space-y-1.5">
                      {item.details.map((d: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Online Modes, Road to CFP, and Crossplay (card-list) */}
      <section
        id="online-modes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              <Network className="w-4 h-4" />
              {t.modules.cfb27OnlineModes.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.cfb27OnlineModes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.cfb27OnlineModes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal">
            {t.modules.cfb27OnlineModes.cards.map((card: any, index: number) => {
              const Icon = MODULE_ICONS[card.icon] ?? Network;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                      {card.category}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  <button
                    onClick={() =>
                      setOnlineExpanded(onlineExpanded === index ? null : index)
                    }
                    className="self-start text-xs font-medium text-[hsl(var(--nav-theme-light))] hover:underline mb-2"
                  >
                    {onlineExpanded === index ? "Hide details" : "Show details"}
                  </button>
                  {onlineExpanded === index && (
                    <ul className="space-y-1.5">
                      {card.keyDetails.map((kd: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{kd}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://linktr.ee/easportscollege"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.linktree}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/NCAAFBseries/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@easportscollege"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://forums.ea.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.forums}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
