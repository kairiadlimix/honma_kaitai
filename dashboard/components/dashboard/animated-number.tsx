'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({ 
  value, 
  duration = 1000, 
  decimals = 0,
  prefix = '',
  suffix = '' 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue);

  return (
    <span>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

