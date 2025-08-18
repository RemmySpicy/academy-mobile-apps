import { useState, useCallback } from 'react';
import { useTheme } from '@academy/mobile-shared';

interface PasswordStrength {
  score: number; // 0-5
  feedback: string[];
  isValid: boolean;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
}

/**
 * Password Validation Hook
 * 
 * Provides real-time password strength analysis and validation
 */
export const usePasswordValidation = () => {
  const { theme } = useTheme();
  
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
    label: 'Very Weak',
    color: theme.colors.status.error,
  });

  const validatePassword = useCallback((password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Determine label and color
    const labels: PasswordStrength['label'][] = [
      'Very Weak',
      'Weak', 
      'Fair',
      'Good',
      'Strong',
      'Very Strong'
    ];

    const colors = [
      theme.colors.status.error,    // Red
      theme.colors.status.warning,  // Orange
      theme.colors.status.warning,  // Orange
      theme.colors.status.success,  // Green
      theme.colors.icon.success,    // Dark Green
      theme.colors.icon.success,    // Darker Green
    ];

    const result: PasswordStrength = {
      score,
      feedback,
      isValid: score >= 4, // Require at least 4/5 criteria
      label: labels[score] || 'Very Weak',
      color: colors[score] || theme.colors.status.error,
    };

    setStrength(result);
    return result;
  }, [theme]);

  const checkPasswordMatch = useCallback((password: string, confirmPassword: string) => {
    return {
      isMatch: password === confirmPassword,
      message: password === confirmPassword ? '' : 'Passwords do not match',
    };
  }, []);

  return {
    strength,
    validatePassword,
    checkPasswordMatch,
  };
};