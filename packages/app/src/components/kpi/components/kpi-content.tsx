import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { Bar } from '~/domain/vaccine/components/bar';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { KpiContentProps } from '../types';

export const KpiContent = ({ tile }: KpiContentProps) => {
  const { commonTexts, formatPercentage } = useIntl();
  const parsedAgePercentage = tile.value ? `${formatPercentage(tile.value)}%` : '-';
  const parsedBirthyearRange = tile.birthyear ? parseBirthyearRange(tile.birthyear) : null;

  return (
    <Box>
      <BoldText>{tile.title}</BoldText>

      <Box paddingTop={space[3]} paddingBottom={tile.differenceValue ? space[1] : space[3]}>
        <KpiValue
          absolute={tile.differenceValue ? tile.value : null}
          difference={tile.differenceValue || undefined}
          isAmount={!!tile.differenceValue}
          text={!tile.differenceValue ? parsedAgePercentage : undefined}
          color={tile?.bar?.color}
        />
      </Box>

      {tile.bar && (
        <Box paddingTop={space[2]} paddingBottom={space[3]}>
          <Bar value={tile.bar.value} color={tile.bar.color} height={12} />
        </Box>
      )}

      <Markdown
        content={
          parsedBirthyearRange
            ? replaceVariablesInText(tile.description, {
                birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
              })
            : tile.description
        }
      />
    </Box>
  );
};
