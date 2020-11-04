import locale from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { ExternalLink } from './external-link';
import { Text } from './typography';
import { Box } from './base';

export interface MetadataProps {
  date?: number;
  source?: {
    text: string;
    href: string;
  };
}

export function Metadata(metadata: MetadataProps) {
  return (
    <Box as="footer" mt={3}>
      <Text color="annotation" fontSize={1}>
        {metadata.date
          ? replaceVariablesInText(locale.common.metadata.date, {
              date: formatDateFromSeconds(metadata.date, 'weekday-medium'),
            })
          : null}
        {metadata.date && metadata.source ? ' · ' : null}
        {metadata.source ? (
          <>
            {locale.common.metadata.source}
            {': '} <ExternalLink {...metadata.source} />
          </>
        ) : null}
      </Text>
    </Box>
  );
}
