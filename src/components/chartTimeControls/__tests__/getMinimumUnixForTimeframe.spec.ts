import { getMinimumUnixForTimeframe } from '../chartTimeControlUtils';

describe('Utils: getMinimumUnixForTimeframe', () => {
  it('should return zero for all', () => {
    const result = getMinimumUnixForTimeframe('all');

    expect(result).toEqual(0);
  });

  it('should return greater than zero for week', () => {
    const result = getMinimumUnixForTimeframe('week');

    const today = new Date().getTime();

    var secondsDelta = Math.abs(today - result) / 1000;
    var daysDelta = Math.floor(secondsDelta / 86400);

    expect(daysDelta).toEqual(8);
  });

  it('should return greater than zero for 5weeks', () => {
    const result = getMinimumUnixForTimeframe('5weeks');

    const today = new Date().getTime();

    var secondsDelta = Math.abs(today - result) / 1000;
    var daysDelta = Math.floor(secondsDelta / 86400);

    expect(daysDelta).toEqual(36);
  });
});
