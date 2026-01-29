'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, ChevronDown, ChevronUp, MapPin, Calendar, Hash, MessageSquare } from 'lucide-react';
import type { FormData, DateOfBirth, Location } from '@/lib/types';

interface InputFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

// Client-side validation constants
const VALIDATION = {
  NAME_MIN: 1,
  NAME_MAX: 100,
  AGE_MIN: 1,
  AGE_MAX: 99,
  MONTH_MIN: 1,
  MONTH_MAX: 12,
  DAY_MIN: 1,
  DAY_MAX: 31,
  YEAR_MIN: 1900,
  YEAR_MAX: 2026,
  CONTEXT_MAX: 500,
};

export default function InputForm({ onSubmit }: InputFormProps) {
  // Basic inputs
  const [userName, setUserName] = useState('');
  const [crushName, setCrushName] = useState('');
  
  // Advanced details toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // User advanced details
  const [userFullName, setUserFullName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userDobDay, setUserDobDay] = useState('');
  const [userDobMonth, setUserDobMonth] = useState('');
  const [userDobYear, setUserDobYear] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userState, setUserState] = useState('');
  
  // Crush advanced details
  const [crushFullName, setCrushFullName] = useState('');
  const [crushAge, setCrushAge] = useState('');
  const [crushDobDay, setCrushDobDay] = useState('');
  const [crushDobMonth, setCrushDobMonth] = useState('');
  const [crushDobYear, setCrushDobYear] = useState('');
  const [crushCity, setCrushCity] = useState('');
  const [crushState, setCrushState] = useState('');
  
  // Shared context
  const [context, setContext] = useState('');
  
  // Form state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation helper
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'userName':
      case 'crushName':
        if (!value.trim()) return 'Name is required';
        if (value.length > VALIDATION.NAME_MAX) return `Max ${VALIDATION.NAME_MAX} characters`;
        return null;
        
      case 'userAge':
      case 'crushAge':
        if (!value) return null; // Optional
        const age = parseInt(value, 10);
        if (isNaN(age) || !Number.isInteger(parseFloat(value))) return 'Must be a whole number';
        if (age < VALIDATION.AGE_MIN || age > VALIDATION.AGE_MAX) {
          return `Must be ${VALIDATION.AGE_MIN}-${VALIDATION.AGE_MAX}`;
        }
        return null;
        
      case 'userDobMonth':
      case 'crushDobMonth':
        if (!value) return null;
        const month = parseInt(value, 10);
        if (isNaN(month) || month < VALIDATION.MONTH_MIN || month > VALIDATION.MONTH_MAX) {
          return 'Month: 1-12';
        }
        return null;
        
      case 'userDobDay':
      case 'crushDobDay':
        if (!value) return null;
        const day = parseInt(value, 10);
        if (isNaN(day) || day < VALIDATION.DAY_MIN || day > VALIDATION.DAY_MAX) {
          return 'Day: 1-31';
        }
        return null;
        
      case 'userDobYear':
      case 'crushDobYear':
        if (!value) return null;
        const year = parseInt(value, 10);
        if (isNaN(year) || year < VALIDATION.YEAR_MIN || year > VALIDATION.YEAR_MAX) {
          return `Year: ${VALIDATION.YEAR_MIN}-${VALIDATION.YEAR_MAX}`;
        }
        return null;
        
      case 'context':
        if (value.length > VALIDATION.CONTEXT_MAX) {
          return `Max ${VALIDATION.CONTEXT_MAX} characters`;
        }
        return null;
        
      default:
        return null;
    }
  };

  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    const error = validateField(field, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const { [field]: _unused, ...rest } = prev;
      return rest;
    });
  };

  const buildFormData = (): FormData => {
    const buildDOB = (day: string, month: string, year: string): DateOfBirth | undefined => {
      if (!day && !month && !year) return undefined;
      return {
        day: day ? parseInt(day, 10) : null,
        month: month ? parseInt(month, 10) : null,
        year: year ? parseInt(year, 10) : null,
      };
    };

    const buildLocation = (city: string, state: string): Location | undefined => {
      if (!city && !state) return undefined;
      return { city: city || undefined, state: state || undefined };
    };

    return {
      user: {
        name: userName.trim(),
        fullName: userFullName.trim() || undefined,
        age: userAge ? parseInt(userAge, 10) : null,
        dob: buildDOB(userDobDay, userDobMonth, userDobYear),
        location: buildLocation(userCity, userState),
      },
      crush: {
        name: crushName.trim(),
        fullName: crushFullName.trim() || undefined,
        age: crushAge ? parseInt(crushAge, 10) : null,
        dob: buildDOB(crushDobDay, crushDobMonth, crushDobYear),
        location: buildLocation(crushCity, crushState),
      },
      context: context.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    const userNameError = validateField('userName', userName);
    if (userNameError) newErrors.userName = userNameError;
    
    const crushNameError = validateField('crushName', crushName);
    if (crushNameError) newErrors.crushName = crushNameError;
    
    // Validate optional fields if filled
    if (userAge) {
      const err = validateField('userAge', userAge);
      if (err) newErrors.userAge = err;
    }
    if (crushAge) {
      const err = validateField('crushAge', crushAge);
      if (err) newErrors.crushAge = err;
    }
    if (userDobMonth) {
      const err = validateField('userDobMonth', userDobMonth);
      if (err) newErrors.userDobMonth = err;
    }
    if (userDobDay) {
      const err = validateField('userDobDay', userDobDay);
      if (err) newErrors.userDobDay = err;
    }
    if (userDobYear) {
      const err = validateField('userDobYear', userDobYear);
      if (err) newErrors.userDobYear = err;
    }
    if (crushDobMonth) {
      const err = validateField('crushDobMonth', crushDobMonth);
      if (err) newErrors.crushDobMonth = err;
    }
    if (crushDobDay) {
      const err = validateField('crushDobDay', crushDobDay);
      if (err) newErrors.crushDobDay = err;
    }
    if (crushDobYear) {
      const err = validateField('crushDobYear', crushDobYear);
      if (err) newErrors.crushDobYear = err;
    }
    if (context) {
      const err = validateField('context', context);
      if (err) newErrors.context = err;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(buildFormData());
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl
    bg-white/60 backdrop-blur-sm
    border ${hasError ? 'border-red-300' : 'border-pink-200/50'}
    text-gray-700 placeholder-gray-400
    focus:border-pink-400 focus:ring-2 focus:ring-pink-200/50
    transition-all duration-300
  `;

  const smallInputClasses = (hasError: boolean) => `
    w-full px-3 py-2 rounded-lg text-sm
    bg-white/60 backdrop-blur-sm
    border ${hasError ? 'border-red-300' : 'border-pink-200/50'}
    text-gray-700 placeholder-gray-400
    focus:border-pink-400 focus:ring-2 focus:ring-pink-200/50
    transition-all duration-300
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="w-4 h-4 text-pink-500" />
          Your Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => handleFieldChange('userName', e.target.value, setUserName)}
          placeholder="Enter your name"
          className={inputClasses(!!errors.userName)}
          maxLength={VALIDATION.NAME_MAX}
          required
        />
        {errors.userName && (
          <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
        )}
      </div>

      {/* Crush Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          Your Crush &apos s Name
        </label>
        <input
          type="text"
          value={crushName}
          onChange={(e) => handleFieldChange('crushName', e.target.value, setCrushName)}
          placeholder="Enter their name"
          className={inputClasses(!!errors.crushName)}
          maxLength={VALIDATION.NAME_MAX}
          required
        />
        {errors.crushName && (
          <p className="text-xs text-red-500 mt-1">{errors.crushName}</p>
        )}
      </div>

      {/* Advanced Details Toggle */}
      <motion.button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl
          bg-gradient-to-r from-pink-50 to-purple-50
          border border-pink-200/50
          text-gray-600 text-sm font-medium
          hover:from-pink-100 hover:to-purple-100
          transition-all duration-300"
        whileTap={{ scale: 0.99 }}
      >
        <span>Advanced Details (Optional)</span>
        {showAdvanced ? (
          <ChevronUp className="w-5 h-5 text-pink-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-pink-500" />
        )}
      </motion.button>

      {/* Advanced Details Content */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-2">
              {/* Your Details Section */}
              <div className="space-y-4 p-4 rounded-2xl bg-pink-50/50 border border-pink-200/30">
                <h3 className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Details
                </h3>

                {/* Full Name */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    placeholder="Your full name"
                    className={smallInputClasses(false)}
                    maxLength={VALIDATION.NAME_MAX}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Age
                  </label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => handleFieldChange('userAge', e.target.value, setUserAge)}
                    placeholder="Your age"
                    className={smallInputClasses(!!errors.userAge)}
                    min={VALIDATION.AGE_MIN}
                    max={VALIDATION.AGE_MAX}
                  />
                  {errors.userAge && (
                    <p className="text-xs text-red-500 mt-1">{errors.userAge}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        value={userDobMonth}
                        onChange={(e) => handleFieldChange('userDobMonth', e.target.value, setUserDobMonth)}
                        placeholder="Month"
                        className={smallInputClasses(!!errors.userDobMonth)}
                        min={VALIDATION.MONTH_MIN}
                        max={VALIDATION.MONTH_MAX}
                      />
                      {errors.userDobMonth && (
                        <p className="text-xs text-red-500 mt-1">{errors.userDobMonth}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        value={userDobDay}
                        onChange={(e) => handleFieldChange('userDobDay', e.target.value, setUserDobDay)}
                        placeholder="Day"
                        className={smallInputClasses(!!errors.userDobDay)}
                        min={VALIDATION.DAY_MIN}
                        max={VALIDATION.DAY_MAX}
                      />
                      {errors.userDobDay && (
                        <p className="text-xs text-red-500 mt-1">{errors.userDobDay}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        value={userDobYear}
                        onChange={(e) => handleFieldChange('userDobYear', e.target.value, setUserDobYear)}
                        placeholder="Year"
                        className={smallInputClasses(!!errors.userDobYear)}
                        min={VALIDATION.YEAR_MIN}
                        max={VALIDATION.YEAR_MAX}
                      />
                      {errors.userDobYear && (
                        <p className="text-xs text-red-500 mt-1">{errors.userDobYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      placeholder="City"
                      className={smallInputClasses(false)}
                      maxLength={VALIDATION.NAME_MAX}
                    />
                    <input
                      type="text"
                      value={userState}
                      onChange={(e) => setUserState(e.target.value)}
                      placeholder="State/Region"
                      className={smallInputClasses(false)}
                      maxLength={VALIDATION.NAME_MAX}
                    />
                  </div>
                </div>
              </div>

              {/* Crush Details Section */}
              <div className="space-y-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-200/30">
                <h3 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-purple-500" />
                  Your Crush &apos s Details
                </h3>

                {/* Full Name */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={crushFullName}
                    onChange={(e) => setCrushFullName(e.target.value)}
                    placeholder="Their full name"
                    className={smallInputClasses(false)}
                    maxLength={VALIDATION.NAME_MAX}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Age
                  </label>
                  <input
                    type="number"
                    value={crushAge}
                    onChange={(e) => handleFieldChange('crushAge', e.target.value, setCrushAge)}
                    placeholder="Their age"
                    className={smallInputClasses(!!errors.crushAge)}
                    min={VALIDATION.AGE_MIN}
                    max={VALIDATION.AGE_MAX}
                  />
                  {errors.crushAge && (
                    <p className="text-xs text-red-500 mt-1">{errors.crushAge}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        value={crushDobMonth}
                        onChange={(e) => handleFieldChange('crushDobMonth', e.target.value, setCrushDobMonth)}
                        placeholder="Month"
                        className={smallInputClasses(!!errors.crushDobMonth)}
                        min={VALIDATION.MONTH_MIN}
                        max={VALIDATION.MONTH_MAX}
                      />
                      {errors.crushDobMonth && (
                        <p className="text-xs text-red-500 mt-1">{errors.crushDobMonth}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        value={crushDobDay}
                        onChange={(e) => handleFieldChange('crushDobDay', e.target.value, setCrushDobDay)}
                        placeholder="Day"
                        className={smallInputClasses(!!errors.crushDobDay)}
                        min={VALIDATION.DAY_MIN}
                        max={VALIDATION.DAY_MAX}
                      />
                      {errors.crushDobDay && (
                        <p className="text-xs text-red-500 mt-1">{errors.crushDobDay}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        value={crushDobYear}
                        onChange={(e) => handleFieldChange('crushDobYear', e.target.value, setCrushDobYear)}
                        placeholder="Year"
                        className={smallInputClasses(!!errors.crushDobYear)}
                        min={VALIDATION.YEAR_MIN}
                        max={VALIDATION.YEAR_MAX}
                      />
                      {errors.crushDobYear && (
                        <p className="text-xs text-red-500 mt-1">{errors.crushDobYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={crushCity}
                      onChange={(e) => setCrushCity(e.target.value)}
                      placeholder="City"
                      className={smallInputClasses(false)}
                      maxLength={VALIDATION.NAME_MAX}
                    />
                    <input
                      type="text"
                      value={crushState}
                      onChange={(e) => setCrushState(e.target.value)}
                      placeholder="State/Region"
                      className={smallInputClasses(false)}
                      maxLength={VALIDATION.NAME_MAX}
                    />
                  </div>
                </div>
              </div>

              {/* Shared Context */}
              <div className="space-y-2">
                <label className="text-xs text-gray-600 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> 
                  Shared Context (Optional)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => handleFieldChange('context', e.target.value, setContext)}
                  placeholder="E.g., We both love hiking and late-night coffee walks..."
                  className={`${smallInputClasses(!!errors.context)} resize-none h-24`}
                  maxLength={VALIDATION.CONTEXT_MAX}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  {errors.context && (
                    <p className="text-red-500">{errors.context}</p>
                  )}
                  <span className="ml-auto">{context.length}/{VALIDATION.CONTEXT_MAX}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 rounded-2xl
          bg-gradient-to-r from-pink-500 to-purple-500
          text-white font-semibold text-lg
          shadow-lg shadow-pink-500/30
          hover:shadow-xl hover:shadow-pink-500/40
          hover:from-pink-600 hover:to-purple-600
          disabled:opacity-70 disabled:cursor-not-allowed
          transition-all duration-300
        `}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Calculating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            Calculate
          </span>
        )}
      </motion.button>

      {/* Privacy Policy Caption */}
      <p className="text-center text-xs text-gray-500">
        By clicking calculate, you agree to our{' '}
        <a href="#" className="text-pink-500 hover:text-pink-600 underline">
          privacy policy
        </a>
      </p>
    </form>
  );
}
