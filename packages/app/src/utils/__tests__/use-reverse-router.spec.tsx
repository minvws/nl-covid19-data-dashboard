import { cleanup, render } from '@testing-library/react';
import { cleanup as cleanupHooks, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { ThemeProvider } from 'styled-components';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import theme from '~/style/theme';
import { BreakpointContextProvider } from '../use-breakpoints';
import { useReverseRouter } from '../use-reverse-router';

const UseReverseRouter = suite('useReverseRouter');

let largeScreen = false;
const gmCode = 'GM001';

UseReverseRouter.before((context) => {
  context.cleanupJsDom = injectJsDom();
  sinon.stub(window, 'matchMedia').callsFake((mq: string) => {
    switch (mq) {
      case theme.mediaQueries.md: {
        return {
          matches: largeScreen,
        } as MediaQueryList;
      }
      default:
        return {
          matches: false,
        } as MediaQueryList;
    }
  });
});

UseReverseRouter.after((context) => {
  context.cleanupJsDom();
  sinon.restore();
});

UseReverseRouter.after.each(() => {
  cleanup();
  cleanupHooks();
});

const TestContainer = () => {
  return (
    <ThemeProvider theme={theme}>
      <BreakpointContextProvider>
        <TestBed />
      </BreakpointContextProvider>
    </ThemeProvider>
  );
};

const TestBed = () => {
  const router = useReverseRouter();

  return (
    <>
      <div data-testid="nl">{router.nl.index()}</div>
      <div data-testid="gm">{router.gm.index(gmCode)}</div>
    </>
  );
};

UseReverseRouter('indexes should link to the actual index on small screens', () => {
  largeScreen = false;
  const result = render(<TestContainer />);
  const nlDiv = result.getByTestId('nl');
  const gmDiv = result.getByTestId('gm');

  assert.equal(nlDiv.textContent?.endsWith('/landelijk'), true);
  assert.equal(gmDiv.textContent?.endsWith(gmCode), true);
});

UseReverseRouter("indexes should 'redirect' to child pages", () => {
  largeScreen = true;
  const result = render(<TestContainer />);
  const nlDiv = result.getByTestId('nl');
  const gmDiv = result.getByTestId('gm');

  assert.equal(nlDiv.textContent?.endsWith('/deCoronaprik'), true);
  assert.equal(gmDiv.textContent?.endsWith('/deCoronaprik'), true);
});

UseReverseRouter('GM routes should have the GM code in them', () => {
  const { result } = renderHook(() => useReverseRouter());

  const keys = Object.keys(result.current.gm);
  keys.forEach((name) => {
    const route = (result.current.gm as any)[name](gmCode);
    assert.equal(route.indexOf(gmCode) > -1, true);
  });

  const route = result.current.gm.rioolwater(gmCode);
  assert.equal(route.indexOf(gmCode) > -1, true);
});

UseReverseRouter.run();
