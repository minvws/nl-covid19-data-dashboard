import { getDaysForTimeframe } from '../chartTimeControlUtils';

describe('Utils: getDaysForTimeframe', () => {
  it('should return 8 for week', () => {
    const result = getDaysForTimeframe('week');
    expect(result).toEqual(8);
  });

  it('should return 36 for 5weeks', () => {
    const result = getDaysForTimeframe('5weeks');
    expect(result).toEqual(36);
  });

  it('should return Infinity for all', () => {
    const result = getDaysForTimeframe('all');
    expect(result).toEqual(Infinity);
  });
});
