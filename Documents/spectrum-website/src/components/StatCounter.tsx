'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface StatCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function StatCounter({ value, duration = 2000, className = '' }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Extract number and suffix from value (e.g., "500+" -> 500, "+")
  const parseValue = (val: string) => {
    // Extract number part (including decimals)
    const numberMatch = val.match(/[\d.]+/);
    if (!numberMatch) return { number: 0, suffix: val, originalSuffix: '' };
    
    let number = parseFloat(numberMatch[0]);
    const remaining = val.replace(numberMatch[0], '');
    
    // Check for K, M, B in the remaining string
    let suffix = '';
    let originalSuffix = '';
    
    if (remaining.toLowerCase().includes('k')) {
      number *= 1000;
      suffix = 'K';
      originalSuffix = remaining.replace(/k/gi, '');
    } else if (remaining.toLowerCase().includes('m')) {
      number *= 1000000;
      suffix = 'M';
      originalSuffix = remaining.replace(/m/gi, '');
    } else if (remaining.toLowerCase().includes('b')) {
      number *= 1000000000;
      suffix = 'B';
      originalSuffix = remaining.replace(/b/gi, '');
    } else {
      originalSuffix = remaining;
    }
    
    return { number, suffix, originalSuffix };
  };

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const parsed = parseValue(value);
      const { number, suffix, originalSuffix } = parsed;
      
      if (number === 0) {
        setDisplayValue(value);
        return;
      }

      const startTime = Date.now();
      const startValue = 0;
      const endValue = number;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;

        // Format the number based on original suffix
        let formattedValue: string;
        if (suffix === 'M') {
          formattedValue = (currentValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (suffix === 'K') {
          formattedValue = (currentValue / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        } else if (suffix === 'B') {
          formattedValue = (currentValue / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        } else {
          formattedValue = Math.floor(currentValue).toString();
        }

        // Add original suffix (like +, %, etc.)
        if (originalSuffix) {
          formattedValue += originalSuffix;
        }

        setDisplayValue(formattedValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final value matches original format
          let finalFormatted: string;
          if (suffix === 'M') {
            finalFormatted = (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
          } else if (suffix === 'K') {
            finalFormatted = (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
          } else if (suffix === 'B') {
            finalFormatted = (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
          } else {
            finalFormatted = Math.floor(number).toString();
          }
          
          if (originalSuffix) {
            finalFormatted += originalSuffix;
          }
          
          setDisplayValue(finalFormatted);
        }
      };

      animate();
    }
  }, [isInView, hasAnimated, value, duration]);

  // Reset animation when value changes
  useEffect(() => {
    setHasAnimated(false);
    setDisplayValue('0');
  }, [value]);

  return (
    <div ref={ref} className={className}>
      {displayValue}
    </div>
  );
}

