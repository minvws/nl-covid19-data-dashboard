import { useMemo } from 'react';
import { TimeframeOption } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { RichContentSelect } from '~/components/rich-content-select';
import { useIntl } from '~/intl';

interface ChartTimeControlsProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions?: TimeframeOption[];
}

export function ChartTimeControls(props: ChartTimeControlsProps) {
  const {
    onChange,
    timeframe,
    timeframeOptions = [
      TimeframeOption.ALL,
      TimeframeOption.TWO_WEEKS,
      TimeframeOption.THIRTY_DAYS,
      TimeframeOption.THREE_MONTHS,
      TimeframeOption.LAST_YEAR,
    ],
  } = props;
  const { siteText } = useIntl();

  const selectOptions = useMemo(
    () =>
      timeframeOptions.map((key) => ({
        label: siteText.charts.time_controls[key],
        value: key,
        content: (
          <Box>
            <Text>{siteText.charts.time_controls[key]}</Text>
          </Box>
        ),
      })),
    [siteText.charts.time_controls, timeframeOptions]
  );

  return (
    <RichContentSelect
      label={siteText.pages.vaccinationsPage.nl.age_group_dropdown.label}
      visuallyHiddenLabel
      initialValue={timeframe}
      options={selectOptions}
      onChange={(option) => onChange(option.value)}
    />
  );
}
