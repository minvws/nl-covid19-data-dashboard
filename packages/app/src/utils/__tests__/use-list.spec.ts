import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useList } from '../use-list';

const UseList = suite('useList');

UseList.after.each(() => {
  cleanup();
  sinon.restore();
});

UseList.before.each((context) => {});

UseList('should return initial value', () => {
  const list = [1, 2, 3, 4];
  const { result } = renderHook(() => useList(list));

  assert.equal(result.current.list, list);
});

UseList('should add the given value to the list', () => {
  const list = [1, 2, 3, 4];
  const { result } = renderHook(() => useList(list));

  act(() => {
    result.current.add(5);
  });

  assert.equal(result.current.list.includes(5), true);
});

UseList('should remove the given value to the list', () => {
  const list = [1, 2, 3, 4];
  const { result } = renderHook(() => useList(list));

  act(() => {
    result.current.remove(4);
  });

  assert.equal(result.current.list.includes(4), false);
});

UseList(
  'should add the given value to the list if its not already in there',
  () => {
    const list = [1, 2, 3, 4];
    const { result } = renderHook(() => useList(list));

    act(() => {
      result.current.toggle(5);
    });

    assert.equal(result.current.list.includes(5), true);
  }
);

UseList(
  'should remove the given value to the list if its already in there',
  () => {
    const list = [1, 2, 3, 4];
    const { result } = renderHook(() => useList(list));

    act(() => {
      result.current.toggle(4);
    });

    assert.equal(result.current.list.includes(4), false);
  }
);

UseList('should clear the list', () => {
  const list = [1, 2, 3, 4];
  const { result } = renderHook(() => useList(list));

  act(() => {
    result.current.clear();
  });

  assert.equal(result.current.list.length, 0);
});

UseList.run();
