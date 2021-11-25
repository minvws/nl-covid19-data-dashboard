import { createFormatting } from '@corona-dashboard/common';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as IntlMod from '~/intl';
import type { SiteText } from '~/locale';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '../use-accessibility-annotations';

const UseAccessibilityAnnotations = suite('useAccessibilityAnnotations');

UseAccessibilityAnnotations.before((context) => {
  context.cleanupJsDom = injectJsDom();

  const formatters = createFormatting('nl-NL', {
    date_today: 'vandaag',
    date_yesterday: 'gisteren',
    date_day_before_yesterday: 'eergisteren',
  });

  sinon.stub(IntlMod, 'useIntl').returns({
    dataset: 'development',
    locale: 'nl',
    siteText: {
      accessibility: {
        test: {
          label: 'test label',
          description: 'test description',
        },
      },
    } as unknown as SiteText,
    ...formatters,
  });
});

UseAccessibilityAnnotations.after((context) => {
  context.cleanupJsDom();
});

UseAccessibilityAnnotations.after.each(() => {
  cleanup();
});

UseAccessibilityAnnotations(
  'should return a description element and props',
  () => {
    const { result } = renderHook(() =>
      useAccessibilityAnnotations({
        key: 'test',
      } as unknown as AccessibilityDefinition)
    );

    console.log(result);
  }
);

UseAccessibilityAnnotations.run();
