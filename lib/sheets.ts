// ==============================================
// Google Sheets Integration for Heisa & Namtal
// ==============================================

import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { SheetRowData, ResponseSource } from './types';

// Re-export for convenience
export type { ResponseSource };

// Headers for the Google Sheet - Source is the LAST column
const SHEET_HEADERS = [
  'Timestamp',
  'User Name',
  'User Age',
  'User DOB',
  'User Location',
  'Crush Name',
  'Crush Age',
  'Crush DOB',
  'Crush Location',
  'Compatibility %',
  'Context',
  'AI Summary',
  'Screen Resolution',
  'Browser/Device Info',
  'Source',  // LAST column: AI or Fallback
];

/**
 * Initialize Google Sheets authentication
 */
function getServiceAccountAuth(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  const keyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  const keyRaw = process.env.GOOGLE_PRIVATE_KEY;

  let key: string;

  if (keyBase64) {
    key = Buffer.from(keyBase64, 'base64').toString('utf-8');
  } else if (keyRaw) {
    key = keyRaw
      .replace(/\\n/g, '\n')
      .replace(/\\\\n/g, '\n')
      .replace(/"/g, '')
      .trim();
  } else {
    throw new Error('Google Sheets credentials not configured');
  }

  if (!email) {
    throw new Error('Google Sheets credentials not configured');
  }

  return new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Get or create the worksheet
 */
async function getOrCreateSheet(doc: GoogleSpreadsheet): Promise<GoogleSpreadsheetWorksheet> {
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: 'Compatibility Results',
      headerValues: SHEET_HEADERS,
    });
  } else {
    try {
      await sheet.loadHeaderRow();

      const currentHeaders = sheet.headerValues;
      if (!currentHeaders.includes('Source')) {
        await sheet.setHeaderRow(SHEET_HEADERS);
      }
    } catch {
      await sheet.setHeaderRow(SHEET_HEADERS);
    }
  }

  return sheet;
}

/**
 * Append a row to the Google Sheet
 */
export async function appendToSheet(data: SheetRowData): Promise<boolean> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    return false;
  }

  try {
    const auth = getServiceAccountAuth();
    const doc = new GoogleSpreadsheet(sheetId, auth);

    const sheet = await getOrCreateSheet(doc);

    await sheet.addRow({
      'Timestamp': data.timestamp,
      'User Name': data.userName,
      'User Age': data.userAge,
      'User DOB': data.userDOB,
      'User Location': data.userLocation,
      'Crush Name': data.crushName,
      'Crush Age': data.crushAge,
      'Crush DOB': data.crushDOB,
      'Crush Location': data.crushLocation,
      'Compatibility %': data.compatibilityPercentage,
      'Context': data.context || '',
      'AI Summary': data.aiSummary,
      'Screen Resolution': data.screenResolution,
      'Browser/Device Info': data.browserDeviceInfo,
      'Source': data.source,  // LAST column
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Prepare row data from the request and response
 */
export function prepareSheetRowData(
  sanitizedData: {
    user: { name: string; age: string; dob: string; location: string };
    crush: { name: string; age: string; dob: string; location: string };
    context?: string;
  },
  percentage: number,
  summary: string,
  metadata: {
    screenResolution: string;
    userAgent: string;
    timestamp: string;
    timezone: string;
  },
  source: ResponseSource
): SheetRowData {
  return {
    timestamp: metadata.timestamp,
    userName: sanitizedData.user.name,
    userAge: sanitizedData.user.age,
    userDOB: sanitizedData.user.dob,
    userLocation: sanitizedData.user.location,
    crushName: sanitizedData.crush.name,
    crushAge: sanitizedData.crush.age,
    crushDOB: sanitizedData.crush.dob,
    crushLocation: sanitizedData.crush.location,
    compatibilityPercentage: percentage,
    context: sanitizedData.context || '',
    aiSummary: summary,
    screenResolution: metadata.screenResolution || 'Unknown',
    browserDeviceInfo: metadata.userAgent || 'Unknown',
    source,
  };
}