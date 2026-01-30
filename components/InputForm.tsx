'use client';

import { useState, useMemo } from 'react';
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
  CONTEXT_MAX: 500,
};

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Generate days 1-31
const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

// Generate years from current year back to 1925
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1925 + 1 }, (_, i) => ({
  value: String(CURRENT_YEAR - i),
  label: String(CURRENT_YEAR - i),
}));

// Indian States and Union Territories
const STATES = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UK', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
];

// Calculate age from DOB
const calculateAgeFromDOB = (year: string, month?: string, day?: string): number | null => {
  if (!year) return null;
  
  const birthYear = parseInt(year, 10);
  const birthMonth = month ? parseInt(month, 10) - 1 : 0;
  const birthDay = day ? parseInt(day, 10) : 1;
  
  const today = new Date();
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
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

  // Validate age matches DOB
  const validateAgeWithDOB = (age: string, year: string, month: string, day: string): string | null => {
    if (!age || !year) return null;
    
    const enteredAge = parseInt(age, 10);
    const calculatedAge = calculateAgeFromDOB(year, month, day);
    
    if (calculatedAge === null) return null;
    
    // Allow 1 year tolerance (birthday might not have happened yet this year)
    if (Math.abs(enteredAge - calculatedAge) > 1) {
      return `Age doesn't match DOB (should be ~${calculatedAge})`;
    }
    
    return null;
  };

  // Memoized age/DOB mismatch errors
  const userAgeMismatch = useMemo(() => 
    validateAgeWithDOB(userAge, userDobYear, userDobMonth, userDobDay),
    [userAge, userDobYear, userDobMonth, userDobDay]
  );
  
  const crushAgeMismatch = useMemo(() => 
    validateAgeWithDOB(crushAge, crushDobYear, crushDobMonth, crushDobDay),
    [crushAge, crushDobYear, crushDobMonth, crushDobDay]
  );

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
        if (!value) return null;
        const age = parseInt(value, 10);
        if (isNaN(age) || !Number.isInteger(parseFloat(value))) return 'Must be a whole number';
        if (age < VALIDATION.AGE_MIN || age > VALIDATION.AGE_MAX) {
          return `Must be ${VALIDATION.AGE_MIN}-${VALIDATION.AGE_MAX}`;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _unused, ...rest } = prev;
      return rest;
    });
  };

  // Helper to get state label from value
  const getStateLabelFromValue = (value: string): string | undefined => {
    const state = STATES.find(s => s.value === value);
    return state?.label;
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

    const buildLocation = (city: string, stateValue: string): Location | undefined => {
      if (!city && !stateValue) return undefined;
      // Store the full state name instead of the code
      const stateLabel = getStateLabelFromValue(stateValue);
      return { city: city || undefined, state: stateLabel || undefined };
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
    
    const newErrors: Record<string, string> = {};
    
    const userNameError = validateField('userName', userName);
    if (userNameError) newErrors.userName = userNameError;
    
    const crushNameError = validateField('crushName', crushName);
    if (crushNameError) newErrors.crushName = crushNameError;
    
    if (userAge) {
      const err = validateField('userAge', userAge);
      if (err) newErrors.userAge = err;
    }
    if (crushAge) {
      const err = validateField('crushAge', crushAge);
      if (err) newErrors.crushAge = err;
    }
    if (context) {
      const err = validateField('context', context);
      if (err) newErrors.context = err;
    }
    
    // Check age/DOB mismatches
    if (userAgeMismatch) newErrors.userAgeMismatch = userAgeMismatch;
    if (crushAgeMismatch) newErrors.crushAgeMismatch = crushAgeMismatch;
    
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

  const selectClasses = (hasError: boolean) => `
    w-full px-3 py-2 rounded-lg text-sm
    bg-white/60 backdrop-blur-sm
    border ${hasError ? 'border-red-300' : 'border-pink-200/50'}
    text-gray-700
    focus:border-pink-400 focus:ring-2 focus:ring-pink-200/50
    transition-all duration-300
    cursor-pointer appearance-none
    bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M7%207l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')]
    bg-no-repeat bg-[right_0.5rem_center]
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
          Your Crush&apos;s Name
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
                    className={smallInputClasses(!!errors.userAge || !!userAgeMismatch)}
                    min={VALIDATION.AGE_MIN}
                    max={VALIDATION.AGE_MAX}
                  />
                  {errors.userAge && (
                    <p className="text-xs text-red-500 mt-1">{errors.userAge}</p>
                  )}
                  {!errors.userAge && userAgeMismatch && (
                    <p className="text-xs text-orange-500 mt-1">{userAgeMismatch}</p>
                  )}
                </div>

                {/* Date of Birth - Dropdowns */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={userDobMonth}
                      onChange={(e) => setUserDobMonth(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <select
                      value={userDobDay}
                      onChange={(e) => setUserDobDay(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Day</option>
                      {DAYS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    <select
                      value={userDobYear}
                      onChange={(e) => setUserDobYear(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
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
                    <select
                      value={userState}
                      onChange={(e) => setUserState(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">State</option>
                      {STATES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Crush Details Section */}
              <div className="space-y-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-200/30">
                <h3 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-purple-500" />
                  Your Crush&apos;s Details
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
                    className={smallInputClasses(!!errors.crushAge || !!crushAgeMismatch)}
                    min={VALIDATION.AGE_MIN}
                    max={VALIDATION.AGE_MAX}
                  />
                  {errors.crushAge && (
                    <p className="text-xs text-red-500 mt-1">{errors.crushAge}</p>
                  )}
                  {!errors.crushAge && crushAgeMismatch && (
                    <p className="text-xs text-orange-500 mt-1">{crushAgeMismatch}</p>
                  )}
                </div>

                {/* Date of Birth - Dropdowns */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={crushDobMonth}
                      onChange={(e) => setCrushDobMonth(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <select
                      value={crushDobDay}
                      onChange={(e) => setCrushDobDay(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Day</option>
                      {DAYS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    <select
                      value={crushDobYear}
                      onChange={(e) => setCrushDobYear(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
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
                    <select
                      value={crushState}
                      onChange={(e) => setCrushState(e.target.value)}
                      className={selectClasses(false)}
                    >
                      <option value="">State</option>
                      {STATES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
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