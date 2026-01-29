# 💕 Zomi Love Guru

A mobile-first AI-powered compatibility calculator built with Next.js 15, featuring beautiful glassmorphism design, Framer Motion animations, and Google Gemini AI integration.

## ✨ Features

- **AI-Powered Analysis**: Uses Google Gemini API to generate witty, personalized compatibility readings
- **Mobile-First Design**: Optimized for mobile with 1080x1920 (9:16) result cards perfect for Instagram Stories
- **Glassmorphism UI**: Beautiful frosted glass aesthetic with smooth animations
- **Privacy Toggle**: Hide crush name in the result card before sharing
- **Heart Confetti**: Celebratory confetti animation for high compatibility scores (>75%)
- **Self-Love Easter Egg**: Special message when you calculate compatibility with yourself
- **Data Logging**: Optional Google Sheets integration for analytics
- **Security First**: Input sanitization, rate limiting, and prompt injection protection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- (Optional) Google Cloud service account for Sheets integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zomi-love-guru.git
   cd zomi-love-guru
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Required
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional - for Google Sheets logging
   GOOGLE_SHEET_ID=your_sheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env.local` file

### Setting up Google Sheets (Optional)

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. **Enable Google Sheets API**
   - Navigate to APIs & Services > Library
   - Search for "Google Sheets API"
   - Click Enable

3. **Create a Service Account**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create

4. **Generate a Key**
   - Click on the service account
   - Go to "Keys" tab
   - Add Key > Create new key > JSON
   - Download the JSON file

5. **Share Your Sheet**
   - Create a new Google Sheet
   - Copy the Sheet ID from the URL
   - Share the sheet with your service account email (with Editor access)

6. **Add Credentials to .env.local**
   - Copy values from the JSON key file to your `.env.local`

## 📁 Project Structure

```
zomi-love-guru/
├── app/
│   ├── api/
│   │   └── calculate/
│   │       └── route.ts      # API endpoint for compatibility calculation
│   ├── result/
│   │   └── page.tsx          # Result display page
│   ├── globals.css           # Global styles and Tailwind config
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page with input form
├── components/
│   ├── InputForm.tsx         # Form component with validation
│   ├── LoadingScreen.tsx     # Animated loading screen
│   └── ResultCard.tsx        # Downloadable result card
├── lib/
│   ├── gemini.ts             # Gemini API integration
│   ├── ratelimit.ts          # Rate limiting logic
│   ├── sanitization.ts       # Input sanitization utilities
│   ├── sheets.ts             # Google Sheets integration
│   ├── types.ts              # TypeScript type definitions
│   └── validation.ts         # Validation utilities
├── public/
│   └── manifest.json         # PWA manifest
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json
```

## 🔒 Security Features

### Input Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Age restricted to integers 1-99
- DOB components validated (month 1-12, day 1-31, year 1900-2026)
- Maximum length limits on all fields

### Sanitization
- HTML entity escaping
- Template syntax removal
- Control character filtering
- Whitespace normalization

### Prompt Injection Protection
- Dangerous pattern detection
- User content wrapped as data, not instructions
- System prompt hardcoded and separate from user input

### Rate Limiting
- IP-based rate limiting (10 requests/minute by default)
- Configurable via environment variables

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.ts` to modify the color scheme:
```typescript
colors: {
  primary: {
    // Your primary color palette
  },
  secondary: {
    // Your secondary color palette
  },
}
```

### Loading Messages
Edit `components/LoadingScreen.tsx` to customize loading messages:
```typescript
const LOADING_MESSAGES = [
  "Your custom message...",
  // Add more messages
];
```

### Result Card Design
Modify `components/ResultCard.tsx` to change the card appearance. The card is designed at 1080x1920 pixels for Instagram Stories.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!


### Environment Variables in Vercel
Add these in your Vercel project settings:
- `GEMINI_API_KEY`
- `GOOGLE_SHEET_ID` (optional)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (optional)
- `GOOGLE_PRIVATE_KEY` (optional)

## 📝 API Reference

### POST /api/calculate

Calculate compatibility between two people.

**Request Body:**
```json
{
  "user": {
    "name": "John",
    "fullName": "John Doe",
    "age": 25,
    "dob": { "month": 6, "day": 15, "year": 1998 },
    "location": { "city": "New York", "state": "NY" }
  },
  "crush": {
    "name": "Jane",
    "fullName": "Jane Smith",
    "age": 24,
    "dob": { "month": 3, "day": 20, "year": 1999 },
    "location": { "city": "Los Angeles", "state": "CA" }
  },
  "context": "We met at a coffee shop",
  "metadata": {
    "screenResolution": "1920x1080",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-15T10:30:00Z",
    "timezone": "America/New_York"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "percentage": 78,
    "summary": "You and Jane are a 78% match! The stars align...",
    "userName": "John",
    "crushName": "Jane",
    "isEasterEgg": false
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Confetti effects
- [html-to-image](https://github.com/bubkoo/html-to-image) - Image export

---

Made with 💕 by Zomi Love Guru
