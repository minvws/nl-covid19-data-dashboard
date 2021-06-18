import { endOfDay, startOfDay } from 'date-fns';

export function startOfDayInSeconds(seconds: number) {
  return Math.round(startOfDay(seconds * 1000).getTime() / 1000);
}

export function endOfDayInSeconds(seconds: number) {
  return Math.round(endOfDay(seconds * 1000).getTime() / 1000);
}
