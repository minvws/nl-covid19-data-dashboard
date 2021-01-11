import { useMemo } from 'react';
import siteText from '~/locale';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { ChoroplethThresholdsValue } from '../shared';
import { DataValue } from './use-municipality-data';

/**
 * This hook generates a text that describes the distribution of the choropleth data for accessibility purposes.
 */
export function useChoroplethDataDescription<T>(
  thresholds: ChoroplethThresholdsValue[],
  gmValues: DataValue[],
  metricName: keyof T,
  metricProperty: string,
  area: 'vr' | 'gm',
  gemcodes?: string[]
) {
  return useMemo(() => {
    const dynamicTexts = getDynamicTextTemplates(metricName, metricProperty);

    if (!dynamicTexts) {
      return '';
    }

    const areas = siteText.choropleth[area];
    const verbs = siteText.choropleth.verb;

    const filteredGmValues = gemcodes
      ? gmValues.filter((gm) => {
          return gemcodes.indexOf(gm.code) > -1;
        })
      : gmValues;

    const ranges = thresholds
      .map((t, index) => {
        const nextThreshold =
          (thresholds[index + 1]?.threshold ?? Infinity) - 1;
        const range = [t.threshold, nextThreshold];
        const result = {
          rangeLow: range[0],
          rangeHigh: range[1],
          count: filteredGmValues.reduce((acc, gm) => {
            if (gm.value >= range[0] && gm.value <= range[1]) {
              return ++acc;
            }
            return acc;
          }, 0),
        };
        return result;
      })
      .filter((x) => x.count > 0);

    if (ranges.length == 0) {
      return '';
    }

    const texts = ranges.map((range) => {
      const txt =
        range.rangeHigh === Infinity
          ? dynamicTexts.last_sentence
          : dynamicTexts.sentence;
      const verb = range.count > 1 ? verbs.plural : verbs.singular;
      const area = range.count > 1 ? areas.plural : areas.singular;
      return replaceVariablesInText(txt, { ...range, verb, area });
    });

    return texts.length > 1
      ? replaceVariablesInText(dynamicTexts.full_sentence, {
          first: texts.slice(0, -1).join(', '),
          last: texts.slice(-1).join(''),
        })
      : replaceVariablesInText(dynamicTexts.full_sentence_single, {
          first: texts[0],
        });
  }, [thresholds, gmValues, metricName, metricProperty, area, gemcodes]);
}

/**
 * Retrieves the text templates for the given metric.
 *
 * Behavior represents an exception here. In order to avoid having to define
 * a separate sentence for each restriction and each type (support and compliance)
 * an extra placeholder called {{restriction}} is added to the sentence which
 * is replaced with the currently selected restriction (extracted from the metric property)
 * and then returned.
 */
function getDynamicTextTemplates<T>(
  metricName: keyof T,
  metricProperty: string
) {
  if (metricName === 'behavior') {
    const parts = metricProperty.split('_');
    const restrictionKey = parts.slice(0, -1).join('_');
    const restriction = (siteText.gedrag_onderwerpen as any)[restrictionKey];
    const type = parts.slice(-1).join('');
    const texts = (siteText.choropleth as any)[metricName]?.[type];
    return {
      ...texts,
      sentence: texts.sentence.replace('{{restriction}}', restriction),
      last_sentence: texts.last_sentence.replace(
        '{{restriction}}',
        restriction
      ),
    };
  } else {
    return (siteText.choropleth as any)[metricName]?.[metricProperty];
  }
}
