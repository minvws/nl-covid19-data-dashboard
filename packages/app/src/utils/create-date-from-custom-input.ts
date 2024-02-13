/**
 * Some business logic requires dates with specific year/month/day
 */
export function createDateFromCustomInput(year: number, month = 0, day = 1) {
  return new Date(year, month, day);
}
