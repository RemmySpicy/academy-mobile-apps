import { useState, useEffect } from 'react';

/**
 * Hook to delay elevation/shadow application until after animations complete
 * This prevents shadow rendering artifacts during Reanimated entrance animations
 * 
 * @param delay - Delay in milliseconds before applying elevation (default: 400ms)
 * @returns boolean indicating whether elevation should be applied
 */
export const useDelayedElevation = (delay: number = 400): boolean => {
  const [showElevation, setShowElevation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElevation(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showElevation;
};