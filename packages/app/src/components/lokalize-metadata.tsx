import { useIntl } from '~/intl';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';

export interface MetadataProps {
  date: string;
  source: string;
}

export function LokalizeMetadata({ date, source }: MetadataProps) {
  const { commonTexts } = useIntl();

  return (
    <Box as="footer" marginTop={space[3]} marginBottom={{ _: '0', sm: '-3px' }} gridArea="metadata">
      <Text color="gray7" variant="label1">
        {`${date} · ${commonTexts.common.metadata.source}: ${source}`}
      </Text>
    </Box>
  );
}
