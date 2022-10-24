import { SeverityIndicatorLevel } from '~/components/severity-indicator-tile/components/severity-indicator-label';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { replaceVariablesInText } from '~/utils';
import { asResponsiveArray } from '~/style/utils';
import { Text } from '~/components/typography';
import { Box } from '~/components/base';
import css from '@styled-system/css';
import { space } from '~/style/theme';

interface indicatorLevelDescriptionProps {
  level: SeverityLevel;
  label: string;
  description: string;
}

export const IndicatorLevelDescription = ({ level, label, description }: indicatorLevelDescriptionProps) => {
  return (
    <Box
      display="grid"
      gridTemplateRows="auto"
      gridTemplateColumns={`${space[4]} auto`}
      alignItems="center"
      mb={4}
      css={css({ columnGap: 3, rowGap: asResponsiveArray({ _: 3, sm: 1 }) })}
    >
      <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>
      <Text fontWeight="bold">{label}</Text>
      <Text css={css({ gridColumnStart: asResponsiveArray({ _: 1, sm: 2 }), gridColumnEnd: 3 })}>
        {replaceVariablesInText(description.split('**').join(''), {
          label: label.toLowerCase(),
        })}
      </Text>
    </Box>
  );
};
