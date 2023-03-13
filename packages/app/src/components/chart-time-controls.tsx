import { useMemo } from 'react';
import { TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
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
  const { onChange, timeframe, timeframeOptions = TimeframeOptionsList } = props;
  const { commonTexts } = useIntl();

  const selectOptions = useMemo(
    () =>
      timeframeOptions.map((key) => ({
        label: commonTexts.charts.time_controls[key],
        value: key,
        content: (
          <Box>
            <Text>{commonTexts.charts.time_controls[key]}</Text>
          </Box>
        ),
      })),
    [commonTexts.charts.time_controls, timeframeOptions]
  );

  return (
    <RichContentSelect
      label={commonTexts.common.age_group_dropdown.label}
      visuallyHiddenLabel
      initialValue={timeframe}
      options={selectOptions}
      onChange={(option) => onChange(option.value)}
    />
  );
}
