import locale from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { ExternalLink } from './external-link';
import { Text } from './typography';
import { Box } from './base';

export interface MetadataProps {
  date?: number | [number, number];
  source?: {
    text: string;
    href: string;
  };
}

function formatMetadataDate(date: number | [number, number]): string {
  if (typeof date === 'number') {
    return replaceVariablesInText(locale.common.metadata.date, {
      date: formatDateFromSeconds(date, 'weekday-medium'),
    });
  }

  return replaceVariablesInText(locale.common.metadata.dateFromTo, {
    dateFrom: formatDateFromSeconds(date[0], 'weekday-medium'),
    dateTo: formatDateFromSeconds(date[1], 'weekday-medium'),
  });
}

export function Metadata({ date, source }: MetadataProps) {
  const dateString = date ? formatMetadataDate(date) : null;
  return (
    <Box as="footer" mt={3} mb={-3} gridArea="metadata">
      <Text my={0} color="annotation" fontSize={1}>
        {dateString}
        {dateString && source ? ' · ' : null}
        {source ? (
          <>
            {locale.common.metadata.source}
            {': '} <ExternalLink href={source.href}>{source.text}</ExternalLink>
          </>
        ) : null}
      </Text>
    </Box>
  );
}
