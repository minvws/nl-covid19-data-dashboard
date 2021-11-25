import { cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { usePrevious } from '../use-previous';

const UsePrevious = suite('usePrevious');

UsePrevious.after.each(() => {
  cleanup();
});

UsePrevious('should return return undefined initially', (context) => {
  const { result } = renderHook((value) => usePrevious(value), {
    initialProps: 'test',
  });

  const firstResult = result.all[0];

  assert.equal(firstResult, undefined);
});

UsePrevious('should return return previous value', (context) => {
  const { result, rerender } = renderHook((value) => usePrevious(value), {
    initialProps: 'test',
  });

  rerender('test2');

  assert.equal(result.all[1], 'test');

  rerender('test3');

  assert.equal(result.all[2], 'test2');
});

UsePrevious.run();
