/**
 * JavaScript uses milliseconds since EPOCH, therefore the value
 * used to create the new Date instance needs to be multiplied by 1000
 * to create an accurate dateTime
 */
export function createDateFromUnixTimestamp(seconds: number): Date {
  return new Date(seconds * 1000);
}
