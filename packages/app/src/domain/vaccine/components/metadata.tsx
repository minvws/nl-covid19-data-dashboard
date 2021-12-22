import { MarginBottomProps } from 'styled-system';
import { useIntl } from '~/intl';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';

export type source = {
  text: string;
  href: string;
};

export interface MetadataProps extends MarginBottomProps {
  date: string;
  source: source;
}

export function Metadata({ date, source }: MetadataProps) {
  const { siteText } = useIntl();

  return (
    <Box as="footer" mt={3} mb={{ _: 0, sm: -3 }} gridArea="metadata">
      <Text color="annotation" variant="label1">
        {`${date} · ${siteText.common.metadata.source}: ${source.text}`}
      </Text>
    </Box>
  );
}
