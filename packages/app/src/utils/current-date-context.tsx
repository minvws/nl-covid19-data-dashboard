import { assert } from '@corona-dashboard/common';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * Dates shouldn't be created during render because the server-side date can be
 * different compared to the date created client-side (especially with a static
 * site: build today, visit tomorrow). The difference between dates (or any
 * variable actually) between server and client can result in different html
 * output between server and client. These differences can in turn result in
 * react rehydration errors such as missing DOM-elements or DOM-
 * elements with wrong attributes.
 *
 * The CurrentDateContext will now hold the "today" date. On the server this is
 * populated with the "last generated" date and on the client the state will be
 * mutated after mount. The explicit state mutation will ensure components are
 * correctly re-rendered where necessary, which means rehydration issues won't
 * pop up anymore.
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
