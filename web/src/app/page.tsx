"use client";

import Link from "next/link";
import BlurText from "@/components/BlurText";
import TiltedCard from "@/components/TiltedCard";
import Dither from "@/components/Dither";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6 overflow-x-hidden">

      {/* 1. DITHER BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-50">
        <Dither
          waveColor={[0.5, 0.5, 0.5]} 
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.4}
          colorNum={6}            
          waveAmplitude={0.4}
          waveFrequency={12}      
          waveSpeed={0.03}
        />
      </div>

      {/* 2. HERO CONTENT 
          Added 'pointer-events-none' so mouse moves pass through to the Dither background.
      */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl w-full flex flex-col items-center pt-16 pointer-events-none">
        <div className="flex flex-col items-center">
          <BlurText
            text="NeuroCursor"
            delay={150}
            animateBy="letters"
            direction="top"
            className="text-7xl md:text-9xl font-bold tracking-tighter text-center text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]" 
          />
          
          <BlurText
            text="Control your computer using real-time AI hand gestures."
            delay={400}
            animateBy="words"
            direction="top"
            className="text-lg md:text-xl text-neutral-300 text-center max-w-xl mx-auto mt-4"
          />
        </div>

        <p className="text-neutral-500 text-xs font-mono uppercase tracking-[0.4em] animate-pulse">
          Move • Click • Pause
        </p>
      </div>

      {/* 3. TILTED CARDS SECTION 
          Wrapper is 'pointer-events-none', but the cards are 'pointer-events-auto' so you can click them.
      */}
      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl w-full place-items-center pointer-events-none">
        
        {/* Dashboard Card */}
        <div className="flex flex-col items-center space-y-8 group pointer-events-auto">
          <Link href="/dashboard" className="relative block">
            <div className="absolute -inset-2 bg-green-500/10 rounded-2xl blur-xl group-hover:bg-green-500/30 transition-all duration-500"></div>
            
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" 
              altText="AI Dashboard Interface"
              captionText="Neuro Systems"
              containerHeight="320px"
              containerWidth="320px"
              imageHeight="320px"
              imageWidth="320px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="px-6 py-2 bg-green-600 text-white rounded-full font-bold text-sm shadow-2xl">
                  LAUNCH DASHBOARD
                </p>
              }
            />
          </Link>
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight">System Core</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">Neural Node: Online</p>
          </div>
        </div>

        {/* Demo Card */}
        <div className="flex flex-col items-center space-y-8 group pointer-events-auto">
          <a href="#demo" className="relative block">
            <div className="absolute -inset-2 bg-blue-500/10 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
            
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
              altText="Hand Tracking Demo"
              captionText="Gesture Recognition"
              containerHeight="320px"
              containerWidth="320px"
              imageHeight="320px"
              imageWidth="320px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm shadow-2xl">
                  VIEW DEMO
                </p>
              }
            />
          </a>
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight">Live Preview</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">Accuracy: 99.4%</p>
          </div>
        </div>

      </div>

      {/* 4. FOOTER SPECS */}
      <div className="relative z-10 mt-32 mb-16 flex items-center justify-center gap-12 text-neutral-500 pointer-events-none">
         <div className="flex flex-col items-center gap-1">
            <span className="text-white font-bold text-lg">4K</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Resolution</span>
         </div>
         <div className="h-8 w-[1px] bg-neutral-800"></div>
         <div className="flex flex-col items-center gap-1">
            <span className="text-white font-bold text-lg">60FPS</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Real-time</span>
         </div>
         <div className="h-8 w-[1px] bg-neutral-800"></div>
         <div className="flex flex-col items-center gap-1">
            <span className="text-white font-bold text-lg">AI</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">MediaPipe</span>
         </div>
      </div>
    </main>
  );
}