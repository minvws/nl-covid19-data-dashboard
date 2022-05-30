import { cleanup, renderHook } from '@testing-library/react-hooks/server';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { CurrentDateProvider, useCurrentDate } from '../current-date-context';
import { endOfDayInSeconds } from '@corona-dashboard/common';
import injectJsDom from 'jsdom-global';

const UseCurrentDate = suite('useCurrentDate');

UseCurrentDate.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseCurrentDate.after.each(() => {
  cleanup();
});

UseCurrentDate.after((context) => {
  context.cleanupJsDom();
});

UseCurrentDate('should return the passed date initially', () => {
  const yesterday = endOfDayInSeconds(
    new Date().setDate(new Date().getDate() - 1) / 1000
  );

  const { result } = renderHook(() => useCurrentDate(), {
    wrapper: ({ children }) => (
      <CurrentDateProvider dateInSeconds={yesterday}>
        {children}
      </CurrentDateProvider>
    ),
  });

  assert.instance(result.current, Date);
  assert.equal(result.current, new Date(yesterday * 1000));
});

UseCurrentDate('should return the current date after hydration', () => {
  const yesterday = endOfDayInSeconds(
    new Date().setDate(new Date().getDate() - 1) / 1000
  );

  const now = endOfDayInSeconds(Date.now() / 1000);

  const { result, hydrate } = renderHook(() => useCurrentDate(), {
    wrapper: ({ children }) => (
      <CurrentDateProvider dateInSeconds={yesterday}>
        {children}
      </CurrentDateProvider>
    ),
  });

  assert.instance(result.current, Date);
  assert.equal(result.current, new Date(yesterday * 1000));

  hydrate();

  assert.instance(result.current, Date);
  assert.equal(result.current, new Date(now * 1000));
});

UseCurrentDate(
  'should throw when CurrentDateProvider is not in the tree',
  () => {
    const { result } = renderHook(() => useCurrentDate());
    assert.throws(() => result.current, 'CurrentDateContext is not available');
  }
);

UseCurrentDate.run();
