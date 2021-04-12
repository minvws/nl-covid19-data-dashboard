import { assert } from '@corona-dashboard/common';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 *
 */

const CurrentDateContext = createContext<Date | undefined>(undefined);

export function CurrentDateProvider({
  dateInSeconds,
  children,
}: {
  dateInSeconds: number;
  children: ReactNode;
}) {
  const [date, setDate] = useState(new Date(dateInSeconds * 1000));
  useEffect(() => setDate(new Date()), []);

  return (
    <CurrentDateContext.Provider value={date}>
      {children}
    </CurrentDateContext.Provider>
  );
}

export function useCurrentDate() {
  const currentDate = useContext(CurrentDateContext);
  assert(currentDate, 'Missing CurrentDateProvider in component tree');

  return currentDate;
}
