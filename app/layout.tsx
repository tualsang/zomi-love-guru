import type { Metadata, Viewport } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Zomi Love Guru | Compatibility Calculator',
  description: 'Discover your connection! Calculate your love compatibility with our AI-powered relationship analyzer.',
  keywords: ['love calculator', 'compatibility', 'relationship', 'AI', 'zodiac', 'romance'],
  authors: [{ name: 'Zomi Love Guru' }],
  creator: 'Zomi Love Guru',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zomi-love-guru.vercel.app',
    siteName: 'Zomi Love Guru',
    title: 'Zomi Love Guru | Compatibility Calculator',
    description: 'Discover your cosmic connection! Calculate your love compatibility with our AI-powered relationship analyzer.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zomi Love Guru - Love Compatibility Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zomi Love Guru | Compatibility Calculator',
    description: 'Discover your cosmic connection! Calculate your love compatibility with our AI-powered relationship analyzer.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${pacifico.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen min-h-[100dvh] flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}