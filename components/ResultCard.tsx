'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, EyeOff, Download, Sparkles, Stars } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ResultCardProps {
  userName: string;
  crushName: string;
  percentage: number;
  summary: string;
  isEasterEgg: boolean;
}

export default function ResultCard({
  userName,
  crushName,
  percentage,
  summary,
  isEasterEgg,
}: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isNameHidden, setIsNameHidden] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Get the actual card element (not the wrapper)
      const cardElement = cardRef.current;
      
      // Generate image at full resolution
      const dataUrl = await toPng(cardElement, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        backgroundColor: '#fdf2f8',
        style: {
          transform: 'none',
          transformOrigin: 'top left',
        },
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `love-compatibility-${userName}-${crushName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [userName, crushName, isDownloading]);

  const getCompatibilityColor = () => {
    if (percentage >= 80) return 'from-pink-500 to-rose-500';
    if (percentage >= 60) return 'from-purple-500 to-pink-500';
    if (percentage >= 40) return 'from-blue-500 to-purple-500';
    return 'from-slate-500 to-blue-500';
  };

  const getCompatibilityMessage = () => {
    if (isEasterEgg) return '✨ Self-Love Champion ✨';
    if (percentage >= 90) return '💕 Soulmates Alert! 💕';
    if (percentage >= 75) return '💖 Strong Connection 💖';
    if (percentage >= 60) return '💜 Good Potential 💜';
    if (percentage >= 40) return '💙 Room to Grow 💙';
    return '🌱 Keep Exploring 🌱';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Wrapper with Transform for Display */}
      <div className="result-card-wrapper">
        {/* Actual Card - 1080x1920 (9:16) */}
        <div
          ref={cardRef}
          className="result-card bg-white relative overflow-hidden"
          style={{
            width: '1080px',
            height: '1920px',
            background: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 30%, #f3e8ff 70%, #fdf2f8 100%)',
          }}
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Large Hearts */}
            <div className="absolute top-20 left-10 text-pink-200/30">
              <Heart size={200} fill="currentColor" />
            </div>
            <div className="absolute bottom-40 right-10 text-purple-200/30">
              <Heart size={180} fill="currentColor" />
            </div>
            <div className="absolute top-1/3 right-20 text-pink-200/20">
              <Heart size={120} fill="currentColor" />
            </div>
            <div className="absolute bottom-1/4 left-20 text-purple-200/20">
              <Heart size={100} fill="currentColor" />
            </div>

            {/* Sparkles */}
            <div className="absolute top-40 right-40 text-yellow-400/40">
              <Sparkles size={60} />
            </div>
            <div className="absolute bottom-60 left-32 text-yellow-400/30">
              <Sparkles size={50} />
            </div>
            <div className="absolute top-2/3 right-24 text-yellow-400/25">
              <Stars size={40} />
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-200/30 to-transparent" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-200/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center px-16 py-20">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Sparkles className="w-12 h-12 text-pink-400" />
                <h1
                  className="font-display text-7xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Zomi Love Guru
                </h1>
                <Sparkles className="w-12 h-12 text-purple-400" />
              </div>
              <p className="text-3xl text-gray-500 font-light tracking-wide">
                Cosmic Compatibility Reading
              </p>
            </div>

            {/* Names Section */}
            <div className="flex items-center justify-center gap-8 mb-16">
              <div className="text-center">
                <p className="text-5xl font-semibold text-gray-800 mb-2">
                  {userName}
                </p>
                <p className="text-2xl text-pink-400">You</p>
              </div>

              <div className="relative">
                <Heart
                  size={100}
                  className="text-pink-500 fill-pink-500"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(236, 72, 153, 0.4))' }}
                />
              </div>

              <div className="text-center">
                <div className="flex items-center gap-3 justify-center">
                  <p
                    className={`text-5xl font-semibold text-gray-800 mb-2 transition-all duration-300 ${
                      isNameHidden ? 'blur-lg select-none' : ''
                    }`}
                  >
                    {crushName}
                  </p>
                </div>
                <p className="text-2xl text-purple-400">Your Crush</p>
              </div>
            </div>

            {/* Percentage Circle */}
            <div className="relative mb-16">
              {/* Outer Glow */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${getCompatibilityColor()} blur-3xl opacity-30`}
                style={{ transform: 'scale(1.2)' }}
              />

              {/* Circle */}
              <div
                className="relative w-80 h-80 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(
                    from 180deg,
                    #ec4899 0deg,
                    #a855f7 ${percentage * 3.6}deg,
                    #e5e7eb ${percentage * 3.6}deg
                  )`,
                  padding: '12px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                  <span
                    className="text-8xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {percentage}%
                  </span>
                  <span className="text-2xl text-gray-500 mt-2">Compatible</span>
                </div>
              </div>
            </div>

            {/* Compatibility Message */}
            <div
              className={`inline-block px-10 py-4 rounded-full bg-gradient-to-r ${getCompatibilityColor()} mb-16`}
            >
              <p className="text-3xl font-semibold text-white">
                {getCompatibilityMessage()}
              </p>
            </div>

            {/* Summary */}
            <div
              className="w-full max-w-4xl p-10 rounded-3xl mb-16"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(236, 72, 153, 0.2)',
                boxShadow: '0 10px 40px rgba(236, 72, 153, 0.1)',
              }}
            >
              <p className="text-3xl text-gray-700 leading-relaxed text-center">
                {summary}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto text-center">
              <p className="text-2xl text-gray-400 mb-3">
                Calculated with ✨ cosmic magic ✨
              </p>
              <p className="text-xl text-gray-300">
                zomi-love-guru.vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Outside the card */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md px-4">
        {/* Privacy Toggle */}
        <motion.button
          onClick={() => setIsNameHidden(!isNameHidden)}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
            bg-white/80 backdrop-blur-sm border border-pink-200/50
            text-gray-700 font-medium
            hover:bg-pink-50 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isNameHidden ? (
            <>
              <EyeOff className="w-5 h-5 text-pink-500" />
              <span>Show Name</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 text-pink-500" />
              <span>Hide Name</span>
            </>
          )}
        </motion.button>

        {/* Download Button */}
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
            bg-gradient-to-r from-pink-500 to-purple-500
            text-white font-semibold
            shadow-lg shadow-pink-500/30
            hover:shadow-xl hover:shadow-pink-500/40
            disabled:opacity-70 disabled:cursor-not-allowed
            transition-all duration-300"
          whileHover={{ scale: isDownloading ? 1 : 1.02 }}
          whileTap={{ scale: isDownloading ? 1 : 0.98 }}
        >
          {isDownloading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download Result</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
