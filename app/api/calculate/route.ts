// ==============================================
// API Route: /api/calculate
// Zomi Love Guru - Compatibility Calculator
// ==============================================

import { NextRequest, NextResponse } from 'next/server';
import { validateFormData, isEasterEggCase, getEasterEggResponse } from '@/lib/validation';
import { sanitizeUserAgent, formatTimestamp } from '@/lib/sanitization';
import { callGeminiAPI, generateFallbackResponse } from '@/lib/gemini';
import { appendToSheet, prepareSheetRowData, type ResponseSource } from '@/lib/sheets';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders } from '@/lib/ratelimit';
import type { CalculateRequest, CalculateResponse } from '@/lib/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/calculate
 * Calculate compatibility between user and crush
 */
export async function POST(request: NextRequest): Promise<NextResponse<CalculateResponse>> {
  try {
    // === STEP 1: Rate Limiting ===
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a moment before trying again.',
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetIn),
        }
      );
    }

    // === STEP 2: Parse Request Body ===
    let body: CalculateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // === STEP 3: Server-Side Validation ===
    const validationResult = validateFormData({
      user: body.user,
      crush: body.crush,
      context: body.context,
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.errors.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { sanitizedData } = validationResult;
    if (!sanitizedData) {
      return NextResponse.json(
        { success: false, error: 'Data sanitization failed' },
        { status: 500 }
      );
    }

    // === STEP 4: Check for Easter Egg ===
    const isEasterEgg = isEasterEggCase({
      user: body.user,
      crush: body.crush,
      context: body.context,
    });

    let percentage: number;
    let summary: string;
    let source: ResponseSource;

    if (isEasterEgg) {
      const easterEggResponse = getEasterEggResponse(sanitizedData.user.name);
      percentage = easterEggResponse.percentage;
      summary = easterEggResponse.summary;
      source = 'AI';  // Easter egg counts as intentional response
    } else {
      // === STEP 5: Call Gemini API (single attempt) ===
      try {
        const geminiResponse = await callGeminiAPI(sanitizedData);
        percentage = geminiResponse.percentage;
        summary = geminiResponse.summary;
        source = 'AI';
      } catch {
        // Use fallback response if Gemini fails
        const fallback = generateFallbackResponse(
          sanitizedData.user.name,
          sanitizedData.crush.name
        );
        percentage = fallback.percentage;
        summary = fallback.summary;
        source = 'Fallback';
      }
    }

    // === STEP 6: Log to Google Sheets ===
    const metadata = {
      screenResolution: body.metadata?.screenResolution || 'Unknown',
      userAgent: sanitizeUserAgent(body.metadata?.userAgent),
      timestamp: formatTimestamp(body.metadata?.timezone || 'UTC'),
      timezone: body.metadata?.timezone || 'UTC',
    };

    try {
      await appendToSheet(
        prepareSheetRowData(sanitizedData, percentage, summary, metadata, source)
      );
    } catch {
      // Don't fail the request if sheet logging fails
    }

    // === STEP 7: Return Response ===
    return NextResponse.json(
      {
        success: true,
        data: {
          percentage,
          summary,
          userName: sanitizedData.user.name,
          crushName: sanitizedData.crush.name,
          isEasterEgg,
        },
      },
      {
        status: 200,
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetIn),
      }
    );
  } catch (error) {
    console.error('Calculate API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle other HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}