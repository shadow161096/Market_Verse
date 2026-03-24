import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <GlassPanel rounded="2xl" glow="purple" className="p-12 flex flex-col items-center gap-6 text-center max-w-md w-full">
                <span
                    className="text-7xl font-black font-display"
                    style={{
                        backgroundImage: "linear-gradient(135deg, #a855f7 0%, #00f5ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    404
                </span>
                <div>
                    <h1 className="text-xl font-display font-bold text-white">Page Not Found</h1>
                    <p className="text-slate-400 text-sm mt-2">
                        This dimension doesn&apos;t exist in the MarketVerse.
                    </p>
                </div>
                <Link href="/">
                    <Button variant="primary">Return to Home</Button>
                </Link>
            </GlassPanel>
        </div>
    );
}
