import { useState, useEffect } from 'react';
import { formatPOSClock } from '../utils/formatters';

export function useClock(): string {
  const [clockStr, setClockStr] = useState<string>(() => formatPOSClock(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setClockStr(formatPOSClock(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return clockStr;
}
