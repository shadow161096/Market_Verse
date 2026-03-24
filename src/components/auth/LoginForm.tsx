"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Fingerprint, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useStore } from "@/store";

interface LoginFormProps {
    loginState: "idle" | "loading" | "success" | "error";
    setLoginState: (state: "idle" | "loading" | "success" | "error") => void;
    onSuccess: () => void;
}

export function LoginForm({ loginState, setLoginState, onSuccess }: LoginFormProps) {
    const { setAuth } = useStore();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Client Validation
        if (isRegister) {
            if (!formData.username || !formData.email || !formData.password) {
                setLoginState("error");
                setErrorMsg("MISSING_REQUIRED_FIELDS");
                return;
            }
        } else {
            if (!formData.email || !formData.password) {
                setLoginState("error");
                setErrorMsg("MISSING_CREDENTIALS");
                return;
            }
        }

        setLoginState("loading");
        setErrorMsg("");

        try {
            const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
            const payload = isRegister ? {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            } : {
                email: formData.email,
                password: formData.password
            };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                const code = res.status === 401 ? "AUTH_INVALID_CREDENTIALS" :
                    res.status === 409 ? "AUTH_IDENTITY_CONFLICT" : 
                    res.status === 429 ? "AUTH_RATE_LIMITED" : "ERR_SYSTEM_FAILURE";
                throw new Error(data.message || code);
            }

            // Fetch user profile after success
            const meRes = await fetch("/api/auth/me");
            if (meRes.ok) {
                const userData = await meRes.json();
                setAuth(userData);
            }

            setLoginState("success");
            setTimeout(onSuccess, 1200);

        } catch (error: any) {
            setLoginState("error");
            setErrorMsg(error.message.toUpperCase().replace(/\s+/g, '_'));

            setTimeout(() => {
                setLoginState("idle");
            }, 4000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md relative z-10"
        >
            {/* Glowing Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-500/30 rounded-2xl blur-xl opacity-20 pointer-events-none" />

            <div className="relative bg-[#020617]/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                {/* Cyber Scanner Line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-80 blur-[1px] 
                    ${loginState === 'loading' ? 'animate-[scan_0.8s_ease-in-out_infinite]' : 'animate-[scan_3s_ease-in-out_infinite]'}`}
                />

                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                        <Fingerprint className="w-8 h-8 text-purple-400" />
                    </div>
                </div>

                <h1 className="text-2xl font-display font-bold text-center text-white mb-2 uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                    System Access
                </h1>
                <p className="text-center text-slate-500 text-xs mb-8 font-mono uppercase tracking-widest">
                    {isRegister ? "Initialize new operative identity" : "Authenticate to enter MarketVerse"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        {isRegister && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-focus-within:via-cyan-500/50 transition-all duration-500" />
                            </div>
                        )}

                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-focus-within:via-cyan-500/50 transition-all duration-500" />
                        </div>

                        {isRegister && (
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="First Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all font-mono text-sm"
                                />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Last Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all font-mono text-sm"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Passcode Override"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm tracking-widest"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-focus-within:via-purple-500/50 transition-all duration-500" />
                        </div>
                    </div>

                    <AnimatePresence>
                        {loginState === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-red-400 text-[10px] font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                            >
                                <AlertCircle className="w-3 h-3" />
                                <span>CRITICAL_ERROR: {errorMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loginState === "loading" || loginState === "success"}
                        className={`w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-lg font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-500
                            ${loginState === "loading" ? "bg-purple-600/80 text-white cursor-wait" :
                                loginState === "success" ? "bg-emerald-500 text-white" :
                                    "bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] active:scale-[0.98]"}`}
                    >
                        {loginState === "loading" ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Authenticating</span>
                            </>
                        ) : loginState === "success" ? (
                            <>
                                <Shield className="w-4 h-4" />
                                <span>Authorization Granted</span>
                            </>
                        ) : (
                            <>
                                <span>{isRegister ? "Initialize Identity" : "Establish Link"}</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setErrorMsg("");
                        }}
                        className="text-[10px] text-slate-600 hover:text-cyan-400 font-mono uppercase tracking-[0.2em] transition-colors"
                    >
                        {isRegister ? "Already authenticated? Return to Login" : "First mission? Request Clearance"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
