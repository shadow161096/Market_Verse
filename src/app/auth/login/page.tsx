"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthScene } from "@/components/3d/auth/AuthScene";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    const router = useRouter();
    // Share state between UI form and 3D background
    const [loginState, setLoginState] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSuccess = () => {
        // Form triggered success. 
        // 3D scene handles hyperdrive. Wait 2 seconds for dramatic portal transition before redirect.
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* The 3D Environment Wrapper */}
            <AuthScene loginState={loginState} />

            {/* The Overlay HUD Details */}
            <div className="absolute top-6 left-6 text-slate-500 font-mono text-xs hidden md:block opacity-60 pointer-events-none">
                <p>MARKETVERSE_OS v2.4.1</p>
                <p>STATUS: {loginState === 'loading' ? 'AUTHENTICATING...' : loginState === 'success' ? 'AUTHORIZED' : 'ONLINE'}</p>
                <p className={`mt-2 transition-colors duration-500 ${loginState === 'error' ? 'text-red-500' : loginState === 'success' ? 'text-emerald-500' : 'text-[#00f5ff]'}`}>
                    {loginState === 'error' ? 'CRITICAL_SECURITY_REJECTION' : 'SECURE_CONNECTION_ESTABLISHED'}
                </p>
            </div>

            {/* Main Form Component */}
            <LoginForm
                loginState={loginState}
                setLoginState={setLoginState}
                onSuccess={handleSuccess}
            />

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-10px); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(400px); opacity: 0; }
                }
            `}</style>
        </main>
    );
}
