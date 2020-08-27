import { visit } from '../visit';

const raw = {
  foo: 'bar',
};

const fn = (str: string) => str.toUpperCase();

describe('Visit Function', () => {
  it('Should apply traverse to object', () => {
    expect(visit(raw, fn)).toStrictEqual({
      foo: 'BAR',
    });
  });
});
