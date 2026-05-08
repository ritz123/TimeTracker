import React, { useState, useEffect } from 'react';
import { APP_NAME, APP_VERSION, APP_TAGLINE } from '../utils/appInfo';

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
        backgroundImage: 'var(--gradient-loading)',
      }}
    >
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl animate-pulse" />
        <svg className="relative w-24 h-24 text-white drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
          <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-white tracking-tight mb-3 splash-title">
        {APP_NAME}
      </h1>
      <p className="text-lg font-light mb-10 splash-subtitle" style={{ color: 'var(--splash-tagline)' }}>
        {APP_TAGLINE}
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

      <div className="absolute bottom-10 text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--splash-version)' }}>
        v{APP_VERSION}
      </div>
    </div>
  );
}
