import { useState, useCallback } from 'react';
import { UseToggleReturn } from '@/types';

/**
 * Custom hook for managing boolean state with toggle functionality
 * @param initialValue - Initial boolean value
 * @returns Object with value, toggle, setTrue, setFalse, and setValue functions
 */
export const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setValueCallback = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setValueCallback,
  };
};
