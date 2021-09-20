import { assert } from '@corona-dashboard/common';
import { isDefined, isPresent } from 'ts-is-present';
import { ChoroplethDataItem, MapType } from '~/components/choropleth/logic';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseFullyVaccinatedPercentageLabel } from './parse-fully-vaccinated-percentage-label';

export function getVaccineCoverageDisplayValues(
  d: ChoroplethDataItem,
  text: SiteText['choropleth_tooltip'],
  map: MapType,
  formatPercentage: (value: number) => string
) {
  const metrics = {
    fully_vaccinated_percentage: '–',
    has_one_shot_percentage: '–',
  };

  const getFormattedLabelOrValue = getLabelOrValueFormatter(
    text,
    map,
    formatPercentage
  );

  if ('fully_vaccinated_percentage_label' in d) {
    metrics.fully_vaccinated_percentage = getFormattedLabelOrValue(
      d,
      'fully_vaccinated_percentage',
      'fully_vaccinated_percentage_label'
    );
  }

  if ('has_one_shot_percentage_label' in d) {
    metrics.has_one_shot_percentage = getFormattedLabelOrValue(
      d,
      'has_one_shot_percentage',
      'has_one_shot_percentage_label'
    );
  }

  return metrics;
}

function getLabelOrValueFormatter(
  text: SiteText['choropleth_tooltip'],
  map: MapType,
  formatPercentage: (value: number) => string
) {
  return function <T extends ChoroplethDataItem>(
    data: T,
    property: keyof T,
    labelKey: keyof T
  ) {
    const parsedValue = isPresent(data[labelKey])
      ? parseFullyVaccinatedPercentageLabel(data[labelKey] as unknown as string)
      : (data[property] as unknown as undefined | number | null) ?? null;

    if (typeof parsedValue === 'number') {
      return formatPercentage(parsedValue) + '%';
    } else if (isPresent(parsedValue) && 'sign' in parsedValue) {
      const content = (
        text as unknown as Record<
          MapType,
          Record<keyof T, Record<string, string>>
        >
      )[map]?.[property]?.[parsedValue.sign];

      assert(
        isDefined(content),
        `No tooltip content found in siteText.choropleth_tooltip.${map}.${property}.${parsedValue.sign}`
      );

      return replaceVariablesInText(content, {
        value: formatPercentage(parsedValue.value) + '%',
      });
    }

    return '–';
  };
}
