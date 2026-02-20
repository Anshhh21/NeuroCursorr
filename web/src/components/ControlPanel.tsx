"use client";

import { useState , useEffect } from "react";
import { startEngine , stopEngine, getEngineStatus } from "@/lib/engineApi";

type EngineStatus = "unknown" | "connected" | "disconnected";

export default function ControlPanel() {
    const [engineStatus, setEngineStatus] = useState<EngineStatus>("unknown");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // check on mount ==> enigne status

    useEffect(() => {
        const checkStatus = async () => {
        setLoading(true);
        const result = await getEngineStatus();
    
        if (result.success) {
            setEngineStatus(result.engineStatus);
        } else {
            setError(result.message);
        }
    
        setLoading(false);
        };
    
        checkStatus();
    }, []);
    
    const handleStart = async () => {
        setLoading(true);
        setError(null);
    
        const result = await startEngine();
    
        if (result.success) {
        setEngineStatus("connected");
        } else {
        setError(result.message);
        }
    
        setLoading(false);
    };
    
    const handleStop = async () => {
        setLoading(true);
        setError(null);
    
        const result = await stopEngine();
    
        if (result.success) {
        setEngineStatus("disconnected");
        } else {
        setError(result.message);
        }
    
        setLoading(false);
    };


    return (
        <div className="w-full max-w-md p-8 bg-neutral-900 rounded-2xl shadow-2xl space-y-8 border border-neutral-800">
    
        {/* Title */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
            NeuroCursor
            </h1>
            <p className="text-neutral-400 text-sm">
            AI Gesture Control Engine
            </p>
        </div>
    
        {/* Status */}
        <div className="space-y-2">
            <h2 className="text-sm uppercase text-neutral-500 tracking-wider">
            Engine Status
            </h2>
    
            <div className="text-lg font-medium">
            {engineStatus === "unknown" && (
                <span className="text-yellow-400">Checking...</span>
            )}
            {engineStatus === "connected" && (
                <span className="text-green-400">🟢 Connected</span>
            )}
            {engineStatus === "disconnected" && (
                <span className="text-red-400">🔴 Disconnected</span>
            )}
            </div>
        </div>
    
        {/* Error */}
        {error && (
            <div className="text-red-500 text-sm bg-red-950 p-3 rounded-lg border border-red-800">
            {error}
            </div>
        )}
    
        {/* Buttons */}
        <div className="flex gap-4">
            <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition disabled:opacity-50 font-medium"
            >
            {loading && engineStatus !== "connected"
                ? "Starting..."
                : "Start Engine"}
            </button>
    
            <button
            onClick={handleStop}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition disabled:opacity-50 font-medium"
            >
            {loading && engineStatus === "connected"
                ? "Stopping..."
                : "Stop Engine"}
            </button>
        </div>
    
        {/* Gesture Guide */}
        <div className="pt-6 border-t border-neutral-800 space-y-2 text-sm text-neutral-400">
            <h3 className="text-neutral-500 uppercase tracking-wider text-xs">
            Gesture Guide
            </h3>
            <ul className="space-y-1">
            <li>☝️ Index Finger → Move Cursor</li>
            <li>👌 Pinch → Click</li>
            <li>✋ Open Palm → Pause / Resume</li>
            </ul>
        </div>
    
        </div>
    );
}