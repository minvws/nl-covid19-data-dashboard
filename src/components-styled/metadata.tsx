import { useContext } from 'react';
import LocaleContext, { TLocale } from '~/locale/localeContext';
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

function formatMetadataDate(
  siteText: TLocale,
  date: number | [number, number]
): string {
  if (typeof date === 'number') {
    return replaceVariablesInText(siteText.common.metadata.date, {
      date: formatDateFromSeconds(siteText.utils, date, 'weekday-medium'),
    });
  }

  return replaceVariablesInText(siteText.common.metadata.dateFromTo, {
    dateFrom: formatDateFromSeconds(siteText.utils, date[0], 'weekday-medium'),
    dateTo: formatDateFromSeconds(siteText.utils, date[1], 'weekday-medium'),
  });
}

export function Metadata({ date, source }: MetadataProps) {
  const { siteText }: TLocale = useContext(LocaleContext);
  const dateString = date ? formatMetadataDate(siteText, date) : null;

  return (
    <Box as="footer" mt={3} gridArea="metadata">
      <Text color="annotation" fontSize={1}>
        {dateString}
        {dateString && source ? ' · ' : null}
        {source ? (
          <>
            {siteText.common.metadata.source}
            {': '} <ExternalLink {...source} />
          </>
        ) : null}
      </Text>
    </Box>
  );
}
