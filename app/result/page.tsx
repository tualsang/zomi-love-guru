'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Share2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import ResultCard from '@/components/ResultCard';

interface ResultData {
  percentage: number;
  summary: string;
  userName: string;
  crushName: string;
  isEasterEgg: boolean;
}

// Heart-shaped confetti configuration
const heartShape = confetti.shapeFromPath({
  path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
});

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fireConfetti = useCallback(() => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fbbf24'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        shapes: [heartShape, 'circle'],
        scalar: 1.2,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        shapes: [heartShape, 'circle'],
        scalar: 1.2,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst in the middle
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        shapes: [heartShape, 'circle'],
        scalar: 1.5,
      });
    }, 500);
  }, []);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('compatibilityResult');
    
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult) as ResultData;
        setResult(parsed);

        // Fire confetti if score > 75%
        if (parsed.percentage > 75) {
          setTimeout(fireConfetti, 500);
        }
      } catch (e) {
        console.error('Failed to parse result:', e);
      }
    }

    setIsLoading(false);
  }, [fireConfetti]);

  const handleShare = async () => {
    if (!result) return;

    const shareText = `${result.userName} and ${result.crushName} are ${result.percentage}% compatible! 💕 Calculate your love compatibility at Zomi Love Guru!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zomi Love Guru - Compatibility Result',
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or error
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText + '\n' + window.location.origin);
        alert('Copied to clipboard!');
      } catch (e) {
        console.error('Failed to copy:', e);
      }
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('compatibilityResult');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
        </motion.div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 mesh-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 text-pink-300 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            No results found
          </h1>
          <p className="text-gray-500 mb-8">
            Start a new compatibility calculation to see your results.
          </p>
          <motion.a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-pink-500 to-purple-500
              text-white font-medium
              shadow-lg shadow-pink-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Start Over
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center mesh-bg py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex items-center justify-between mb-6"
      >
        <motion.a
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-white/60 backdrop-blur-sm border border-pink-200/50
            text-gray-600 text-sm font-medium
            hover:bg-white/80 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.a>

        <div className="flex gap-2">
          <motion.button
            onClick={handleShare}
            className="p-2 rounded-xl
              bg-white/60 backdrop-blur-sm border border-pink-200/50
              text-gray-600
              hover:bg-white/80 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handleStartOver}
            className="p-2 rounded-xl
              bg-white/60 backdrop-blur-sm border border-pink-200/50
              text-gray-600
              hover:bg-white/80 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Calculate Again"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResultCard
          userName={result.userName}
          crushName={result.crushName}
          percentage={result.percentage}
          summary={result.summary}
          isEasterEgg={result.isEasterEgg}
        />
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500 mb-4">
          Share your result on Instagram Stories!
        </p>
        
        <motion.button
          onClick={handleStartOver}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-white/80 backdrop-blur-sm border border-pink-200/50
            text-gray-700 font-medium
            hover:bg-pink-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="w-4 h-4" />
          Calculate Another
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto pt-8 pb-4 text-center text-xs text-gray-400"
      >
        <p>Made with 💕 by Zomi Love Guru</p>
        <p className="mt-1">This is for entertainment purposes only</p>
      </motion.footer>
    </main>
  );
}
