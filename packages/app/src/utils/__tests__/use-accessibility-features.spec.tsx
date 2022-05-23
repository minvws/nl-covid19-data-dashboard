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
import { useUniqueId } from '../use-unique-id';

const UseAccessibilityAnnotations = suite('useAccessibilityAnnotations');

const originalUseUniqueId = useUniqueId.bind({}); // clones the hook

UseAccessibilityAnnotations.before((context) => {
  context.cleanupJsDom = injectJsDom();

  // @TODO: Mocking a React Hook is not possible without installing another npm package. We might consider cleaning this up later
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useUniqueId = () => 'uniqueId';
});

UseAccessibilityAnnotations.after((context) => {
  context.cleanupJsDom();

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useUniqueId = originalUseUniqueId;
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
      id: 'testKey_uniqueId',
      children: 'test description',
    });
    assert.equal(result.current.props, {
      'aria-label': 'test label',
      'aria-describedby': 'testKey_uniqueId',
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
      id: 'testKey_uniqueId',
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
    commonTexts: {
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
    } as unknown as SiteText['common'],
    ...formatters,
  };

  return (
    <IntlContext.Provider value={contextValue}>{children}</IntlContext.Provider>
  );
}

UseAccessibilityAnnotations.run();
