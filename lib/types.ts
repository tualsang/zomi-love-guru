// ==============================================
// Type Definitions for Zomi Love Guru
// ==============================================

// Date of Birth - All fields optional for partial dates
export interface DateOfBirth {
  day?: number | null;
  month?: number | null;
  year?: number | null;
}

// Location information
export interface Location {
  city?: string;
  state?: string;
}

// Person data (User or Crush)
export interface PersonData {
  name: string;
  fullName?: string;
  age?: number | null;
  dob?: DateOfBirth;
  location?: Location;
}

// Complete form data
export interface FormData {
  user: PersonData;
  crush: PersonData;
  context?: string;
}

// Validated and sanitized data for API
export interface SanitizedFormData {
  user: {
    name: string;
    fullName: string;
    age: string;
    dob: string;
    location: string;
  };
  crush: {
    name: string;
    fullName: string;
    age: string;
    dob: string;
    location: string;
  };
  context: string;
}

// API Request payload
export interface CalculateRequest {
  user: PersonData;
  crush: PersonData;
  context?: string;
  metadata: {
    screenResolution: string;
    userAgent: string;
    timestamp: string;
    timezone: string;
  };
}

// Gemini API response structure
export interface GeminiResponse {
  percentage: number;
  summary: string;
}

// API Response
export interface CalculateResponse {
  success: boolean;
  data?: {
    percentage: number;
    summary: string;
    userName: string;
    crushName: string;
    isEasterEgg: boolean;
  };
  error?: string;
}

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: SanitizedFormData;
}

// Rate limit entry
export interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

// Google Sheets row data
export interface SheetRowData {
  timestamp: string;
  userName: string;
  userAge: string;
  userDOB: string;
  userLocation: string;
  crushName: string;
  crushAge: string;
  crushDOB: string;
  crushLocation: string;
  compatibilityPercentage: number;
  aiSummary: string;
  screenResolution: string;
  browserDeviceInfo: string;
}

// Loading messages for animation
export type LoadingMessage = string;

// Result card props
export interface ResultCardProps {
  userName: string;
  crushName: string;
  percentage: number;
  summary: string;
  isEasterEgg: boolean;
}

// Form field validation rules
export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  required?: boolean;
}
