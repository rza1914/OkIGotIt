import { useEffect } from 'react';

export const useLockBodyScroll = (lock: boolean) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (lock) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
};