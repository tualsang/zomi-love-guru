// ==============================================
// Validation Utilities for Zomi Love Guru
// ==============================================

import type {
  FormData,
  PersonData,
  DateOfBirth,
  ValidationError,
  ValidationResult,
  SanitizedFormData,
} from './types';
import { sanitizeString, sanitizeNumber, formatDOB, formatLocation } from './sanitization';

// Constants for validation
const VALIDATION_CONSTANTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  CONTEXT_MAX_LENGTH: 500,
  AGE_MIN: 1,
  AGE_MAX: 99,
  MONTH_MIN: 1,
  MONTH_MAX: 12,
  DAY_MIN: 1,
  DAY_MAX: 31,
  YEAR_MIN: 1900,
  YEAR_MAX: 2026,
};

// Dangerous patterns to detect prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /forget\s+(all\s+)?(previous|above|prior)/i,
  /new\s+instructions?/i,
  /system\s*:?\s*prompt/i,
  /\{\{.*\}\}/,
  /<\/?script/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /data\s*:/i,
  /vbscript\s*:/i,
  /<\/?iframe/i,
  /<\/?object/i,
  /<\/?embed/i,
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  /you\s+are\s+(now\s+)?a/i,
  /act\s+as\s+(if\s+you\s+are\s+)?a/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /roleplay\s+as/i,
  /override\s+(your\s+)?(instructions|rules|guidelines)/i,
  /reveal\s+(your\s+)?(system|prompt|instructions)/i,
];

/**
 * Check if a string contains potential injection attempts
 */
export function containsInjectionAttempt(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Validate a person's name
 */
export function validateName(
  name: unknown,
  fieldName: string,
  required: boolean = true
): ValidationError | null {
  if (name === undefined || name === null || name === '') {
    if (required) {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  }

  if (typeof name !== 'string') {
    return { field: fieldName, message: `${fieldName} must be a string` };
  }

  const trimmed = name.trim();

  if (required && trimmed.length < VALIDATION_CONSTANTS.NAME_MIN_LENGTH) {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  if (trimmed.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
    return {
      field: fieldName,
      message: `${fieldName} must be ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters or less`,
    };
  }

  if (containsInjectionAttempt(trimmed)) {
    return { field: fieldName, message: `${fieldName} contains invalid characters` };
  }

  return null;
}

/**
 * Validate age (must be integer 1-99)
 */
export function validateAge(age: unknown, fieldName: string): ValidationError | null {
  if (age === undefined || age === null || age === '') {
    return null; // Age is optional
  }

  const numAge = typeof age === 'string' ? parseInt(age, 10) : age;

  if (typeof numAge !== 'number' || isNaN(numAge)) {
    return { field: fieldName, message: 'Age must be a valid number' };
  }

  if (!Number.isInteger(numAge)) {
    return { field: fieldName, message: 'Age must be a whole number (no decimals)' };
  }

  if (numAge < VALIDATION_CONSTANTS.AGE_MIN || numAge > VALIDATION_CONSTANTS.AGE_MAX) {
    return {
      field: fieldName,
      message: `Age must be between ${VALIDATION_CONSTANTS.AGE_MIN} and ${VALIDATION_CONSTANTS.AGE_MAX}`,
    };
  }

  return null;
}

/**
 * Validate date of birth components
 */
export function validateDOB(dob: DateOfBirth | undefined, fieldPrefix: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!dob) return errors;

  // Validate month (1-12)
  if (dob.month !== undefined && dob.month !== null) {
    const month = typeof dob.month === 'string' ? parseInt(dob.month, 10) : dob.month;
    if (isNaN(month) || month < VALIDATION_CONSTANTS.MONTH_MIN || month > VALIDATION_CONSTANTS.MONTH_MAX) {
      errors.push({
        field: `${fieldPrefix}Month`,
        message: 'Month must be between 1 and 12',
      });
    }
  }

  // Validate day (1-31)
  if (dob.day !== undefined && dob.day !== null) {
    const day = typeof dob.day === 'string' ? parseInt(dob.day, 10) : dob.day;
    if (isNaN(day) || day < VALIDATION_CONSTANTS.DAY_MIN || day > VALIDATION_CONSTANTS.DAY_MAX) {
      errors.push({
        field: `${fieldPrefix}Day`,
        message: 'Day must be between 1 and 31',
      });
    }
  }

  // Validate year (1900-2026)
  if (dob.year !== undefined && dob.year !== null) {
    const year = typeof dob.year === 'string' ? parseInt(dob.year, 10) : dob.year;
    if (isNaN(year) || year < VALIDATION_CONSTANTS.YEAR_MIN || year > VALIDATION_CONSTANTS.YEAR_MAX) {
      errors.push({
        field: `${fieldPrefix}Year`,
        message: `Year must be between ${VALIDATION_CONSTANTS.YEAR_MIN} and ${VALIDATION_CONSTANTS.YEAR_MAX}`,
      });
    }
  }

  return errors;
}

/**
 * Validate context text
 */
export function validateContext(context: unknown): ValidationError | null {
  if (context === undefined || context === null || context === '') {
    return null; // Context is optional
  }

  if (typeof context !== 'string') {
    return { field: 'context', message: 'Context must be a string' };
  }

  if (context.length > VALIDATION_CONSTANTS.CONTEXT_MAX_LENGTH) {
    return {
      field: 'context',
      message: `Context must be ${VALIDATION_CONSTANTS.CONTEXT_MAX_LENGTH} characters or less`,
    };
  }

  if (containsInjectionAttempt(context)) {
    return { field: 'context', message: 'Context contains invalid content' };
  }

  return null;
}

/**
 * Validate location fields
 */
export function validateLocation(
  city: unknown,
  state: unknown,
  fieldPrefix: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (city !== undefined && city !== null && city !== '') {
    if (typeof city !== 'string') {
      errors.push({ field: `${fieldPrefix}City`, message: 'City must be a string' });
    } else if (city.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: `${fieldPrefix}City`,
        message: `City must be ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters or less`,
      });
    } else if (containsInjectionAttempt(city)) {
      errors.push({ field: `${fieldPrefix}City`, message: 'City contains invalid characters' });
    }
  }

  if (state !== undefined && state !== null && state !== '') {
    if (typeof state !== 'string') {
      errors.push({ field: `${fieldPrefix}State`, message: 'State must be a string' });
    } else if (state.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: `${fieldPrefix}State`,
        message: `State must be ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters or less`,
      });
    } else if (containsInjectionAttempt(state)) {
      errors.push({ field: `${fieldPrefix}State`, message: 'State contains invalid characters' });
    }
  }

  return errors;
}

