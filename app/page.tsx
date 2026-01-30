'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Info } from 'lucide-react';
import InputForm from '@/components/InputForm';
import LoadingScreen from '@/components/LoadingScreen';
import type { FormData, CalculateResponse } from '@/lib/types';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Collect metadata
      const metadata = {
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // Call API
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: formData.user,
          crush: formData.crush,
          context: formData.context,
          metadata,
        }),
      });

      const result: CalculateResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to calculate compatibility');
      }

      // Store result in sessionStorage and navigate to result page
      sessionStorage.setItem('compatibilityResult', JSON.stringify(result.data));
      
      // Add minimum loading time for UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      window.location.href = '/result';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 sm:py-12 mesh-bg">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/30"
            initial={{ y: '100vh', x: `${15 + i * 15}vw` }}
            animate={{ y: '-100vh' }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          >
            <Heart size={20 + i * 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10 relative z-10 w-full max-w-md px-2"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 fill-pink-500" />
        </motion.div>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
          <span className="text-gradient">Neino 🩷 Namtal</span>
        </h1>
        
        <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
          Discover your connection with Neino 💕 Namtal!
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-3 text-sm text-pink-600"
        >
          <Sparkles className="w-4 h-4" />
          <span>itna • ngaihna • lungkim-na</span>
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full max-w-md mb-6 px-4 py-3 rounded-xl glass border-red-200 bg-red-50/80"
          >
            <p className="text-red-600 text-sm text-center">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-6 sm:p-8 glow">
          <InputForm onSubmit={handleSubmit} />
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            <span>Your data is processed securely and never shared</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pt-8 pb-4 text-center text-xs text-gray-400"
      >
        <p>Made with Neino 💕 Namtal</p>
        <p className="mt-1">This is for entertainment purposes only</p>
      </motion.footer>
    </main>
  );
}