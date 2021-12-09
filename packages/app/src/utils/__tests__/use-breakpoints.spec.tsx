import { cleanup, renderHook } from '@testing-library/react-hooks/server';
import injectJsDom from 'jsdom-global';
import { findKey } from 'lodash';
import * as sinon from 'sinon';
import { ThemeProvider } from 'styled-components';
import { Context, suite, uvu } from 'uvu';
import * as assert from 'uvu/assert';
import theme from '~/style/theme';
import { BreakpointContextProvider, useBreakpoints } from '../use-breakpoints';

type MediaQueryCallback = (evt: MediaQueryListEvent) => void;
type ContextWithMediaQueries = Context &
  uvu.Crumbs & {
    mediaQueryCallback: {
      -readonly [key in keyof typeof theme.mediaQueries]?: MediaQueryCallback;
    };
    matches: {
      -readonly [key in keyof typeof theme.mediaQueries]: boolean;
    };
  };

function getMqKey(mediaQuery: string) {
  return findKey(theme.mediaQueries, (mq) => mq === mediaQuery) as
    | keyof typeof theme.mediaQueries
    | undefined;
}

function addListenerStub(context: ContextWithMediaQueries, mediaQuery: string) {
  return (callback: MediaQueryCallback) => {
    const mqKey = getMqKey(mediaQuery);

    if (!mqKey) return;

    context.mediaQueryCallback[mqKey] = callback;
  };
}

const UseBreakpoints = suite('useBreakpoints');

UseBreakpoints.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseBreakpoints.after((context) => {
  context.cleanupJsDom();
});

UseBreakpoints.before.each((context) => {
  cleanup();
  context.mediaQueryCallback = {};
  context.matches = {};
  (window as any).matchMedia = () => undefined;
  sinon.stub(window, 'matchMedia').callsFake((mq: string) => {
    const mqKey = getMqKey(mq);

    return {
      matches: (mqKey && context.matches[mqKey]) ?? false,
      addListener: addListenerStub(context as ContextWithMediaQueries, mq),
    } as MediaQueryList;
  });
});

UseBreakpoints.after.each(() => {
  cleanup();
  sinon.restore();
});

function WrappingContext({ children }: { children: any }) {
  return (
    <ThemeProvider theme={theme}>
      <BreakpointContextProvider>{children}</BreakpointContextProvider>
    </ThemeProvider>
  );
}

UseBreakpoints('should return the given initial value by default', () => {
  const { result: resultFalse } = renderHook(() => useBreakpoints(false), {
    wrapper: WrappingContext,
  });

  assert.equal(resultFalse.current, {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  const { result: resultTrue } = renderHook(() => useBreakpoints(true), {
    wrapper: WrappingContext,
  });

  assert.equal(resultTrue.current, {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
  });
});

UseBreakpoints(
  'should return the match for each breakpoint after hydrating',
  (context) => {
    const { result, hydrate } = renderHook(() => useBreakpoints(false), {
      wrapper: WrappingContext,
    });

    assert.equal(result.current, {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    });

    const matches = {
      xs: true,
      sm: false,
      md: true,
      lg: false,
      xl: true,
    };

    context.matches = matches;

    hydrate();

    assert.equal(result.current, matches);
  }
);

UseBreakpoints('should update the breakpoints on change', (context) => {
  const { result, hydrate } = renderHook(() => useBreakpoints(false), {
    wrapper: WrappingContext,
  });

  hydrate();

  assert.equal(
    Object.keys(context.mediaQueryCallback),
    Object.keys(theme.mediaQueries),
    'Did not add change listeners for all media queries'
  );

  const expectedBreakpoints: Record<keyof typeof theme.mediaQueries, boolean> =
    {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    };

  Object.keys(theme.mediaQueries).forEach((mqKey) => {
    context.mediaQueryCallback[mqKey]({ matches: true });
    expectedBreakpoints[mqKey as keyof typeof theme.mediaQueries] = true;

    assert.equal(result.current, expectedBreakpoints);
  });
});

UseBreakpoints.run();
