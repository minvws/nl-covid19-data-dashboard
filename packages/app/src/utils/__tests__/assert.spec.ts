import { assert as testedAssert } from '../assert';
import * as assert from 'uvu/assert';
import { suite } from 'uvu';

const Assert = suite('assert');

Assert('should return undefined when the condition is truthy', () => {
  assert.is(testedAssert(true, 'message'), undefined);
});

Assert('should throw when the condition is falsey', () => {
  assert.throws(() => testedAssert(false, 'message'), 'message');
});

Assert.run();
