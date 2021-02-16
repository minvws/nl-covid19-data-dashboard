import locale from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from './base';
import { ExternalLink } from './external-link';
import { Text } from './typography';
import css from '@styled-system/css';
import siteText from '~/locale/index';
import { VisuallyHidden } from './visually-hidden';
export interface MetadataProps {
  date?: number | [number, number];
  source?: {
    text: string;
    href: string;
  };
  accessibilitySubject?: string;
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

export function Metadata({
  date,
  source,
  accessibilitySubject,
}: MetadataProps) {
  const dateString = date ? formatMetadataDate(date) : null;

  return (
    <Box as="footer" mt={3} mb={{ _: 0, sm: -3 }} gridArea="metadata">
      <Text my={0} color="annotation" fontSize={1}>
        {dateString}
        {dateString && source ? ' · ' : null}
        {source ? (
          <>
            {locale.common.metadata.source}
            {': '}
            {source.href && (
              <ExternalLink href={source.href}>
                <VisuallyHidden>
                  {replaceVariablesInText(siteText.accessibility.link_source, {
                    subject: accessibilitySubject,
                  })}
                </VisuallyHidden>
                {source.text}
              </ExternalLink>
            )}
            {!source.href && (
              <Text
                css={css({
                  display: 'inline-block',
                  my: '0',
                  fontSize: 'inherit',
                })}
              >
                {source.text}
              </Text>
            )}
          </>
        ) : null}
      </Text>
    </Box>
  );
}
