import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useReverseRouter } from '../use-reverse-router';

const UseReverseRouter = suite('useReverseRouter');

UseReverseRouter.before((context) => {
  context.cleanupJsDom = injectJsDom();
  (window as any).matchMedia = () => {};
  sinon.stub(window, 'matchMedia').callsFake((mq: string) => {
    console.log('mq', mq);
    switch (mq) {
      case 'screen and (min-width: 26em)': {
        return {
          matches: true,
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
});

UseReverseRouter.before.each((context) => {});

UseReverseRouter(
  'indexes should have menu suffix on small pages',
  (context) => {
    const { result } = renderHook(() => useReverseRouter());

    assert.equal(result.current.nl.index().endsWith('?menu=1'), true);
    assert.equal(result.current.vr.index().endsWith('?menu=1'), true);
    assert.equal(result.current.gm.index().endsWith('?menu=1'), true);
    assert.equal(result.current.in.index().endsWith('?menu=1'), true);
  }
);

UseReverseRouter.run();
