import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from './base';
import { Text } from './typography';
import { useIntl } from '~/intl';

export interface MetadataProps {
  date?: number | [number, number];
  source?: {
    text: string;
    href: string;
  };
  obtained?: number;
}

export function Metadata({ date, source, obtained }: MetadataProps) {
  const { siteText, formatDateFromSeconds } = useIntl();

  const dateString =
    typeof date === 'number'
      ? replaceVariablesInText(siteText.common.metadata.date, {
          date: formatDateFromSeconds(date, 'weekday-medium'),
        })
      : Array.isArray(date)
      ? replaceVariablesInText(siteText.common.metadata.dateFromTo, {
          startDate: formatDateFromSeconds(date[0], 'weekday-medium'),
          endDate: formatDateFromSeconds(date[1], 'weekday-medium'),
        })
      : null;

  return (
    <Box as="footer" mt={3} mb={{ _: 0, sm: -3 }} gridArea="metadata">
      <Text my={0} color="annotation" fontSize={1}>
        {dateString}
        {obtained &&
          ` ${replaceVariablesInText(siteText.common.metadata.obtained, {
            date: formatDateFromSeconds(obtained, 'weekday-medium'),
          })}`}
        {dateString && source ? ' · ' : null}
        {source ? `${siteText.common.metadata.source}: ${source.text}` : null}
      </Text>
    </Box>
  );
}
