import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinished }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4200);
    const doneTimer = setTimeout(onFinished, 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)',
      }}
    >
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl animate-pulse" />
        <svg className="relative w-24 h-24 text-white drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
          <path d="M3 10h18" strokeWidth="1.5" />
          <path d="M8 2v4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 2v4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 14h2v2H7z" fill="currentColor" strokeWidth="0" />
          <path d="M11 14h2v2h-2z" fill="currentColor" strokeWidth="0" />
          <path d="M15 14h2v2h-2z" fill="currentColor" strokeWidth="0" />
          <path d="M7 18h2" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 18h2" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-white tracking-tight mb-3 splash-title">
        Weekly Tracker
      </h1>
      <p className="text-indigo-200 text-lg font-light mb-10 splash-subtitle">
        Track your work. Celebrate your wins.
      </p>

      <div className="flex items-center gap-3 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <div className="absolute bottom-10 text-indigo-300/60 text-xs font-medium tracking-widest uppercase">
        v1.0
      </div>
    </div>
  );
}
