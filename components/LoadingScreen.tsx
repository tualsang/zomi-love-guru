'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Stars, Moon, Sun, Cloud } from 'lucide-react';

const LOADING_MESSAGES = [
  "Seeking wisdom from Proverbs…",
  "Consulting the Song of Solomon…",
  "Praying over your connection…",
  "Searching for God's plan…",
  "Checking if two can walk together…",
  "Measuring with 1 Corinthians 13…",
  "Asking what God has joined…",
  "Reading the Book of Ruth…",
  "Discerning hearts and intentions…",
  "Looking for a Boaz or Ruth…",
  "Checking if iron sharpens iron…",
  "Seeking a cord of three strands…",
];

export default function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotate messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mesh-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Hearts */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-pink-300/40"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: '100vh',
              rotate: Math.random() * 360,
            }}
            animate={{
              y: '-20vh',
              rotate: 360 + Math.random() * 360,
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          >
            <Heart
              size={15 + Math.random() * 25}
              fill="currentColor"
            />
          </motion.div>
        ))}

        {/* Sparkle Effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-purple-400/50"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Sparkles size={20 + i * 2} />
          </motion.div>
        ))}

        {/* Orbiting Elements */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="relative w-64 h-64">
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400/60"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Stars size={24} />
            </motion.div>
            <motion.div
              className="absolute top-1/2 -right-4 -translate-y-1/2 text-blue-400/60"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Moon size={24} />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-orange-400/60"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Sun size={24} />
            </motion.div>
            <motion.div
              className="absolute top-1/2 -left-4 -translate-y-1/2 text-pink-400/60"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              <Cloud size={24} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Loading Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center px-6"
      >
        {/* Animated Heart */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-pink-500/30 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Heart Icon */}
          <div className="relative">
            <Heart
              size={80}
              className="text-pink-500 fill-pink-500 drop-shadow-lg"
            />
            
            {/* Inner Sparkle */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            >
              <Sparkles size={24} />
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Message */}
        <div className="h-8 mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-gray-700 text-center"
            >
              {LOADING_MESSAGES[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm border border-pink-200/30">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-500"
        >
          Ngaihsut ci-pi a ngaihsun lai...
        </motion.p>

        {/* Floating Dots */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-400"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
