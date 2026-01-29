// ==============================================
// Sanitization Utilities for Zomi Love Guru
// ==============================================

import type { DateOfBirth, Location } from './types';

/**
 * HTML entities map for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Remove control characters and normalize whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize various whitespace to regular space
    .replace(/[\t\r\f\v]+/g, ' ')
    // Collapse multiple spaces
    .replace(/ +/g, ' ')
    // Trim
    .trim();
}

/**
 * Remove any potential template syntax that could be interpreted
 */
export function removeTemplateSyntax(str: string): string {
  return str
    // Remove mustache/handlebars syntax
    .replace(/\{\{.*?\}\}/g, '')
    // Remove EJS syntax
    .replace(/<%.*?%>/g, '')
    // Remove Jinja syntax
    .replace(/\{%.*?%\}/g, '')
    // Remove ${} syntax
    .replace(/\$\{.*?\}/g, '')
    // Remove backticks that could start template literals
    .replace(/`/g, "'");
}

/**
 * Sanitize a string for safe use in prompts and storage
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Step 1: Trim and normalize whitespace
  sanitized = normalizeWhitespace(sanitized);

  // Step 2: Remove template syntax
  sanitized = removeTemplateSyntax(sanitized);

  // Step 3: Escape HTML entities
  sanitized = escapeHtml(sanitized);

  // Step 4: Limit length to prevent abuse
  const MAX_LENGTH = 500;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitize a number input
 */
export function sanitizeNumber(input: number | string | undefined | null): number | null {
  if (input === undefined || input === null || input === '') {
    return null;
  }

  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  return Math.floor(num); // Ensure integer
}

/**
 * Format date of birth for display and API use
 */
export function formatDOB(dob: DateOfBirth | undefined): string {
  if (!dob) return 'Not provided';

  const parts: string[] = [];

  if (dob.month !== undefined && dob.month !== null) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = typeof dob.month === 'string' ? parseInt(dob.month, 10) - 1 : dob.month - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      parts.push(months[monthIndex]);
    }
  }

  if (dob.day !== undefined && dob.day !== null) {
    const day = typeof dob.day === 'string' ? parseInt(dob.day, 10) : dob.day;
    if (day >= 1 && day <= 31) {
      parts.push(day.toString());
    }
  }

  if (dob.year !== undefined && dob.year !== null) {
    const year = typeof dob.year === 'string' ? parseInt(dob.year, 10) : dob.year;
    if (year >= 1900 && year <= 2026) {
      parts.push(year.toString());
    }
  }

  return parts.length > 0 ? parts.join(' ') : 'Not provided';
}

/**
 * Format location for display and API use
 */
export function formatLocation(location: Location | undefined): string {
  if (!location) return 'Not provided';

  const parts: string[] = [];

  if (location.city) {
    parts.push(sanitizeString(location.city));
  }

  if (location.state) {
    parts.push(sanitizeString(location.state));
  }

  return parts.length > 0 ? parts.join(', ') : 'Not provided';
}

/**
 * Sanitize for prompt injection prevention
 * This creates a version safe to embed in AI prompts
 */
export function sanitizeForPrompt(input: string): string {
  let sanitized = sanitizeString(input);

  // Additional prompt-specific sanitization
  // Replace any newlines with spaces to prevent prompt formatting manipulation
  sanitized = sanitized.replace(/\n/g, ' ');

  // Remove any instruction-like patterns
  const instructionPatterns = [
    /(?:^|\s)(?:ignore|disregard|forget|override|reveal|show|display)\s/gi,
    /(?:^|\s)(?:you are|act as|pretend|roleplay|system|prompt|instruction)/gi,
    /(?:^|\s)(?:respond with|output|return|give me)\s/gi,
  ];

  for (const pattern of instructionPatterns) {
    sanitized = sanitized.replace(pattern, ' ');
  }

  return sanitized.trim();
}

/**
 * Create a safe wrapper for user content in prompts
 */
export function wrapUserContent(label: string, content: string): string {
  const sanitized = sanitizeForPrompt(content);
  // Use a format that clearly marks user content as data, not instructions
  return `${label}: "${sanitized}"`;
}

/**
 * Sanitize user agent string for storage
 */
export function sanitizeUserAgent(userAgent: string | undefined | null): string {
  if (!userAgent) return 'Unknown';
  
  // Only keep alphanumeric, spaces, forward slashes, parentheses, dots, and dashes
  return userAgent
    .replace(/[^a-zA-Z0-9\s\/\(\)\.\-_;,]/g, '')
    .substring(0, 500);
}

/**
 * Format timestamp for storage
 */
export function formatTimestamp(timezone: string = 'UTC'): string {
  const now = new Date();
  
  try {
    return now.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '') + ` [${timezone}]`;
  } catch {
    // Fallback if timezone is invalid
    return now.toISOString() + ' [UTC]';
  }
}
