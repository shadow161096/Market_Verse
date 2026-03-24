"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";
import { HolographicText } from "@/components/ui/HolographicText";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/ecommerce/ProductGrid";
import { FEATURED_PRODUCTS } from "@/lib/mockData";
import { toast } from "react-hot-toast";
import { fadeUp, staggerContainer, staggerItem, heroTitle, heroSubtitle } from "@/lib/animations";
import { useStore } from "@/store";
import { IntroCutscene } from "@/components/layout/IntroCutscene";
import { LiveActivityTicker } from "@/components/ui/LiveActivityTicker";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";

// 3D background — client-only, no SSR (Three.js can't run on server)
const AnimatedBackground = dynamic(
  () =>
    import("@/components/3d/AnimatedBackground").then(
      (m) => m.AnimatedBackground
    ),
  { ssr: false }
);

const STATS = [
  { label: "Products", value: "50K+" },
  { label: "Happy Customers", value: "2.4M+" },
  { label: "Countries", value: "140+" },
  { label: "Satisfaction", value: "99.2%" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Delivery",
    desc: "Same-day and next-day delivery across 140 countries.",
    color: "text-[#00f5ff]",
    bg: "bg-[#00f5ff]/10 border-[#00f5ff]/20",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    desc: "Military-grade encryption and biometric authentication.",
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10 border-[#a855f7]/20",
  },
  {
    icon: Truck,
    title: "Free Returns",
    desc: "30-day no-question returns on every single order.",
    color: "text-[#f0abfc]",
    bg: "bg-[#f0abfc]/10 border-[#f0abfc]/20",
  },
  {
    icon: Star,
    title: "Verified Quality",
    desc: "Every product tested by our AI quality-assurance system.",
    color: "text-[#10b981]",
    bg: "bg-[#10b981]/10 border-[#10b981]/20",
  },
];

export default function HomePage() {
  const { hasSeenIntro, setHasSeenIntro } = useStore();
  const [showMain, setShowMain] = useState(hasSeenIntro);

  useEffect(() => {
    if (hasSeenIntro) {
      setShowMain(true);
    }
  }, [hasSeenIntro]);

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setShowMain(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnimatedBackground />
      <LiveActivityTicker />
      <AnimatePresence mode="wait">
        {!showMain ? (
          <IntroCutscene key="intro" onComplete={handleIntroComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* ─── Hero Section ────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Radial glow overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="flex flex-col items-center gap-6"
                >
                  <motion.div variants={staggerItem}>
                    <Badge variant="purple" className="text-xs">
                      <Zap className="w-3 h-3" />
                      Launching into the Future
                    </Badge>
                  </motion.div>

                  <motion.h1
                    variants={heroTitle}
                    className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tight"
                  >
                    The Universe
                    <br />
                    of{" "}
                    <HolographicText animate>Commerce</HolographicText>
                  </motion.h1>

                  <motion.p
                    variants={heroSubtitle}
                    className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed"
                  >
                    Immerse yourself in a new dimension of shopping. Discover
                    50,000+ futuristic products curated for tomorrow&apos;s
                    consumer.
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-4 mt-2"
                  >
                    <Link href="/products">
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Explore Products
                      </Button>
                    </Link>
                    <Button
                      variant="neon"
                      size="lg"
                      onClick={() => {
                        toast("Demo video player coming in next update!", {
                          icon: "🎬",
                          style: {
                            background: "rgba(15, 23, 42, 0.9)",
                            color: "#fff",
                            border: "1px solid rgba(0, 245, 255, 0.3)",
                          },
                        });
                      }}
                    >
                      Watch Demo
                    </Button>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div
                    variants={staggerItem}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full max-w-2xl"
                  >
                    {STATS.map((stat) => (
                      <GlassPanel
                        key={stat.label}
                        rounded="xl"
                        glow="purple"
                        className="p-4 text-center"
                      >
                        <div
                          className="text-2xl font-display font-black gradient-text"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, #e2e8f0 0%, #a855f7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {stat.label}
                        </div>
                      </GlassPanel>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Scroll hint */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
                <span className="text-xs text-slate-600 tracking-widest uppercase">
                  Scroll
                </span>
              </motion.div>
            </section>

            {/* ─── Features ───────────────────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-6 w-full">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="flex flex-col gap-12"
              >
                <motion.div variants={fadeUp} className="text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                    Built for the{" "}
                    <HolographicText
                      animate={false}
                      className="gradient-text"
                    >
                      Next Generation
                    </HolographicText>
                  </h2>
                  <p className="text-slate-500 mt-3 max-w-lg mx-auto">
                    We didn&apos;t just build a store. We built an experience.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <motion.div key={f.title} variants={staggerItem}>
                        <GlassPanel
                          rounded="2xl"
                          className="p-6 flex flex-col gap-4 h-full hover:border-white/15 transition-colors"
                        >
                          <div
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${f.bg}`}
                          >
                            <Icon className={`w-6 h-6 ${f.color}`} />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-white">
                              {f.title}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                              {f.desc}
                            </p>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            {/* ─── Featured Products ──────────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-6 w-full">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                className="flex flex-col gap-10"
              >
                <motion.div
                  variants={fadeUp}
                  className="flex items-end justify-between gap-4"
                >
                  <div>
                    <Badge variant="neon" className="mb-3">
                      Featured
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                      Handpicked{" "}
                      <span
                        className="gradient-text"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #a855f7 0%, #00f5ff 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Favorites
                      </span>
                    </h2>
                  </div>
                  <Link href="/products">
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      View All
                    </Button>
                  </Link>
                </motion.div>

                <ProductGrid products={FEATURED_PRODUCTS} columns={4} />
              </motion.div>
            </section>

            {/* ─── Client Testimonials ────────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-6 w-full">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                className="flex flex-col gap-10"
              >
                <TestimonialCarousel />
              </motion.div>
            </section>

            {/* ─── CTA Banner ─────────────────────────────────────────────────────── */}
            <section className="py-16 px-6 max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <GlassPanel
                  rounded="3xl"
                  glow="cyan"
                  className="relative overflow-hidden px-10 py-16 text-center"
                  style={
                    {
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(0,245,255,0.08) 100%)",
                    } as React.CSSProperties
                  }
                >
                  {/* Decorative blob */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full blur-[80px] pointer-events-none"
                    style={{ background: "rgba(168,85,247,0.2)" }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <Badge variant="neon">Limited Time</Badge>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
                      Get 20% Off Your
                      <br />
                      <HolographicText animate>First Order</HolographicText>
                    </h2>
                    <p className="text-slate-400 max-w-md">
                      Join 2.4 million customers in the next generation of
                      commerce. Use{" "}
                      <code className="text-[#00f5ff] font-mono text-sm">
                        VERSE20
                      </code>{" "}
                      at checkout.
                    </p>
                    <Link href="/products">
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </GlassPanel>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

