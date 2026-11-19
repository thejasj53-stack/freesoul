import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BreathingExercise() {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setPhase((p) => {
        if (p === 'Inhale') return 'Hold';
        if (p === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <h3 className="font-heading font-bold text-xl text-wellness-navy mb-2">Box Breathing Exercise</h3>
      <p className="text-sm text-wellness-sageDark mb-8">Regulate your nervous system with guided pacing.</p>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{
            scale: phase === 'Inhale' ? 1.3 : phase === 'Hold' ? 1.3 : 1,
            opacity: phase === 'Hold' ? 0.8 : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-wellness-lavender rounded-full opacity-50"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36 bg-wellness-navy text-white rounded-full shadow-lg">
          <span className="text-xs text-wellness-lavender uppercase tracking-wider">Breathe</span>
          <span className="text-xl font-bold font-heading">{isActive ? phase : 'Ready'}</span>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-wellness-navy text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
        >
          {isActive ? 'Pause Exercise' : 'Start Breathing'}
        </button>
      </div>
    </div>
  );
}