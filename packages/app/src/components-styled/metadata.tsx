import locale from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from './base';
import { ExternalLink } from './external-link';
import { Text } from './typography';
import css from '@styled-system/css';
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
    startDate: formatDateFromSeconds(date[0], 'weekday-medium'),
    endDate: formatDateFromSeconds(date[1], 'weekday-medium'),
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
            {': '}
            {source.href && (
              <ExternalLink href={source.href}>{source.text}</ExternalLink>
            )}
            {!source.href && (
              <Text css={css({ display: 'inline-block', my: '0' })}>
                {source.text}
              </Text>
            )}
          </>
        ) : null}
      </Text>
    </Box>
  );
}
