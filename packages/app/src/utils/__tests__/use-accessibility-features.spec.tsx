import { createFormatting } from '@corona-dashboard/common';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import React from 'react';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { IntlContext } from '~/intl';
import { IntlContextProps } from '~/intl/hooks/use-intl';
import type { SiteText } from '~/locale';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '../use-accessibility-annotations';

const UseAccessibilityAnnotations = suite('useAccessibilityAnnotations');

UseAccessibilityAnnotations.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseAccessibilityAnnotations.after((context) => {
  context.cleanupJsDom();
});

UseAccessibilityAnnotations.after.each(() => {
  cleanup();
});

UseAccessibilityAnnotations(
  'should return a visually hidden description element and props',
  () => {
    const { result } = renderHook(
      () =>
        useAccessibilityAnnotations({
          key: 'testKey',
        } as unknown as AccessibilityDefinition),
      {
        wrapper,
      }
    );

    assert.equal(result.current.descriptionElement.type.name, 'VisuallyHidden');
    assert.equal(result.current.descriptionElement.props, {
      id: 'testKey_id',
      children: 'test description',
    });
    assert.equal(result.current.props, {
      'aria-label': 'test label',
      'aria-describedby': 'testKey_id',
    });
  }
);

UseAccessibilityAnnotations(
  'should concatenate description & features texts',
  () => {
    const { result } = renderHook(
      () =>
        useAccessibilityAnnotations({
          key: 'testKey',
          features: [
            'keyboard_time_series_chart',
            'keyboard_bar_chart',
            'keyboard_choropleth',
          ],
        } as unknown as AccessibilityDefinition),
      {
        wrapper,
      }
    );

    assert.equal(result.current.descriptionElement.props, {
      id: 'testKey_id',
      children:
        'test description test keyboard series feature test keyboard bar feature test keyboard choropleth feature',
    });
  }
);

UseAccessibilityAnnotations(
  'should throw an error when no label or description is defined',
  () => {
    const { result: resultNoLabel } = renderHook(
      () =>
        useAccessibilityAnnotations({
          key: 'testKeyNoLabel',
        } as unknown as AccessibilityDefinition),
      {
        wrapper,
      }
    );

    assert.ok(resultNoLabel.error);

    const { result: resultNoDescription } = renderHook(
      () =>
        useAccessibilityAnnotations({
          key: 'testKeyNoDescription',
        } as unknown as AccessibilityDefinition),
      {
        wrapper,
      }
    );

    assert.ok(resultNoDescription.error);
  }
);

function wrapper({ children }: { children: any }) {
  const formatters = createFormatting('nl-NL', {
    date_today: 'vandaag',
    date_yesterday: 'gisteren',
    date_day_before_yesterday: 'eergisteren',
  });

  const contextValue: IntlContextProps = {
    dataset: 'development',
    locale: 'nl',
    siteText: {
      accessibility: {
        charts: {
          testKey: {
            label: 'test label',
            description: 'test description',
          },
          testNoLabel: {
            label: '',
            description: 'test description',
          },
          testNoDescription: {
            label: 'test label',
          },
        },
        features: {
          keyboard_time_series_chart: 'test keyboard series feature',
          keyboard_bar_chart: 'test keyboard bar feature',
          keyboard_choropleth: 'test keyboard choropleth feature',
        },
      },
    } as unknown as SiteText,
    ...formatters,
  };

  return (
    <IntlContext.Provider value={contextValue}>{children}</IntlContext.Provider>
  );
}

UseAccessibilityAnnotations.run();
