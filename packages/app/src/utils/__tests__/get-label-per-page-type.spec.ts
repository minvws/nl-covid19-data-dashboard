import { ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getLabelPerPageType } from '~/components/choropleth/logic/get-label-per-page-type';
import { createFormatting } from '@corona-dashboard/common';
import { SiteText } from '~/locale';

const GetLabelPerPageType = suite('getLabelPerPageType');

const commonTexts = {
  common: {
    no_virus_particles_measured: 'Geen virusdeeltjes gemeten',
    no_notifications: 'Geen meldingen',
    bigger_than_zero_and_less_than_value: 'Groter dan 0 tot {{value_1}}',
  },
} as SiteText['common'];

const { formatNumber } = createFormatting('nl-NL', {} as SiteText['common']['utils']);

GetLabelPerPageType('Should return the label for sewer at index 0', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(0, data[0], data, 'sewer', commonTexts, formatNumber);

  assert.is(label, 'Geen virusdeeltjes gemeten');
});

GetLabelPerPageType('Should return the label for sewer at index 1', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(1, data[0], data, 'sewer', commonTexts, formatNumber);

  assert.is(label, 'Groter dan 0 tot 2');
});

GetLabelPerPageType('Should return the label for patienten-in-beeld at index 0', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(0, data[0], data, 'patienten-in-beeld', commonTexts, formatNumber);

  assert.is(label, 'Geen meldingen');
});

GetLabelPerPageType('Should return the label for patienten-in-beeld at index 1', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(1, data[0], data, 'patienten-in-beeld', commonTexts, formatNumber);

  assert.is(label, 'Groter dan 0 tot 2');
});

GetLabelPerPageType('Should return the label for ziekenhuis-opnames at index 0', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(0, data[0], data, 'ziekenhuis-opnames', commonTexts, formatNumber);

  assert.is(label, 'Geen meldingen');
});

GetLabelPerPageType('Should return the label for ziekenhuis-opnames at index 1', () => {
  const data: ChoroplethThresholdsValue[] = [
    {
      color: colors.gray2,
      threshold: 0,
    },
    {
      color: colors.scale.blue[0],
      threshold: 1,
    },
    {
      color: colors.scale.blue[1],
      threshold: 2,
    },
  ];

  let label = getLabelPerPageType(1, data[0], data, 'ziekenhuis-opnames', commonTexts, formatNumber);

  assert.is(label, 'Groter dan 0 tot 2');
});

GetLabelPerPageType.run();
