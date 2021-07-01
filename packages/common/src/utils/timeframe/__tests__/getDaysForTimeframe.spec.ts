import { getDaysForTimeframe } from '..';

describe('Utils: getDaysForTimeframe', () => {
  it('should return 35 for 5weeks', () => {
    const result = getDaysForTimeframe('5weeks');
    expect(result).toEqual(35);
  });

  it('should return Infinity for all', () => {
    const result = getDaysForTimeframe('all');
    expect(result).toEqual(Infinity);
  });
});
