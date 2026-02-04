# Heisa & Namtal

Discover your unique connection with **Heisa & Namtal**, an AI-powered compatibility calculator that goes beyond random numbers.

## ✨ Features

-   **AI Analysis**: Generates personalized, witty, and faith-based compatibility summaries using Google Gemini.
-   **Zomi Flavor**: Weaves in beautiful Zomi expressions like *[thupha]* (blessing) and *[lungdamna]* (joy) directly into the text.
-   **Dynamic Styling**: Zomi words are automatically highlighted in **bold pink** for a beautiful reading experience.
-   **Social Ready**: Result cards are optimized for sharing on Instagram/Snapchat stories with perfect spacing.
-   **Privacy First**: Option to hide names before sharing screenshots.
-   **Rate Limiting**: Built-in protection to ensure fair usage.

## 🚀 Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **AI**: Google Gemini API (`gemini-2.5-flash-lite`)
-   **Styling**: Tailwind CSS + Framer Motion
-   **Database**: Google Sheets (for simple logging)

## 🛠️ Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/tualsang/neino-namtal.git
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables (`.env.local`):
    ```env
    GEMINI_API_KEY=your_api_key_here
    GOOGLE_SERVICE_ACCOUNT_EMAIL=your_email
    GOOGLE_PRIVATE_KEY=your_key
    GOOGLE_SHEET_ID=your_sheet_id
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📄 License

MIT
