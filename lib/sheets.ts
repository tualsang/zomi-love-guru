// ==============================================
// Google Sheets Integration for Zomi Love Guru
// ==============================================

import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { SheetRowData } from './types';

// Headers for the Google Sheet
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
  'AI Summary',
  'Screen Resolution',
  'Browser/Device Info',
];

/**
 * Initialize Google Sheets authentication
 */
function getServiceAccountAuth(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  
  // Decode from base64
  const keyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (!email || !keyBase64) {
    throw new Error('Google Sheets credentials not configured');
  }
  
  const key = Buffer.from(keyBase64, 'base64').toString('utf-8');

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
  // Load document properties and worksheets
  await doc.loadInfo();

  // Try to get the first sheet
  let sheet = doc.sheetsByIndex[0];

  if (!sheet) {
    // Create a new sheet if none exists
    sheet = await doc.addSheet({
      title: 'Compatibility Results',
      headerValues: SHEET_HEADERS,
    });
  } else {
    // Ensure headers exist
    try {
      await sheet.loadHeaderRow();
    } catch {
      // Headers don't exist, set them
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
    console.warn('Google Sheet ID not configured, skipping data storage');
    return false;
  }

  try {
    const auth = getServiceAccountAuth();
    const doc = new GoogleSpreadsheet(sheetId, auth);

    const sheet = await getOrCreateSheet(doc);

    // Add the row
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
      'AI Summary': data.aiSummary,
      'Screen Resolution': data.screenResolution,
      'Browser/Device Info': data.browserDeviceInfo,
    });

    return true;
  } catch (error) {
    console.error('Failed to append to Google Sheet:', error);
    // Don't throw - we don't want to fail the request if sheet logging fails
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
  },
  percentage: number,
  summary: string,
  metadata: {
    screenResolution: string;
    userAgent: string;
    timestamp: string;
    timezone: string;
  }
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
    aiSummary: summary,
    screenResolution: metadata.screenResolution || 'Unknown',
    browserDeviceInfo: metadata.userAgent || 'Unknown',
  };
}
