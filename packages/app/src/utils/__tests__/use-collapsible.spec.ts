import { renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useCollapsible } from '../use-collapsible';

const UseCollapsible = suite('useCollapsible');

UseCollapsible('should', () => {
  const { result } = renderHook(() => useCollapsible());

  assert.is(true, false);
});

UseCollapsible.run();