/**
 * Validate a complete person's data
 */
export function validatePerson(
  person: PersonData | undefined,
  prefix: string,
  nameRequired: boolean = true
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!person) {
    if (nameRequired) {
      errors.push({ field: `${prefix}Name`, message: `${prefix} name is required` });
    }
    return errors;
  }

  // Validate name (required)
  const nameError = validateName(person.name, `${prefix} Name`, nameRequired);
  if (nameError) errors.push(nameError);

  // Validate full name (optional)
  const fullNameError = validateName(person.fullName, `${prefix} Full Name`, false);
  if (fullNameError) errors.push(fullNameError);

  // Validate age (optional)
  const ageError = validateAge(person.age, `${prefix} Age`);
  if (ageError) errors.push(ageError);

  // Validate DOB (optional)
  const dobErrors = validateDOB(person.dob, `${prefix} `);
  errors.push(...dobErrors);

  // Validate location (optional)
  const locationErrors = validateLocation(
    person.location?.city,
    person.location?.state,
    `${prefix} `
  );
  errors.push(...locationErrors);

  return errors;
}

/**
 * Main validation function for the complete form
 */
export function validateFormData(data: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate user data
  const userErrors = validatePerson(data.user, 'User', true);
  errors.push(...userErrors);

  // Validate crush data
  const crushErrors = validatePerson(data.crush, 'Crush', true);
  errors.push(...crushErrors);

  // Validate context
  const contextError = validateContext(data.context);
  if (contextError) errors.push(contextError);

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Create sanitized data
  const sanitizedData: SanitizedFormData = {
    user: {
      name: sanitizeString(data.user.name),
      fullName: sanitizeString(data.user.fullName || data.user.name),
      age: data.user.age ? (sanitizeNumber(data.user.age)?.toString() ?? 'Not provided') : 'Not provided',
      dob: formatDOB(data.user.dob),
      location: formatLocation(data.user.location),
    },
    crush: {
      name: sanitizeString(data.crush.name),
      fullName: sanitizeString(data.crush.fullName || data.crush.name),
      age: sanitizeNumber(data.crush.age)?.toString() ?? 'Not provided',
      dob: formatDOB(data.crush.dob),
      location: formatLocation(data.crush.location),
    },
    context: sanitizeString(data.context || ''),
  };

  return { isValid: true, errors: [], sanitizedData };
}

/**
 * Check if this is the Easter egg case (same person)
 */
export function isEasterEggCase(data: FormData): boolean {
  const userName = data.user.name.toLowerCase().trim();
  const crushName = data.crush.name.toLowerCase().trim();

  // Names must match (case-insensitive)
  if (userName !== crushName) {
    return false;
  }

  // Check if DOBs are explicitly different
  const userDOB = data.user.dob;
  const crushDOB = data.crush.dob;

  if (userDOB && crushDOB) {
    const hasDifferentDOB =
      (userDOB.day && crushDOB.day && userDOB.day !== crushDOB.day) ||
      (userDOB.month && crushDOB.month && userDOB.month !== crushDOB.month) ||
      (userDOB.year && crushDOB.year && userDOB.year !== crushDOB.year);

    if (hasDifferentDOB) {
      return false;
    }
  }

  // Check if locations are explicitly different
  const userLocation = data.user.location;
  const crushLocation = data.crush.location;

  if (userLocation && crushLocation) {
    const hasDifferentLocation =
      (userLocation.city && crushLocation.city && 
       userLocation.city.toLowerCase().trim() !== crushLocation.city.toLowerCase().trim()) ||
      (userLocation.state && crushLocation.state && 
       userLocation.state.toLowerCase().trim() !== crushLocation.state.toLowerCase().trim());

    if (hasDifferentLocation) {
      return false;
    }
  }

  return true;
}

/**
 * Get Easter egg response
 */
export function getEasterEggResponse(userName: string): { percentage: number; summary: string } {
  return {
    percentage: 100,
    summary: `You and yourself are a 100% match! Ah ${userName}, trying to date yourself? Bold move! As Matthew 22:39 says, "Love your neighbor as yourself" — but maybe love yourself first before finding a neighbor to love! Your itna for yourself is giving main character energy. Pasian in nang hong it, God loves you, now go find someone else to love too!`,
  };
}

