import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { wrapAroundLength } from '../number';

const WrapAroundLength = suite('wrapAroundLength');

WrapAroundLength('should not wrap a number when n < len', () => {
  assert.is(wrapAroundLength(5, 10), 5);
});

WrapAroundLength('should return 0 when n > len', () => {
  assert.is(wrapAroundLength(15, 10), 0);
});

WrapAroundLength('should return 0 when n > 0', () => {
  assert.is(wrapAroundLength(-1, 1), 0);
});

WrapAroundLength('should throw when len < 0', () => {
  assert.throws(() => wrapAroundLength(1, -1));
});

WrapAroundLength.run();
