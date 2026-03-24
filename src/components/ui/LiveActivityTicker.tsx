"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, UserPlus, Star } from "lucide-react";

type Activity = {
  id: string;
  type: "purchase" | "signup" | "review";
  message: string;
  time: string;
  icon: any;
  color: string;
};

const ACTIVITIES = [
  { type: "purchase", message: "Sarah from Tokyo just purchased Cyberdeck V4", icon: Package, color: "text-[#00f5ff]" },
  { type: "signup", message: "New Agent joined from Neo-Berlin", icon: UserPlus, color: "text-[#a855f7]" },
  { type: "review", message: "Marcus left a 5-star review on Neural Link", icon: Star, color: "text-[#10b981]" },
  { type: "purchase", message: "Alex from New York bought Hoverboard X", icon: Package, color: "text-[#00f5ff]" },
  { type: "purchase", message: "Priya from Mumbai purchased Quantum Core", icon: Package, color: "text-[#00f5ff]" },
  { type: "signup", message: "New Agent joined from Seoul", icon: UserPlus, color: "text-[#a855f7]" },
  { type: "review", message: "Elena left a 5-star review on Plasma Caster", icon: Star, color: "text-[#10b981]" },
];

export function LiveActivityTicker() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const showRandomActivity = () => {
      const template = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      const id = Math.random().toString(36).substr(2, 9);
      
      setCurrentActivity({
        id,
        ...template,
        time: "Just now",
      } as Activity);

      // Hide after 4 seconds
      setTimeout(() => {
        setCurrentActivity(null);
      }, 4000);

      // Schedule next one between 8 to 15 seconds
      const nextDelay = Math.random() * 7000 + 8000;
      timeout = setTimeout(showRandomActivity, nextDelay);
    };

    // Start first activity after 3 seconds
    timeout = setTimeout(showRandomActivity, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm pointer-events-auto"
            style={{
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${currentActivity.color}`}>
              <currentActivity.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white shadow-black drop-shadow-md">
                {currentActivity.message}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                <span>{currentActivity.time}</span>
                <span className="mx-1">•</span>
                <span className="text-[#00f5ff] font-mono text-[10px]">VERIFIED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
