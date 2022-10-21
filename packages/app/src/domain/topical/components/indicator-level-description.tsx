import { SeverityIndicatorLevel } from '~/components/severity-indicator-tile/components/severity-indicator-label';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { replaceVariablesInText } from '~/utils';
import { Text, Heading } from '~/components/typography';
import { Box } from '~/components/base';
import css from '@styled-system/css';

interface indicatorLevelDescriptionProps {
  level: SeverityLevel;
  label: string;
  description: string;
}

export const IndicatorLevelDescription = ({ level, label, description }: indicatorLevelDescriptionProps) => {
  return (
    <Box display={'grid'} gridTemplateColumns="60px auto" css={css({ gap: 1 })} mb={4}>
      <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>
      <Heading level={4} fontWeight="bold">
        {label}
      </Heading>
      <Text css={css({ gridColumnStart: 2 })}>
        {replaceVariablesInText(description.split('**').join(''), {
          label: label.toLowerCase(),
        })}
      </Text>
    </Box>
  );
};
