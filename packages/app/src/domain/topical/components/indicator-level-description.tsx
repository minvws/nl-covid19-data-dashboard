import css from '@styled-system/css';
import { SeverityIndicatorLevel } from '~/components/severity-indicator-tile/components/severity-indicator-label';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { replaceVariablesInText } from '~/utils';
import { asResponsiveArray } from '~/style/utils';
import { Text, BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { Box } from '~/components/base';

interface IndicatorLevelDescriptionProps {
  level: SeverityLevel;
  label: string;
  description: string;
}

export const IndicatorLevelDescription = ({ level, label, description }: IndicatorLevelDescriptionProps) => {
  return (
    <li value={level}>
      <Box
        display="grid"
        gridTemplateRows="auto"
        gridTemplateColumns={`${space[4]} auto`}
        alignItems="center"
        marginBottom={4}
        css={css({ columnGap: 3, rowGap: asResponsiveArray({ _: 3, sm: 1 }) })}
      >
        <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>
        <BoldText>{label}</BoldText>
        <Text css={css({ gridColumnStart: asResponsiveArray({ _: 1, sm: 2 }), gridColumnEnd: 3 })}>
          {replaceVariablesInText(description.split('**').join(''), {
            label: label.toLowerCase(),
          })}
        </Text>
      </Box>
    </li>
  );
};
