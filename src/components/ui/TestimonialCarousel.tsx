"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex Vance",
    role: "Verified Buyer",
    content: "The Cyberdeck V4 I bought here is absolutely mind-blowing. The latency is practically non-existent. MarketVerse is the only place I trust for grade-A tech.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "Pro Gamer",
    content: "I've been searching for a reliable source of neural implants to boost my reaction times. Placed the order, arrived next day. Perfect condition.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Jin Sato",
    role: "Collector",
    content: "The packaging alone is worth the price. This platform perfectly bridges the gap between digital and physical commerce. Highly recommended.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=60",
  },
  {
    id: 4,
    name: "Mia Al-Fayed",
    role: "Corporate Exec",
    content: "Security is my top priority. MarketVerse's military-grade encryption during checkout gives me the peace of mind I need when making high-value purchases.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      <div className="flex flex-col items-center mb-10 text-center">
        <Badge variant="neon" className="mb-3">Client Reviews</Badge>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          Trusted by <span className="text-[#00f5ff]">Millions</span>
        </h2>
      </div>

      <div className="relative h-[250px] sm:h-[200px] w-full mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <GlassPanel rounded="2xl" className="p-8 h-full flex flex-col justify-between">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
              <div className="flex gap-1 mb-4">
                {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-slate-300 italic mb-6 leading-relaxed">
                "{TESTIMONIALS[currentIndex].content}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={TESTIMONIALS[currentIndex].avatar} 
                  alt={TESTIMONIALS[currentIndex].name} 
                  className="w-12 h-12 rounded-full border border-white/20"
                />
                <div>
                  <h4 className="font-semibold text-white">{TESTIMONIALS[currentIndex].name}</h4>
                  <p className="text-sm text-slate-400">{TESTIMONIALS[currentIndex].role}</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={prev}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={next}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
