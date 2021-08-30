import { isPresent } from 'ts-is-present';

type BirthYearRange = {
  type: 'before' | 'between' | 'after';
  start?: number;
  end?: number;
};

/**
 * Birth year ranges have one of the following shapes:
 *
 * '-2003' -> 2003 and before,
 * '2003-2009' -> 2003 to 2009,
 * '2009-' -> 2009 and after,
 *
 * This function parses the birth year range and returns the start and end
 */
export function parseBirthyearRange(str: string): BirthYearRange | null {
  const regex = /^(-*)([0-9]{4})(-*)([0-9]{4})*$/;
  const match = str.match(regex);

  if (isPresent(match)) {
    const [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _,
      before,
      start,
      betweenOrAfter,
      end,
    ] = match;

    // if we have a before indicator, only return the end year
    if (before === '-') {
      return {
        type: 'before',
        end: Number(start),
      };
    }

    // if we have a between indicator and both years are present, return both start and end
    if (betweenOrAfter === '-' && isPresent(start) && isPresent(end)) {
      return {
        type: 'between',
        start: Number(start),
        end: Number(end),
      };
    }

    // if we have a between indicator and only the start year is present, return only the start
    if (betweenOrAfter === '-') {
      return {
        type: 'after',
        start: Number(start),
      };
    }
  }

  return null;
}
