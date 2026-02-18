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
    <div className="p-6 bg-neutral-900 rounded-xl space-y-6">
    <div>
        <h2 className="text-xl font-semibold mb-2">Engine Status</h2>
        <div className="text-lg">
        {engineStatus === "unknown" && "Checking..."}
        {engineStatus === "connected" && "🟢 Connected"}
        {engineStatus === "disconnected" && "🔴 Disconnected"}
        </div>
    </div>

    {error && (
        <div className="text-red-500 text-sm">
        {error}
        </div>
    )}

    <div className="flex gap-4">
        <button
        onClick={handleStart}
        disabled={loading}
        className="px-4 py-2 bg-green-600 rounded-lg disabled:opacity-50"
        >
        Start Engine
        </button>

        <button
        onClick={handleStop}
        disabled={loading}
        className="px-4 py-2 bg-red-600 rounded-lg disabled:opacity-50"
        >
        Stop Engine
        </button>
    </div>
    </div>
);
}