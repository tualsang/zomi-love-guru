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
      const cardElement = cardRef.current;
      
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

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const fileName = `love-compatibility-${userName}-${crushName}.png`;

      // Try Web Share API first (mobile - allows saving to Photos)
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
        try {
          const file = new File([blob], fileName, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'My Love Compatibility Result',
            text: `${userName} & ${crushName} - ${percentage}% Compatible! 💕`,
          });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          console.log('Share failed, falling back to download:', err);
        }
      }

      // Fallback: Regular download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [userName, crushName, percentage, isDownloading]);

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
          {/* Background Decorations - Larger */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Large Hearts */}
            <div className="absolute top-16 left-8 text-pink-200/30">
              <Heart size={280} fill="currentColor" />
            </div>
            <div className="absolute bottom-32 right-8 text-purple-200/30">
              <Heart size={250} fill="currentColor" />
            </div>
            <div className="absolute top-1/3 right-16 text-pink-200/20">
              <Heart size={160} fill="currentColor" />
            </div>
            <div className="absolute bottom-1/4 left-16 text-purple-200/20">
              <Heart size={140} fill="currentColor" />
            </div>

            {/* Sparkles - Larger */}
            <div className="absolute top-32 right-32 text-yellow-400/40">
              <Sparkles size={90} />
            </div>
            <div className="absolute bottom-48 left-24 text-yellow-400/30">
              <Sparkles size={80} />
            </div>
            <div className="absolute top-2/3 right-20 text-yellow-400/25">
              <Stars size={70} />
            </div>

            {/* Decorative Circles - Larger */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/30 to-transparent" />
            <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-200/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center px-12 py-16">
            {/* Header - Larger */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-6 mb-8">
                <Sparkles className="w-16 h-16 text-pink-400" />
                <h1
                  className="font-display font-bold"
                  style={{
                    fontSize: '90px',
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Zomi Love Guru
                </h1>
                <Sparkles className="w-16 h-16 text-purple-400" />
              </div>
              <p 
                className="text-gray-500 font-light tracking-wide"
                style={{ fontSize: '42px' }}
              >
                Cosmic Compatibility Reading
              </p>
            </div>

            {/* Names Section - Larger */}
            <div className="flex items-center justify-center gap-10 mb-12">
              <div className="text-center">
                <p 
                  className="font-semibold text-gray-800 mb-3"
                  style={{ fontSize: '64px' }}
                >
                  {userName}
                </p>
                <p className="text-pink-400" style={{ fontSize: '32px' }}>You</p>
              </div>

              <div className="relative">
                <Heart
                  size={140}
                  className="text-pink-500 fill-pink-500"
                  style={{ filter: 'drop-shadow(0 6px 30px rgba(236, 72, 153, 0.5))' }}
                />
              </div>

              <div className="text-center">
                <div className="flex items-center gap-3 justify-center">
                  <p
                    className={`font-semibold text-gray-800 mb-3 transition-all duration-300 ${
                      isNameHidden ? 'blur-xl select-none' : ''
                    }`}
                    style={{ fontSize: '64px' }}
                  >
                    {crushName}
                  </p>
                </div>
                <p className="text-purple-400" style={{ fontSize: '32px' }}>Your Crush</p>
              </div>
            </div>

            {/* Percentage Circle - Larger */}
            <div className="relative mb-12">
              {/* Outer Glow */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${getCompatibilityColor()} blur-3xl opacity-40`}
                style={{ transform: 'scale(1.3)' }}
              />

              {/* Circle */}
              <div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: '420px',
                  height: '420px',
                  background: `conic-gradient(
                    from 180deg,
                    #ec4899 0deg,
                    #a855f7 ${percentage * 3.6}deg,
                    #e5e7eb ${percentage * 3.6}deg
                  )`,
                  padding: '16px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: '130px',
                      background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {percentage}%
                  </span>
                  <span 
                    className="text-gray-500 mt-2"
                    style={{ fontSize: '36px' }}
                  >
                    Compatible
                  </span>
                </div>
              </div>
            </div>

            {/* Compatibility Message - Larger */}
            <div
              className={`inline-block px-14 py-6 rounded-full bg-gradient-to-r ${getCompatibilityColor()} mb-12`}
            >
              <p 
                className="font-semibold text-white"
                style={{ fontSize: '44px' }}
              >
                {getCompatibilityMessage()}
              </p>
            </div>

            {/* Summary - Larger */}
            <div
              className="w-full max-w-[950px] p-12 rounded-3xl mb-12"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(236, 72, 153, 0.2)',
                boxShadow: '0 15px 50px rgba(236, 72, 153, 0.15)',
              }}
            >
              <p 
                className="text-gray-700 leading-relaxed text-center"
                style={{ fontSize: '35px', lineHeight: '1.6' }}
              >
                {summary}
              </p>
            </div>

            {/* Footer - Larger */}
            <div className="mt-auto text-center">
              <p 
                className="text-gray-400 mb-4"
                style={{ fontSize: '32px' }}
              >
                Calculated with ✨ cosmic magic ✨
              </p>
              <p 
                className="text-gray-300"
                style={{ fontSize: '28px' }}
              >
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