import { TimeframeOption } from '@corona-dashboard/common';
import { RadioGroup } from '~/components/radio-group';
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
      'all',
      '2weeks',
      '30days',
      '3months',
      'lastYear',
      'startOfYear',
    ],
  } = props;
  const { siteText } = useIntl();

  const labelMap = {
    startOfYear: siteText.charts.time_controls['startOfYear'],
    lastYear: siteText.charts.time_controls['lastYear'],
    '3months': siteText.charts.time_controls['3months'],
    '30days': siteText.charts.time_controls['30days'],
    '2weeks': siteText.charts.time_controls['2weeks'],
    all: siteText.charts.time_controls['all'],
  };

  const items = timeframeOptions.map((key) => ({
    label: labelMap[key],
    value: key,
    content: (
      <Box>
        <Text>{siteText.charts.time_controls[key]}</Text>
      </Box>
    ),
  }));

  return (
    <RichContentSelect
      label={siteText.pages.vaccinationsPage.nl.age_group_dropdown.label}
      visuallyHiddenLabel
      initialValue={timeframeOptions[0]}
      options={items}
      onChange={(option) => onChange(option.value)}
    />
  );

  // return <RadioGroup value={timeframe} onChange={onChange} items={items} />;
}
