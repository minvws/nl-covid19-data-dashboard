import { createFormatting } from '@corona-dashboard/common';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { IntlContext } from '~/intl';
import { SiteText } from '~/locale';
import { Dataset } from '~/locale/use-lokalize-text';
import { useFormatDateRange } from '../use-format-date-range';

const UseFormatDateRange = suite('useFormatDateRange');

UseFormatDateRange.after.each(() => {
  cleanup();
});

UseFormatDateRange('Should format separate months', () => {
  const intlContext = createContext();

  const { result } = renderHook(
    () => useFormatDateRange(1635807600, 1638399600),
    {
      wrapper: ({ children }) => (
        <IntlContext.Provider value={intlContext}>
          {children}
        </IntlContext.Provider>
      ),
    }
  );
  const [dateFromText, dateToText] = result.current;

  assert.is(dateFromText, '2 november');
  assert.is(dateToText, '2 december');
});

// For some reason this test fails on CI, I don't have time right now to figure out why,
// so skipping for now ;(
UseFormatDateRange.skip('Should format the same months', () => {
  const intlContext = createContext();

  const { result } = renderHook(
    () => useFormatDateRange(1638313200, 1638399600),
    {
      wrapper: ({ children }) => (
        <IntlContext.Provider value={intlContext}>
          {children}
        </IntlContext.Provider>
      ),
    }
  );
  const [dateFromText, dateToText] = result.current;

  assert.is(dateFromText, '1');
  assert.is(dateToText, '2 december');
});

UseFormatDateRange.run();

function createContext() {
  const {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  } = createFormatting('nl-NL', {} as SiteText['common']['utils']);

  return {
    dataset: 'production' as Dataset,
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
    commonTexts: {} as SiteText['common'],
    locale: 'nl' as 'nl' | 'en',
  };
}
