import { getMinimumUnixForTimeframe } from '..';

describe('Utils: getMinimumUnixForTimeframe', () => {
  it('should return zero for all', () => {
    const result = getMinimumUnixForTimeframe('all', new Date());

    expect(result).toEqual(0);
  });

  it('should return greater than zero for 5weeks', () => {
    const result = getMinimumUnixForTimeframe('5weeks', new Date());

    const today = new Date().getTime();

    const secondsDelta = Math.abs(today - result) / 1000;
    const daysDelta = Math.floor(secondsDelta / 86400);

    expect(daysDelta).toEqual(36);
  });
});
