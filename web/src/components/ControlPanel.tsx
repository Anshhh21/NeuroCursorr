"use client";

import { useState, useEffect } from "react";
import { startEngine, stopEngine, getEngineStatus } from "@/lib/engineApi";
import BlurText from "@/components/BlurText";
import Dither from "@/components/Dither";
import Link from "next/link";

type EngineStatus = "unknown" | "connected" | "disconnected";

export default function ControlPanel() {
    const [engineStatus, setEngineStatus] = useState<EngineStatus>("unknown");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            setLoading(true);
            const result = await getEngineStatus();
            if (result.success) setEngineStatus(result.engineStatus);
            else setError(result.message);
            setLoading(false);
        };
        checkStatus();
    }, []);

    const handleStart = async () => {
        setLoading(true);
        setError(null);
        const result = await startEngine();
        if (result.success) setEngineStatus("connected");
        else setError(result.message);
        setLoading(false);
    };

    const handleStop = async () => {
        setLoading(true);
        setError(null);
        const result = await stopEngine();
        if (result.success) setEngineStatus("disconnected");
        else setError(result.message);
        setLoading(false);
    };

    return (
        <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6 overflow-hidden">
            
            {/* 1. DITHER BACKGROUND - Fixed to Viewport */}
            <div className="fixed inset-0 z-0 h-screen w-screen opacity-40">
                <Dither
                    waveColor={[0.5, 0.5, 0.5]}
                    disableAnimation={false}
                    enableMouseInteraction={true}
                    mouseRadius={0.3}
                    colorNum={4}
                    waveAmplitude={0.3}
                    waveFrequency={10}
                    waveSpeed={0.05}
                />
            </div>

            {/* 2. DASHBOARD CONTENT - Perfectly Centered Container */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                
                {/* Heading (Pointer-events-none to let Dither work) */}
                <div className="text-center mb-10 pointer-events-none">
                    <BlurText
                        text="Control Center"
                        delay={100}
                        animateBy="letters"
                        direction="top"
                        className="text-5xl font-bold tracking-tighter text-white"
                    />
                    <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">
                        Neural Link: Active
                    </p>
                </div>

                {/* The Dashboard Card */}
                <div className="relative w-full">
                    {/* Subtle Glow */}
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
                    
                    <div className="relative p-8 bg-neutral-900/60 backdrop-blur-2xl rounded-3xl border border-neutral-800 space-y-8 shadow-2xl">
                        
                        {/* Status Monitor */}
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-neutral-800">
                            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Status</span>
                            <div className="font-mono text-sm font-bold">
                                {engineStatus === "unknown" && <span className="text-yellow-500 animate-pulse">INIT...</span>}
                                {engineStatus === "connected" && <span className="text-green-400">ONLINE</span>}
                                {engineStatus === "disconnected" && <span className="text-red-500">OFFLINE</span>}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-[10px] bg-red-950/20 p-3 rounded-xl border border-red-900/30 font-mono">
                                [SYS_ERR]: {error}
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleStart}
                                disabled={loading || engineStatus === "connected"}
                                className="w-full py-4 rounded-full bg-green-600 hover:bg-green-500 transition-all disabled:opacity-20 font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(22,163,74,0.1)] active:scale-95"
                            >
                                {loading && engineStatus !== "connected" ? "Syncing..." : "Start Engine"}
                            </button>

                            <button
                                onClick={handleStop}
                                disabled={loading || engineStatus === "disconnected"}
                                className="w-full py-4 rounded-full border border-neutral-800 hover:bg-red-900/40 hover:border-red-800 transition-all disabled:opacity-20 font-bold text-xs tracking-[0.2em] uppercase active:scale-95"
                            >
                                {loading && engineStatus === "connected" ? "Halt..." : "Stop Engine"}
                            </button>
                        </div>

                        {/* Gesture Legend */}
                        <div className="pt-6 border-t border-neutral-800 grid grid-cols-3 gap-2">
                            <LegendItem icon="☝️" label="Point" />
                            <LegendItem icon="👌" label="Pinch" />
                            <LegendItem icon="✋" label="Palm" />
                        </div>
                    </div>
                </div>

                {/* Navigation Back */}
                <Link 
                    href="/" 
                    className="mt-12 text-neutral-600 hover:text-white text-[10px] font-mono uppercase tracking-[0.3em] transition-all"
                >
                    [ ESC ] Return to Home
                </Link>
            </div>
        </main>
    );
}

function LegendItem({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-lg">{icon}</span>
            <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">{label}</span>
        </div>
    );
}